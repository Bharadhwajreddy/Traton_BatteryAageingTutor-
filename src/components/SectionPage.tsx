"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Section } from "@/lib/types";
import { BlockView } from "@/components/Blocks";
import { SECTIONS } from "@/content";
import { SECTION_META } from "@/content/meta";
import { ReadingProgress } from "@/components/ReadingProgress";

export function SectionPage({ section }: { section: Section }) {
  const [clarify, setClarify] = useState(false);
  const [deeper, setDeeper] = useState(false);

  const meta = SECTION_META[section.slug];
  const idx = SECTIONS.findIndex((s) => s.slug === section.slug);
  const prev = idx > 0 ? SECTIONS[idx - 1] : null;
  const next = idx >= 0 && idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;

  const visible = section.blocks.filter((b) => b.depth === "core" || deeper);
  const deeperCount = section.blocks.filter((b) => b.depth === "deeper").length;
  const toolCount = section.blocks.filter((b) => b.kind === "tool").length;

  return (
    <article className="mx-auto max-w-4xl px-6 pb-16 md:px-10">
      <ReadingProgress />

      {/* ---------- HEADER BAND ---------- */}
      <header className="relative -mx-6 mb-8 overflow-hidden border-b border-slate-800 px-6 pb-8 pt-10 md:-mx-10 md:px-10">
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${meta?.gradient ?? "from-sky-500/20 to-transparent"}`} />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <span className={meta?.text}>{section.title}</span>
            <span>·</span>
            <span>~{section.minutes} min</span>
            {toolCount > 0 && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">🔬 {toolCount} interactive</span>
              </>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-4"
          >
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${meta?.chip ?? "bg-sky-500/15"} text-3xl shadow-lg`}>
              {meta?.icon}
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 md:text-4xl">{section.title}</h1>
              <p className="mt-1.5 max-w-2xl text-slate-400">{section.summary}</p>
            </div>
          </motion.div>

          {section.prerequisites.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">Builds on:</span>
              {section.prerequisites.map((p) => {
                const s = SECTIONS.find((x) => x.slug === p);
                return (
                  <Link
                    key={p}
                    href={`/learn/${p}`}
                    className="rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-0.5 text-slate-400 hover:border-sky-600 hover:text-sky-300"
                  >
                    {SECTION_META[p]?.icon} {s?.title ?? p}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* ---------- LEARNING OUTCOMES ---------- */}
      {meta?.takeaways && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`mb-8 rounded-2xl border ${meta.border} glass p-5`}
        >
          <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${meta.text}`}>
            🎯 By the end of this section you&apos;ll be able to
          </div>
          <ul className="space-y-1.5">
            {meta.takeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <span className={`mt-0.5 shrink-0 ${meta.text}`}>▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ---------- DEPTH CONTROLS ---------- */}
      <div className="sticky top-0 z-40 -mx-2 mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/85 p-2 backdrop-blur-xl">
        <span className="px-2 text-xs text-slate-500">Reading level:</span>
        <button
          onClick={() => setClarify((c) => !c)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
            clarify ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          title="Re-explain everything in simpler terms with analogies"
        >
          💬 Clarify {clarify && "✓"}
        </button>
        <button
          onClick={() => setDeeper((d) => !d)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
            deeper ? "bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          title="Reveal advanced material: derivations, mechanisms, model details"
        >
          🔭 Go deeper {deeper ? "✓" : `+${deeperCount}`}
        </button>
        <span className="ml-auto px-2 text-xs text-slate-600">
          {clarify ? "Simplified" : "Postdoc-level"} · {deeper ? "advanced shown" : "core only"}
        </span>
      </div>

      {/* ---------- BLOCKS ---------- */}
      <div className="prose-body">
        <AnimatePresence initial={false}>
          {visible.map((block, i) => (
            <motion.div
              key={`${section.slug}-${i}-${block.kind}`}
              layout="position"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <BlockView block={block} clarify={clarify} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ---------- PREV / NEXT ---------- */}
      <nav className="mt-12 grid gap-3 border-t border-slate-800 pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="group rounded-xl border border-slate-800 glass p-4 transition-colors hover:border-slate-600"
          >
            <div className="text-xs text-slate-500">← Previous</div>
            <div className="mt-0.5 font-medium text-slate-200 group-hover:text-sky-300">
              {SECTION_META[prev.slug]?.icon} {prev.title}
            </div>
          </Link>
        ) : <span />}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="group rounded-xl border border-slate-800 glass p-4 text-right transition-colors hover:border-slate-600"
          >
            <div className="text-xs text-slate-500">Next →</div>
            <div className="mt-0.5 font-medium text-slate-200 group-hover:text-emerald-300">
              {next.title} {SECTION_META[next.slug]?.icon}
            </div>
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
