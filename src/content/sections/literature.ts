import type { Section } from "@/lib/types";

export const literature: Section = {
  slug: "literature",
  title: "Literature Landscape",
  summary:
    "A guided map of where to read: mechanism reviews, semi-empirical classics, mechanistic SEI models, electro-thermal and heavy-duty studies, V2G-degradation papers, data-driven SoH work — and how to read an ageing paper efficiently.",
  prerequisites: ["model-families"],
  minutes: 12,
  blocks: [
    {
      kind: "text",
      depth: "core",
      heading: "How to use this map",
      body:
        "Battery-ageing literature is vast, repetitive at the edges, and unevenly trustworthy. This section is a *territory map*, not a bibliography: it names the categories, the style of paper that anchors each one, and what each category can and cannot give a truck-V2G project. Deliberate choice: papers are characterised by *family* ('Schmalstieg-style', 'Naumann-style') rather than catalogued, because specific papers age while the families persist — and because your literature review should be built by you running the searches, not by inheriting someone's reference list. Read this section once before your first library session and once again after your first twenty papers; it will mean different things each time.",
      clarify:
        "It's the difference between a city map and a restaurant guide. The guide's entries go stale; the map — 'the old town is here, the business district there, avoid this area at night' — stays useful for years. This is the map.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Foundational mechanism reviews",
      body:
        "Start here, because everything else assumes this vocabulary. Two anchor types:\n- **Vetter-style mechanism reviews**: comprehensive surveys of what physically degrades — [[SEI]] chemistry, [[lithium plating]], cathode dissolution, binder and current-collector ageing — organised by component. The classic of this type is two decades old and still the standard first citation; read a modern successor alongside it, because electrolytes and cell formats have moved.\n- **Birkl-style degradation-mode frameworks**: the conceptual layer that organises mechanisms into modes ([[LLI]], [[LAM]], conductivity loss) and links them to observables (capacity, resistance, [[OCV]]-curve deformation, [[DVA]]/[[ICA]] signatures). This framework is what lets you diagnose *which* mode is active from non-destructive measurements — and it is the backbone of this app's Mechanisms section.\nWhat this category gives you: vocabulary, causal structure, and the checklists for what a model might be missing. What it cannot give you: numbers for *your* cell.",
      clarify:
        "These are the anatomy textbooks of the field. Nobody treats a patient from an anatomy book — but nobody should be allowed near a patient without one either.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Semi-empirical model classics",
      body:
        "The workhorse family from the model-families section has a small canon of archetypes worth reading in full, because hundreds of later papers are variations on them:\n- **Schmalstieg-style [[NMC]] models**: combined calendar + cycle stress-factor models fitted on large T × [[SoC]] × [[DoD]] matrices, with voltage/SoC-dependent calendar stress and Wöhler-like cycle terms. The template for most automotive lifetime studies since.\n- **Naumann-style [[LFP]] models**: the matching pair of calendar and cycle papers for LFP/graphite — notable for clean methodology sections (calendar subtraction, exponent fitting) that are worth imitating regardless of chemistry.\n- **Wang-style cycle-life/throughput models**: earlier-generation models expressing fade versus Ah-throughput with temperature and rate corrections — historically important, still cited in techno-economic work, and a good object lesson in what happens when calendar ageing and SoC sensitivity are absent.\nRead these *for their methods sections first*: matrix design, RPT schedule, fitting order. The parameter tables are the least transferable part — and remember this app's parameters are literature-*typical* composites, deliberately not lifted from any of them.",
      clarify:
        "Think of these as the standard recipes every chef learns before improvising. You're not reading them to cook their exact dish with their exact ingredients — you're reading them to learn knife technique: how a clean ageing study is designed, separated, and fitted.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Mechanistic SEI and calendar models",
      body:
        "The physics end of calendar ageing has its own literature thread: **single-mechanism electrochemical SEI models** (diffusion-limited vs kinetics-limited film growth, the origin of √t), and **anode-potential-driven calendar models** that replace the empirical SoC stress factor with the graphite electrode's potential as the causal variable — naturally explaining the staircase-like SoC dependence that LFP cells show (the flat [[OCV]] hides sharp [[anode potential]] steps) and extrapolating across SoC far better than fitted exponentials. Adjacent threads: plating-onset models for fast charging, and degradation submodels embedded in [[P2D]]/[[SPM]] frameworks. Read this category when your question touches *why* a stress factor has its shape, when you need to extrapolate outside a test matrix, or when you want the model to keep working as cell design changes. Expect heavier mathematics and far more parameters per page — budget reading time accordingly.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Electro-thermal pack models and heavy-duty studies",
      body:
        "Two thinner but project-critical categories:\n- **Electro-thermal pack modelling**: [[ECM]] parameterisation and coupling to lumped or network thermal models, thermal-gradient effects on [[cell-to-cell variation]], and the feedback of [[impedance]] growth into heat generation. Mostly found in applied-energy and vehicle-engineering venues rather than electrochemistry journals.\n- **Truck/heavy-duty-specific ageing**: duty-cycle studies for regional and long-haul operation, [[MCS]] megawatt-charging thermal and plating implications, battery sizing under payload constraints. Be warned and encouraged in the same breath: **this literature is markedly thinner than the passenger-car corpus** — fewer cell formats studied, fewer long-term field datasets, V2G-with-trucks barely touched. For a thesis hunter that is not a problem, it is the opportunity: a well-executed heavy-duty ageing or truck-V2G study lands in a visibly under-served niche, whereas the four-thousandth passenger-EV cycling paper does not.",
      clarify:
        "Research niches are like ski slopes: the passenger-car slope is groomed, crowded, and every line has been skied. The heavy-duty slope has fresh snow and a few rocks — more risk, more reward, and far fewer people to compare yourself against.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "truck",
      title: "The heavy-duty gap, concretely",
      body:
        "Searches that return hundreds of passenger-car hits return a handful for trucks: long-term ageing under real long-haul duty cycles, [[MCS]]-rate fast-charging ageing on large-format cells, depot-fleet V2G with warranty-constrained dispatch, second-life value of truck packs. Each of those is a defensible thesis topic *because* the literature is thin. Strategy: import methods from the mature passenger-car literature (test design, fitting workflow, dispatch formulations) and apply them to the heavy-duty operating envelope — higher daily [[FEC]], larger packs, hotter sustained loads, schedulable parking. Method transfer into an empty niche is the lowest-risk form of originality there is.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "V2G + degradation studies",
      body:
        "The intersection that this app's V2G section lives in. Three recognisable clusters:\n- **Degradation-aware dispatch optimisation**: MILP/MPC formulations with ageing cost terms, piecewise-linearised stress factors, rolling horizons — judged by *how* they price degradation, which ranges from flat €/kWh (weak) to full stress-factor counterfactuals (strong).\n- **Marginal ageing-cost papers**: the conceptual thread defining what one extra kWh costs, including the critique of linear [[SoH]]-budget pricing you met earlier.\n- **V2G calendar-benefit studies**: the strand showing that grid discharge can *reduce* net ageing by lowering parking SoC — the non-obvious result; check whether a paper's model even contains a calendar–SoC term before trusting its V2G verdict in either direction.\nSorting heuristic for this whole category: find the degradation model inside the optimisation paper. If it is a cycle-count or flat throughput cost, the economic conclusions are upper bounds on harm for shallow services and lower bounds for deep hot ones — usually the paper's headline claim dissolves right there.",
      clarify:
        "When reading any V2G economics paper, play 'find the battery model' the way you'd check a financial product's fine print for the actual interest rate. The optimisation machinery is usually sound; the battery cost assumption is where the conclusion was quietly decided.",
    },
    {
      kind: "text",
      depth: "core",
      heading: "Data-driven SoH/RUL and the public datasets",
      body:
        "The machine-learning corner, plus its fuel:\n- **Feature-based estimation**: [[SoH]] regression from charge-curve segments, [[ICA]] peak features, relaxation behaviour — the most field-deployable thread, since the features survive noisy fleet data.\n- **Knee-point prediction benchmarks**: early-life features predicting cycle life and [[knee point]] onset; impressive within-dataset, fragile across chemistries and protocols — read the cross-validation design more carefully than the headline error.\n- **Public datasets**: the NASA-style, Oxford-style, and Stanford/MIT-style cycling sets that this entire sub-field trains on. Know their limitations before borrowing conclusions for trucks: predominantly small cells (18650-class), often aggressive fixed protocols chosen to *finish* in months, limited calendar data, and chemistries/formats a generation behind a current heavy-duty pack. They are excellent for developing and benchmarking *methods*, and treacherous for transplanting *numbers* — the same own-vs-borrowed-data logic from the parameter-identification section, applied to ML.",
    },
    {
      kind: "text",
      depth: "deeper",
      heading: "Reading an ageing paper efficiently: the six-point screen",
      body:
        "Postdoc triage: most papers should cost you five minutes, not ninety. Screen in this order and stop at the first disqualifier *for your purpose*:\n- **Chemistry + format**: which cathode generation, what silicon content in the anode, what cell format and capacity? A 2 Ah 18650 NMC111 result constrains a 300 Ah prismatic NMC811 cell only loosely.\n- **Test-matrix bounds**: the T/SoC/DoD/C-rate box actually tested — the model is licensed inside it and guessing outside it. Compare against *your* operating envelope before reading any conclusions.\n- **Time span**: months of data extrapolated to years? Watch the exponent — short campaigns cannot pin z, and lifetime claims inherit that wobble exponentially.\n- **Model structure**: which family, which assumed separabilities, is [[superposition]] assumed, is calendar subtracted from cycle data?\n- **Validation type**: training-matrix fit only, held-out constant conditions, or held-out *dynamic* profiles? Only the last earns trust for field prediction.\n- **Knee handling**: does the data contain knees, does the model represent them, and does the text say what happens after one? Silence on knees plus smooth power laws means the paper's late-life predictions are decoration.\nPapers passing all six for your use case are rare; those are the ones that get the ninety minutes and a permanent slot in your reference manager.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "tip",
      title: "Search-string starter kit",
      body:
        "Seed queries for Scopus/Google Scholar — combine, then snowball through citations of whatever survives the six-point screen: `lithium-ion calendar aging model SoC temperature`; `cycle aging semi-empirical depth of discharge model`; `SEI growth model anode potential calendar`; `lithium plating fast charging model onset`; `battery degradation aware V2G dispatch optimization`; `marginal battery degradation cost vehicle-to-grid`; `heavy-duty truck battery aging duty cycle`; `megawatt charging battery degradation`; `battery knee point prediction early life features`; `SoH estimation incremental capacity analysis features`. Two mechanical tips: add `review` to any string for a fast field overview, and filter to the last five years *except* for the foundational mechanism reviews and semi-empirical classics, where the originals remain the right entry points.",
    },
    {
      kind: "callout",
      depth: "core",
      tone: "misconception",
      title: "\"A 2015 cell study transfers to a 2025 truck cell\"",
      body:
        "Treat cell-ageing results as perishable goods. Between an early-2010s test cell and a current heavy-duty cell, nearly every ageing-relevant ingredient changed: cathodes moved from NMC111-class toward Ni-rich NMC811-class (different dissolution and cracking behaviour, different high-SoC sensitivity); anodes picked up **silicon content** (larger breathing, different [[SEI]] dynamics, different [[DoD]] sensitivity); electrolytes gained additive packages tuned per cell generation; formats jumped from 2–3 Ah cylinders to 100–300 Ah prismatic/pouch cells with genuinely different thermal gradients and pressure conditions; and LFP returned at modern quality levels. The *mechanism vocabulary* and the *model structures* transfer beautifully across that decade — the **parameters and rankings do not**. Date-stamp every borrowed number, and when an old result anchors a key conclusion, demand a recent corroborating study or downgrade the conclusion to a hypothesis.",
    },
  ],
};
