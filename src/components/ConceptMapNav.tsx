"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SECTIONS, CONCEPT_GROUPS } from "@/content";
import { SECTION_META, GROUP_THEME } from "@/content/meta";

export function ConceptMapNav() {
  const pathname = usePathname();
  return (
    <nav className="flex h-full flex-col gap-5 overflow-y-auto p-5">
      <Link href="/" className="group block">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
          >
            🔋
          </motion.span>
          <div>
            <div className="text-base font-bold leading-tight text-slate-100 group-hover:gradient-text">
              BatteryAgeTutor
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">
              NMC · LFP · Heavy-Duty · V2G
            </div>
          </div>
        </div>
      </Link>

      {CONCEPT_GROUPS.map((g) => {
        const theme = GROUP_THEME[g.label];
        return (
          <div key={g.label}>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <span>{theme?.icon}</span>
              <span>{g.label}</span>
            </div>
            <ul className="space-y-0.5">
              {g.slugs.map((slug) => {
                const s = SECTIONS.find((x) => x.slug === slug);
                if (!s) return null;
                const meta = SECTION_META[slug];
                const active = pathname === `/learn/${slug}`;
                return (
                  <li key={slug}>
                    <Link
                      href={`/learn/${slug}`}
                      className={`group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-all ${
                        active
                          ? "bg-slate-800/80 font-medium text-slate-100"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className={`h-4 w-0.5 rounded-full ${theme?.bar ?? "bg-sky-400"}`}
                        />
                      )}
                      <span className={`text-sm ${active ? "" : "opacity-70 group-hover:opacity-100"}`}>
                        {meta?.icon}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <div className="mt-auto border-t border-slate-800 pt-4">
        <Link
          href="/glossary"
          className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm ${
            pathname === "/glossary"
              ? "bg-slate-800/80 text-slate-100"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }`}
        >
          <span>📖</span> Glossary
        </Link>
      </div>
    </nav>
  );
}
