# Battery Ageing Modelling — Flowcharts & Decision Trees

All diagrams use [Mermaid](https://mermaid.js.org/) syntax — rendered automatically in GitHub, Notion, VS Code, and Obsidian.

---

## 1. What happens inside an ageing cell? (Mechanism → Mode → Observable)

```mermaid
flowchart TD
    subgraph mechanisms["⚙️ Mechanisms (root causes)"]
        SEI["SEI growth\n(anode, always active)"]
        PLT["Lithium plating\n(fast charge, cold, high SoC)"]
        PAR["Particle cracking\n(anode + cathode, deep cycles)"]
        DIS["TM dissolution\n(NMC cathode, high voltage)"]
        OXI["Electrolyte oxidation\n(cathode, high SoC)"]
        GAS["Gas evolution\n(electrolyte decomposition)"]
        BND["Binder/contact loss\n(mechanical fatigue)"]
    end

    subgraph modes["📦 Degradation Modes"]
        LLI["LLI\n(Loss of Lithium Inventory)"]
        LAMa["LAM-anode\n(Loss of Active Material)"]
        LAMc["LAM-cathode"]
        IMP["Conductivity / Impedance rise"]
    end

    subgraph observables["📊 Observables (what you measure)"]
        CAP["Capacity fade\n(Q_actual / Q_nominal)"]
        RES["Resistance rise\n(R / R₀)"]
        OCV["OCV curve deformation\n(DVA / ICA shift)"]
        SWL["Cell swelling"]
    end

    SEI --> LLI
    SEI --> IMP
    PLT --> LLI
    PLT --> IMP
    PAR --> LAMa
    PAR --> LAMc
    PAR --> IMP
    DIS --> LAMc
    DIS --> LLI
    OXI --> LAMc
    OXI --> LLI
    GAS --> IMP
    GAS --> SWL
    BND --> LAMa
    BND --> LAMc
    BND --> IMP

    LLI --> CAP
    LAMa --> CAP
    LAMc --> CAP
    IMP --> RES
    LLI --> OCV
    LAMa --> OCV
    LAMc --> OCV
    GAS --> SWL

    style mechanisms fill:#1a0a0a,stroke:#f87171,color:#fca5a5
    style modes fill:#0a1a0a,stroke:#34d399,color:#6ee7b7
    style observables fill:#0a0a1a,stroke:#60a5fa,color:#93c5fd
```

---

## 2. Calendar vs Cycle ageing — which dominates for your truck?

```mermaid
flowchart TD
    START([🚛 What is your truck doing?]) --> Q1{Mostly\nparked?}

    Q1 -->|"> 70 % of life at rest"| CAL["📅 CALENDAR AGEING DOMINATES\n\nDrivers:\n• Storage temperature\n• Storage SoC\n• Duration"]
    Q1 -->|"< 30 % of life at rest"| CYC["🔄 CYCLE AGEING DOMINATES\n\nDrivers:\n• DoD per cycle\n• Mean SoC\n• C-rate (especially charge)\n• Temperature during operation"]
    Q1 -->|"30–70 % at rest"| BOTH["⚖️ BOTH MATTER\nUse combined model:\nQ_loss = Q_cal + Q_cyc"]

    CAL --> CAL2{Storage\ntemperature?}
    CAL2 -->|"> 35 °C (summer depot)"| HOT["🔴 HIGH RISK\nArrhenius ≈ 2× per 10 °C\nPrioritise active cooling\nor lower SoC at rest"]
    CAL2 -->|"< 25 °C (climatised)"| COOL["🟢 LOW RISK\nOptimise SoC: aim 40–60 %\nfor NMC; 30–70 % for LFP"]

    CAL --> CAL3{Storage SoC?}
    CAL3 -->|"> 80 %"| HIGHSOC["⚠️ NMC: expensive\n(electrolyte oxidation,\nSEI at low anode potential)\nLFP: milder but not free"]
    CAL3 -->|"40–60 %"| MIDSOC["✅ Optimal for both\nNMC and LFP\nMinimises SEI driving force"]

    CYC --> CYC2{DoD per\ncycle?}
    CYC2 -->|"> 60 % DoD"| DEEPDOD["🔴 Deep cycle\nWöhler-like: cost ∝ DoD\n→ negotiate smaller SoC window\nor partial charge strategy"]
    CYC2 -->|"< 20 % DoD\n(FCR micro-cycles)"| SHALLOWD["🟢 Very gentle per Ah\nBut still adds throughput:\nCheck FEC/day budget"]

    CYC --> CYC3{Charge\nC-rate?}
    CYC3 -->|"MCS > 1.5C\n+ cold weather"| PLATING["🚨 LITHIUM PLATING RISK\nAdapt charging power\nvs temperature curve\nNever MCS below 5 °C"]
    CYC3 -->|"Depot ≤ 1C\n> 15 °C"| SAFE["✅ Safe operating regime\nStandard model valid"]

    BOTH --> SUPPOS["Superposition:\nQ_total = Q_cal + Q_cyc\n⚠️ Interaction adds 5–20 %\nnot captured by pure sum"]

    style CAL fill:#1a1200,stroke:#fbbf24,color:#fde68a
    style CYC fill:#0a1a10,stroke:#34d399,color:#6ee7b7
    style BOTH fill:#0f0f1a,stroke:#a78bfa,color:#c4b5fd
    style PLATING fill:#1a0000,stroke:#f87171,color:#fca5a5
    style HOT fill:#1a0000,stroke:#f87171,color:#fca5a5
```

---

## 3. Stress factor map — what drives what

```mermaid
flowchart LR
    subgraph inputs["🎛️ Operating Conditions"]
        T["Temperature T"]
        SOC["State of Charge\n(storage SoC)"]
        DOD["Depth of Discharge\n(per cycle)"]
        MSOC["Mean SoC\n(centre of cycling window)"]
        CRAT["Charge C-rate"]
        DCRAT["Discharge C-rate"]
        TIME["Time at rest t"]
        FEC["FEC / Ah throughput"]
    end

    subgraph factors["⚡ Stress Factors"]
        ARR["f_T = exp(−Eₐ/RT)\nArrhenius\n~2× per 10 °C"]
        FSOC["f_SoC ≈ linear in U\n(NMC steep,\nLFP weaker)"]
        FDOD["g_DoD ≈ linear in DoD\n(quadratic for some cells)"]
        FMSOC["g_SoC = quadratic U-shape\n(min at ~50 % SoC)"]
        FCHG["g_C = exp((C−1)·k)\nMild below 1C,\nsteep above 1C"]
        FPLT["g_plating (T, C_chg)\n= 0 if T > threshold\n  large if cold + fast"]
        FTEMP["g_T = U-shaped in T\n(hot: chemistry;\ncold: plating)"]
    end

    subgraph outputs["📉 Ageing Rates"]
        QCAL["Calendar fade rate\nk_cal · f_T · f_SoC"]
        QCYC["Cycle fade rate\nk_cyc · g_DoD · g_SoC · g_T · g_C · g_plating"]
        RRES["Resistance growth\n(parallel structure)"]
    end

    T --> ARR
    SOC --> FSOC
    DOD --> FDOD
    MSOC --> FMSOC
    CRAT --> FCHG
    CRAT --> FPLT
    T --> FPLT
    T --> FTEMP
    DCRAT --> FTEMP

    ARR --> QCAL
    FSOC --> QCAL
    TIME --> QCAL

    FDOD --> QCYC
    FMSOC --> QCYC
    FCHG --> QCYC
    FPLT --> QCYC
    FTEMP --> QCYC
    FEC --> QCYC

    QCAL --> RRES
    QCYC --> RRES

    style inputs fill:#060a14,stroke:#475569,color:#94a3b8
    style factors fill:#0f1629,stroke:#6366f1,color:#a5b4fc
    style outputs fill:#0a1a10,stroke:#34d399,color:#6ee7b7
```

---

## 4. NMC vs LFP — which chemistry for which truck application?

```mermaid
flowchart TD
    START([Choose cell chemistry\nfor your truck application]) --> Q1{Primary\nobjective?}

    Q1 -->|"Maximum range\n/ payload"| DENS["Energy density matters\n→ Consider NMC"]
    Q1 -->|"Maximum cycle life\n/ low TCO"| LIFE["Longevity matters\n→ Consider LFP"]
    Q1 -->|"V2G / revenue focus"| V2G["Many cycles, V2G\n→ LFP often wins"]

    DENS --> Q2{Operating\nprofile?}
    Q2 -->|"Long-haul, 1–2 FEC/day\nMCS fast charging"| NMC_WARN["⚠️ NMC + MCS:\nPlating risk in winter\nNeed thermal management\nHigh SoC at rest is expensive"]
    Q2 -->|"Regional, ≤ 1 FEC/day\ndepot charging only"| NMC_OK["✅ NMC viable\nArrhenius risk: cool depot\nStore at 50–60 % if possible"]

    LIFE --> Q3{Daily\nthroughput?}
    Q3 -->|"< 1 FEC/day"| LFP_OK["✅ LFP very good\nFlat OCV: BMS calibration\nneeds periodic full charge\n(ageing cost, plan for it)"]
    Q3 -->|"> 1.5 FEC/day"| LFP_GREAT["🟢 LFP excellent\nLower cycle stress coefficients\nLess DoD sensitivity than NMC\nInferior energy density trade-off"]

    V2G --> Q4{V2G service\ntype?}
    Q4 -->|"FCR / shallow\nmicro-cycles"| BOTH_OK["Both NMC and LFP viable\nLFP: flatter OCV = more\nstable SoC estimation\nfor BMS during regulation"]
    Q4 -->|"Deep arbitrage\nhigh SoC peaks"| LFP_V2G["LFP preferred:\nLess SoC-stress sensitivity\nCan hold high SoC more safely\n(though still not ideal)"]
    Q4 -->|"Smart charging\n(V1G, timing only)"| ANY["Either chemistry fine\nZero extra throughput:\nageing cost negligible"]

    NMC_WARN --> COMPARE["📊 Key numbers to compare:\nNMC: ~0.5–2× more Wh/kg\nLFP: ~2–4× more FEC at same DoD\nNMC calendar at 40°C/90%SoC:\n~3–5× faster than LFP same conditions"]

    style NMC_WARN fill:#1a0a00,stroke:#f97316,color:#fed7aa
    style LFP_GREAT fill:#0a1a00,stroke:#84cc16,color:#d9f99d
    style LFP_V2G fill:#0a1a00,stroke:#34d399,color:#6ee7b7
    style COMPARE fill:#1a1200,stroke:#fbbf24,color:#fde68a
```

---

## 5. Ageing model selection — what model for what question?

```mermaid
flowchart TD
    START([🎯 What do you need the\nageing model to do?]) --> Q1{Primary use case?}

    Q1 -->|"BMS: online SoH\nestimation in real time"| BMS["📱 BMS / Online estimation\n→ Very fast, simple model\n→ ECM + coulomb counting\n→ Kalman filter update of SoH\n→ NO semi-empirical needed\nin the inner loop"]

    Q1 -->|"Fleet simulation /\nwarranty lifetime prediction"| FLEET["🚛 Fleet / Warranty\n→ Semi-empirical stress model\n(Schmalstieg-style)\n+ electrothermal coupling\n+ Monte Carlo over parameters"]

    Q1 -->|"V2G dispatch\noptimisation"| OPT["⚡ V2G Optimisation\n→ Depends on solver type"]

    Q1 -->|"Cell design /\nR&D understanding"| CELL["🔬 Cell design / R&D\n→ Physics-based model\n(DFN / P2D + degradation)"]

    Q1 -->|"Online monitoring\n+ RUL prediction"| ML["🤖 ML / Data-driven\n→ Feature-based SoH\nor hybrid grey-box"]

    OPT --> Q2{Optimiser type?}
    Q2 -->|"MILP / convex solver\n(fast, large fleet)"| LIN["Linearise stress factors:\nc_deg = linear in FEC, DoD\nPiecewise approximation\nof U-shaped SoC term"]
    Q2 -->|"MPC / simulation\nin the loop"| SIM["Full semi-empirical model\nevaluated each timestep\nSlower, more accurate"]
    Q2 -->|"Heuristic /\nrule-based"| RULE["Simple throughput budget:\nmax FEC/day, DoD cap\nNot accurate but fast"]

    FLEET --> VALID{Validation data\navailable?}
    VALID -->|"Own ageing tests\non the target cell"| FIT["Fit Schmalstieg-style model\nto your data:\nCalendar matrix + cycle matrix\n→ RPT extraction\n→ Stress-factor regression\n→ Validate on drive cycle"]
    VALID -->|"Only supplier data\nor literature"| LIT["Use literature-typical\nparameters (like this app)\n+ sensitivity analysis\nDocument uncertainty bounds"]
    VALID -->|"Field data\n(large fleet telemetry)"| DATA["Consider hybrid grey-box:\nPhysics structure +\ndata-fitted coefficients\n(best of both)"]

    CELL --> Q3{Computational\nbudget?}
    Q3 -->|"Fast (parameter ID,\nmechanism study)"| SPM["SPM / SPMe\n+ SEI growth submodel\n+ plating submodel\nFast enough for parameter fitting"]
    Q3 -->|"High fidelity\n(few simulations)"| DFN["Full DFN / P2D\n+ degradation submodels\nOnly for specific deep dives"]

    style BMS fill:#0a1a2a,stroke:#38bdf8,color:#7dd3fc
    style FLEET fill:#1a0f00,stroke:#f59e0b,color:#fde68a
    style OPT fill:#0a1a10,stroke:#34d399,color:#6ee7b7
    style CELL fill:#1a0a1a,stroke:#a78bfa,color:#c4b5fd
    style ML fill:#1a1a0a,stroke:#facc15,color:#fef08a
    style LIN fill:#0a1a10,stroke:#34d399,color:#6ee7b7
    style FIT fill:#1a0f00,stroke:#f59e0b,color:#fde68a
```

---

## 6. Schmalstieg 2014 model — full data flow

```mermaid
flowchart TD
    subgraph inputs["📥 Inputs"]
        LOAD["Load profile\nI(t)  [A]"]
        TAMB["Ambient temperature\nT_amb(t)  [°C]"]
        CELL["Cell parameters\n(fresh: Q₀, R₀, OCV curve)"]
    end

    subgraph ecm["⚡ ECM — Equivalent Circuit Model"]
        OCV["OCV(SoC)\nlookup from OCV–SoC curve"]
        DROPS["Voltage drops:\nΔV = I·R₀ + Σ V_RC,k"]
        VCELL["V_cell(t) = OCV − ΔV"]
        SOC_UPD["SoC update:\ndSoC/dt = −I / Q_cell"]
    end

    subgraph thermal["🌡️ Thermal Model"]
        HEAT["Joule heating:\nq_gen = I²·R_eff"]
        COOL["Convective cooling:\nq_cool = hA·(T−T_amb)"]
        TEMP["Cell temperature:\nm·Cp·dT/dt = q_gen − q_cool"]
    end

    subgraph stress["📊 Stress Factor Computation"]
        ARR["Arrhenius:\nf_T = exp(−Eₐ/RT)"]
        VSOC["Voltage stress:\nf_SoC = U − U_ref"]
        DDOD["DoD from SoC swing\n(rainflow if dynamic)"]
        GMSOC["Mean SoC:\ng_SoC = γ₂·(U_mean−U_ref)²+γ₃"]
        GDOD["DoD stress:\ng_DoD = γ₁·DoD"]
    end

    subgraph aging["📉 Ageing Model"]
        QCAL["Calendar fade:\nΔQ_cal = α_cap·f_T·f_SoC·Δ(t^0.75)"]
        QCYC["Cycle fade:\nΔQ_cyc = (g_DoD+g_SoC)·ΔAh"]
        RCAL["Calendar resistance:\nΔR_cal = β_res·f_T·f_SoC·Δ(t^0.75)"]
        RCYC["Cycle resistance:\nΔR_cyc = β_cyc·(g_DoD+g_SoC)·ΔAh"]
        TOTAL["Q_loss = ΣΔQ_cal + ΣΔQ_cyc\nR_grow = ΣΔR_cal + ΣΔR_cyc"]
    end

    subgraph feedback["🔄 State Update (ageing feedback)"]
        QUPD["Q_cell ← Q₀·(1 − Q_loss)"]
        RUPD["R₀ ← R₀,fresh·(1 + R_grow)"]
        EOL{"Q_loss > 20 %\nor R_grow > 100 %?"}
    end

    LOAD --> ecm
    TAMB --> thermal
    CELL --> ecm
    CELL --> thermal

    ecm --> VCELL
    ecm --> SOC_UPD

    thermal --> TEMP

    VCELL --> ARR
    VCELL --> VSOC
    TEMP --> ARR
    SOC_UPD --> DDOD
    SOC_UPD --> GMSOC
    DDOD --> GDOD

    ARR --> QCAL
    VSOC --> QCAL
    ARR --> RCAL
    VSOC --> RCAL
    GDOD --> QCYC
    GMSOC --> QCYC
    GDOD --> RCYC
    GMSOC --> RCYC

    QCAL --> TOTAL
    QCYC --> TOTAL
    RCAL --> TOTAL
    RCYC --> TOTAL

    TOTAL --> QUPD
    TOTAL --> RUPD

    QUPD --> EOL
    RUPD --> EOL

    QUPD -->|"Feed back to ECM"| ecm
    RUPD -->|"Feed back to ECM & thermal"| ecm
    RUPD --> thermal

    EOL -->|"Yes → End of Life"| DONE["🏁 EOL reached\nLog: time, FEC, T_hist"]
    EOL -->|"No → continue"| LOAD

    style inputs fill:#060a14,stroke:#475569,color:#94a3b8
    style ecm fill:#0a0f1a,stroke:#38bdf8,color:#7dd3fc
    style thermal fill:#1a0800,stroke:#f97316,color:#fed7aa
    style stress fill:#0f0a1a,stroke:#a78bfa,color:#c4b5fd
    style aging fill:#0a1a10,stroke:#34d399,color:#6ee7b7
    style feedback fill:#1a1200,stroke:#fbbf24,color:#fde68a
    style DONE fill:#1a0a0a,stroke:#f87171,color:#fca5a5
```

---

## 7. V2G ageing cost — decision framework

```mermaid
flowchart TD
    START([⚡ Should this truck\ndo V2G tonight?]) --> Q1{V2G service\ntype?}

    Q1 --> FCR["FCR / frequency regulation\n~5 % DoD micro-cycles"]
    Q1 --> PEAK["Peak shaving\n~30 % DoD discharge"]
    Q1 --> ARB["Day-ahead arbitrage\n~60 % DoD, high SoC wait"]
    Q1 --> V1G["Smart charging (V1G)\nNo discharge, only timing"]

    V1G --> V1G_OUT["✅ Almost always do it\nZero extra throughput\nCalendar benefit if lower mean SoC\nc_deg ≈ 0"]

    FCR --> FCR_COST["Marginal cost:\nLOW per kWh (shallow DoD)\nBUT check: does FCR\nkeep pack at high SoC\nwhile waiting for signal?"]
    FCR_COST --> FCR_Q{Mean parking\nSoC > 80 %?}
    FCR_Q -->|"Yes"| FCR_WARN["⚠️ Calendar cost may\nexceed FCR revenue\nLower target SoC first"]
    FCR_Q -->|"No (40–70 %)"| FCR_OK["✅ FCR likely profitable\nc_deg << revenue\nGo ahead"]

    PEAK --> PEAK_COST["Moderate DoD, predictable\nUse marginal cost formula:\nc_deg = pack_value\n× ΔSoH / (1−SoH_EOL)"]
    PEAK_COST --> PEAK_Q{c_deg < revenue?}
    PEAK_Q -->|"Yes"| PEAK_OK["✅ Dispatch — profitable"]
    PEAK_Q -->|"No"| PEAK_NO["❌ Skip — battery wears\nfaster than it earns"]

    ARB --> ARB_COST["HIGH ageing risk:\n• Deep DoD\n• High SoC wait = calendar cost\n• Temperature × SoC interaction"]
    ARB_COST --> ARB_Q{Net value > 0\nafter full cost model?}
    ARB_Q -->|"Yes (summer, LFP,\ncool depot)"| ARB_OK["✅ Conditional go\nMonitor closely"]
    ARB_Q -->|"No (NMC, hot,\nhigh DoD)"| ARB_NO["❌ Skip arbitrage\nCost > revenue for this cell"]

    ARB --> ARB_CAL["💡 Non-obvious benefit:\nDischarging to 50 % for V2G\nthen recharging reduces\nMEAN parking SoC vs\ncharging to 100 % and waiting\n→ Calendar benefit partially\noffsets cycle cost"]

    style V1G_OUT fill:#0a1a00,stroke:#84cc16,color:#d9f99d
    style FCR_OK fill:#0a1a00,stroke:#34d399,color:#6ee7b7
    style PEAK_OK fill:#0a1a00,stroke:#34d399,color:#6ee7b7
    style ARB_OK fill:#1a1400,stroke:#fbbf24,color:#fde68a
    style FCR_WARN fill:#1a1000,stroke:#f59e0b,color:#fed7aa
    style PEAK_NO fill:#1a0a00,stroke:#f87171,color:#fca5a5
    style ARB_NO fill:#1a0a00,stroke:#f87171,color:#fca5a5
```

---

## 8. Parameter identification workflow (Schmalstieg method)

```mermaid
flowchart TD
    START([🧪 You have a new cell.\nHow do you fit the\nSchmalstieg model?]) --> PLAN

    PLAN["Step 0: Plan the test matrix\nCalendar: ≥3 temps × ≥6 SoCs × ≥6 months\nCycle: ≥3 DoDs × ≥3 mean SoCs × fixed T & C-rate\nMin. 3 cells/condition for scatter estimate\nFix RPT protocol (C/5 capacity + 10 A pulse resistance)"]

    PLAN --> CAL_TEST["📅 Run calendar tests\nStore cells at constant T and SoC\nRun RPT every 30 days\nRecord Q(t) and R(t) per condition"]

    CAL_TEST --> CAL_FIT["Fit per condition:\nQ_loss(t) = A_i · t^z\n→ Get A_i and z per condition\nExpect z ≈ 0.5–0.85\n(often fix at 0.75 for NMC)"]

    CAL_FIT --> ARR_FIT["Arrhenius fit:\nFor each SoC, plot ln(A_i) vs 1/T\nSlope = −Eₐ/R → extract Eₐ\n(expect 40–60 kJ/mol for NMC/graphite)"]

    ARR_FIT --> SOC_FIT["SoC stress fit:\nNormalise A_i by exp(−Eₐ/RT)\nPlot normalised coeff vs cell voltage U\nFit line → get α_cap and U_ref"]

    SOC_FIT --> RES_CAL["Repeat for resistance R_grow,cal:\nGet β_res and E_a,R"]

    RES_CAL --> CYC_TEST["🔄 Run cycle tests\nCycle at fixed T & C-rate\nVary DoD and mean SoC\nRun RPT every 25 cycles"]

    CYC_TEST --> SUBTRACT["⚠️ Subtract calendar contribution!\nQ_cyc,isolated = Q_total − Q_cal(t_elapsed, T, U_mean)\nThis step is critical — skip it and\nyou overfit the cycle parameters"]

    SUBTRACT --> CYC_FIT["Fit per cycle condition:\nQ_loss,cyc = α_cyc · Ah^z_cyc\nGet α_cyc per (DoD, mean SoC)"]

    CYC_FIT --> DOD_FIT["DoD stress fit:\nPlot α_cyc vs DoD → fit γ₁ (slope)\nExpect near-linear for NMC"]

    DOD_FIT --> MSOC_FIT["Mean SoC fit:\nFor fixed DoD, plot α_cyc vs U_mean\nFit quadratic → get γ₂ (curvature)\nand γ₃ (baseline minimum)"]

    MSOC_FIT --> COUPLE["⚙️ Couple to electrothermal model\nLink ECM + thermal node\nPass actual T and V to ageing model\n(not set-point T and V!)"]

    COUPLE --> VALIDATE["✅ Validate on dynamic profiles\nRun representative truck duty cycle\nthrough coupled model\nCompare Q and R predictions to RPT data\nTarget: error < 15 %"]

    VALIDATE --> Q2{Error < 15 %?}
    Q2 -->|"Yes"| DONE["🏁 Model ready\nDocument: parameters, validity bounds,\ntest matrix range, known gaps\n(plating at low T, C-rate dependence)"]
    Q2 -->|"No"| DEBUG["🔍 Debug:\nWhich condition has highest residual?\nIf calendar: check Arrhenius fit or\nsubstract step\nIf cycle: check DoD or mean-SoC fit\nIf dynamic: check electrothermal coupling"]
    DEBUG --> VALIDATE

    style PLAN fill:#060a14,stroke:#475569,color:#94a3b8
    style SUBTRACT fill:#1a0800,stroke:#f97316,color:#fed7aa
    style COUPLE fill:#0f0a1a,stroke:#a78bfa,color:#c4b5fd
    style VALIDATE fill:#0a1a10,stroke:#34d399,color:#6ee7b7
    style DONE fill:#0a1a00,stroke:#84cc16,color:#d9f99d
    style DEBUG fill:#1a0a0a,stroke:#f87171,color:#fca5a5
```

---

## 9. Thesis planning — 5-step pipeline

```mermaid
flowchart LR
    S1["📝 Step 1\nDefine the question\n\n• What SoH metric?\n  (capacity, resistance, both)\n• What EOL criterion?\n  (80 % cap? Power limit?)\n• What output?\n  (RUL? €/kWh? SoH at year N?)"]

    S2["🧩 Step 2\nChoose model family\n\n• BMS → simple ECM\n• V2G dispatch → semi-empirical\n  (linearisable)\n• Warranty → semi-empirical\n  + uncertainty bounds\n• R&D → physics-based"]

    S3["🧪 Step 3\nData strategy\n\n• Own tests (best, 12–24 mo)\n• Supplier NDA data\n• Public datasets\n  (NASA / Oxford)\n• Literature-typical\n  + sensitivity analysis"]

    S4["⚙️ Step 4\nIdentification & validation\n\n• Fit per condition\n• Subtract calendar from cycle\n• Stress-factor regression\n• Validate on DYNAMIC profiles\n  (not just matrix points!)\n• Report uncertainty bands"]

    S5["⚡ Step 5\nV2G / TCO integration\n\n• Timestep separation:\n  seconds (ECM) vs days (ageing)\n• Accumulate stress stats\n• Rolling SoH update\n• Marginal cost pricing\n• Sensitivity to Ea, DoD exponent"]

    S1 -->|"Metric dictates model"| S2
    S2 -->|"Model dictates data needs"| S3
    S3 -->|"Data enables fitting"| S4
    S4 -->|"Validated model → simulation"| S5

    style S1 fill:#0a0f1a,stroke:#38bdf8,color:#7dd3fc
    style S2 fill:#0f0a1a,stroke:#a78bfa,color:#c4b5fd
    style S3 fill:#1a0f00,stroke:#f59e0b,color:#fde68a
    style S4 fill:#0a1a10,stroke:#34d399,color:#6ee7b7
    style S5 fill:#1a0800,stroke:#f97316,color:#fed7aa
```

---

## How to render these diagrams

- **GitHub**: automatically rendered in any `.md` file — just push and view
- **VS Code**: install "Markdown Preview Mermaid Support" extension → Ctrl+Shift+V
- **Obsidian**: native Mermaid support, no plugin needed
- **Export to PNG/SVG**: paste any diagram block at [mermaid.live](https://mermaid.live) and download
