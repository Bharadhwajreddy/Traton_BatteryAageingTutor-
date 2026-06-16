# Schmalstieg et al. (2014) — Holistic Aging Model for NMC 18650 Cells

> **Original summary for educational use. No copyrighted text reproduced.**
> Model equations are restated in our own notation consistent with the tutor app.

---

## 1. Bibliographic details

| Field | Value |
|---|---|
| **Title** | A holistic aging model for Li(NiMnCo)O₂ based 18650 lithium-ion batteries |
| **Authors** | Johannes Schmalstieg · Stefan Käbitz · Madeleine Ecker · Dirk Uwe Sauer |
| **Institution** | ISEA / E.ON Energy Research Center, RWTH Aachen University |
| **Journal** | Journal of Power Sources |
| **Volume / Pages** | 257 / 325–334 |
| **Year** | 2014 |
| **DOI** | [10.1016/j.jpowsour.2014.02.012](https://doi.org/10.1016/j.jpowsour.2014.02.012) |
| **RWTH open record** | [publications.rwth-aachen.de/record/235563](http://publications.rwth-aachen.de/record/235563) |
| **Semantic Scholar** | [link](https://www.semanticscholar.org/paper/A-holistic-aging-model-for-Li(NiMnCo)O2-based-18650-Schmalstieg-K%C3%A4bitz/e8bf5ec6c13f38f5b186d9972284c106250c1087) |
| **Citations** | ≥ 549 (as of 2024) |
| **Cell chemistry** | NMC cathode / graphite anode (commercial 18650, 2.05 Ah nominal) |

---

## 2. Why this paper matters

Before Schmalstieg 2014, battery ageing models typically addressed either calendar ageing **or** cycle ageing in isolation, and few studies coupled the ageing model to a realistic thermal-electrical simulation of the cell during operation. This paper made three contributions that set the agenda for the following decade:

1. **One model, both ageing modes.** Calendar and cycle degradation are described by separate, physically motivated stress-factor equations and then **superposed** — "holistic" in the title refers to this combined treatment of capacity fade and resistance growth under both storage and cycling conditions.

2. **Electrothermal coupling.** Rather than assuming the cell operates at the user-specified temperature and SoC set-point, the model is driven by an **impedance-based ECM + thermal model** that computes the actual cell temperature and voltage as a function of load current. This means stress factors are calculated from the cell's *experienced* conditions, not its *nominal* conditions — a critical distinction for pulsed or drive-cycle operation.

3. **Large experimental basis.** More than 60 NMC/graphite 18650 cells were tested across a factorial calendar and cycle matrix. The companion paper (Ecker et al. 2014, J. Power Sources 248) details the full experimental dataset. Having 60+ cells on test was unusually rigorous for the time and gave the parameter fits statistical credibility.

---

## 3. Cell and experimental design

### Cell
- Vendor: not named in the public record (consistent with standard confidentiality practice)
- Chemistry: Li(Ni₁/₃Mn₁/₃Co₁/₃)O₂ cathode / graphite anode (NMC111)
- Format: cylindrical 18650
- Nominal capacity: 2.05 Ah
- Nominal voltage: 3.6 V, operating window 2.5–4.2 V

### Calendar ageing matrix (from Ecker et al. 2014 companion paper)

| Variable | Values tested |
|---|---|
| Temperature | 25 °C, 35 °C, 50 °C |
| Storage SoC | 0 %, 10 %, 20 %, 30 %, 50 %, 60 %, 70 %, 80 %, 85 %, 90 %, 95 %, 100 % |
| Duration | up to ~520 days (18 months) |
| Reference performance test | Capacity check (C/5 CCCV) + resistance pulse at 50 % SoC every ~30 days |

Notable observations:
- At 50 °C and 100 % SoC: EOL (80 % capacity) reached in only ~107 days
- At 50 °C and 0 % SoC: projected lifetime ~4+ years
- Activation energies from Arrhenius fits: **47–60 kJ/mol** (capacity loss at 50 % SoC)
- Clear voltage-plateau effects: cells stored at SoC crossing graphite voltage plateaus (≈10–30 % and ≈60–70 %) showed locally higher degradation — the negative-electrode anode potential is the dominant driver, not cathode voltage per se

### Cycle ageing matrix

| Variable | Values tested |
|---|---|
| Temperature | 35 °C (all cycling tests) |
| C-rate | 1C charge and discharge |
| DoD (ΔSoC per cycle) | 5 %, 10 %, 20 %, 50 %, 80 %, 100 % |
| Mean SoC | varied alongside DoD (e.g. 0–100 %, 10–90 %, 25–75 %, 40–60 %, 47.5–52.5 %) |
| Metric | capacity every ~25 cycles; resistance pulse at 50 % SoC |

Notable observations:
- FEC to 80 % capacity: ~440 FEC at 100 % DoD, and extrapolated ~8500 FEC at 5 % DoD (47.5–52.5 % SoC) → enormous DoD leverage
- Resistance: grew proportionally with capacity fade; cells typically reached ~150 % initial resistance at sudden EOL
- **Sudden-death phenomenon**: cells failed unpredictably between 250–950 cycles at identical conditions — a fundamental prediction challenge that later models still struggle with

---

## 4. Model structure (our notation, not copied from the paper)

### 4.1 Calendar capacity fade

```
Q_loss,cal(t, T, U) = α_cap · (U − U_ref) · exp(−Eₐ / (R · T)) · t^0.75
```

**Symbol-by-symbol:**

| Symbol | Meaning | Typical value / range |
|---|---|---|
| Q_loss,cal | Fractional capacity lost to calendar ageing (0–1) | — |
| α_cap | Pre-exponential calendar capacity coefficient (fitted) | determined by regression on the storage matrix |
| U | Average cell voltage during storage (V) ≈ OCV at storage SoC | 2.5–4.2 V for this cell |
| U_ref | Reference voltage at which α_cap was fitted (typically mid-point ~3.73 V) | ~3.73 V |
| Eₐ | Apparent activation energy for SEI-driven calendar fade | 48–60 kJ/mol |
| R | Universal gas constant | 8.314 J/(mol·K) |
| T | Absolute temperature (K) | 298–323 K in tests |
| t | Storage time (days) | — |
| **0.75** | Time exponent — between pure diffusion (0.5) and linear (1.0) | **key finding: not √t** |

**Why t^0.75 rather than t^0.5?**
The classical SEI-growth argument (diffusion-limited growth through a thickening film) predicts √t dependence. An exponent of 0.75 suggests the film growth is not purely diffusion-limited — pore closure, electrolyte concentration gradients, or crack-and-reheal dynamics on the graphite surface all introduce mechanisms faster than pure diffusion. A value between 0.5 and 1 is common empirically for NMC/graphite cells; Schmalstieg 2014 found 0.75 gave the best fit over the tested duration.

**Why linear in voltage (U)?**
The Arrhenius factor captures the rate's temperature dependence; the linear voltage term captures the SoC dependence of the SEI formation driving force. At higher OCV (= higher SoC = lower graphite anode potential vs Li/Li⁺), the thermodynamic driving force for electrolyte reduction is larger. In mechanistic models this is a Butler–Volmer or Tafel expression in anode overpotential; Schmalstieg 2014 approximates this as linear in cell voltage over the tested range, which is computationally convenient and fits the data well in the 3.3–4.2 V range.

### 4.2 Calendar resistance growth

```
R_grow,cal(t, T, U) = β_res · (U − U_ref) · exp(−Eₐ,R / (R · T)) · t^0.75
```

Same structure as capacity fade but with a separate pre-exponential coefficient β_res and potentially a different apparent activation energy Eₐ,R. Capacity fade and resistance growth are treated as **parallel but independent** outputs of the same underlying SEI thickening process — both driven by the same stress factors, both exhibiting the same time exponent. This is one of the model's most convenient (and occasionally criticised) simplifications: in reality, resistance can grow faster or slower than capacity depending on which mechanism dominates.

### 4.3 Cycle capacity fade

```
Q_loss,cyc(Ah, DoD, U_mean) = α_cyc(DoD, U_mean) · Ah^z_cyc
```

where the stress-factor coefficient αcyc depends on **both DoD and mean SoC**:

```
α_cyc = γ₁ · DoD + γ₂ · (U_mean − U_ref)² + γ₃
```

**Breaking this down:**

- **DoD term (γ₁ · DoD)**: Capacity-fade coefficient scales approximately *linearly* with depth of discharge. This is the Wöhler-curve idea: deeper cycles cost proportionally more per cycle. Doubling DoD roughly doubles the fade rate per Ah throughput — a stronger penalty than many practitioners assume (they often use constant €/Ah).

- **U_mean term (γ₂ · (U_mean − U_ref)²)**: The mean SoC effect has a **U-shape with a minimum around mid-SoC (≈50 %)**. Cycling centred on high SoC accelerates cathode surface degradation, electrolyte oxidation, and SEI growth (high positive electrode potential); cycling centred on very low SoC accelerates anode structural damage (graphite at deep discharge loses lithium-hosting intercalation sites). The quadratic in (U_mean − U_ref) captures this symmetric-ish U-shape. Important: the minimum is not at the lowest voltage — it is around 50 % SoC, roughly 3.7 V for this NMC cell.

- **z_cyc**: Exponent on Ah throughput. In the simplest models z_cyc = 1 (linear in throughput), meaning all kWh are equally damaging regardless of when they flow. Schmalstieg found z_cyc close to 1 for NMC at 35 °C, justifying a throughput-proportional model *at constant stress conditions* — but this does NOT mean constant stress can be assumed in the field.

### 4.4 Cycle resistance growth

```
R_grow,cyc(Ah, DoD, U_mean) = β_cyc(DoD, U_mean) · Ah^z_R
```

Same stress-factor form as cycle capacity fade, separate coefficient set. Resistance tends to grow somewhat faster relative to capacity in cycling than in calendar storage (because cycling adds mechanical fatigue on top of chemical film growth), so the parameters differ.

### 4.5 Superposition (the "holistic" combination)

```
Q_loss,total = Q_loss,cal + Q_loss,cyc
R_grow,total = R_grow,cal + R_grow,cyc
```

This is the simplest possible combination: **additive superposition with no interaction terms**. The model explicitly does not capture:
- How cycling cracks the SEI, exposing fresh surface that then ages faster (calendar-cycle coupling)
- How the calendar component within cycling tests biases cycle-only parameter fits (requires explicit subtraction)
- Path dependence: what happened in month 1 influences the rate in month 12

These are known limitations; they are *not* flaws unique to Schmalstieg — they apply to virtually all semi-empirical models and are explicitly discussed in the paper.

### 4.6 Electrothermal coupling — what makes it truly "holistic"

The critical innovation over pure lookup-table ageing models is the integration with an **impedance-based ECM + thermal model**:

```
Electrothermal model:
  V_cell(t) = OCV(SoC) − I·R₀(T, SoC) − Σ V_RC,k(t)      [ECM voltage]
  m·Cp · dT/dt = I²·R_eff − h·A·(T − T_amb)                 [thermal balance]

Ageing model feedback:
  R₀ ← R₀,fresh · (1 + R_grow,total)     [resistance update]
  Q_cell ← Q_fresh · (1 − Q_loss,total)  [capacity update]
```

The loop works like this every simulation timestep:
1. ECM computes actual cell voltage and current from load profile
2. Thermal model updates cell temperature
3. Actual T and actual V(t) → compute instantaneous stress factors
4. Stress factors accumulate ageing increments over the timestep
5. Ageing increments update R₀ and Q_cell for the next step

This means **you do not need to specify an operating temperature or SoC set-point** — the model self-consistently predicts what temperature the cell will reach under a given load and ambient condition, and uses that actual temperature for the ageing calculation. For a truck battery experiencing I²R heating during a 2C gradient climb, this matters enormously: the cell surface temperature may be 15–20 °C above ambient, and the Arrhenius factor at those temperatures can double the ageing rate compared to assuming ambient temperature.

---

## 5. Key findings

1. **Time exponent is 0.75, not 0.5.** Commonly cited as confirming that SEI growth is not purely diffusion-limited for this NMC chemistry over multi-month timescales.

2. **Voltage stress is approximately linear** over the practical SoC range tested. Simple to implement in optimisation models (avoids exponential solver issues).

3. **Activation energy ≈ 48–60 kJ/mol** for NMC/graphite calendar ageing. Implies roughly 2× rate acceleration per 10 °C around 25–50 °C — consistent with the commonly cited "2×/10 K" rule, validating it for this chemistry.

4. **DoD drives cycle fade approximately linearly** (per unit charge throughput). Shallow FCR micro-cycles are not "free" but are much cheaper per Ah than deep arbitrage cycles — the exact point that throughput-only V2G cost models get wrong.

5. **Mean SoC shows a U-shaped effect with a minimum ≈ 50 % SoC.** Parking or cycling near 50 % is the best operating strategy for longevity — charging to 100 % for calendar and cycling at extreme SoC both accelerate degradation.

6. **Resistance and capacity degrade in parallel** but can reach different thresholds at different ages. A pack can fail a power requirement (resistance-limited) before failing a range requirement (capacity-limited), or vice versa. Both outputs of this model are needed for a complete truck SoH assessment.

7. **Sudden death below ~400 FEC** was observed and is unexplained by the model. This is a known gap in all smooth parametric models and motivates more recent data-driven knee-point detection approaches.

---

## 6. Limitations and what later work addressed

| Limitation | Later work |
|---|---|
| Linear superposition of calendar + cycle (no interaction) | Path-dependent models; mechanistic SEI + plating models |
| No lithium-plating term (fast charge at low T) | Plating-aware models for MCS / fast-charge scenarios |
| No knee-point prediction | Data-driven knee detection papers (2020s) |
| Single cell type / NMC111 (not truck format) | Heavy-duty pouch/prismatic format studies; but this cell's model *structure* is widely reused |
| t^0.75 extrapolated beyond test duration | Uncertainty quantification studies; mechanistic models with better long-term extrapolation |
| C-rate not varied in cycle tests (1C only) | Follow-on studies varying charge C-rate; Naumann-style LFP models |
| No LFP equivalent | Naumann et al. (2015, 2017) provide the LFP counterpart from the same ISEA group |

---

## 7. Connections to the tutor app

| App section | Schmalstieg 2014 connection |
|---|---|
| **Mechanisms** | SEI growth → t^0.75 calendar fade; particle cracking → DoD stress; both simultaneously → holistic |
| **Calendar vs Cycle** | Direct model of this paper: additive superposition Q_cal + Q_cyc with stress factors |
| **Stress Factors** | Every stress factor in the model is taught (Arrhenius, voltage/SoC linear, DoD Wöhler, U_mean U-shape) |
| **Model Families** | This paper is the canonical "semi-empirical stress-factor model"; the tutor app's `ageing.ts` uses the same structure with literature-typical parameters |
| **Calendar Explorer tool** | Runs the exact model form: Q_cal = k_ref · f_T(Arrhenius) · f_SoC · t^z |
| **Cycle Explorer tool** | Runs cycle fade with DoD and mean-SoC stress consistent with Schmalstieg 2014 findings |
| **V2G Dispatch** | Uses Schmalstieg-style marginal degradation cost (ΔSoH_extra → € value via linear budget) |
| **Parameter Identification** | Schmalstieg 2014 is the gold-standard example of: factorial test matrix → per-condition fit → stress-factor regression → electrothermal-coupled validation |

---

## 8. BibTeX entry

```bibtex
@article{schmalstieg2014holistic,
  author    = {Schmalstieg, Johannes and K{\"a}bitz, Stefan and Ecker, Madeleine and Sauer, Dirk Uwe},
  title     = {A holistic aging model for {Li(NiMnCo)O\textsubscript{2}} based 18650 lithium-ion batteries},
  journal   = {Journal of Power Sources},
  volume    = {257},
  pages     = {325--334},
  year      = {2014},
  doi       = {10.1016/j.jpowsour.2014.02.012},
  publisher = {Elsevier},
  note      = {ISEA, E.ON Energy Research Center, RWTH Aachen University}
}
```
