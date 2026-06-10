import type { Section } from "@/lib/types";

export const roadmap: Section = {
  slug: "roadmap",
  title: "Modelling Roadmap: From Question to Thesis",
  summary:
    "A five-step decision pipeline — question, model family, data strategy, identification & validation, system integration — that turns everything before it into an executable thesis plan.",
  prerequisites: ["model-families", "parameter-identification", "v2g-integration"],
  minutes: 20,
  blocks: [
    {
      kind: "text",
      depth: "core",
      heading: "From knowledge to a plan",
      body:
        "You now know the mechanisms, the stress factors, the model families, where parameters come from, and how ageing plugs into [[V2G]] economics. What turns that into a thesis is **sequence discipline**: a fixed order of decisions in which each step's output is the next step's input, and no step is allowed to start before its input exists. The five steps: (1) define the question and its metrics; (2) choose the model family; (3) choose the data strategy; (4) identify and validate; (5) integrate into the system simulation. The single most common failure mode in student projects is running this pipeline backwards — choosing an exciting model first, then hunting for a question it answers and data it can eat. Run it forwards and the thesis largely writes itself.",
      clarify:
        "It's the difference between buying power tools and then wondering what to build, versus drawing the bookshelf first and buying exactly the tools the drawing demands. Both people end up busy; only one ends up with a bookshelf.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Step 1 — Write the question down, with units",
      body:
        "Before touching any model, commit in writing to:\n- **Your [[SoH]] definition**: capacity-based (range), resistance/power-based (gradeability, fast-charge capability), or both. A truck pack can fail power before capacity — choosing the wrong axis invalidates the whole study.\n- **Your [[EOL]] criterion**: the conventional 80 % capacity, or an application-derived threshold (minimum guaranteed route + reserve on the worst winter day).\n- **Your output metric**: [[RUL]] in years? Cost per kWh of throughput for dispatch pricing? Probability of surviving warranty? End-of-warranty SoH distribution across a fleet? These sound interchangeable; they demand different models. RUL needs trustworthy long-horizon extrapolation; cost-per-kWh needs trustworthy *marginal* sensitivities; warranty risk needs uncertainty quantification and [[cell-to-cell variation]], not just a mean trajectory.\nThe question dictates the model — write it before choosing the model. A test: if you cannot sketch, axes labelled, the final plot of your thesis now, Step 1 is not finished.",
      clarify:
        "'How healthy is this person?' is unanswerable; 'can they finish a marathon in under five hours next spring?' structures the training plan, the tests, and the verdict. Vague questions attract impressive models and produce unfalsifiable theses.",
    },
    {
      kind: "equation",
      depth: "core",
      latex:
        "c_{\\mathrm{throughput}} = \\frac{E_{\\mathrm{pack}} \\cdot p_{\\mathrm{pack}}}{(1 - SoH_{\\mathrm{EOL}})} \\cdot \\frac{\\partial\\, \\Delta SoH}{\\partial\\, E_{\\mathrm{kWh}}} \\quad \\bigg[ \\tfrac{\\text{EUR}}{\\text{kWh}} \\bigg]",
      label: "Example metric definition: marginal cost per kWh of throughput",
      explanation:
        "If Step 1 chooses 'cost per kWh of throughput' as the metric, this is its formal definition: pack value amortised over the SoH budget, times the *sensitivity* of SoH loss to one extra kWh under the operating conditions of interest. Note what the partial derivative demands of the model: condition-dependence (the derivative differs between an FCR micro-cycle and a hot deep cycle) and differentiability or at least smooth evaluability. A pure cycle-count model makes this derivative a constant — which, as the V2G section showed, is exactly the failure. Defining the metric formally like this is the fastest way to discover what the model must be able to do.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Step 2 — Choose the model family with an explicit decision flow",
      body:
        "Make the choice auditable by writing the decision tree into the thesis. A serviceable default:\n\n### Decision flow\n```\nWhat is the primary question?\n│\n├─ Cell-internal design insight needed?\n│   (charging protocols, knee mechanisms, electrode sizing)\n│   └─→ physics-based: SPM/SPMe + SEI/plating submodels;\n│        full DFN/P2D only if parameters are obtainable\n│\n├─ Dispatch/TCO optimisation inside a solver?\n│   └─→ semi-empirical stress-factor model\n│        (piecewise-linearised or surrogate for MILP/MPC),\n│        wrapped in an electro-thermal loop\n│\n├─ Field data available, monitoring/estimation needed?\n│   └─→ data-driven (feature-based SoH) or\n│        hybrid grey-box on a semi-empirical skeleton\n│\n└─ Lifetime prediction / warranty risk?\n    └─→ semi-empirical + uncertainty quantification;\n         mechanistic spot-checks at envelope edges\n```\nTwo riders: any branch may *borrow* a targeted sub-model from another branch (a dispatch study adds one plating guard from the physics branch), and the tree's output is a starting family, not a vow — Step 4's validation results are allowed to send you back here, once, with reasons documented.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Step 3 — Data strategy: four sources, one budget",
      body:
        "Rank the realistic data sources by fidelity-per-effort for *your* question:\n- **Own ageing tests**: highest fidelity, 12–24 months of lead time — only viable if the thesis starts as the cells go into the chambers, or if you join a running campaign.\n- **Supplier/OEM curves under NDA**: often excellent and exactly on-cell, but opaque (you see curves, not raw data or test conditions) and unpublishable in detail — fine for an industrial thesis whose contribution is method, not parameters.\n- **Public datasets**: real measured ageing, free, but almost never your cell format, chemistry generation, or duty profile — best for method development and benchmarking.\n- **Literature-typical parameters + sensitivity analysis**: the honest fallback. Assemble parameters from published *ranges*, label them as typical, and let a systematic sensitivity analysis bound what the uncertainty does to your conclusions. A conclusion that survives the plausible parameter range is a result; one that flips sign within it is a finding too — it says the decision *needs* better data, and quantifies which parameter to buy.\nMixing sources is normal: literature-typical calendar parameters, supplier cycle curves, public data to validate the fitting code. Just keep a register of what came from where.",
      clarify:
        "Cooking with what the market has: fresh local produce if the season allows (own tests), a trusted supplier's prepared stock (NDA data), canned goods (public datasets), or a well-reviewed recipe with substitutions noted (literature values + sensitivity). A good cook makes an honest meal from any of them — what's forbidden is serving canned soup and calling it garden-fresh.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Step 4 — Identify, validate, quantify, document",
      body:
        "Execute the parameter-identification playbook, condensed to its non-negotiables:\n- **Fit** with the staged workflow: calendar first, cycle after calendar-subtraction, shared exponents unless the data demands otherwise.\n- **Hold out dynamic profiles** — validation data must differ in *kind* from training data, not just in random split. For a truck study: synthetic weekly duty cycles including [[opportunity charging]] and weekend rests.\n- **Quantify uncertainty**: bootstrap or covariance-based parameter intervals, Monte-Carlo propagation to the output metric, and a tornado-style sensitivity ranking telling the reader which parameter dominates.\n- **Document assumptions** in a living register: [[superposition]] assumed, stress-factor separability assumed by design, Arrhenius validity range, no [[knee point]] representable, validity box in T/SoC/DoD/C-rate space. Every assumption gets a one-line justification and a note on what breaks if it fails.\nThe deliverable of Step 4 is not 'a fitted model' — it is a fitted model **plus its certificate**: error on held-out dynamics, uncertainty bands, and the assumption register. Models without certificates are anecdotes.",
      clarify:
        "Think of it as getting the model a passport: photo (fit), biometrics taken by someone other than the applicant (held-out validation), stated validity period and territory (the assumption register and validity box). Border control — your thesis committee — is entitled to refuse entry to models travelling without documents.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Step 5 — Integration: the co-simulation loop",
      body:
        "The validated ageing model finally goes to work inside the system simulation. The reference architecture is a loop:\n\n```\nduty-cycle generator  →  electro-thermal model   →  ageing model\n (routes, charging,       (ECM: V, I, losses;        (stress factors →\n  V2G dispatch)            thermal node: T)            ΔSoH, ΔR per day)\n        ↑                                                   │\n        │                  SoH/R update loop                │\n        └──────────────  economic layer  ←─────────────────┘\n                          (revenue, c_deg, TCO)\n```\n\nThe design trick that makes this tractable is **timestep separation**: electrics and temperature need seconds-to-minutes resolution, ageing moves at days-to-months. So: simulate one *representative day* (or week) at fine resolution, hand the ageing model the day's condition summary (temperature histogram, mean [[SoC]], [[FEC]], [[DoD]] distribution from rainflow counting), accumulate ΔSoH and ΔR, update the [[ECM]] parameters, and only re-simulate the fine layer when SoH has moved enough to matter (e.g. every simulated month). Exploit the separation — a naive second-by-second simulation of ten years is millions of times more compute for no additional insight. The closed loop is what captures the feedbacks single-pass studies miss: resistance growth → more heat and earlier derating → different duty-cycle realisation → different ageing.",
      clarify:
        "You don't re-plan a city after every car trip: traffic runs on a minutes clock, urban decay on a years clock, and planners summarise the former to feed the latter. Battery system simulation is the same two-clock problem, and treating it as one clock is the classic way to drown a thesis in compute.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "assumption",
      title: "Reference system for all worked numbers",
      body:
        "Unless a section says otherwise, this app's examples assume a **500 kWh** truck pack (≈ 90 % usable), pack replacement value 120 €/kWh, [[EOL]] at 80 % capacity-SoH, and a 25 °C reference temperature — the same constants the interactive tools read from their parameter file. Adopt the same discipline in a thesis: one reference system, declared once, used everywhere, with deviations flagged locally. Half of all 'contradictory' results between battery studies dissolve once you normalise their reference assumptions.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "tip",
      title: "Default starting point: semi-empirical + sensitivity",
      body:
        "When in doubt, start with a [[semi-empirical model]] and a serious sensitivity analysis, and let the *sensitivity ranking* tell you where more physics would pay. If the thesis conclusion is robust to the calendar-SoC factor's plausible range, you never needed an anode-potential model for it; if everything hinges on cold fast-charge behaviour, that — and only that — is where a mechanistic plating sub-model earns its parameterisation cost. This 'physics on demand' strategy beats both naïve simplicity and wall-to-wall DFN in results-per-month, which is the currency a thesis actually runs on.",
    },
    {
      kind: "text",
      depth: "deeper",
      heading: "When to go beyond: plating-aware fast charge and knee prediction",
      body:
        "Two upgrades justify leaving the semi-empirical comfort zone, and a thesis can scope either as a dedicated chapter. **(1) Plating-aware fast-charge modelling**: if your duty cycles feature [[MCS]]-class charging — especially cold starts or charging an already-aged pack — the smooth stress-factor treatment of charge rate is structurally inadequate, because [[lithium plating]] is a threshold phenomenon in [[anode potential]], not a smooth multiplier. The economic version of the question: how much charging time can the depot save before the marginal plating risk eats the saving? Only an SPMe-with-plating layer can price that. **(2) Knee prediction**: if the question is warranty risk or second-life value, the tail behaviour dominates, and a model that cannot produce a [[knee point]] under-states tail risk by construction. Current honest practice is not 'predict the knee date' but 'bound the conditions that bring the knee closer' — combining mechanistic triggers (plating onset, electrolyte depletion, accelerating [[LAM]]) with data-driven early-warning features. Scope it as risk quantification, not prophecy, and it is a strong chapter; promise knee *dates* and you have scheduled your own disappointment.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Deliverables checklist",
      body:
        "What the finished thesis should contain, as artefacts rather than promises:\n- **Question statement** with metric definitions ([[SoH]] axis, EOL, output units) — Step 1's output, verbatim.\n- **Model-family decision record**: the tree, the chosen branch, the rejected alternatives and why.\n- **Data provenance table**: every parameter's source (own fit / NDA / public / literature-typical), with the literature-typical ones flagged.\n- **Assumption register**: numbered, justified, each with its failure consequence.\n- **Validation report**: held-out dynamic-profile errors, with plots of predicted vs measured fade.\n- **Sensitivity & uncertainty plots**: tornado ranking of parameters; output-metric distributions, not just means.\n- **Validity box**: the T/SoC/DoD/C-rate region inside which the conclusions hold, stated as bluntly as a drug label.\n- **Reproducibility package**: code, parameter files, and the duty-cycle definitions.\nExaminers and industrial supervisors disagree about many things; they unanimously reward the student who can produce this list on demand.",
      clarify:
        "It's a pilot's pre-landing checklist: nothing on it is intellectually hard, and skipping any single item occasionally ends very badly. The point of a checklist is precisely that it doesn't rely on you being brilliant on the day.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "truck",
      title: "Worked example: a depot-V2G thesis in pipeline form",
      body:
        "Step 1: 'What is the net present value of evening arbitrage for a 20-truck depot ([[NMC]], 500 kWh each) over 8 years, in € per truck-year, with 80 %-capacity EOL?' Step 2: tree → dispatch optimisation branch → semi-empirical in an electro-thermal loop, piecewise-linearised for the MILP. Step 3: literature-typical NMC parameters + sensitivity, supplier curves if the partner company opens them. Step 4: fit/assemble, validate against a public dynamic-profile dataset, Monte-Carlo the NPV. Step 5: duty-cycle generator from real route plans, daily fine simulation, monthly SoH update, economic layer on day-ahead prices. Deliverable plot (sketchable today, per Step 1's test): NPV per truck-year vs arbitrage depth, with uncertainty band, for two parking-SoC counterfactuals. That is a complete, defensible master's thesis — and every section of this app maps onto exactly one of its work packages.",
    },
  ],
};
