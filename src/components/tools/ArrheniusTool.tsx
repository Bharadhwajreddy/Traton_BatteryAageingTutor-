"use client";

import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot,
} from "recharts";
import { arrheniusFactor } from "@/lib/ageing";
import { Slider, ToolFrame, CHART_COLORS } from "./Controls";

export function ArrheniusTool() {
  const [ea, setEa] = useState(50); // kJ/mol
  const [probeT, setProbeT] = useState(40);

  const data = useMemo(() => {
    const pts = [];
    for (let t = -10; t <= 60; t += 2) {
      pts.push({
        tempC: t,
        factor: +arrheniusFactor(t, ea * 1000).toFixed(3),
        rule: +Math.pow(2, (t - 25) / 10).toFixed(3), // the "2x per 10 K" rule of thumb
      });
    }
    return pts;
  }, [ea]);

  const probe = arrheniusFactor(probeT, ea * 1000);

  return (
    <ToolFrame
      title="Arrhenius Acceleration Explorer"
      subtitle="How fast does chemical ageing accelerate with temperature? Factor of 1 = the rate at 25 °C. Dashed grey: the '2× per 10 K' rule of thumb."
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <Slider label="Activation energy Ea" unit="kJ/mol" min={20} max={80} step={1} value={ea} onChange={setEa}
            hint="Graphite-cell calendar ageing: typically ~40–60 kJ/mol" />
          <Slider label="Probe temperature" unit="°C" min={-10} max={60} step={1} value={probeT} onChange={setProbeT} />
          <div className="rounded-lg bg-slate-800/80 p-3 text-sm text-slate-300">
            At {probeT} °C: <b className="text-sky-300">{probe.toFixed(2)}×</b> the 25 °C ageing rate.
            <div className="mt-1 text-xs text-slate-500">
              Note this covers chemical ageing (SEI growth) only — lithium plating gets WORSE when cold; the Arrhenius curve cannot show that.
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="tempC" stroke="#94a3b8" label={{ value: "temperature °C", position: "insideBottom", offset: -2, fill: "#94a3b8", fontSize: 12 }} />
              <YAxis stroke="#94a3b8" label={{ value: "acceleration ×", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Legend />
              <Line type="monotone" dataKey="factor" name={`Arrhenius (Ea = ${ea} kJ/mol)`} stroke={CHART_COLORS.nmc} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="rule" name="2× / 10 K rule" stroke={CHART_COLORS.baseline} strokeWidth={2} strokeDasharray="6 4" dot={false} />
              <ReferenceDot x={probeT} y={+probe.toFixed(3)} r={5} fill={CHART_COLORS.net} stroke="none" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolFrame>
  );
}
