"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS, CONCEPT_GROUPS } from "@/content";

export function ConceptMapNav() {
  const pathname = usePathname();
  return (
    <nav className="flex h-full flex-col gap-5 overflow-y-auto p-5">
      <Link href="/" className="block">
        <div className="text-lg font-bold leading-tight text-slate-100">🔋 BatteryAgeTutor</div>
        <div className="text-[11px] text-slate-500">NMC · LFP · Heavy-Duty · V2G</div>
      </Link>
      {CONCEPT_GROUPS.map((g) => (
        <div key={g.label}>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{g.label}</div>
          <ul className="space-y-0.5">
            {g.slugs.map((slug) => {
              const s = SECTIONS.find((x) => x.slug === slug);
              if (!s) return null;
              const active = pathname === `/learn/${slug}`;
              return (
                <li key={slug}>
                  <Link
                    href={`/learn/${slug}`}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-sky-600/20 font-medium text-sky-300"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="mt-auto border-t border-slate-800 pt-4">
        <Link
          href="/glossary"
          className={`block rounded-lg px-3 py-1.5 text-sm ${
            pathname === "/glossary" ? "bg-sky-600/20 text-sky-300" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          📖 Glossary
        </Link>
      </div>
    </nav>
  );
}
