"use client";

import type { ReactNode } from "react";
import type { Block, CalloutTone } from "@/lib/types";
import { Equation } from "@/components/Equation";
import { Term } from "@/components/Term";
import { ToolHost } from "@/components/tools";

// ---------- inline markup: **bold**, *italic*, `code`, [[term]] ----------

const INLINE_RE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[\[[^\]]+\]\])/g;

export function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_RE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-100">
          {renderInline(part.slice(2, -2))}
        </strong>
      );
    }
    if (part.startsWith("[[") && part.endsWith("]]")) {
      return <Term key={i} term={part.slice(2, -2)} />;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-slate-800 px-1 py-0.5 text-[0.9em] text-amber-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{renderInline(part.slice(1, -1))}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ---------- block-level: paragraphs, "- " bullets, "### " subheads ----------

function renderBody(body: string): ReactNode {
  const lines = body.split("\n");
  const out: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (key: number) => {
    if (bullets.length) {
      out.push(
        <ul key={`ul-${key}`} className="my-2 list-disc space-y-1.5 pl-6">
          {bullets.map((b, i) => (
            <li key={i}>{renderInline(b)}</li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };
  lines.forEach((line, i) => {
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
      return;
    }
    flush(i);
    if (line.startsWith("### ")) {
      out.push(
        <h4 key={i} className="mt-3 font-semibold text-slate-200">
          {renderInline(line.slice(4))}
        </h4>
      );
    } else if (line.trim()) {
      out.push(
        <p key={i} className="my-2 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  });
  flush(lines.length);
  return out;
}

// ---------- callout styling ----------

const TONE_STYLE: Record<
  CalloutTone,
  { border: string; bg: string; icon: string; label: string; accent: string; glow: string }
> = {
  misconception: { border: "border-rose-500/40", bg: "bg-rose-500/[0.07]", icon: "⚠️", label: "Common misconception", accent: "text-rose-300", glow: "bg-rose-500/20" },
  truck: { border: "border-amber-500/40", bg: "bg-amber-500/[0.07]", icon: "🚛", label: "Truck reality", accent: "text-amber-300", glow: "bg-amber-500/20" },
  tip: { border: "border-emerald-500/40", bg: "bg-emerald-500/[0.07]", icon: "💡", label: "Practical tip", accent: "text-emerald-300", glow: "bg-emerald-500/20" },
  assumption: { border: "border-violet-500/40", bg: "bg-violet-500/[0.07]", icon: "📌", label: "Working assumption", accent: "text-violet-300", glow: "bg-violet-500/20" },
};

// ---------- the block renderer ----------

export function BlockView({ block, clarify }: { block: Block; clarify: boolean }) {
  const deeperFrame =
    block.depth === "deeper" ? "border-l-2 border-indigo-500/60 pl-4 ml-0.5" : "";

  if (block.kind === "text") {
    const useClarify = clarify && block.clarify;
    return (
      <div className={deeperFrame}>
        {block.depth === "deeper" && (
          <span className="mb-1 inline-block rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300">
            Deeper
          </span>
        )}
        {block.heading && (
          <h3 className="mt-7 mb-2 flex items-center gap-2.5 text-xl font-bold text-slate-100">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-sky-400 to-emerald-400" />
            {block.heading}
          </h3>
        )}
        {useClarify && (
          <span className="mb-1 inline-block rounded bg-sky-500/20 px-2 py-0.5 text-xs font-medium text-sky-300">
            Simplified explanation
          </span>
        )}
        <div className="text-slate-300">{renderBody(useClarify ? block.clarify! : block.body)}</div>
      </div>
    );
  }

  if (block.kind === "equation") {
    return (
      <div className={`my-5 overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900/90 to-slate-950/90 ${deeperFrame}`}>
        {block.label && (
          <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className="text-amber-300">ƒ(x)</span> {block.label}
          </div>
        )}
        <div className="px-4 py-3">
          <div className="text-lg text-slate-100">
            <Equation latex={block.latex} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{renderInline(block.explanation)}</p>
        </div>
      </div>
    );
  }

  if (block.kind === "callout") {
    const s = TONE_STYLE[block.tone];
    return (
      <div className={`relative my-5 overflow-hidden rounded-2xl border ${s.border} ${s.bg} p-5 ${deeperFrame}`}>
        <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full ${s.glow} blur-2xl`} />
        <div className="relative">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-lg">{s.icon}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider ${s.accent}`}>{s.label}</span>
          </div>
          <div className="font-semibold text-slate-100">{block.title}</div>
          <div className="mt-1 text-sm text-slate-300">{renderBody(block.body)}</div>
        </div>
      </div>
    );
  }

  // tool
  return (
    <div className="my-7">
      {block.note && (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-sky-500/30 bg-sky-500/[0.06] p-3 text-sm text-slate-300">
          <span className="text-base">👉</span>
          <span>
            <span className="font-semibold text-sky-300">Try it: </span>
            {renderInline(block.note)}
          </span>
        </div>
      )}
      <ToolHost tool={block.tool} />
    </div>
  );
}
