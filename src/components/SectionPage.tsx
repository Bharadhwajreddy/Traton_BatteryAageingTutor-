"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Section } from "@/lib/types";
import { BlockView } from "@/components/Blocks";
import { SECTIONS } from "@/content";

export function SectionPage({ section }: { section: Section }) {
  const [clarify, setClarify] = useState(false);
  const [deeper, setDeeper] = useState(false);

  const idx = SECTIONS.findIndex((s) => s.slug === section.slug);
  const prev = idx > 0 ? SECTIONS[idx - 1] : null;
  const next = idx >= 0 && idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;

  const visible = section.blocks.filter((b) => b.depth === "core" || deeper);
  const deeperCount = section.blocks.filter((b) => b.depth === "deeper").length;

  return (
    <article className="mx-auto max-w-4xl px-8 py-10">
      <header className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>~{section.minutes} min</span>
          {section.prerequisites.length > 0 && (
            <>
              <span>·</span>
              <span>builds on:</span>
              {section.prerequisites.map((p) => {
                const s = SECTIONS.find((x) => x.slug === p);
                return (
                  <Link key={p} href={`/learn/${p}`} className="rounded-full border border-slate-700 px-2 py-0.5 text-slate-400 hover:border-sky-600 hover:text-sky-300">
                    {s?.title ?? p}
                  </Link>
                );
              })}
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-100">{section.title}</h1>
        <p className="mt-2 text-slate-400">{section.summary}</p>

        {/* depth controls */}
        <div className="sticky top-0 z-40 -mx-2 mt-5 flex gap-2 rounded-xl border border-slate-800 bg-slate-950/90 p-2 backdrop-blur">
          <button
            onClick={() => setClarify((c) => !c)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              clarify ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
            title="Re-explain everything in simpler terms with analogies"
          >
            💬 Clarify {clarify ? "on" : ""}
          </button>
          <button
            onClick={() => setDeeper((d) => !d)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              deeper ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
            title="Reveal advanced material: derivations, mechanisms, model details"
          >
            🔭 Go deeper {deeper ? "on" : `(+${deeperCount})`}
          </button>
        </div>
      </header>

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

      <nav className="mt-12 flex justify-between border-t border-slate-800 pt-6 text-sm">
        {prev ? (
          <Link href={`/learn/${prev.slug}`} className="text-slate-400 hover:text-sky-300">← {prev.title}</Link>
        ) : <span />}
        {next ? (
          <Link href={`/learn/${next.slug}`} className="text-slate-400 hover:text-sky-300">{next.title} →</Link>
        ) : <span />}
      </nav>
    </article>
  );
}
