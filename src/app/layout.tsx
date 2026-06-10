import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ConceptMapNav } from "@/components/ConceptMapNav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BatteryAgeTutor — NMC/LFP Truck Battery Ageing & V2G",
  description:
    "Interactive deep-dive into Li-ion ageing mechanisms, models, and V2G integration for heavy-duty truck batteries.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-slate-950 text-slate-300 antialiased">
        <div className="flex min-h-screen">
          <aside className="sticky top-0 h-screen w-72 shrink-0 border-r border-slate-800 bg-slate-950">
            <ConceptMapNav />
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
