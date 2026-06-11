"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SECTIONS, CONCEPT_GROUPS } from "@/content";
import { SECTION_META, GROUP_THEME } from "@/content/meta";
import { BatteryHero } from "@/components/BatteryHero";
import { Reveal } from "@/components/Reveal";

const STATS = [
  { value: "10", label: "concept sections" },
  { value: "6", label: "interactive tools" },
  { value: "2", label: "chemistries (NMC · LFP)" },
  { value: "46", label: "glossary terms" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      {/* ---------- HERO ---------- */}
      <section className="relative mb-14 overflow-hidden rounded-3xl border border-slate-800 grid-texture">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/10 via-transparent to-emerald-600/10" />
        <div className="relative grid gap-6 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs text-slate-400"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Interactive learning · postdoc depth, master&apos;s-student friendly
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-100 md:text-5xl"
            >
              Battery Ageing for <span className="gradient-text">Heavy-Duty Trucks</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-4 max-w-xl text-lg leading-relaxed text-slate-400"
            >
              Go from <span className="text-sky-300">SoC/SoH basics</span> to PhD-level ageing modelling for{" "}
              <span className="font-semibold text-sky-300">NMC</span> and{" "}
              <span className="font-semibold text-emerald-300">LFP</span> truck packs — mechanisms, model
              families, parameter identification, and how degradation enters{" "}
              <span className="font-semibold text-amber-300">V2G</span> and revenue simulations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <Link
                href="/learn/foundations"
                className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition-transform hover:scale-[1.03]"
              >
                Start learning →
              </Link>
              <Link
                href="/learn/v2g-integration"
                className="rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-emerald-600 hover:text-emerald-300"
              >
                ⚡ Jump to V2G simulator
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex items-center"
          >
            <BatteryHero />
          </motion.div>
        </div>

        {/* stat band */}
        <div className="relative grid grid-cols-2 gap-px border-t border-slate-800 bg-slate-800/60 md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="bg-slate-950/40 px-5 py-4 text-center"
            >
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <Reveal className="mb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: "💬", title: "Clarify", text: "One click re-explains any concept in plain language with concrete analogies.", color: "text-sky-300", border: "hover:border-sky-600" },
            { icon: "🔭", title: "Go deeper", text: "Reveal derivations, mechanism kinetics, and advanced model structures on demand.", color: "text-indigo-300", border: "hover:border-indigo-600" },
            { icon: "🔬", title: "Play with models", text: "Every concept ends in a live tool driven by a real semi-empirical ageing model.", color: "text-emerald-300", border: "hover:border-emerald-600" },
          ].map((c) => (
            <div key={c.title} className={`rounded-2xl border border-slate-800 glass p-5 transition-colors ${c.border}`}>
              <div className="mb-2 text-2xl">{c.icon}</div>
              <div className={`font-semibold ${c.color}`}>{c.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{c.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ---------- CONCEPT MAP ---------- */}
      <div className="space-y-10">
        {CONCEPT_GROUPS.map((g) => {
          const theme = GROUP_THEME[g.label];
          return (
            <Reveal key={g.label}>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xl">{theme?.icon}</span>
                <h2 className={`text-sm font-bold uppercase tracking-wider ${theme?.text}`}>{g.label}</h2>
                <div className={`h-px flex-1 ${theme?.bar} opacity-20`} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {g.slugs.map((slug, idx) => {
                  const s = SECTIONS.find((x) => x.slug === slug);
                  const meta = SECTION_META[slug];
                  if (!s || !meta) return null;
                  return (
                    <Link key={slug} href={`/learn/${slug}`} className="group">
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`relative h-full overflow-hidden rounded-2xl border border-slate-800 glass p-5 ${meta.border.replace("border-", "hover:border-")}`}
                      >
                        <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${meta.gradient} opacity-60 blur-2xl`} />
                        <div className="relative">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.chip} text-lg`}>
                                {meta.icon}
                              </span>
                              <h3 className="font-semibold text-slate-100 transition-colors group-hover:text-white">
                                {s.title}
                              </h3>
                            </div>
                            <span className="shrink-0 rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-500">
                              ~{s.minutes} min
                            </span>
                          </div>
                          <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{s.summary}</p>
                          <div className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${meta.text} opacity-0 transition-opacity group-hover:opacity-100`}>
                            Open section
                            <span className="transition-transform group-hover:translate-x-0.5">→</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-14">
        <div className="rounded-2xl border border-slate-800 glass p-6 text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Suggested path:</span> Foundations → Mechanisms →
          Calendar vs Cycle → Stress Factors → Truck Use Cases → Model Families → Parameter Identification →
          V2G → Roadmap. But the map is yours — jump anywhere.
        </div>
      </Reveal>
    </div>
  );
}
