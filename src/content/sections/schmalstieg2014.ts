import type { Section } from "@/lib/types";

export const schmalstieg2014: Section = {
  slug: "schmalstieg-2014",
  title: "Schmalstieg 2014 — The RWTH Holistic Model",
  summary:
    "Deep-dive into the most-cited NMC semi-empirical ageing model: 60+ cells tested at ISEA/RWTH Aachen, both calendar and cycle ageing, electrothermal coupling, and t^0.75 time dependence. Every equation explained from first principles.",
  prerequisites: ["model-families", "parameter-identification"],
  minutes: 35,
  blocks: [
    // ── CONTEXT ──────────────────────────────────────────────────────────────
    {
      kind: "callout",
      depth: "core",
      tone: "tip",
      title: "Paper reference",
      body:
        "Schmalstieg J., Käbitz S., Ecker M., Sauer D.U. — *A holistic aging model for Li(NiMnCo)O₂ based 18650 lithium-ion batteries* — **Journal of Power Sources 257 (2014) 325–334** — DOI 10.1016/j.jpowsour.2014.02.012.\nAuthors: ISEA / E.ON Energy Research Center, RWTH Aachen University. 549+ citations as of 2024. The companion experimental dataset is in Ecker et al., J. Power Sources 248 (2014) 839–851.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Why this paper became the benchmark",
      body:
        "In 2014, battery ageing models fell into one of two camps: purely experimental correlations (fit a curve to one condition, interpolate carefully) or full physics-based models (computationally expensive, hard to parameterise). Schmalstieg et al. found the middle ground that battery-system engineers had been waiting for: a **semi-empirical stress-factor model** rigorous enough to capture the main ageing drivers (temperature, [[SoC]], [[DoD]], [[C-rate]]-driven heat), lean enough to run inside a system simulator, and anchored by more than 60 cells tested across a systematic factorial matrix. The term *holistic* in the title has a precise meaning: the same framework covers **calendar ageing, cycle ageing, capacity fade, and resistance growth simultaneously**, all coupled to an electrothermal model so that stress factors are computed from the cell's real experienced conditions — not from the ambient set-points. Every subsequent semi-empirical model you will encounter in the truck/V2G literature is either a refinement of this structure or a deliberate departure from it. Understanding this paper deeply means understanding the entire model family.",
      clarify:
        "Before 2014 most engineers either fitted a single curve to one set of conditions (not transferable) or ran expensive physics simulations (not practical in a fleet). Schmalstieg's group found the sweet spot: a formula simple enough to run in Excel, but driven by the actual temperature and voltage the cell experiences moment-to-moment. It became the reference others cite or argue against — reading it once is the single highest-ROI hour you can spend on ageing modelling.",
    },

    // ── CELL & TEST MATRIX ───────────────────────────────────────────────────
    {
      kind: "text",
      depth: "core",
      heading: "The experimental foundation: 60+ cells, two matrix types",
      body:
        "The cell under test is a commercial NMC/graphite 18650, 2.05 Ah nominal, voltage window 2.5–4.2 V. The electrode chemistry is approximately NMC111 (equal parts Ni, Mn, Co). The test programme has two parts:\n- **Calendar matrix**: cells stored at constant SoC (0–100 %, twelve levels) and three temperatures (25 °C, 35 °C, 50 °C). Capacity and resistance checked every ~30 days via a standardised reference performance test ([[RPT]]). Duration: up to 520 days (~17 months). Purpose: isolate the temperature and [[SoC]] dependence of storage degradation.\n- **Cycle matrix**: cells cycled at 1C charge and 1C discharge, 35 °C fixed, varying depth of discharge (5 %, 10 %, 20 %, 50 %, 80 %, 100 %) and mean [[SoC]] (centred on 50 %, but also at extreme positions). RPT every ~25 cycles. Purpose: isolate the [[DoD]] and mean-SoC dependence of cycling degradation, at constant temperature and C-rate.\n- Identical RPT protocol for both: C/5 constant-current–constant-voltage full charge, then C/5 full discharge to measure capacity; 10 A current pulse at 50 % SoC for 17 seconds to measure resistance. Both metrics tracked from day/cycle 0 to the end.\nUsing the same RPT across both matrix types is not a detail — it is what allows you to **subtract the calendar contribution out of the cycle tests** and get isolated cycle degradation (see Section 4.4).",
      clarify:
        "Imagine testing 60 cars. Half are parked at different temperatures and fuel levels (calendar matrix). The other half are driven in precise patterns — some do small loops, others long journeys (cycle matrix). Every few weeks every car gets the same road test to measure how much range and acceleration it has lost. Keeping the road test identical across all 60 cars is what allows you to compare results and build a single unified model.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "truck",
      title: "Why 60 cells and not 6?",
      body:
        "A truck OEM typically needs ageing predictions with ≤ 10 % error over 1.5–2 million km. One cell per condition gives you one curve with unknown scatter. Three cells per condition (the minimum) lets you estimate scatter but not tail risks. Schmalstieg's ≥ 60 cells across the factorial grid provided enough statistical power to see that the **sudden-death phenomenon** (cells failing unpredictably between 250–950 cycles at identical conditions) is real and not a measurement artefact — and that no smooth parametric model can predict it. That honest acknowledgment of the model's limit is itself a scientific contribution.",
    },

    // ── CALENDAR MODEL ───────────────────────────────────────────────────────
    {
      kind: "text",
      depth: "core",
      heading: "Calendar capacity fade: the t^0.75 discovery",
      body:
        "The central result of the calendar part of the model is deceptively simple — a three-factor product:\n- A **temperature factor** (Arrhenius)\n- A **voltage/SoC factor** (approximately linear in cell voltage over the tested range)\n- A **time factor** with exponent **0.75**\n\nThe temperature and SoC factors you might expect from electrochemistry. The time exponent is the surprise. The classical [[SEI]] growth argument predicts the thickness grows as √t (t^0.5), because the SEI film itself is the transport bottleneck and thicker film = slower growth = self-decelerating kinetics. Schmalstieg's experimental data across 12 SoC levels and 3 temperatures consistently returned a best-fit exponent of **0.75** — faster than pure diffusion, slower than linear. This says the SEI growth mechanism is not purely diffusion-limited in this cell: pore closure in the electrode, electrolyte concentration gradients, crack-and-reheal cycles on graphite particles, or mixed kinetic-diffusion control all produce exponents between 0.5 and 1. The 0.75 value is now widely reproduced for NMC/graphite chemistry and used as a fingerprint for this model family in the literature.",
      clarify:
        "If you fill a bucket with a leaky garden hose and the leak gets slower as the bucket fills (because pressure drops), the bucket fill rate goes as √time. That is diffusion-limited SEI growth. Schmalstieg found the real-world battery behaves like a bucket that also has a second leak that opens and closes as the bucket sloshes — more complicated than pure diffusion, but not as damaging as a constant-rate leak either. The t^0.75 is the signature of that mixed behaviour.",
    },
    {
      kind: "equation",
      depth: "core",
      latex:
        "Q_{\\mathrm{loss,cal}}(t,\\,T,\\,U) \\;=\\; \\alpha_{\\mathrm{cap}} \\;\\cdot\\; \\underbrace{(U - U_{\\mathrm{ref}})}_{\\text{SoC stress}} \\;\\cdot\\; \\underbrace{\\exp\\!\\left(\\frac{-E_a}{R\\,T}\\right)}_{\\text{Arrhenius}} \\;\\cdot\\; t^{0.75}",
      label: "Calendar capacity fade — Schmalstieg 2014 model",
      explanation:
        "Q_loss,cal is the fraction of nominal capacity lost to storage ageing (0 = no loss, 0.2 = EOL at 80 % SoH). α_cap is a pre-exponential coefficient fitted from the test matrix. (U − U_ref) is the linear voltage stress — U is the actual cell OCV at the storage SoC, U_ref is a reference point (~3.73 V). E_a is the apparent activation energy for calendar fade (~48–60 kJ/mol for this NMC cell, from Arrhenius fits across 25–50 °C). R = 8.314 J/(mol·K), T is absolute temperature in K. t is storage time (days). The exponent 0.75 is the paper's empirical finding — not the classical diffusion-limited 0.5. All three factors multiply: if you double the temperature acceleration AND move from 50 % to 100 % SoC, the rates combine multiplicatively, not additively.",
    },
    {
      kind: "tool",
      depth: "core",
      tool: "calendar-explorer",
      note: "This tool implements the exact Schmalstieg 2014 calendar model structure (Arrhenius × SoC stress × t^z). Set temperature to 50 °C and SoC to 95–100 % for NMC and watch the 15-year fade — that is why storing NMC trucks fully charged in summer is expensive.",
    },
    {
      kind: "text",
      depth: "deeper",
      heading: "Why linear voltage stress — and where it breaks",
      body:
        "A mechanistic model would express the SoC stress as a Butler–Volmer or Tafel function of the **anode overpotential** η_a = E_a − E_eq,a (how far the anode surface potential sits below the equilibrium for SEI-forming reactions). Cell voltage and anode potential are linked through the electrode potentials, so cell voltage is an accessible proxy. Over the tested range (3.3–4.2 V), the Tafel function exp(−αFη/RT) is approximately linear in V — because the range is narrow relative to RT/F (~26 mV at 25 °C). The linear approximation is therefore justified *within* the test matrix but is expected to break at extreme low SoC (near 0 %, where cell voltage approaches 2.5 V and the function changes curvature). This is why extrapolation beyond the test matrix is dangerous: models should be reported with their validity bounds, not applied blindly to conditions the test never covered.",
    },
    {
      kind: "equation",
      depth: "deeper",
      latex:
        "R_{\\mathrm{grow,cal}}(t,\\,T,\\,U) \\;=\\; \\beta_{\\mathrm{res}} \\;\\cdot\\; (U - U_{\\mathrm{ref}}) \\;\\cdot\\; \\exp\\!\\left(\\frac{-E_{a,R}}{R\\,T}\\right) \\;\\cdot\\; t^{0.75}",
      label: "Calendar resistance growth — same form, separate coefficients",
      explanation:
        "Resistance growth uses an identical structural form to capacity fade, but with separate fitted coefficients β_res and E_a,R. The paper found that resistance and capacity degrade roughly in parallel — both driven by SEI thickening — but with different pre-exponential magnitudes. Using the same t^0.75 and Arrhenius structure for both outputs is a deliberate simplification: it keeps the model symmetric and reduces the number of free parameters. In practice, resistance sometimes grows faster than capacity at low temperature (because ionic conductivity of the thickening SEI layer matters more for resistance than for capacity), so later models fit the exponents separately.",
    },

    // ── CYCLE MODEL ──────────────────────────────────────────────────────────
    {
      kind: "text",
      depth: "core",
      heading: "Cycle capacity fade: DoD linearity and the U-shaped SoC effect",
      body:
        "The cycle model separates how **much** energy goes through the cell (Ah throughput, equivalent to [[FEC]] × nominal capacity) from **how damaging each Ah is** (the stress coefficient, which depends on DoD and mean SoC). Two findings dominate:\n\n**1. DoD scales fade approximately linearly per Ah.** Doubling the depth of discharge roughly doubles the capacity loss per unit charge throughput. At 5 % DoD the cell reached an extrapolated ~8500 FEC to EOL; at 100 % DoD it reached only ~440 FEC. This is a factor of ~19× difference in cycle life for a factor of 20× difference in DoD — almost exactly linear. The mechanical fatigue analogy is apt: larger strains per cycle = more damage per cycle, and the relationship is close to proportional for this chemistry.\n\n**2. Mean SoC has a U-shape with a minimum near 50 %.** Cycling centred on 50 % SoC is the healthiest — both electrodes operate in their structurally stable, thermodynamically comfortable zones. Cycling at high mean SoC stresses the NMC cathode (high potential → electrolyte oxidation, transition-metal dissolution) and keeps the graphite anode at a reactive low potential. Cycling at low mean SoC means both electrodes operate at extreme states: cathode at deep discharge can undergo partial phase transformation, graphite at deep discharge has lower staging energy and is more prone to structural damage from lithium re-insertion. The quadratic U-shape around 50 % captures this approximately.",
      clarify:
        "Think of DoD as how hard you flex a metal rod: small flex = stays straight for very long; big flex = snaps quickly; and the relationship is roughly proportional per flex. Mean SoC is where in its range you flex it: flexing in the middle of its range is the gentlest; flexing near either end puts extra stress on already-strained atoms. The combination of both effects gives you the full cycle-life surface.",
    },
    {
      kind: "equation",
      depth: "core",
      latex:
        "Q_{\\mathrm{loss,cyc}}(\\mathrm{Ah},\\,\\mathrm{DoD},\\,U_{\\mathrm{mean}}) \\;=\\; \\underbrace{\\bigl[\\,\\gamma_1 \\cdot \\mathrm{DoD}\\;+\\;\\gamma_2 \\cdot (U_{\\mathrm{mean}} - U_{\\mathrm{ref}})^2\\;+\\;\\gamma_3\\,\\bigr]}_{\\alpha_{\\mathrm{cyc}}(\\mathrm{DoD},\\,U_{\\mathrm{mean}})} \\;\\cdot\\; \\mathrm{Ah}^{z_{\\mathrm{cyc}}}",
      label: "Cycle capacity fade — stress coefficient × throughput",
      explanation:
        "Ah is cumulative charge throughput (A·h) — equivalent to FEC × Q_nominal. α_cyc is the stress coefficient: γ₁ is the DoD prefactor (linear DoD dependence), γ₂ governs the U-shaped mean-SoC penalty centred on U_ref (~3.73 V = ~50 % SoC for this NMC cell), and γ₃ is a baseline minimum rate. The cycle throughput exponent z_cyc is close to 1 for NMC at 35 °C and 1C, meaning fade is approximately linear in cumulative Ah at constant operating conditions. All three coefficients γ₁, γ₂, γ₃ are fitted from the cycle matrix. Temperature is absent from this equation — in the 2014 paper the cycle matrix was run at fixed 35 °C; the temperature effect on cycle ageing enters implicitly through the electrothermal model's self-consistent temperature computation during the simulation.",
    },
    {
      kind: "tool",
      depth: "core",
      tool: "cycle-explorer",
      note: "Try 100 % DoD vs 10 % DoD at constant temperature — the life difference illustrates the γ₁·DoD factor directly. Then observe how moving the temperature below 10 °C with a high charge C-rate triggers the plating penalty — something Schmalstieg 2014 did not model (1C only, 35 °C), which is why plating-aware extensions exist.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "misconception",
      title: "Throughput is not a constant degradation rate",
      body:
        "Schmalstieg 2014 shows that z_cyc ≈ 1 at fixed conditions. This does NOT mean you can price all kWh of throughput at the same cost. It means throughput is a good predictor of fade *when all other stress factors are held constant*. Change DoD from 5 % to 100 % and the cost per Ah is 19× higher. Change mean SoC from 50 % to 90 % and cost rises significantly. A V2G optimiser using flat €/kWh pricing picks the worst services for exactly this reason — it silently subsidises deep, high-SoC cycles while overcharging gentle FCR micro-cycles.",
    },

    // ── SUPERPOSITION ────────────────────────────────────────────────────────
    {
      kind: "text",
      depth: "core",
      heading: "Superposition: adding calendar and cycle ageing",
      body:
        "The 'holistic' combination is additive: total capacity loss = calendar part + cycle part, and similarly for resistance. This is the model's most criticised simplification — and also its most convenient one. The argument for it: calendar and cycle ageing involve physically different stress states (rest vs. current flow), so at zeroth order they are independent. The argument against it: cycling cracks the [[SEI]], exposing fresh graphite surface that then ages faster in storage — this is a **multiplicative interaction** that additive superposition ignores. In practice, pure additive superposition tends to underpredict total fade in mixed calendar+cycle operation by 5–20 %, depending on the duty cycle. The Schmalstieg paper does not claim this is exact; it is a practical approximation that makes the model usable in simulation while remaining explicitly criticisable, which is the correct engineering trade-off.",
      clarify:
        "If scratching a surface makes it rust faster, the total damage is not just 'scratching damage + rusting damage' — the scratching made the rusting worse. Additive superposition ignores this interaction. Schmalstieg's model does not pretend it doesn't exist; it just acknowledges that including it would require many more fitted parameters and a more complex model that might overfit the available data.",
    },
    {
      kind: "equation",
      depth: "core",
      latex:
        "Q_{\\mathrm{loss,total}} = Q_{\\mathrm{loss,cal}} + Q_{\\mathrm{loss,cyc}} \\qquad R_{\\mathrm{grow,total}} = R_{\\mathrm{grow,cal}} + R_{\\mathrm{grow,cyc}}",
      label: "Superposition assumption — additive calendar + cycle",
      explanation:
        "The total fractional capacity lost is the sum of the calendar contribution (driven by time, temperature, and storage SoC) and the cycle contribution (driven by cumulative charge throughput, DoD, and mean SoC during cycling). Resistance growth is similarly additive. The two halves share no interaction term. To separate them in a mixed-use simulation, you accumulate calendar stress during rest periods and cycle stress during charge/discharge, then sum at any point in time.",
    },
    {
      kind: "text",
      depth: "deeper",
      heading: "Three ways superposition breaks — and what to do about it",
      body:
        "**1. Cycling cracks and refreshes the SEI.** Every charge/discharge cycle makes graphite particles breathe (volume change ~10 % for graphite), which stresses and partially fractures the [[SEI]] film. The freshly exposed graphite surface ages faster in subsequent storage than an uncracked surface. This means the effective calendar rate constant k_cal increases as FEC accumulates — a positive feedback the additive model misses. Magnitude: can cause 10–20 % underestimation of total fade over a vehicle lifetime.\n\n**2. Calendar contamination inside cycle tests.** A cycle test run over 6 months accumulates 6 months of calendar ageing on top of the cycle ageing. If you do not subtract the calendar contribution (using a parallel storage test at the same temperature and mean SoC), you overfit the cycle parameters and the cycle model ends up absorbing some calendar damage — making it look like cycling hurts more than it does, and making the calendar model less accurate when applied to periods of pure storage. Schmalstieg 2014 explicitly uses matched storage tests to correct for this.\n\n**3. Electrode balancing shift.** As LLI accumulates (both from calendar SEI and cycle SEI/plating), the graphite anode's usable SoC window shifts relative to the cathode. A cell that was cycling between 3.0 V and 4.2 V at the start of life is now, after years of LLI, cycling the anode over a slightly different voltage range — meaning the actual DoD stress factor is not constant over life, even if the terminal-voltage window is held fixed. Semi-empirical models are usually fitted at beginning-of-life and then extrapolated assuming the same stress factors hold throughout, which becomes increasingly inaccurate as the cell ages.",
    },

    // ── ELECTROTHERMAL COUPLING ──────────────────────────────────────────────
    {
      kind: "text",
      depth: "core",
      heading: "The electrothermal coupling — what actually makes it holistic",
      body:
        "If you take the equations above and run them with a fixed temperature and SoC, you get a standard stress-factor model — one step above pure Ah-counting, but still missing something critical. What the Schmalstieg 2014 model adds is the **feedback loop** between the cell's electrical and thermal state and its ageing rate:\n\n1. **[[ECM]] (Equivalent Circuit Model)**: the cell voltage is modelled as OCV(SoC) minus ohmic drop (I × R₀) minus RC-element transients. This gives you the actual cell voltage under load — not the set-point voltage at rest.\n2. **Thermal model**: a lumped thermal node balances Joule heating (I² × R₀ + RC losses) against convection to the ambient. At high current (e.g. 2C gradient climb), I²R heating can raise the cell 10–15 °C above ambient. At low current it stays near ambient.\n3. **Ageing update**: every simulation timestep, the actual T (from the thermal model) and the actual V (from the ECM) are passed to the ageing model. The Arrhenius factor and voltage stress factor are computed for the *experienced* conditions, not the *nominal* ones.\n4. **State update**: as ageing accumulates, R₀ increases (R_grow) and Q_cell decreases (Q_loss). These updated values feed back into the ECM and thermal model in the next step — a **positive feedback loop**: more resistance → more heat → faster ageing → more resistance.\n\nThis loop is the physical reality of operating any battery: the cell's own losses heat it up and thus accelerate its own degradation. A model that ignores this — e.g. one that just assumes the cell stays at ambient temperature — will underpredict ageing under high-current operation, exactly the condition that matters most for truck fast-charging and gradient operation.",
      clarify:
        "Analogy: a car engine that gets hotter when it works harder, and hotter engines wear out faster. A model that assumes the engine stays at 20 °C regardless of load would predict the same wear at idle and at full throttle — obviously wrong. Schmalstieg's model is like adding a thermocouple to the model engine: it tracks the actual temperature every moment and updates the wear prediction accordingly.",
    },
    {
      kind: "equation",
      depth: "core",
      latex:
        "\\underbrace{m\\,c_p \\,\\frac{dT}{dt} = I^2 R_{\\mathrm{eff}} - h A (T - T_{\\mathrm{amb}})}_{\\text{cell thermal balance}} \\qquad \\underbrace{V_{\\mathrm{cell}} = \\mathrm{OCV}(\\mathrm{SoC}) - I R_0 - \\textstyle\\sum_k V_{\\!RC,k}}_{\\text{ECM voltage}}",
      label: "Electrothermal model coupled to the ageing model",
      explanation:
        "Left: the cell temperature T evolves from Joule heating (I²R_eff, where R_eff includes ohmic and RC contributions) minus convective cooling (hA(T−T_amb), where h is heat-transfer coefficient and A is cell surface area). Right: the ECM cell voltage is OCV at the current SoC, minus the ohmic drop IR₀, minus the sum of RC-element voltages V_RC,k (capturing diffusion and charge-transfer dynamics). Both T and V_cell feed directly into the Arrhenius factor exp(−Eₐ/RT) and the voltage stress factor (V_cell − U_ref) in the ageing model. As the cell ages: R₀ rises → Joule heating per amp increases → T rises → ageing rate rises → R₀ rises faster. This is the electrothermal-ageing positive feedback that makes aged packs age faster — and that any realistic truck/V2G simulation must include.",
    },
    {
      kind: "tool",
      depth: "core",
      tool: "arrhenius",
      note: "The Arrhenius tool shows how the temperature acceleration factor changes with Ea. The Schmalstieg 2014 Ea of 48–60 kJ/mol corresponds to roughly 1.7–2.0× acceleration per 10 °C — consistent with the '2×/10 K' rule of thumb, and exactly the factor that I²R self-heating amplifies during truck operation.",
    },
    {
      kind: "text",
      depth: "deeper",
      heading: "Implementing the feedback loop: timestep strategy",
      body:
        "The electrothermal-ageing feedback loop spans multiple timescales: seconds (RC-element dynamics, I²R heating), minutes (temperature settling), hours (SoC change under normal driving), and days-to-months (ageing). Simulating this at 1-second resolution for a 10-year truck life is computationally impractical. The standard engineering approach exploits **timestep separation**: run the electrical+thermal model at fine resolution (1–10 s) to compute mean and peak stress indicators (T_mean, SoC_mean, DoD per micro-cycle); accumulate stress statistics over a longer aggregation window (1 hour to 1 day); pass statistics to the ageing model for a bulk update of R₀ and Q_cell. The ageing state is then held fixed for the aggregation window, and the ECM/thermal model uses the updated R₀ and Q_cell for the next window. This works because ageing is slow (R₀ changes by < 0.01 % in a day) — the quasi-static assumption holds well throughout the model's valid range. It breaks only near the knee point, where ageing can accelerate rapidly — a known limitation addressed by shortening the aggregation window in that regime.",
    },

    // ── SUDDEN DEATH ─────────────────────────────────────────────────────────
    {
      kind: "callout",
      depth: "core",
      tone: "misconception",
      title: "The model cannot predict sudden death — and the paper says so",
      body:
        "A subset of cells in the cycle matrix failed abruptly between 250 and 950 cycles at identical test conditions — capacity dropped from ~90 % to < 70 % in a few cycles. No smooth parametric model predicts this: the Schmalstieg model (and every semi-empirical model like it) gives a smooth, monotonic fade curve with no knee. The paper acknowledges this explicitly. The sudden-death mechanism is likely catastrophic internal short circuit or accelerating lithium-plating dendritic growth — stochastic, test-to-test variable, and invisible to any model fit to mean behaviour. For truck warranty engineering this matters: your model may predict 2000 FEC to 80 % SoH, but some packs may fail at 600 FEC. Statistical treatment (Weibull distributions over a fleet, not point estimates) and cell-to-cell variation analysis are the only engineering responses. A model that doesn't mention this limitation is incomplete.",
    },

    // ── WHAT LATER WORK ADDRESSED ────────────────────────────────────────────
    {
      kind: "text",
      depth: "core",
      heading: "What the model does not cover — and the extensions that do",
      body:
        "Schmalstieg 2014 was a landmark but not the final word. Several explicit gaps motivate later work:\n- **No [[lithium plating]] term.** The cycle matrix used 1C charge rate at 35 °C — conditions where plating is minimal. For [[MCS]] (megawatt charging) at ≤ 10 °C, plating is the dominant cycle-ageing mechanism and this model is structurally blind to it. Plating-aware extensions add a gating function: no plating penalty above a threshold temperature and below a threshold charge C-rate.\n- **No C-rate dependence in cycle model.** Because all cycling was done at 1C, the model cannot distinguish a gentle 0.3C depot charge from an aggressive 2C opportunity charge at the same DoD and mean SoC. Later truck-focused models add a C-rate stress factor g_C.\n- **Only one temperature in the cycle matrix (35 °C).** Temperature effects on cycling enter only via the electrothermal model's self-heating, not via an explicit cycle-temperature stress factor. At very different ambient temperatures (−20 °C Arctic, +45 °C Gulf summer) this is insufficient.\n- **NMC111, not NMC622/811 or NMC-G+Si.** Energy densities and electrode materials have evolved significantly since 2014. The model structure remains valid; the parameters need re-fitting for modern cells.\n- **No LFP equivalent.** The structural counterpart for [[LFP]] came from the same ISEA group in Naumann et al. 2015/2017 — same equations, different fitted parameters and a notably weaker SoC-stress function (LFP's flat OCV means the voltage stress term has less dynamic range).",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "truck",
      title: "Adapting Schmalstieg 2014 for truck use today",
      body:
        "A 2025 truck battery engineering team at a MAN/Traton-type OEM would use the Schmalstieg 2014 model *structure* (same equation form) but:\n(1) Re-fit α_cap, β_res, γ₁–γ₃ for the specific prismatic NMC or LFP cell in the truck pack, under NDA from the cell supplier.\n(2) Add a plating-gate term for the MCS fast-charge scenario.\n(3) Add a C-rate stress factor g_C for the cycle model.\n(4) Extend the thermal model from a single-cell lump to a pack-level thermal network to capture the hottest-cell temperature in a 500 kWh module stack.\n(5) Validate on truck duty-cycle data (dynamic current profiles) rather than just the constant-current RPT used in the original paper.\nSteps (2)–(5) are the bread-and-butter of a master's thesis or industrial internship project at an OEM. The foundation — Schmalstieg 2014 — is what you build on.",
    },

    // ── PARAMETER IDENTIFICATION RECIPE ─────────────────────────────────────
    {
      kind: "text",
      depth: "deeper",
      heading: "How to re-parameterise this model for a new cell",
      body:
        "The Schmalstieg model has a well-defined fitting procedure that can be followed as a recipe:\n### Step A — Calendar fitting\n1. Run storage tests at ≥ 3 temperatures and ≥ 6 SoC values. Record capacity at regular intervals for ≥ 6 months (12 months preferred).\n2. For each condition, fit Q_loss,cal(t) = A · t^z. Determine the best-fit exponent z (expect 0.5–0.85 for NMC/graphite; fix at 0.75 if data are consistent).\n3. At each SoC, plot A vs temperature on an Arrhenius plot (ln A vs 1/T). The slope gives −Eₐ/R. Extract Eₐ.\n4. Plot A / exp(−Eₐ/RT) vs cell voltage U at each SoC. Fit a straight line: slope = α_cap, intercept absorbed into the fit.\n5. Repeat for resistance R_grow,cal to get β_res and E_a,R.\n### Step B — Cycle fitting (after subtracting calendar contribution)\n1. For each cycle condition, at each RPT checkpoint, subtract the expected calendar fade Q_loss,cal(t_elapsed, T_test, U_mean) from the measured total fade. The residual is the isolated cycle fade.\n2. Fit Q_loss,cyc(Ah) = α_cyc · Ah^z_cyc for each condition.\n3. Plot α_cyc vs DoD: fit γ₁ from the slope.\n4. Plot α_cyc vs U_mean: fit γ₂ (U-shape coefficient) and γ₃ (baseline).\n5. Repeat for resistance R_grow,cyc.\n### Step C — Validation on dynamic profiles\nRun the fully parameterised model through a representative truck duty cycle (dynamic current, real ambient temperature, thermally coupled). Compare predicted to measured capacity and resistance fade at the same RPT intervals. If the error exceeds ~15 %, investigate which stress factor is responsible (residual plot per condition) and revisit the relevant fit.",
    },

    // ── FINAL SYNTHESIS ──────────────────────────────────────────────────────
    {
      kind: "text",
      depth: "core",
      heading: "Summary: what you should carry away from this paper",
      body:
        "If you read Schmalstieg 2014 once and had to summarise it in five sentences for a PhD defence, this is what they should be:\n\n**1.** The model covers calendar ageing (time, temperature, SoC), cycle ageing (Ah throughput, DoD, mean SoC), and both capacity fade and resistance growth — holistically in a single framework.\n\n**2.** Calendar fade follows t^0.75 with Arrhenius temperature scaling and approximately linear voltage stress — the 0.75 exponent is the key empirical finding, distinct from the classical diffusion-limited √t prediction.\n\n**3.** Cycle fade is approximately linear in cumulative Ah throughput per unit depth-of-discharge, with a U-shaped penalty centred on 50 % mean SoC — so shallow, mid-SoC cycling is disproportionately cheap and deep, high-SoC cycling is disproportionately expensive.\n\n**4.** The model is driven by an electrothermal ECM+thermal model, so stress factors reflect the cell's actual experienced temperature and voltage under load, not its nominal set-points — this is the feature that makes it suitable for realistic truck/V2G simulation.\n\n**5.** The model is explicitly a smooth parametric fit and cannot predict sudden cell death; statistical treatment of a cell population and knowledge of the model's extrapolation bounds are required for engineering sign-off.",
    },

    {
      kind: "text",
      depth: "deeper",
      heading: "How to read the original paper efficiently",
      body:
        "If you access the paper (DOI 10.1016/j.jpowsour.2014.02.012 — check your university's journal subscription), the structure is:\n- **Section 2 (Experimental)**: read carefully — the cell specs, RPT protocol, and matrix designs are all there, and they explain every subsequent modelling choice.\n- **Section 3 (Calendar ageing)**: read the Arrhenius plots (temperature fits) and the voltage-stress plots (SoC fits). The t^0.75 finding is in the time-dependence figures.\n- **Section 4 (Cycle ageing)**: focus on the DoD vs fade-rate plot and the mean-SoC U-shape figure. The sudden-death observation is at the end of this section.\n- **Section 5 (Holistic model)**: this is the assembly of calendar + cycle + electrothermal coupling into one model and its validation on a drive-cycle simulation. Read the validation figures carefully — the model tracks the data within ~5–10 % on the validation set.\n- **Tables 1–3**: the fitted parameter values. You cannot reproduce these for a different cell (they are specific to the 2.05 Ah NMC111 18650 tested), but the table structure shows you exactly what parameters you need to fit for any cell.\nEstimated reading time with this structure: 90 minutes for a first pass that gives you everything you need for a literature review or a model implementation plan.",
    },
  ],
};
