"use client";

import type { ChemistryId } from "@/lib/ageing";

export function Slider({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
  hint,
}: {
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="tabular-nums text-sky-300">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-sky-500"
      />
      {hint && <div className="text-xs text-slate-500">{hint}</div>}
    </label>
  );
}

export function ChemistryToggle({
  value,
  onChange,
}: {
  value: ChemistryId;
  onChange: (c: ChemistryId) => void;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-600 text-sm">
      {(["NMC", "LFP"] as ChemistryId[]).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-4 py-1.5 font-medium transition-colors ${
            value === c ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export function ToolFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5 shadow-lg">
      <div className="mb-4">
        <h4 className="text-base font-semibold text-slate-100">🔬 {title}</h4>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
      <p className="mt-3 text-[11px] text-slate-600">
        Driven by literature-typical example parameters (see /data/parameters.json) — correct trends and orders of
        magnitude, not a fit to any specific cell.
      </p>
    </div>
  );
}

export const CHART_COLORS = {
  nmc: "#38bdf8",
  lfp: "#34d399",
  baseline: "#94a3b8",
  warn: "#f87171",
  accent: "#a78bfa",
  revenue: "#34d399",
  cost: "#f87171",
  net: "#fbbf24",
};
