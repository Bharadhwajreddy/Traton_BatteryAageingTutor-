# MODELLING_ROADMAP.md — From Question to Thesis

Standalone version of the in-app "Modelling Roadmap" node: a 5-step pipeline for building and using an ageing model for a heavy-duty NMC/LFP + V2G problem. Diagrams over code, by design.

## Step 1 — Define the question and the metrics

Write the research question **before** choosing a model. Then fix:

- **SoH definition**: capacity-based (range) vs resistance/power-based (gradeability, fast-charge) — or both.
- **EOL criterion**: 80 % capacity is convention, not law; fleets may use power or warranty criteria. Second-life shifts EOL meaning.
- **Output metric**: RUL (years/FEC to EOL) for warranty questions; **€ / kWh-throughput marginal cost** for V2G dispatch questions; SoH trajectory for TCO.

> The metric dictates the model: a dispatch optimiser needs a differentiable/linearisable cost of throughput; a warranty study needs calibrated absolute fade with uncertainty bounds.

## Step 2 — Choose the model family

```
                         ┌─ Need cell-design / mechanism insight? ──► Physics-based (SPM/SPMe → DFN + degradation submodels)
                         │
Question ──► What must   ├─ Need lifetime prediction across a bounded
             the model   │  operating envelope (fleet/TCO/warranty)? ──► Semi-empirical stress-factor model
             do?         │                                              (+ electro-thermal coupling at pack level)
                         │
                         ├─ Need degradation INSIDE an optimiser
                         │  (V2G dispatch, MILP/MPC)? ──► Semi-empirical → piecewise-linearised cost term,
                         │                                or surrogate fitted to a richer model
                         │
                         └─ Have field/lab data streams, need monitoring
                            & RUL updates? ──► Data-driven / hybrid grey-box
```

Rules of thumb:
- Pure Ah-throughput models are **not acceptable** for V2G heavy-duty work (no T/SoC/DoD sensitivity → misprices every service).
- More physics is only better if you can parameterise it: a DFN with guessed parameters loses to a well-fitted stress model.
- Plan for the **knee**: none of the smooth families predicts it; state explicitly whether your conclusions survive an early knee.

## Step 3 — Data strategy

Options in descending order of cost and fidelity:

1. **Own ageing campaign** (12–24 months): calendar matrix (T × SoC, ≥ 3×4), cycle matrix (DoD × C-rate × T × mean-SoC, fractional/DoE design), ≥ 3 cells per condition, periodic RPTs (C/20 capacity, pulse resistance, optionally EIS + DVA/ICA).
2. **Supplier data under NDA** (typical in a MAN-type environment): check matrix bounds vs your duty cycles before trusting.
3. **Public datasets** (NASA/Oxford/Stanford-style): mostly small cells, passenger-car-like profiles — fine for method development, weak for truck conclusions.
4. **Literature-typical parameters + sensitivity analysis**: acceptable for system-level studies if every parameter carries an uncertainty range and conclusions are tested against it. (This app's tools work this way, and say so.)

Pitfalls: acceleration changes the dominant mechanism (60 °C ages a different battery); cycle tests contain calendar ageing that must be subtracted; aged-cell behaviour (balancing shift, plating onset) invalidates fresh-cell fits late in life.

## Step 4 — Parameter identification & validation

1. Fit per-condition fade curves → time/FEC exponents.
2. Regress stress-factor parameters (Arrhenius Ea, SoC stress, DoD/Wöhler, C-rate) across the matrix.
3. **Validate on held-out dynamic profiles** — synthetic truck duty cycles, not matrix points. This is the only validation that matters for V2G claims.
4. Quantify uncertainty: parameter confidence intervals → Monte-Carlo lifetime bands. Report lifetime as a distribution, not a number.
5. Maintain an **assumption register** (this repo's HANDOVER.md is the template).

## Step 5 — Integration into V2G / revenue simulation

Co-simulation architecture (timestep separation is the key trick):

```
duty-cycle / market generator (s–min)            economics layer (h–days)
        │  P(t), T_amb(t), prices                       ▲
        ▼                                               │ revenue, c_deg
ECM + thermal model (s)  ──► I(t), T_cell(t), SoC(t) ──►│
        ▲                                               │
        │  R(SoH), Q(SoH)      ageing model (h–days) ───┘
        └────────────────────  SoH update loop
```

- Electrics at seconds, ageing at hours/days: accumulate stress statistics (FEC, mean SoC, T histogram, DoD via rainflow) and update SoH per period.
- For optimisation: either simulation-in-the-loop (evaluate candidate dispatch, slow, exact) or degradation-as-cost-term (piecewise-linearised stress factors inside MILP/MPC, fast, approximate). State which and why.
- Carry SoH forward in rolling horizons; re-derate fast-charge limits as the cell ages.
- Constraints from the real world: warranty FEC/DoD caps, minimum departure SoC, BMS-recalibration full charges for LFP.

## Thesis deliverables checklist

- [ ] Research question + metric definition (Step 1) written first
- [ ] Model-family choice justified against the decision tree (Step 2)
- [ ] Data provenance + matrix bounds documented (Step 3)
- [ ] Validation on dynamic profiles + uncertainty bands (Step 4)
- [ ] Co-simulation architecture diagram + timestep justification (Step 5)
- [ ] Assumption register, sensitivity plots, limitations section (knee, cell-to-cell variation, aged-cell plating onset)
