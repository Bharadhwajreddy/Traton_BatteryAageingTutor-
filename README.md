# 🔋 BatteryAgeTutor

Desktop-first interactive web app that teaches **battery ageing for NMC & LFP heavy-duty truck packs** — from SoC/SoH basics to PhD-level ageing modelling and **V2G / revenue-simulation integration**.

Built for a motivated automotive-engineering master's student: every concept starts with intuition, then equations, then an interactive scenario tool driven by a real (literature-typical) semi-empirical ageing model.

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

## What's inside

- **10 concept-map sections**: Foundations → Mechanisms → Calendar vs Cycle → Stress Factors → Truck Use Cases → Model Families → Parameter Identification → V2G Integration → Modelling Roadmap → Literature Landscape
- **Clarify** button (simpler explanations + analogies) and **Go deeper** toggle (derivations, advanced models) on every page
- **6 interactive tools** (temperature/Arrhenius, calendar ageing, cycle ageing DoD×C-rate, SoC-window comparison, V2G dispatch economics, animated mechanism diagram) — all driven by `src/lib/ageing.ts` + `data/parameters.json`
- **38-term glossary** with hover tooltips
- **Docs**: `docs/ARCHITECTURE.md`, `docs/CONTENT_MAP.md`, `docs/MODELLING_ROADMAP.md`, `docs/LITERATURE_MAP.md`; decision log in `HANDOVER.md`

## Tech stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Recharts · Framer Motion · KaTeX — no backend, deploys as a static-friendly app (Vercel-ready).

> ⚠️ All model parameters are literature-typical teaching values (correct trends and orders of magnitude), **not** fits to any specific cell. Do not use for engineering sign-off.
