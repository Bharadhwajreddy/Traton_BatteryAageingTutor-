import type { Section } from "@/lib/types";

export const modelFamilies: Section = {
  slug: "model-families",
  title: "Ageing Model Families",
  summary:
    "The modelling landscape ordered by physics content: throughput counting, semi-empirical stress models, mechanistic/electrochemical models, coupled electro-thermal ageing, and data-driven approaches — and which one answers which question.",
  prerequisites: ["calendar-vs-cycle", "stress-factors"],
  minutes: 25,
  blocks: [
    {
      kind: "text",
      depth: "core",
      heading: "A map, not a ranking",
      body:
        "Every ageing model answers the same surface question — *how much capacity and power will this cell have lost after this usage history?* — but the families differ wildly in what they take as input, what they cost to build, and where they are allowed to be trusted. The most useful way to organise them is by **physics content**: from models that know nothing about the cell except how many amp-hours passed through it, up to models that resolve lithium concentration gradients inside individual particles. More physics buys you extrapolation power; it also buys you parameters you may never be able to measure. The whole craft of degradation modelling is choosing the cheapest family that still answers *your* question.",
      clarify:
        "Think of weather forecasting. You can predict tomorrow from 'it's usually like today' (cheap, often fine, useless for storms), from statistical patterns of past weather (better, still blind to new situations), or from full atmospheric physics simulation (powerful, expensive, and wrong anyway if you feed it bad measurements). Battery ageing models span the same range, and just like in weather, the fanciest model is not automatically the right tool.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "(a) Pure throughput models — counting amp-hours",
      body:
        "The simplest family assigns the battery a fixed lifetime budget: *N* cycles, or a total Ah/[[FEC]] throughput, and charges every unit of throughput an equal share of the pack's value. A slightly fancier variant counts cycles against a single [[Wöhler curve]] using rainflow counting. These models survive because they are trivially cheap and because fleet spreadsheets love a single €/kWh-throughput number. For heavy-duty [[V2G]], they fail structurally, not just numerically:\n- **No temperature sensitivity** — a Phoenix summer and an Oslo winter cost the same, which is off by a large factor in either direction.\n- **No calendar term** — a truck parked at 95 % [[SoC]] all weekend ages for free, which is exactly backwards for [[NMC]].\n- **No depth or rate sensitivity** (in the pure-Ah version) — a shallow 5 % [[FCR]] micro-cycle is priced like a slice of a 90 % deep discharge, so the model systematically *overprices the gentlest V2G services and underprices the harshest ones*. An optimiser fed this cost signal will make confidently wrong dispatch decisions.",
      clarify:
        "It's like pricing car wear purely per kilometre: 100 km on a smooth motorway and 100 km on a washboard gravel track cost the same, and a car rusting in a salty harbour car park for a year costs nothing. Fine for a rough annual budget; disastrous if someone is using the price to decide *which* roads to drive.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "(b) Semi-empirical stress-factor models — the workhorse",
      body:
        "The [[semi-empirical model]] family keeps a physics-*motivated* skeleton and fills in the numbers by regression on matrix ageing tests. The skeleton is almost always: a reference degradation rate, multiplied by separable [[stress factor]]s for temperature ([[Arrhenius]]), storage SoC, [[DoD]], and [[C-rate]], driving a power law in time (calendar) and in FEC (cycle), with the two added under the [[superposition]] assumption. Strengths: parameters come from feasible lab campaigns; evaluation costs microseconds, so the model drops straight into [[BMS]] code, fleet simulation, and dispatch optimisers; and each stress factor is individually interpretable. Limits you must respect: it is an **interpolation machine** — outside the fitted T/SoC/DoD/C grid it has no opinion, only an extrapolated guess; separability and superposition are assumptions, not facts; and it is structurally unable to predict a [[knee point]], because nothing in a smooth power law can produce one.",
      clarify:
        "It's a well-calibrated recipe book, not a chemistry textbook. Within the dishes it was tested on, it's accurate and fast. Ask it about an ingredient combination nobody ever cooked in the lab — megawatt charging at −10 °C, say — and it will still print a confident number, derived from nothing.",
    },
    {
      kind: "equation",
      depth: "core",
      latex:
        "Q_{\\mathrm{loss}} = \\underbrace{k_{\\mathrm{cal}}\\, f_T(T)\\, f_{SoC}(SoC)\\, t^{\\,z_{\\mathrm{cal}}}}_{\\text{calendar}} \\; + \\; \\underbrace{k_{\\mathrm{cyc}}\\, g_{DoD}(DoD)\\, g_C(C)\\, g_T(T)\\, FEC^{\\,z_{\\mathrm{cyc}}}}_{\\text{cycle}}",
      label: "Generic semi-empirical structure",
      explanation:
        "Two additive terms (superposition). The calendar term: a reference rate k_cal scaled by a temperature factor f_T (Arrhenius) and a storage-SoC factor f_SoC, growing as t to a fitted exponent z_cal (≈ 0.5 if SEI diffusion limitation dominates). The cycle term: a reference rate per FEC scaled by depth-of-discharge, C-rate, and temperature factors, growing as FEC to its own exponent. Schmalstieg-style NMC models and Naumann-style LFP models are exactly this shape with chemistry-specific factor functions; Wang-style throughput models are this shape with most factors frozen to 1.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "What this app actually computes",
      body:
        "Every interactive tool in this app runs a model of exactly the family-(b) shape, so you can check your reading against running code. Concretely: `Q_loss(t) = Q_cal(t) + Q_cyc(FEC)`, with `Q_cal = k_ref · f_T(T) · f_SoC(SoC) · t^z_cal` and `Q_cyc = k_ref · g_DoD · g_C · g_T,plating · FEC^z_cyc`. The temperature factor is pure Arrhenius around 25 °C; the calendar SoC factor is an exponential in SoC with an extra penalty above ~85 % (mimicking [[electrolyte oxidation]] on NMC and the anode plateau edge on [[LFP]]); the DoD factor is Wöhler-like (linear + quadratic); the cycle temperature factor is U-shaped with a low-temperature plating penalty gated on charge C-rate. Resistance growth reuses the same stress factors with its own prefactors. The parameters are *literature-typical*, deliberately not copied from any single paper — good for trends and orders of magnitude, not for engineering sign-off.",
      clarify:
        "In other words: the curves you drag around in the tools are not a cartoon — they are this exact equation evaluated live. When the calendar explorer bends upward as you raise SoC, you are watching f_SoC(SoC) do its job.",
    },
    {
      kind: "tool",
      depth: "core",
      tool: "calendar-explorer",
      note: "This very tool runs the semi-empirical structure from (b) — read the curve while you read the equations. Vary T and SoC and identify which stress factor each slider drives.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "(c) Mechanistic and physics-based models",
      body:
        "Family (c) replaces fitted stress factors with resolved physics. The ladder, in increasing cost:\n- **Standalone [[SEI]] growth models**: diffusion- or kinetics-limited film growth driven by [[anode potential]] rather than by an empirical SoC factor. Because anode potential is the *actual* causal variable, these extrapolate across SoC and chemistry tweaks far better than a fitted f_SoC.\n- **[[lithium plating]] models**: deposition kinetics activated when the local anode potential crosses 0 V vs Li/Li⁺ — the only model class that can *predict* (rather than postdict) a fast-charge-induced [[knee point]].\n- **Reduced-order electrochemical models**: [[SPM]] and SPMe couple one representative particle per electrode to simplified electrolyte dynamics, cheap enough for control and observer design, and able to host SEI/plating submodels.\n- **Full [[P2D]] (DFN) with degradation submodels**: the reference resolution — solid and electrolyte transport through both electrode thicknesses, with mechanisms attached locally. Indispensable for cell design questions; rarely justified for fleet or dispatch questions.\nThe computational cost spans roughly six orders of magnitude from a stress-factor evaluation to a parameterised DFN time step — and the *parameterisation* cost spans even more.",
      clarify:
        "Stress-factor models say 'high SoC is bad, here's the fitted penalty'. Mechanistic models say *why*: high SoC pushes the graphite electrode near 0 V, where the electrolyte decomposes faster. Knowing the why means the model still works when the situation changes; the price is that you now need to know things about the cell's insides that the manufacturer will not tell you.",
    },
    {
      kind: "equation",
      depth: "deeper",
      latex:
        "i_{\\mathrm{SEI}} \\;\\propto\\; \\exp\\!\\left(-\\frac{\\alpha F \\eta_{\\mathrm{SEI}}}{R T}\\right), \\qquad \\eta_{\\mathrm{SEI}} = \\phi_s - \\phi_e - U_{\\mathrm{SEI}}",
      label: "Tafel-style SEI side-reaction current",
      explanation:
        "The SEI-forming side reaction is treated as an irreversible electrochemical reaction with a Tafel rate law: its current density i_SEI grows exponentially as the overpotential η_SEI becomes more negative. η_SEI is the local anode solid-phase potential φ_s minus electrolyte potential φ_e minus the side reaction's equilibrium potential U_SEI (~0.4 V vs Li/Li⁺). High cell SoC drives φ_s down → η_SEI more negative → exponentially faster SEI growth. This single expression is the mechanistic ancestor of every empirical 'exp(c·SoC)' calendar stress factor — including the one in this app's `socStressFactor` — and it explains *why* that empirical shape keeps working: it is the shadow of a Tafel law projected onto the SoC axis.",
    },
    {
      kind: "text",
      depth: "deeper",
      heading: "Where mechanistic models earn their keep — and where they don't",
      body:
        "Mechanistic models dominate in three situations: (1) **extrapolation by construction** — an anode-potential-driven calendar model fitted at three SoC points predicts intermediate and edge SoC behaviour from physics, not curve shape; (2) **operating-strategy design** — only a plating-aware model can tell you how much charging current an *aged* cell tolerates at 0 °C, because the answer depends on internal states no test matrix covered; (3) **diagnosis** — coupling to [[DVA]]/[[ICA]] observables to attribute fade to [[LLI]] vs [[LAM]]. They lose badly when parameters are guessed: a DFN model has dozens of transport and kinetic parameters, many unmeasurable without cell teardown, and its outputs can be exquisitely sensitive to the wrong ones. The honest workflow is hybrid: mechanistic structure where the physics is the question, fitted simplicity everywhere else.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "(d) Electro-thermal coupled ageing models — the system-level standard",
      body:
        "For pack and system studies, the practical standard is a feedback loop of three cheap models: an [[ECM]] reproduces terminal voltage and computes I²R losses; a lumped thermal node (or small thermal network) turns those losses plus cooling into cell temperature; and a family-(b) ageing model consumes the resulting temperature, SoC, and current trajectories. The coupling matters because the feedbacks are the story: ageing raises resistance → more heat per amp → higher temperature → faster ageing. A truck pulling 2C on a gradient with a mid-life pack sits meaningfully hotter than the same truck when new, and an uncoupled model misses the compounding entirely. This architecture — ECM + thermal node + ageing in a loop, electrics at seconds, ageing accumulated daily — is what virtually every credible V2G and fleet simulation runs, including the dispatch tool in this app.",
      clarify:
        "Three small gears meshed together: an electrical gear (voltage and losses), a thermal gear (losses become temperature), and a slow ageing gear (temperature and use become wear). None of the three is sophisticated alone; the realism comes from letting them turn each other.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "(e) Data-driven and machine-learning models",
      body:
        "The newest family learns the usage→degradation map directly from data. Three sub-flavours: **feature-based** models extract engineered features from charge curves (voltage-curve segments, ICA peak heights, relaxation behaviour) and regress [[SoH]] or [[RUL]] — strong for *estimation* from field data; **sequence models** ingest raw time-series histories; **hybrid grey-box** models wrap a semi-empirical skeleton and let an ML residual absorb what the skeleton misses — often the best engineering compromise. Be honest about the costs: these models are data-hungry in exactly the dimension batteries are stingy (years per sample), they interpolate the *operating-condition distribution of the training fleet* and silently degrade off it, and [[knee point]] prediction — the thing fleet owners most want — remains a genuinely open problem: knees are rare in datasets, mechanistically diverse, and by definition preceded by data that looks reassuringly normal.",
      clarify:
        "ML ageing models are like a doctor who has seen ten thousand patients but never opened an anatomy book: superb pattern recognition within the population they trained on, and no principled basis for the patient unlike any they have seen — which, for a 2026 truck cell doing megawatt charging and V2G, is precisely your patient.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "misconception",
      title: "\"More physics is always better\"",
      body:
        "No. A DFN model with guessed parameters is *worse* than a well-fitted stress-factor model: it produces precise-looking, mechanism-labelled, confidently wrong numbers, and its complexity hides the guessing. Model quality = structure quality × parameter quality × validation quality, and the second two terms usually bind first. If your data supports four stress factors and two exponents, fit four stress factors and two exponents — and spend the saved months on validation against dynamic profiles.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "truck",
      title: "Choosing for a truck V2G study",
      body:
        "Concrete selection logic for a depot-V2G thesis on a 500 kWh tractor pack: the dispatch optimiser needs millisecond-cheap, condition-sensitive marginal costs → family (b) inside a family-(d) electro-thermal loop. The [[MCS]] fast-charge limits for the aged pack need plating physics → one targeted family-(c) study, not a full DFN of everything. Fleet SoH monitoring from telematics → family (e) feature-based estimation. Three questions, three families, one project. The pure-Ah model from (a) appears only as the strawman whose dispatch decisions you beat.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Which family for which question",
      body:
        "The selection logic, compressed:\n- **[[BMS]] / online SoH estimation** → data-driven feature-based, or ECM-observer hybrids: you have streams of field data and need estimation, not prediction.\n- **Warranty and lifetime sign-off** → semi-empirical fitted on *your* cell with held-out dynamic validation, plus uncertainty quantification; mechanistic spot-checks at the operating envelope's edges.\n- **V2G dispatch optimisation** → semi-empirical inside an electro-thermal loop, possibly piecewise-linearised for the solver: the optimiser calls the cost model millions of times.\n- **Cell or charging-protocol design** → mechanistic (SPMe/DFN + SEI/plating submodels): the question *is* the internal physics.\n- **Fleet [[TCO]] screening** → semi-empirical with sensitivity bands; throughput models only ever as an admitted lower bound on sophistication.\nNotice the pattern: the question fixes the family far more than the chemistry or the data do. Write the question down first — the Roadmap section turns this into a full procedure.",
      clarify:
        "Same rule as choosing a map: hiking needs contour lines, driving needs roads, flying needs airspace. No map is 'the most accurate' in the abstract — and nobody hikes with an aeronautical chart just because aviation sounds more advanced.",
    },
  ],
};
