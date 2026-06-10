"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SECTIONS, CONCEPT_GROUPS } from "@/content";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-slate-100">
          Battery Ageing for Heavy-Duty Trucks
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-400">
          From SoC basics to PhD-level ageing modelling for <b className="text-sky-300">NMC</b> and{" "}
          <b className="text-emerald-300">LFP</b> truck packs — mechanisms, model families, parameter
          identification, and how degradation enters <b className="text-amber-300">V2G</b> and revenue
          simulations. Every section: intuition first, then equations, then an interactive scenario tool.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-slate-700 px-3 py-1">💬 Clarify = simpler + analogies</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">🔭 Go deeper = derivations + advanced models</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">🔬 6 interactive model-driven tools</span>
        </div>
      </motion.header>

      <div className="space-y-8">
        {CONCEPT_GROUPS.map((g, gi) => (
          <motion.section
            key={g.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 + gi * 0.12 }}
          >
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              {g.label}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {g.slugs.map((slug) => {
                const s = SECTIONS.find((x) => x.slug === slug);
                if (!s) return null;
                return (
                  <Link key={slug} href={`/learn/${slug}`} className="group">
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="h-full rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-colors group-hover:border-sky-700"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-semibold text-slate-100 group-hover:text-sky-300">{s.title}</h3>
                        <span className="shrink-0 text-xs text-slate-600">~{s.minutes} min</span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.summary}</p>
                      {s.prerequisites.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {s.prerequisites.map((p) => (
                            <span key={p} className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">
                              ← {SECTIONS.find((x) => x.slug === p)?.title ?? p}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-600"
      >
        Suggested path: Foundations → Mechanisms → Calendar vs Cycle → Stress Factors → Truck Use Cases →
        Model Families → Parameter Identification → V2G → Roadmap. But the map is yours — jump anywhere.
      </motion.footer>
    </div>
  );
}
