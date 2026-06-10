// Semi-empirical combined calendar + cycle ageing model used by all
// interactive tools. Parameters live in /data/parameters.json and are
// literature-typical, NOT fits to a specific paper — good for trends and
// orders of magnitude, not for engineering sign-off.
//
// Model structure (documented in docs/ARCHITECTURE.md and taught in the
// "Model families" section):
//
//   Q_loss(t) = Q_cal(t) + Q_cyc(FEC)                (superposition assumption)
//   Q_cal     = k_ref * f_T(T) * f_SoC(SoC) * t^z_cal
//   Q_cyc     = k_ref * g_DoD(DoD) * g_C(C) * g_T(T) * g_plating(T, C_chg) * FEC^z_cyc
//   f_T       = Arrhenius: exp( Ea/R * (1/T_ref - 1/T) )
//
// Resistance growth uses the same stress factors with its own prefactors.

import params from "../../data/parameters.json";

export type ChemistryId = "NMC" | "LFP";
export type V2gStrategyId = "none" | "peakShaving" | "arbitrage" | "fcr";

const R = params.reference.gasConstant;
const T_REF = params.reference.tRefK;

export const REFERENCE = params.reference;
export const CHEMISTRIES = params.chemistries;
export const V2G_STRATEGIES = params.v2gStrategies as Record<
  V2gStrategyId,
  { label: string; extraFecPerDay: number; revenueEurPerDay: number; meanSocShift: number }
>;

type ChemParams = (typeof params.chemistries)["NMC"];

function chem(id: ChemistryId): ChemParams {
  return params.chemistries[id];
}

/** Arrhenius temperature acceleration factor relative to 25 °C. */
export function arrheniusFactor(tempC: number, eaJPerMol: number): number {
  const T = tempC + 273.15;
  return Math.exp((eaJPerMol / R) * (1 / T_REF - 1 / T));
}

/**
 * Calendar SoC stress: storing at high SoC keeps the graphite anode at low
 * potential, accelerating SEI growth; an extra penalty kicks in near the top
 * of the window (electrolyte oxidation on NMC, anode plateau edge on LFP).
 * soc is a fraction in [0, 1].
 */
export function socStressFactor(soc: number, c: ChemistryId): number {
  const s = chem(c).calendar.socStress;
  let f = s.a + s.b * Math.exp(s.c * soc);
  if (soc > s.highSocKnee) {
    f *= 1 + (s.highSocPenalty - 1) * ((soc - s.highSocKnee) / (1 - s.highSocKnee));
  }
  return f;
}

/** Calendar capacity loss fraction after `days` at constant tempC and soc. */
export function calendarLoss(days: number, tempC: number, soc: number, c: ChemistryId): number {
  const p = chem(c).calendar;
  const k = p.kRefPerSqrtDay * arrheniusFactor(tempC, p.activationEnergyJPerMol) * socStressFactor(soc, c);
  return k * Math.pow(Math.max(days, 0), p.timeExponent);
}

/** DoD stress (Wöhler-like): deep cycles cost disproportionately more per FEC. */
export function dodStressFactor(dod: number, c: ChemistryId): number {
  const s = chem(c).cycle.dodStress;
  return 1 + s.linear * dod + s.quadratic * dod * dod;
}

/** C-rate stress: mild below ~1C, grows roughly exponentially above. */
export function cRateStressFactor(cRate: number, c: ChemistryId): number {
  const s = chem(c).cycle.cRateStress;
  return s.base + (1 - s.base) * Math.exp(s.exp * (cRate - 1) * (cRate > 1 ? 1.6 : 1));
}

/**
 * Cycle temperature stress: U-shaped. Hot accelerates side reactions;
 * cold (during charge, gated by charge C-rate) risks lithium plating.
 */
export function cycleTempStressFactor(tempC: number, chargeCRate: number, c: ChemistryId): number {
  const p = chem(c).cycle;
  const dT = tempC - p.tOptC;
  let f = 1 + (dT * dT) / (p.tWidthC * p.tWidthC);
  const lp = p.lowTempPlating;
  if (tempC < lp.thresholdC && chargeCRate > lp.chargeCrateGate) {
    f *= 1 + lp.perDegree * (lp.thresholdC - tempC) * (chargeCRate / lp.chargeCrateGate);
  }
  return f;
}

export interface CycleConditions {
  dod: number; // depth of discharge per cycle, fraction
  cRate: number; // average discharge C-rate
  chargeCRate: number; // average charge C-rate
  tempC: number;
}

/** Cycle capacity loss fraction after `fec` full equivalent cycles. */
export function cycleLoss(fec: number, cond: CycleConditions, c: ChemistryId): number {
  const p = chem(c).cycle;
  const k =
    p.kRefPerFec *
    dodStressFactor(cond.dod, c) *
    cRateStressFactor(cond.cRate, c) *
    cycleTempStressFactor(cond.tempC, cond.chargeCRate, c);
  return k * Math.pow(Math.max(fec, 0), p.fecExponent);
}

/** Relative resistance increase (fraction of initial R0). */
export function resistanceGrowth(days: number, fec: number, tempC: number, soc: number, cond: CycleConditions, c: ChemistryId): number {
  const p = chem(c);
  const cal =
    p.resistance.kCalPerSqrtDay *
    arrheniusFactor(tempC, p.calendar.activationEnergyJPerMol) *
    socStressFactor(soc, c) *
    Math.sqrt(Math.max(days, 0));
  const cyc =
    p.resistance.kCycPerFec *
    dodStressFactor(cond.dod, c) *
    cycleTempStressFactor(cond.tempC, cond.chargeCRate, c) *
    Math.max(fec, 0);
  return cal + cyc;
}

export interface UsageProfile {
  /** Full equivalent cycles per day from driving. */
  fecPerDay: number;
  /** Mean SoC the pack sits at (storage + operation average), fraction. */
  meanSoc: number;
  dod: number;
  cRate: number;
  chargeCRate: number;
  tempC: number;
}

export interface SohPoint {
  /** Time in years. */
  years: number;
  soh: number; // 1.0 = new
  calLoss: number;
  cycLoss: number;
  resistanceRel: number; // R/R0
}

/** Simulate SOH trajectory over `years` with daily resolution collapsed to ~monthly points. */
export function simulateSoh(profile: UsageProfile, years: number, c: ChemistryId, pointsPerYear = 12): SohPoint[] {
  const out: SohPoint[] = [];
  const n = Math.round(years * pointsPerYear);
  const cond: CycleConditions = {
    dod: profile.dod,
    cRate: profile.cRate,
    chargeCRate: profile.chargeCRate,
    tempC: profile.tempC,
  };
  for (let i = 0; i <= n; i++) {
    const t = (i / pointsPerYear) * 365;
    const fec = profile.fecPerDay * t;
    const cal = calendarLoss(t, profile.tempC, profile.meanSoc, c);
    const cyc = cycleLoss(fec, cond, c);
    out.push({
      years: i / pointsPerYear,
      soh: Math.max(1 - cal - cyc, 0.5),
      calLoss: cal,
      cycLoss: cyc,
      resistanceRel: 1 + resistanceGrowth(t, fec, profile.tempC, profile.meanSoc, cond, c),
    });
  }
  return out;
}

export interface V2gResult {
  years: number;
  sohBaseline: number;
  sohV2g: number;
  cumulativeRevenueEur: number;
  cumulativeDegCostEur: number;
  netEur: number;
}

/**
 * Compare a baseline driving profile against the same profile + a V2G
 * strategy. Extra degradation is monetised linearly against the SOH budget
 * between 100 % and EOL (a common simplification — its limits are discussed
 * in the V2G section).
 */
export function simulateV2g(
  base: UsageProfile,
  strategy: V2gStrategyId,
  years: number,
  c: ChemistryId,
  pointsPerYear = 12
): V2gResult[] {
  const s = V2G_STRATEGIES[strategy];
  const v2gProfile: UsageProfile = {
    ...base,
    fecPerDay: base.fecPerDay + s.extraFecPerDay,
    meanSoc: Math.min(Math.max(base.meanSoc + s.meanSocShift, 0.05), 0.98),
  };
  const baseline = simulateSoh(base, years, c, pointsPerYear);
  const withV2g = simulateSoh(v2gProfile, years, c, pointsPerYear);
  const packValue = REFERENCE.packEnergyKWh * REFERENCE.packCostEurPerKWh;
  const sohBudget = 1 - REFERENCE.eolSohFraction;
  return baseline.map((b, i) => {
    const days = b.years * 365;
    const extraLoss = b.soh - withV2g[i].soh;
    const degCost = (extraLoss / sohBudget) * packValue;
    const revenue = s.revenueEurPerDay * days;
    return {
      years: b.years,
      sohBaseline: b.soh,
      sohV2g: withV2g[i].soh,
      cumulativeRevenueEur: revenue,
      cumulativeDegCostEur: degCost,
      netEur: revenue - degCost,
    };
  });
}
