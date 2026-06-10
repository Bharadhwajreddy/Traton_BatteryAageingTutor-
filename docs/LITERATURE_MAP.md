# LITERATURE_MAP.md — Literature Landscape by Concept Node

Original high-level synthesis of *types* of literature per concept node. No copyrighted text is reproduced; named styles ("Schmalstieg-style") identify model lineages generically. The in-app "Literature Landscape" section mirrors and explains this map.

| Concept node | Literature category | What you find there | Typical model structures |
|---|---|---|---|
| Mechanisms | Ageing-mechanism reviews (Vetter-style); degradation-mode frameworks (Birkl-style) | Mechanism taxonomy: SEI, plating, LAM, electrolyte/binder; mechanisms → modes (LLI/LAM) → observables mapping | Qualitative frameworks; DVA/ICA diagnostic methods |
| Calendar ageing | Storage-matrix studies per chemistry (Naumann-style for LFP; Schmalstieg-style for NMC); mechanistic SEI calendar models | T × SoC storage grids over 1–2 years; √t fits; Arrhenius + SoC (or anode-potential) stress functions | Q_cal = k(T, SoC)·t^z, z ≈ 0.5; Tafel/anode-potential SEI models |
| Cycle ageing | Cycle-matrix studies (Wang-style cycle-life models; chemistry-specific Wöhler/DoD studies) | DoD × C-rate × T grids; throughput-based fade; resistance growth | Q_cyc = k(stress)·FEC^z or ·Ah^z; Wöhler DoD curves |
| Stress factors / electro-thermal | Coupled ECM + thermal + ageing pack studies | I²R heating ↔ ageing feedback, thermal gradients, cell-to-cell divergence | ECM + lumped thermal node + semi-empirical ageing in co-simulation |
| Truck use cases | Heavy-duty electrification + duty-cycle studies; MCS fast-charging effects | FEC/day statistics, depot vs opportunity charging, payload effects. **Thinner than passenger-car literature — a thesis opportunity.** | Duty-cycle synthesis + ageing model evaluation |
| Model families | Physics-based modelling literature (DFN/P2D, SPM/SPMe + degradation submodels); reduced-order model reviews | Cost-fidelity ladder, SEI/plating submodels, parameterisation difficulty | DFN + side-reaction kinetics; SPMe + SEI/plating |
| Parameter identification | Accelerated-ageing methodology papers; DoE for battery testing; identifiability studies | Test-matrix design, RPT protocols, acceleration pitfalls, uncertainty quantification | Least-squares / Bayesian fitting over matrices |
| V2G integration | Degradation-aware dispatch optimisation; marginal ageing-cost papers; V2G calendar-benefit studies | Cost-of-throughput formulations, MILP/MPC embeddings, results showing V2G can *reduce* net ageing via lower parking SoC | Linearised c_deg terms in dispatch optimisation; rolling-horizon MPC |
| Data-driven SoH/RUL | Feature-based SoH estimation; knee-point prediction benchmarks; public datasets (NASA/Oxford/Stanford-style) | Charge-curve features → SoH regression; sequence models; dataset limitations for trucks | Gaussian processes, gradient boosting, LSTM/transformer; hybrid grey-box |

## How to read an ageing paper efficiently (checklist)

1. **Cell**: chemistry, format, capacity, year — a 2015 18650 ≠ a 2025 truck prismatic (silicon content, electrolytes moved).
2. **Test matrix bounds**: T, SoC, DoD, C-rate ranges — the model is blind outside them.
3. **Duration**: months tested vs years predicted — extrapolation ratio.
4. **Model structure**: which stress factors, which exponents, superposition assumed?
5. **Validation**: matrix points only, or held-out dynamic profiles?
6. **Knee handling**: predicted, acknowledged, or silently absent?

## Search-string starter kit

- `("lithium-ion" OR "li-ion") AND (NMC OR LFP) AND ("calendar ageing" OR "calendar aging") AND model`
- `"heavy-duty" AND (truck OR bus) AND battery AND (ageing OR degradation)`
- `V2G AND battery AND degradation AND (cost OR optimization)`
- `"lithium plating" AND "fast charging" AND model`
- `"knee point" AND capacity AND prediction`
