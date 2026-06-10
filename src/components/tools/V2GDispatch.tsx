"use client";

import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  simulateV2g, V2G_STRATEGIES, REFERENCE,
  type ChemistryId, type V2gStrategyId, type UsageProfile,
} from "@/lib/ageing";
import { Slider, ChemistryToggle, ToolFrame, CHART_COLORS } from "./Controls";

export function V2GDispatch() {
  const [strategy, setStrategy] = useState<V2gStrategyId>("arbitrage");
  const [chem, setChem] = useState<ChemistryId>("NMC");
  const [drivingFec, setDrivingFec] = useState(0.9);
  const [tempC, setTempC] = useState(25);
  const [parkSoc, setParkSoc] = useState(70);

  const { soh, econ, net10y } = useMemo(() => {
    const base: UsageProfile = {
      fecPerDay: drivingFec,
      meanSoc: parkSoc / 100,
      dod: 0.6,
      cRate: 0.7,
      chargeCRate: 1.0,
      tempC,
    };
    const res = simulateV2g(base, strategy, 10, chem);
    return {
      soh: res.map((r) => ({
        years: +r.years.toFixed(2),
        baseline: +(r.sohBaseline * 100).toFixed(2),
        v2g: +(r.sohV2g * 100).toFixed(2),
      })),
      econ: res.map((r) => ({
        years: +r.years.toFixed(2),
        revenue: Math.round(r.cumulativeRevenueEur),
        degCost: Math.round(r.cumulativeDegCostEur),
        net: Math.round(r.netEur),
      })),
      net10y: res[res.length - 1]?.netEur ?? 0,
    };
  }, [strategy, chem, drivingFec, tempC, parkSoc]);

  const packValue = REFERENCE.packEnergyKWh * REFERENCE.packCostEurPerKWh;

  return (
    <ToolFrame
      title="V2G Dispatch Simulator"
      subtitle={`Reference pack: ${REFERENCE.packEnergyKWh} kWh @ ${REFERENCE.packCostEurPerKWh} €/kWh (≈ €${packValue.toLocaleString()}), EOL at ${REFERENCE.eolSohFraction * 100} % SoH. Degradation monetised linearly against the SoH budget — a deliberate simplification discussed in the text.`}
    >
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <ChemistryToggle value={chem} onChange={setChem} />
          <label className="block text-sm">
            <span className="font-medium text-slate-300">V2G service</span>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as V2gStrategyId)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-slate-200"
            >
              {(Object.keys(V2G_STRATEGIES) as V2gStrategyId[]).map((k) => (
                <option key={k} value={k}>{V2G_STRATEGIES[k].label}</option>
              ))}
            </select>
            <span className="text-xs text-slate-500">
              +{V2G_STRATEGIES[strategy].extraFecPerDay} FEC/day, ~€{V2G_STRATEGIES[strategy].revenueEurPerDay}/day revenue
            </span>
          </label>
          <Slider label="Driving throughput" unit="FEC/day" min={0.2} max={2} step={0.1} value={drivingFec} onChange={setDrivingFec}
            hint="Regional ≈ 0.6–1, long-haul ≈ 1–2" />
          <Slider label="Mean parking SoC" unit="%" min={30} max={100} step={5} value={parkSoc} onChange={setParkSoc}
            hint="V2G strategies shift this — see meanSocShift in the data" />
          <Slider label="Average temperature" unit="°C" min={5} max={45} step={1} value={tempC} onChange={setTempC} />
          <div className={`rounded-lg p-3 text-sm ${net10y >= 0 ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
            10-year net value: <b>€{Math.round(net10y).toLocaleString()}</b>
            <div className="mt-1 text-xs opacity-75">revenue − marginal degradation cost vs the no-V2G baseline</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={soh} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} syncId="v2g">
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="years" stroke="#94a3b8" />
                <YAxis domain={[70, 100]} stroke="#94a3b8" label={{ value: "SoH %", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                <Legend />
                <ReferenceLine y={80} stroke="#64748b" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="baseline" name="driving only" stroke={CHART_COLORS.baseline} strokeWidth={2} strokeDasharray="6 4" dot={false} />
                <Line type="monotone" dataKey="v2g" name="driving + V2G" stroke={CHART_COLORS.nmc} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={econ} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} syncId="v2g">
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="years" stroke="#94a3b8" label={{ value: "years", position: "insideBottom", offset: -2, fill: "#94a3b8", fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} label={{ value: "€", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} formatter={(v) => `€${Number(v).toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="cumulative revenue" stroke={CHART_COLORS.revenue} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="degCost" name="cumulative degradation cost" stroke={CHART_COLORS.cost} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="net" name="net" stroke={CHART_COLORS.net} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ToolFrame>
  );
}
