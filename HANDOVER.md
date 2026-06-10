# HANDOVER.md — BatteryAgeTutor continuous log

Append-only decision log. Newest entries at the bottom.

---

## 2026-06-10 — Phase 1: High-level design (Agents 1+2+3, logged by Agent 5)

**What was done**
- Defined the concept map: 10 nodes in 4 groups (Physics & Mechanisms / Application Context / Modelling / Research Landscape). See `docs/CONTENT_MAP.md` (incl. Mermaid diagram and per-node depth-layer table).
- Defined the teaching interaction model: page-level **Clarify** button (swaps in simpler text + analogies per block) and **Go deeper** toggle (reveals advanced blocks marked with an indigo rail). Default depth: postdoc-explaining-to-master's-student.
- Agent 4 drafted the literature map per node → `docs/LITERATURE_MAP.md`.

**Key decisions**
1. Content stored as **typed TypeScript** (`src/content/sections/*.ts`), not MDX: the clarify/deeper/tool block structure is validated by the compiler.
2. Tech: Next.js 16 + TS + Tailwind v4; **Recharts** for plots (light, slider-friendly), **Framer Motion** for animations, **KaTeX** for equations. No backend.
3. One shared model library (`src/lib/ageing.ts`) drives *all* interactive tools, so the equations in the text are literally the code behind the plots.

**Assumptions (also flagged in the UI)**
- Reference vehicle: heavy-duty truck, **500 kWh pack**, 90 % usable, **120 €/kWh** pack-level cost, **EOL at 80 % SoH**.
- Model parameters in `/data/parameters.json` are **literature-typical** (trend- and order-of-magnitude-correct for NMC/graphite and LFP/graphite), explicitly *not* fits to any specific published cell — every tool footer says so.
- Ageing model: superposition of calendar (√t, Arrhenius, SoC stress) and cycle (FEC-based, DoD/C-rate/T stress with low-T plating gate) parts; superposition is taught as an assumption and critiqued in-app.

---

## 2026-06-10 — Phase 2: UI & UX architecture (Agent 3)

**What was done**
- Layout: left fixed concept-map sidebar (`ConceptMapNav`), centre content column, interactive tools inline in the content flow (chosen over a right rail so each tool sits exactly where the concept is taught; sticky depth-control bar keeps Clarify/Go-deeper always reachable).
- Built block renderer (`Blocks.tsx`) with inline markup (`**bold**`, `[[term]]` glossary tooltips, bullets, sub-heads), KaTeX equation cards with symbol walkthroughs, and 4 callout tones (misconception / truck reality / tip / assumption).
- Built 6 interactive tools (all driven by `lib/ageing.ts`): calendar-explorer, cycle-explorer, soc-window, v2g-dispatch, arrhenius, mechanism-diagram (animated SVG cell cross-section with Framer Motion).
- Home page: animated concept-map overview with prerequisite chips; glossary page with all tooltip terms.

**Key decisions**
- Tools embedded as content blocks (`kind: "tool"`) with a "Try it" note → pedagogy controls placement, engineering controls implementation.
- Spec §9 tool coverage: Temperature ✔ (arrhenius + calendar-explorer), SoC window ✔, C-rate/DoD ✔ (cycle-explorer), V2G dispatch ✔.

---

## 2026-06-10 — Phase 3: Content implementation (Agents 1 + 4)

**What was done**
- 10 sections written (~110 blocks total): foundations, mechanisms (quality exemplar), calendar-vs-cycle, stress-factors, truck-use-cases, model-families, parameter-identification, v2g-integration, roadmap, literature.
- Every section: intuition first → equations → truck example → misconception callout; most core blocks carry a Clarify analogy variant; 1–3 Deeper blocks each.
- Glossary: 38 terms with hover tooltips.
- Standalone docs: `docs/MODELLING_ROADMAP.md` (5-step thesis pipeline + decision tree + co-simulation diagram), `docs/LITERATURE_MAP.md`.

**Key content decisions**
- Pure Ah-throughput models are presented only with explicit critique (per spec §4).
- SEI vs plating, calendar/cycle superposition limits, and electro-thermal coupling each get dedicated misconception/deeper treatment (spec §6 quality-check hotspots).
- LFP nuances taught: flat-OCV estimation problem, BMS-recalibration full charges, weaker-but-nonzero SoC calendar sensitivity.

**Glossary extension candidates noted by Agent 1** (not yet added): coulomb counting, hysteresis, graphite staging, rainflow counting, second life, gradeability, CEI.

---

## Open gaps / future work (per spec §9)

- **Thermal runaway / safety propagation**: only mentioned via plating-dendrite risk; no dedicated node.
- **Cell-to-cell variation & pack statistics**: covered as deeper blocks, could become its own node with a Monte-Carlo tool.
- **Knee-point prediction**: taught as an open problem; a knee-demonstration toy model would strengthen it.
- **Second-life economics**: EOL nuance mentioned in foundations; no dedicated treatment.
- **3-D response surfaces** (e.g. T × SoC fade maps): Recharts is line/area only; consider Plotly for these.
- **Real duty-cycle import**: tools use parametric profiles; uploading a measured truck power profile would be a strong extension.
- Vercel deployment: planned next step once the user approves the local build.
