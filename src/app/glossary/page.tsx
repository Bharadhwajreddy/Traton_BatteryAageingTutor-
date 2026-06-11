import { GLOSSARY } from "@/content/glossary";

export const metadata = { title: "Glossary — BatteryAgeTutor" };

export default function GlossaryPage() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-10">
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-800 grid-texture p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-transparent to-sky-600/10" />
        <div className="relative">
          <div className="text-4xl">📖</div>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-100">Glossary</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            {GLOSSARY.length} terms — every one also appears as a hover tooltip wherever it&apos;s underlined in the
            lessons. Skim it once now, then let the tooltips do the work.
          </p>
        </div>
      </div>

      <dl className="grid gap-4 md:grid-cols-2">
        {sorted.map((g) => (
          <div
            key={g.term}
            className="group rounded-2xl border border-slate-800 glass p-4 transition-colors hover:border-sky-700/60"
          >
            <dt className="flex items-center gap-2 font-semibold text-sky-300">
              <span className="h-4 w-1 rounded-full bg-gradient-to-b from-sky-400 to-emerald-400" />
              {g.term}
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-slate-300">{g.short}</dd>
            {g.long && <dd className="mt-2 border-t border-slate-800 pt-2 text-sm leading-relaxed text-slate-500">{g.long}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
}
