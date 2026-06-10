"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolFrame } from "./Controls";

type Mech = "sei" | "plating" | "cracking" | "dissolution";

const MECHS: Record<Mech, { label: string; buckets: string; caption: string }> = {
  sei: {
    label: "SEI growth",
    buckets: "LLI + impedance ↑",
    caption:
      "The passivation film on every graphite particle thickens slowly forever, consuming cyclable lithium and adding ionic resistance. Always active; fastest when hot and at high SoC.",
  },
  plating: {
    label: "Lithium plating",
    buckets: "LLI (+ safety risk)",
    caption:
      "Metallic lithium deposits on the anode surface when charging too fast, too cold, or too full. Partly irreversible; dendrites can grow toward the separator.",
  },
  cracking: {
    label: "Particle cracking (LAM)",
    buckets: "LAM + impedance ↑",
    caption:
      "Repeated swelling/shrinking fatigues particles until they crack or lose electrical contact — mechanical fatigue, worst for deep cycles and high C-rates.",
  },
  dissolution: {
    label: "TM dissolution (NMC)",
    buckets: "LAM-cathode → LLI-anode",
    caption:
      "Transition metals (especially Mn) dissolve from the NMC cathode at high voltage, migrate across, and poison the anode SEI — coupling cathode damage to anode lithium loss.",
  },
};

function Particle({ cx, cy, r, fill, cracked }: { cx: number; cy: number; r: number; fill: string; cracked?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      {cracked && (
        <motion.path
          d={`M ${cx - r * 0.7} ${cy - r * 0.4} L ${cx} ${cy + r * 0.1} L ${cx - r * 0.2} ${cy + r * 0.7}`}
          stroke="#0f172a"
          strokeWidth={2}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
      )}
    </g>
  );
}

export function MechanismDiagram() {
  const [mech, setMech] = useState<Mech>("sei");

  const anodeParticles = [
    { cx: 70, cy: 60 }, { cx: 120, cy: 110 }, { cx: 65, cy: 165 }, { cx: 125, cy: 215 }, { cx: 75, cy: 260 },
  ];
  const cathodeParticles = [
    { cx: 430, cy: 65 }, { cx: 380, cy: 120 }, { cx: 435, cy: 175 }, { cx: 378, cy: 225 }, { cx: 428, cy: 265 },
  ];

  return (
    <ToolFrame
      title="Cell Cross-Section: Where Each Mechanism Lives"
      subtitle="Stylised electrode stack — graphite anode (left), separator (middle), NMC/LFP cathode (right). Pick a mechanism."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(MECHS) as Mech[]).map((m) => (
          <button
            key={m}
            onClick={() => setMech(m)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mech === m ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {MECHS[m].label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <svg viewBox="0 0 500 320" className="w-full rounded-xl bg-slate-950" role="img" aria-label="cell cross-section diagram">
          {/* current collectors */}
          <rect x={10} y={20} width={14} height={280} fill="#b45309" rx={2} />
          <rect x={476} y={20} width={14} height={280} fill="#64748b" rx={2} />
          {/* separator */}
          <rect x={240} y={20} width={20} height={280} fill="#1e293b" rx={3} />
          <text x={250} y={14} textAnchor="middle" fill="#64748b" fontSize={11}>separator</text>
          <text x={95} y={14} textAnchor="middle" fill="#94a3b8" fontSize={11}>graphite anode</text>
          <text x={405} y={14} textAnchor="middle" fill="#94a3b8" fontSize={11}>cathode</text>

          {/* anode particles + SEI rings */}
          {anodeParticles.map((p, i) => (
            <g key={i}>
              <motion.circle
                cx={p.cx} cy={p.cy}
                fill="none" stroke="#fbbf24" strokeOpacity={0.85}
                animate={{
                  r: mech === "sei" ? 34 : 29,
                  strokeWidth: mech === "sei" ? 7 : 2,
                }}
                transition={{ duration: 1.4, repeat: mech === "sei" ? Infinity : 0, repeatType: "reverse" }}
              />
              <Particle cx={p.cx} cy={p.cy} r={27} fill="#334155" cracked={false} />
            </g>
          ))}

          {/* cathode particles */}
          {cathodeParticles.map((p, i) => (
            <Particle key={i} cx={p.cx} cy={p.cy} r={27} fill="#475569" cracked={mech === "cracking"} />
          ))}
          {mech === "cracking" &&
            anodeParticles.slice(1, 4).map((p, i) => (
              <motion.path
                key={`ac-${i}`}
                d={`M ${p.cx - 18} ${p.cy - 10} L ${p.cx + 2} ${p.cy + 4} L ${p.cx - 4} ${p.cy + 18}`}
                stroke="#0f172a" strokeWidth={2} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.2 * i }}
              />
            ))}

          {/* plating dendrites from anode surface toward separator */}
          <AnimatePresence>
            {mech === "plating" &&
              [80, 150, 225].map((y, i) => (
                <motion.path
                  key={y}
                  d={`M 160 ${y} q 20 ${i % 2 ? 12 : -12} 40 0 q 18 ${i % 2 ? -10 : 10} 38 2`}
                  stroke="#e2e8f0" strokeWidth={3.5} fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, delay: i * 0.3 }}
                />
              ))}
          </AnimatePresence>

          {/* dissolution: ions migrating cathode -> anode */}
          <AnimatePresence>
            {mech === "dissolution" &&
              [70, 145, 230].map((y, i) => (
                <motion.circle
                  key={y}
                  r={6} fill="#f472b6"
                  initial={{ cx: 390, cy: y, opacity: 0 }}
                  animate={{ cx: 130, cy: y + 10, opacity: [0, 1, 1, 0.6] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.4, delay: i * 0.4, repeat: Infinity, repeatDelay: 0.6 }}
                />
              ))}
          </AnimatePresence>
        </svg>
        <div>
          <div className="rounded-lg bg-slate-800/80 p-4">
            <div className="text-sm font-semibold text-sky-300">{MECHS[mech].label}</div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-amber-400">
              feeds: {MECHS[mech].buckets}
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{MECHS[mech].caption}</p>
          </div>
        </div>
      </div>
    </ToolFrame>
  );
}
