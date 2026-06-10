# ARCHITECTURE.md — BatteryAgeTutor

Desktop-first educational web app teaching battery ageing for NMC/LFP heavy-duty truck packs and its use in V2G simulations.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Static-friendly, file-based routing, strict typing for the content model |
| Styling | Tailwind CSS v4 | Fast iteration, consistent dark scientific theme |
| Charts | Recharts | Lightweight declarative React charts, good for live slider-driven re-render |
| Animation | Framer Motion | Section transitions, "Go deeper" reveal, animated mechanism SVG |
| Equations | KaTeX | Fast server-renderable LaTeX |
| Backend | none | Pure static educational tool; all models run client-side in TypeScript |

## Directory structure

```
/data
  parameters.json        # literature-typical NMC/LFP ageing parameters + reference pack + V2G strategies
/docs
  ARCHITECTURE.md        # this file
  CONTENT_MAP.md         # concept map: nodes, edges, depth layers
  MODELLING_ROADMAP.md   # standalone version of the in-app thesis roadmap
  LITERATURE_MAP.md      # literature landscape by concept node
/src
  /app
    layout.tsx           # shell: left sidebar (concept map nav) + main column
    page.tsx             # home: animated concept-map overview
    /learn/[slug]        # one route per concept node (static params)
    /glossary            # full glossary page
  /components
    Blocks.tsx           # block renderer (text/equation/callout/tool) + inline markup parser
    SectionPage.tsx      # page-level Clarify / Go-deeper state, block list, prev/next
    ConceptMapNav.tsx    # left navigation grouped by concept area
    Equation.tsx         # KaTeX wrapper
    Term.tsx             # [[term]] glossary hover tooltip
    /tools               # interactive scenario tools (all client components)
      Controls.tsx       # shared Slider / ChemistryToggle / ToolFrame
      CalendarExplorer   # T × storage-SoC → calendar fade
      CycleExplorer      # DoD × C-rate × T → cycle fade + resistance
      SocWindowTool      # window placement A vs B at equal daily energy
      V2GDispatch        # strategy → SoH trajectories + revenue vs degradation cost
      ArrheniusTool      # Ea × T → acceleration factor vs 2×/10K rule
      MechanismDiagram   # animated cell cross-section (SEI/plating/cracking/dissolution)
      index.tsx          # ToolHost: ToolId → component
  /content
    index.ts             # SECTIONS list + CONCEPT_GROUPS layout
    glossary.ts          # tooltip glossary
    /sections/*.ts       # one typed Section per concept node
  /lib
    types.ts             # Block/Section/Glossary content type system
    ageing.ts            # semi-empirical combined ageing model + V2G economics
HANDOVER.md              # continuous decision log
```

## Content model & data flow

```
content/sections/*.ts (typed Section)
        │ imported by
content/index.ts ──► app/learn/[slug]/page.tsx (server)
        │                  │ props (serialisable)
        ▼                  ▼
ConceptMapNav        SectionPage (client: clarify/deeper state)
                           │ per block
                           ▼
                     Blocks.tsx ──► Equation / Term / ToolHost
                                          │
                                          ▼
                              lib/ageing.ts ◄── data/parameters.json
```

- **Depth layers**: every block has `depth: "core" | "deeper"`. Core text blocks may carry a `clarify` variant. The page-level **Clarify** button swaps in the simpler text; **Go deeper** reveals `deeper` blocks (marked with an indigo rail).
- **Glossary**: `[[term]]` inline syntax resolves against `content/glossary.ts` at render time → hover tooltip.
- **Models**: all six tools call the same `lib/ageing.ts` functions, parameterised from `/data/parameters.json`. The model structure is itself teaching material (shown in the "Model families" section).

## Model implemented in lib/ageing.ts

Semi-empirical, superposition-based:

- Calendar: `Q_cal = k_ref · f_T(Arrhenius) · f_SoC · t^0.5`
- Cycle: `Q_cyc = k_ref · g_DoD · g_C · g_T(U-shaped, plating gate) · FEC^z`
- Resistance growth: same stress factors, separate prefactors
- V2G economics: marginal degradation cost = `pack_value · ΔSoH / (1 − SoH_EOL)`; linearity deliberately simple and critiqued in-app.

Parameters are literature-typical (correct trends/orders of magnitude), not fits to specific cells — flagged in every tool's footer.

## Key decisions

1. **No backend** — content + models are static; deploys anywhere (Vercel-ready).
2. **Content as typed TS, not MDX** — the clarify/deeper/tool structure is richer than markdown front-matter allows; the compiler validates every section.
3. **One shared model library** — students see the *same* equations in the text and behind every plot.
4. **Recharts over Plotly** — smaller bundle, sufficient for line/area charts; Plotly can be added later for 3-D response surfaces.
