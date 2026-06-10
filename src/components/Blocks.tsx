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

const TONE_STYLE: Record<CalloutTone, { border: string; bg: string; icon: string; label: string }> = {
  misconception: { border: "border-rose-500/50", bg: "bg-rose-500/10", icon: "⚠️", label: "Common misconception" },
  truck: { border: "border-amber-500/50", bg: "bg-amber-500/10", icon: "🚛", label: "Truck reality" },
  tip: { border: "border-emerald-500/50", bg: "bg-emerald-500/10", icon: "💡", label: "Practical tip" },
  assumption: { border: "border-violet-500/50", bg: "bg-violet-500/10", icon: "📌", label: "Working assumption" },
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
          <h3 className="mt-6 mb-2 text-xl font-semibold text-slate-100">{block.heading}</h3>
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
      <div className={`my-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4 ${deeperFrame}`}>
        {block.label && (
          <div className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
            {block.label}
          </div>
        )}
        <div className="text-lg text-slate-100">
          <Equation latex={block.latex} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{renderInline(block.explanation)}</p>
      </div>
    );
  }

  if (block.kind === "callout") {
    const s = TONE_STYLE[block.tone];
    return (
      <div className={`my-4 rounded-xl border ${s.border} ${s.bg} p-4 ${deeperFrame}`}>
        <div className="mb-1 flex items-center gap-2 font-semibold text-slate-100">
          <span>{s.icon}</span>
          <span className="text-xs uppercase tracking-wider text-slate-400">{s.label}</span>
        </div>
        <div className="font-semibold text-slate-100">{block.title}</div>
        <div className="mt-1 text-sm text-slate-300">{renderBody(block.body)}</div>
      </div>
    );
  }

  // tool
  return (
    <div className="my-6">
      {block.note && (
        <p className="mb-2 text-sm italic text-slate-400">
          <span className="font-semibold not-italic text-slate-300">Try it: </span>
          {renderInline(block.note)}
        </p>
      )}
      <ToolHost tool={block.tool} />
    </div>
  );
}
