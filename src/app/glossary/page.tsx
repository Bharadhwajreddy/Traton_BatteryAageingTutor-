import { GLOSSARY } from "@/content/glossary";

export const metadata = { title: "Glossary — BatteryAgeTutor" };

export default function GlossaryPage() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-100">Glossary</h1>
      <p className="mt-2 text-slate-400">
        Every term here is also available as a hover tooltip wherever it appears underlined in the text.
      </p>
      <dl className="mt-8 space-y-5">
        {sorted.map((g) => (
          <div key={g.term} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <dt className="font-semibold text-sky-300">{g.term}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-slate-300">{g.short}</dd>
            {g.long && <dd className="mt-2 text-sm leading-relaxed text-slate-500">{g.long}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
}
