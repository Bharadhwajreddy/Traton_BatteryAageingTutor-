"use client";

import { motion } from "framer-motion";

/**
 * Animated SVG hero: a truck battery pack whose cells "age" — fill drains
 * and colour shifts from healthy green toward worn amber — looping gently.
 * Ions drift across to suggest the electrochemistry beneath.
 */
export function BatteryHero() {
  const cells = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 520 260" className="h-auto w-full" role="img" aria-label="animated truck battery pack ageing">
      <defs>
        <linearGradient id="healthy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="worn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* pack housing */}
      <rect x="20" y="40" width="480" height="180" rx="16" fill="#0b1220" stroke="#1e293b" strokeWidth="2" />
      <rect x="500" y="110" width="14" height="40" rx="4" fill="#1e293b" />

      {/* cells */}
      {cells.map((i) => {
        const x = 44 + i * 76;
        return (
          <g key={i}>
            <rect x={x} y="64" width="56" height="132" rx="8" fill="#0f172a" stroke="#243042" strokeWidth="1.5" />
            {/* draining + colour-shifting fill */}
            <motion.rect
              x={x + 6}
              width="44"
              rx="5"
              initial={{ y: 76, height: 112, fill: "url(#healthy)" }}
              animate={{
                y: [76, 76, 110, 110, 76],
                height: [112, 112, 78, 78, 112],
                fill: ["#10b981", "#10b981", "#f59e0b", "#f59e0b", "#10b981"],
              }}
              transition={{ duration: 7, times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, delay: i * 0.18 }}
              filter="url(#glow)"
            />
            {/* terminal */}
            <rect x={x + 20} y="56" width="16" height="10" rx="2" fill="#475569" />
          </g>
        );
      })}

      {/* drifting ions */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.circle
          key={`ion-${i}`}
          r="3.5"
          fill="#7dd3fc"
          initial={{ cx: 60, cy: 100 + i * 18, opacity: 0 }}
          animate={{ cx: [60, 470], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.7, ease: "linear" }}
        />
      ))}

      {/* SoH label */}
      <motion.text
        x="260"
        y="244"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        initial={{ fill: "#34d399" }}
        animate={{ fill: ["#34d399", "#34d399", "#fbbf24", "#fbbf24", "#34d399"] }}
        transition={{ duration: 7, times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity }}
      >
        State of Health: degrading over years of duty
      </motion.text>
    </svg>
  );
}
