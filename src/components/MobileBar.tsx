"use client";

import Link from "next/link";

/** Compact top bar shown only below the lg breakpoint (sidebar is hidden there). */
export function MobileBar() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-950/85 px-4 py-2.5 backdrop-blur-xl lg:hidden">
      <Link href="/" className="flex items-center gap-2 font-bold text-slate-100">
        <span className="text-xl">🔋</span> BatteryAgeTutor
      </Link>
      <Link href="/glossary" className="text-sm text-slate-400 hover:text-sky-300">
        📖 Glossary
      </Link>
    </div>
  );
}
