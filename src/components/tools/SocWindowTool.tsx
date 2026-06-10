"use client";

import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { simulateSoh, type ChemistryId, type UsageProfile } from "@/lib/ageing";
import { Slider, ChemistryToggle, ToolFrame, CHART_COLORS } from "./Controls";

function windowProfile(lo: number, hi: number, fecPerDay: number, tempC: number): UsageProfile {
  return {
    fecPerDay,
    meanSoc: (lo + hi) / 200,
    dod: Math.max(hi - lo, 1) / 100,
    cRate: 0.6,
    chargeCRate: 0.8,
    tempC,
  };
}

export function SocWindowTool() {
  const [loA, setLoA] = useState(40);
  const [hiA, setHiA] = useState(80);
  const [loB, setLoB] = useState(60);
  const [hiB, setHiB] = useState(100);
  const [tempC, setTempC] = useState(30);
  const [chem, setChem] = useState<ChemistryId>("NMC");

  const data = useMemo(() => {
    const fec = 1.0; // same daily energy for fairness
    const a = simulateSoh(windowProfile(Math.min(loA, hiA - 5), hiA, fec, tempC), 10, chem);
    const b = simulateSoh(windowProfile(Math.min(loB, hiB - 5), hiB, fec, tempC), 10, chem);
    return a.map((p, i) => ({
      years: +p.years.toFixed(2),
      windowA: +(p.soh * 100).toFixed(2),
      windowB: +(b[i].soh * 100).toFixed(2),
    }));
  }, [loA, hiA, loB, hiB, tempC, chem]);

  const last = data[data.length - 1];

  return (
    <ToolFrame
      title="SoC Window Comparison"
      subtitle="Same daily energy (1 FEC/day), same temperature — only the SoC window placement differs. Calendar + cycle combined."
    >
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <ChemistryToggle value={chem} onChange={setChem} />
          <div className="rounded-lg border border-sky-700/50 p-3">
            <div className="mb-2 text-sm font-semibold text-sky-300">Window A</div>
            <Slider label="Lower SoC" unit="%" min={0} max={90} step={5} value={loA} onChange={setLoA} />
            <Slider label="Upper SoC" unit="%" min={10} max={100} step={5} value={hiA} onChange={setHiA} />
          </div>
          <div className="rounded-lg border border-rose-700/50 p-3">
            <div className="mb-2 text-sm font-semibold text-rose-300">Window B</div>
            <Slider label="Lower SoC" unit="%" min={0} max={90} step={5} value={loB} onChange={setLoB} />
            <Slider label="Upper SoC" unit="%" min={10} max={100} step={5} value={hiB} onChange={setHiB} />
          </div>
          <Slider label="Average temperature" unit="°C" min={0} max={45} step={1} value={tempC} onChange={setTempC} />
          <div className="rounded-lg bg-slate-800/80 p-3 text-sm text-slate-300">
            After 10 years: A = <b className="text-sky-300">{last?.windowA.toFixed(1)} %</b>, B ={" "}
            <b className="text-rose-300">{last?.windowB.toFixed(1)} %</b>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="years" stroke="#94a3b8" label={{ value: "years", position: "insideBottom", offset: -2, fill: "#94a3b8", fontSize: 12 }} />
              <YAxis domain={[65, 100]} stroke="#94a3b8" label={{ value: "SoH %", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Legend />
              <ReferenceLine y={80} stroke="#64748b" strokeDasharray="4 4" label={{ value: "EOL 80 %", fill: "#94a3b8", fontSize: 11 }} />
              <Line type="monotone" dataKey="windowA" name={`Window A (${loA}–${hiA} %)`} stroke={CHART_COLORS.nmc} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="windowB" name={`Window B (${loB}–${hiB} %)`} stroke={CHART_COLORS.warn} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolFrame>
  );
}
