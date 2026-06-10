"use client";

import { useState } from "react";
import { findGlossary } from "@/content/glossary";

export function Term({ term }: { term: string }) {
  const [open, setOpen] = useState(false);
  const entry = findGlossary(term);
  if (!entry) return <span>{term}</span>;
  return (
    <span
      className="relative cursor-help border-b border-dotted border-sky-500 text-sky-300"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
    >
      {term}
      {open && (
        <span className="absolute left-1/2 top-full z-50 mt-1 w-72 -translate-x-1/2 rounded-lg border border-slate-600 bg-slate-900 p-3 text-sm font-normal not-italic text-slate-200 shadow-xl">
          <span className="mb-1 block font-semibold text-sky-300">{entry.term}</span>
          {entry.short}
        </span>
      )}
    </span>
  );
}
