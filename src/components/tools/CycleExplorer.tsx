"use client";

import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { cycleLoss, resistanceGrowth, type ChemistryId, type CycleConditions } from "@/lib/ageing";
import { Slider, ChemistryToggle, ToolFrame, CHART_COLORS } from "./Controls";

export function CycleExplorer() {
  const [dod, setDod] = useState(70);
  const [cRate, setCRate] = useState(0.8);
  const [chargeC, setChargeC] = useState(1.5);
  const [tempC, setTempC] = useState(25);
  const [chem, setChem] = useState<ChemistryId>("NMC");

  const { data, fecToEol } = useMemo(() => {
    const cond: CycleConditions = { dod: dod / 100, cRate, chargeCRate: chargeC, tempC };
    const gentle: CycleConditions = { dod: 0.4, cRate: 0.5, chargeCRate: 0.5, tempC: 25 };
    const pts = [];
    let eol: number | null = null;
    for (let fec = 0; fec <= 5000; fec += 100) {
      const loss = cycleLoss(fec, cond, chem);
      if (eol === null && loss >= 0.2) eol = fec;
      pts.push({
        fec,
        scenario: +(100 * (1 - loss)).toFixed(2),
        gentle: +(100 * (1 - cycleLoss(fec, gentle, chem))).toFixed(2),
        resistance: +((1 + resistanceGrowth(0, fec, tempC, 0.5, cond, chem)) * 100).toFixed(1),
      });
    }
    return { data: pts, fecToEol: eol };
  }, [dod, cRate, chargeC, tempC, chem]);

  return (
    <ToolFrame
      title="Cycle Ageing Explorer"
      subtitle="Pure cycling wear vs full equivalent cycles (calendar part removed for clarity). Dashed grey = a gentle depot profile (0.5C, 40 % DoD, 25 °C)."
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <ChemistryToggle value={chem} onChange={setChem} />
          <Slider label="Depth of discharge" unit="%" min={5} max={100} step={5} value={dod} onChange={setDod} />
          <Slider label="Discharge C-rate" unit="C" min={0.2} max={3} step={0.1} value={cRate} onChange={setCRate}
            hint="Highway cruise ≈ 0.3–0.6C, gradients 1.5–3C peaks" />
          <Slider label="Charge C-rate" unit="C" min={0.2} max={3} step={0.1} value={chargeC} onChange={setChargeC}
            hint="Depot ≈ 0.3–1C, MCS opportunity charging 1.5–3C" />
          <Slider label="Cell temperature" unit="°C" min={-10} max={55} step={1} value={tempC} onChange={setTempC}
            hint="Try fast charging below 10 °C and watch the plating penalty" />
          <div className="rounded-lg bg-slate-800/80 p-3 text-sm text-slate-300">
            FEC to 80 % SoH:{" "}
            <b className="text-sky-300">{fecToEol === null ? "> 5000" : `≈ ${fecToEol}`}</b>
            <div className="mt-1 text-xs text-slate-500">At 1.2 FEC/day (long-haul) that is {fecToEol === null ? "> 11" : (fecToEol / 1.2 / 365).toFixed(1)} years of cycling wear alone.</div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="fec" stroke="#94a3b8" label={{ value: "full equivalent cycles", position: "insideBottom", offset: -2, fill: "#94a3b8", fontSize: 12 }} />
              <YAxis yAxisId="soh" domain={[60, 100]} stroke="#94a3b8" label={{ value: "SoH %", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }} />
              <YAxis yAxisId="res" orientation="right" domain={[100, 200]} stroke="#a78bfa" label={{ value: "R/R₀ %", angle: 90, position: "insideRight", fill: "#a78bfa", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Legend />
              <ReferenceLine yAxisId="soh" y={80} stroke={CHART_COLORS.warn} strokeDasharray="4 4" label={{ value: "EOL 80 %", fill: "#f87171", fontSize: 11 }} />
              <Line yAxisId="soh" type="monotone" dataKey="scenario" name="your profile (SoH)" stroke={CHART_COLORS.warn} strokeWidth={2.5} dot={false} />
              <Line yAxisId="soh" type="monotone" dataKey="gentle" name="gentle depot profile" stroke={CHART_COLORS.baseline} strokeWidth={2} strokeDasharray="6 4" dot={false} />
              <Line yAxisId="res" type="monotone" dataKey="resistance" name="resistance R/R₀" stroke={CHART_COLORS.accent} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolFrame>
  );
}
