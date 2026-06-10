"use client";

import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { calendarLoss, arrheniusFactor, socStressFactor, CHEMISTRIES, type ChemistryId } from "@/lib/ageing";
import { Slider, ChemistryToggle, ToolFrame, CHART_COLORS } from "./Controls";

export function CalendarExplorer() {
  const [tempC, setTempC] = useState(35);
  const [soc, setSoc] = useState(90);
  const [chem, setChem] = useState<ChemistryId>("NMC");

  const data = useMemo(() => {
    const pts = [];
    for (let m = 0; m <= 15 * 12; m += 3) {
      const days = (m / 12) * 365;
      pts.push({
        years: +(m / 12).toFixed(2),
        scenario: +(100 * calendarLoss(days, tempC, soc / 100, chem)).toFixed(2),
        reference: +(100 * calendarLoss(days, 25, 0.5, chem)).toFixed(2),
      });
    }
    return pts;
  }, [tempC, soc, chem]);

  const ea = CHEMISTRIES[chem].calendar.activationEnergyJPerMol;
  const fT = arrheniusFactor(tempC, ea);
  const fSoc = socStressFactor(soc / 100, chem) / socStressFactor(0.5, chem);

  return (
    <ToolFrame
      title="Calendar Ageing Explorer"
      subtitle="Capacity loss from pure storage — no cycling at all. Compare your scenario to the gentle reference (25 °C, 50 % SoC)."
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <ChemistryToggle value={chem} onChange={setChem} />
          <Slider label="Storage temperature" unit="°C" min={-10} max={60} step={1} value={tempC} onChange={setTempC}
            hint="Depot in summer ≈ 30–40 °C; climatised ≈ 20 °C" />
          <Slider label="Storage SoC" unit="%" min={0} max={100} step={5} value={soc} onChange={setSoc}
            hint="Where the pack sits while parked" />
          <div className="rounded-lg bg-slate-800/80 p-3 text-sm text-slate-300">
            <div>Arrhenius factor vs 25 °C: <b className="text-sky-300">{fT.toFixed(2)}×</b></div>
            <div>SoC stress vs 50 %: <b className="text-sky-300">{fSoc.toFixed(2)}×</b></div>
            <div className="mt-1 text-xs text-slate-500">Multiplicative: combined ≈ {(fT * fSoc).toFixed(2)}× the reference fade rate.</div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="years" stroke="#94a3b8" label={{ value: "years parked", position: "insideBottom", offset: -2, fill: "#94a3b8", fontSize: 12 }} />
              <YAxis stroke="#94a3b8" label={{ value: "capacity loss %", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Legend />
              <Line type="monotone" dataKey="scenario" name={`your scenario (${tempC} °C, ${soc} %)`} stroke={CHART_COLORS.warn} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="reference" name="reference (25 °C, 50 %)" stroke={CHART_COLORS.baseline} strokeWidth={2} strokeDasharray="6 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolFrame>
  );
}
