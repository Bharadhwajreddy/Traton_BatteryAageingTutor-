import type { Section } from "@/lib/types";

export const foundations: Section = {
  slug: "foundations",
  title: "Foundations: SoC, SoH, OCV & EOL",
  summary:
    "The vocabulary everything else builds on: why SoC is an estimate, why SoH is plural, what EOL actually means, and how NMC vs LFP voltage curves shape what a BMS can know.",
  prerequisites: [],
  minutes: 15,
  blocks: [
    {
      kind: "text",
      depth: "core",
      heading: "SoC: an estimate wearing a measurement's clothes",
      body:
        "**[[SoC]]** is the fraction of usable charge currently in the cell — and here is the first uncomfortable truth of this whole field: *no sensor measures it*. There is no \"lithium gauge\" inside the cell. The [[BMS]] only ever sees terminal voltage, current, and temperature, and must **infer** SoC from them. Two inference routes exist:\n- **Coulomb counting**: integrate the measured current over time. Direct, fast, but every sensor error integrates with it.\n- **Voltage-based inference**: at rest, terminal voltage relaxes toward the [[OCV]], and the OCV–SoC curve can be inverted to read off SoC.\nEvery practical estimator (Kalman-filter style or otherwise) is a fusion of these two routes, weighted by how trustworthy each one is for the chemistry at hand. Keep this in mind whenever someone quotes an SoC to one decimal place.",
      clarify:
        "Imagine a fuel tank with no float gauge. You have two options: keep a logbook of every litre poured in and burned (coulomb counting — but if your flow meter is slightly off, the logbook drifts further from reality every day), or shake the tank and judge the fill level from the sloshing sound (voltage — works if the sound changes clearly with level, useless if it doesn't). The dashboard \"fuel gauge\" is a guess built from both. SoC is exactly that kind of guess.",
    },
    {
      kind: "equation",
      depth: "core",
      latex:
        "\\mathrm{SoC}(t) = \\mathrm{SoC}(t_0) - \\frac{1}{Q_{\\mathrm{act}}} \\int_{t_0}^{t} I(\\tau)\\, d\\tau",
      label: "Coulomb counting",
      explanation:
        "SoC at time t equals the SoC at the last known reference point t0, minus the charge throughput since then (discharge current counted positive here), normalised by the *actual* capacity Q_act. Two traps hide in this innocent formula. First, the integral accumulates every current-sensor bias forever — a tiny constant offset becomes an SoC error that grows linearly in time until something resets it. Second, the denominator must be the actual, aged capacity: if the BMS divides by the nominal (as-new) capacity of a cell that has lost 15 %, every SoC step is systematically too small. SoC estimation and SoH estimation are therefore coupled problems, not separate ones.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "The OCV–SoC backbone: NMC's slope vs LFP's plateau",
      body:
        "The [[OCV]]–SoC relation is the map a voltage-based estimator inverts, and the two truck-relevant chemistries hand the BMS completely different maps:\n- **[[NMC]]**: the OCV slopes steadily from roughly 3.0 to 4.2 V. A rested voltage reading maps to a fairly unique SoC, so voltage corrections are frequent and trustworthy.\n- **[[LFP]]**: the OCV is famously flat — across most of the 20–80 % range the cell sits within a few tens of millivolts of ~3.3 V. A change of one percent SoC moves the voltage by an amount comparable to sensor accuracy, so mid-range voltage readings carry almost no SoC information.\nConsequence: an LFP BMS must lean heavily on coulomb counting and can only recalibrate near the curve's steep ends — which is why LFP fleets routinely charge to 100 % *for estimator hygiene*, accepting a real calendar-ageing cost for it. The chemistry choice quietly dictates BMS architecture and even operating procedures.",
      clarify:
        "Think of judging your position on a hike using only an altimeter. On a steady slope (NMC), every altitude reading corresponds to one spot on the trail — easy. On a vast flat plateau (LFP), the altimeter reads the same everywhere; you could be anywhere on it. Your only fix is to walk to the plateau's edge (charge to nearly full or empty), recognise the cliff, and reset your mental map there.",
    },
    {
      kind: "text",
      depth: "deeper",
      heading: "Why LFP makes drift correction genuinely hard",
      body:
        "Coulomb-counting drift is unavoidable: a current-sensor offset of even 0.1 % of full-scale, integrated continuously, produces SoC errors of several percent per day of operation. The standard cure — wait for a rest, read the relaxed voltage, invert the OCV map — works beautifully for NMC and poorly for LFP, for three compounding reasons. (1) *Flatness*: mid-range, millivolts of measurement noise translate into tens of percent of SoC. (2) *Hysteresis*: LFP's OCV depends on history — the rested voltage after charging sits visibly above the rested voltage after discharging at the same SoC, a gap of order tens of millivolts, which on a flat curve is catastrophic ambiguity. The hysteresis is rooted in the two-phase (FePO4/LiFePO4) nature of the cathode combined with graphite staging, and it does not relax away on practical timescales. (3) *Ageing deformation*: the OCV–SoC map itself shifts as [[LLI]] and [[LAM]] re-align the electrode balancing, so a BMS using the as-new map gains a slow systematic error on top of everything else. This is why serious LFP estimators track the OCV map online or schedule deliberate full charges as calibration events.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "SoH is plural",
      body:
        "**[[SoH]]** sounds like one number; it is at least two, and they answer different questions:\n- **Capacity-SoH**: how much charge the cell still holds, relative to nameplate. This governs **range**.\n- **Resistance/power-SoH**: how much the [[impedance]] has grown. This governs **peak power, gradeability, regen acceptance, and fast-charge capability** — and it generates heat, which feeds back into ageing.\nThe two are correlated (many mechanisms feed both) but emphatically not interchangeable: SEI growth raises resistance per unit capacity lost differently than, say, contact-loss LAM does. For a truck the split is operational, not academic: capacity-SoH decides whether the route still fits between charges; resistance-SoH decides whether the truck can hold speed on a 4 % grade at low SoC, and whether the [[MCS]] session still fits in the driver's 45-minute break.",
      clarify:
        "Think of an ageing marathon runner. One number describes lung capacity (how far they can go — capacity-SoH); a different number describes knee condition (how hard they can push at any moment — resistance-SoH). Two runners can have identical endurance while one of them can no longer sprint at all. Asking \"what's their health?\" without saying which kind tells you very little.",
    },
    {
      kind: "equation",
      depth: "core",
      latex:
        "\\mathrm{SoH}_Q = \\frac{Q_{\\mathrm{act}}}{Q_{\\mathrm{nom}}}, \\qquad \\mathrm{SoH}_R = \\frac{R_{\\mathrm{act}}}{R_{0}}",
      label: "Capacity-SoH and resistance-SoH",
      explanation:
        "Capacity-SoH is the actual extractable capacity Q_act (measured under defined reference conditions: temperature, C-rate, voltage window — the fine print matters) divided by the nominal capacity Q_nom. It starts near 1 and falls. Resistance-SoH is the actual resistance R_act relative to the begin-of-life resistance R0; it starts at 1 and *rises* — values of 1.5–2.0 are common before capacity reaches its 80 % threshold. Note the asymmetric conventions: capacity-SoH falling to 0.8 and resistance-SoH rising to 2.0 are both typical end-of-life neighbourhoods, and which one binds first depends entirely on the application.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "misconception",
      title: "SoH is not a fuel gauge",
      body:
        "Two packs with identical capacity-SoH of 85 % can be in completely different states: one aged gently by calendar storage (mild, uniform SEI growth, modest resistance rise), the other hammered by cold fast-charging (plating history, doubled resistance, a [[knee point]] waiting around the corner). Equal capacity-SoH, very different power capability, very different remaining life. SoH is a *summary statistic* of a high-dimensional internal state — useful, but never confuse the summary for the state. This is precisely why diagnostics like [[DVA]], [[ICA]] and [[EIS]] exist: to see behind the single number.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "EOL: a contract, not a cliff",
      body:
        "**[[EOL]]** is conventionally set at 80 % capacity-SoH for traction batteries — a number inherited from warranty practice, not from physics. The cell does not die at 79.9 %; it simply (by convention) no longer meets an assumed requirement. The honest definition is **application-defined**: a regional distribution truck with 30 % route margin can run far below 80 % without operational pain, while a weight-limited long-haul tractor on a tight schedule may be functionally end-of-life at 88 % — or may hit a *power* EOL (resistance too high for MCS within the break window) while its capacity is still fine. And \"end of life\" rarely means end of *useful* life: a retired truck pack can serve years in stationary storage, where energy density is irrelevant and C-rates are gentle. The second-life caveat: the pack's value depends on its history and documentation — a pack near a plating-driven knee is a liability, not an asset, and you cannot tell the difference from capacity-SoH alone (see the misconception above).",
      clarify:
        "EOL is like a mandatory retirement age: an administrative line, not a biological event. Some people are worn out years before it; others happily start a second career after it. The 80 % figure is the pension rulebook — what actually matters is whether this particular battery can still do this particular job, and what shape it is really in underneath.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "RUL: a forecast, not a property",
      body:
        "**[[RUL]]** — remaining useful life — is the time and/or [[FEC]] left until EOL. The crucial subtlety: RUL is not a property of the battery alone; it is a *prediction conditional on an assumed future usage profile*. Change the scenario — add a megawatt-charging stop, move the depot from Sweden to Spain, raise the parking SoC — and the RUL of the very same pack changes. A serious RUL statement therefore has three parts: a current-state estimate, a future stress scenario, and a degradation model connecting them; uncertainty enters through all three and compounds. For fleet planning this is a feature, not a bug: because RUL depends on the scenario, the operator can *manage* it — which is exactly the lever the later sections of this app are about.",
      clarify:
        "RUL is a weather forecast, not a thermometer reading. \"This pack has 4 years left\" really means \"4 years left *if* it keeps being used the way we assumed.\" Drive it harder and the forecast shortens; park it smarter and it lengthens. And like any forecast, the further out you look, the wider the error bars.",
    },
    {
      kind: "text",
      depth: "deeper",
      heading: "Why the 80 % line is shakier than it looks",
      body:
        "Two effects make the tidy 80 % threshold treacherous. First, **fade is not guaranteed to stay graceful**: many cells show a [[knee point]] where capacity loss accelerates sharply, often plating- or LAM-driven, and the knee frequently lurks in the 70–85 % SoH region — precisely where second-life decisions are made. An RUL extrapolated linearly through a knee is not slightly wrong, it is categorically wrong. Second, **pack SoH is not mean cell SoH**: usable pack capacity is gated by the weakest serial element, so [[cell-to-cell variation]] means the pack crosses 80 % before the average cell does, and the gap widens over life as thermal gradients amplify divergence. Cell-level test data therefore gives an *optimistic* bound on pack life unless the model explicitly propagates the spread. Both effects argue for the same practice: treat EOL forecasting as a probabilistic exercise with knee-risk flags, never as a single extrapolated line.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "truck",
      title: "Range-EOL vs power-EOL on a real route",
      body:
        "Take a ~500 kWh regional truck with comfortable route margin. Losing 20 % capacity trims range the planner can absorb — capacity-EOL might genuinely be 70 % for this duty. But if the resistance has doubled along the way, the symptoms show up elsewhere first: the [[opportunity charging]] stop that used to add 40 % SoC in the break now adds 28 % because the BMS derates power on the hot, high-impedance pack; gradeability at low SoC sags; winter cabin-plus-pack heating eats the margin. Fleets that track only capacity-SoH are routinely surprised by power-EOL — the failure mode their telematics dashboard wasn't watching.",
    },
  ],
};
