"use client";

import React, { useEffect, useState } from 'react';

/**
 * QuantumHistogram
 * Premium SVG animated bar chart for measurement probability distributions.
 *
 * Props:
 *   data      - { counts: {[state]: number}, probabilities?: {[state]: number} }
 *               OR Array<{state, prob, count}>
 *   shots     - total shot count (default 1024)
 *   title     - chart heading
 *   height    - total SVG height in px (default 240)
 *   showIdeal - if true, overlays a dashed ideal (uniform) line
 */
export default function QuantumHistogram({
  data,
  shots = 1024,
  title = 'Measurement Distribution',
  height = 240,
  showIdeal = false,
}) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered]   = useState(null);

  // Trigger bar-rise animation on first render / data change
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(t);
  }, [data]);

  // ── Normalise input ──────────────────────────────────────────────────────────
  let entries = [];
  if (!data) return null;

  if (Array.isArray(data)) {
    entries = data;
  } else if (data.probabilities && Object.keys(data.probabilities).length) {
    entries = Object.entries(data.probabilities)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([state, prob]) => ({
        state:  `|${state}\u27E9`,
        prob:   Number(prob),
        count:  data.counts?.[state] ?? Math.round(prob * shots),
      }));
  } else if (data.counts && Object.keys(data.counts).length) {
    const total = Object.values(data.counts).reduce((s, v) => s + v, 0) || shots;
    entries = Object.entries(data.counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([state, count]) => ({
        state:  `|${state}\u27E9`,
        prob:   count / total,
        count:  Number(count),
      }));
  }

  if (entries.length === 0) return null;

  // ── Layout constants ─────────────────────────────────────────────────────────
  const PAD_L    = 32;
  const PAD_R    = 12;
  const PAD_TOP  = 14;
  const PAD_BOT  = 46; // space for labels
  const barArea  = height - PAD_TOP - PAD_BOT;
  const maxProb  = Math.max(...entries.map(e => e.prob), 0.01);
  const barGap   = 8;
  const minBarW  = 24;
  const maxBarW  = 68;
  // dynamic bar width so everything fits
  const svgContentW = 460;
  const rawBarW = (svgContentW - PAD_L - PAD_R - barGap * (entries.length + 1)) / entries.length;
  const barW    = Math.min(maxBarW, Math.max(minBarW, rawBarW));
  const totalW  = PAD_L + PAD_R + entries.length * (barW + barGap) + barGap;

  const idealProb = 1 / entries.length; // for showIdeal overlay

  // Per-bar colour (hue spread across cyan→violet)
  const barColor = (idx, total, prob) => {
    const hue  = 180 + (idx / Math.max(total - 1, 1)) * 120; // 180→300
    const sat  = 65 + prob * 25;
    const lit  = 52;
    return {
      fill: `hsl(${hue},${sat}%,${lit}%)`,
      glow: `hsl(${hue},85%,66%)`,
      faded:`hsl(${hue},${sat}%,${lit}%,0.2)`,
    };
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--color-muted)]">
          {title}
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--color-muted)]">
          <span>{Number(shots).toLocaleString()} shots</span>
          <span className="text-slate-600">·</span>
          <span>{entries.length} states</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg
          width={Math.max(totalW, 320)}
          height={height}
          className="overflow-visible block"
        >
          {/* ── Y-axis grid + ticks ──────────────────────────────────── */}
          {[0, 0.25, 0.5, 0.75, 1.0].map(pct => {
            const yProb = pct * maxProb;
            const y     = PAD_TOP + barArea * (1 - pct);
            if (y < PAD_TOP - 4) return null;
            return (
              <g key={pct}>
                <line
                  x1={PAD_L - 6} y1={y}
                  x2={Math.max(totalW, 320)} y2={y}
                  stroke="rgba(148,163,184,0.09)"
                  strokeWidth={1} strokeDasharray="4 5"
                />
                <text
                  x={PAD_L - 8} y={y + 3.5}
                  textAnchor="end" fontSize={7.5}
                  fill="rgba(148,163,184,0.45)"
                  fontFamily="'Courier New',monospace"
                >
                  {(yProb * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* Ideal uniform dashed line */}
          {showIdeal && (() => {
            const y = PAD_TOP + barArea * (1 - idealProb / maxProb);
            return (
              <line
                x1={PAD_L} y1={y}
                x2={Math.max(totalW, 320)} y2={y}
                stroke="rgba(250,204,21,0.45)"
                strokeWidth={1.2}
                strokeDasharray="6 4"
              />
            );
          })()}

          {/* ── Bars ─────────────────────────────────────────────────── */}
          {entries.map((entry, idx) => {
            const x     = PAD_L + barGap + idx * (barW + barGap);
            const h     = animated ? Math.max(3, (entry.prob / maxProb) * barArea) : 0;
            const y     = PAD_TOP + barArea - h;
            const { fill, glow } = barColor(idx, entries.length, entry.prob);
            const isHov = hovered === idx;

            return (
              <g
                key={entry.state}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }}
              >
                {/* Hover glow behind bar */}
                {isHov && (
                  <rect
                    x={x - 3} y={y - 3} rx={6} ry={6}
                    width={barW + 6} height={h + 6}
                    fill={glow} opacity={0.12}
                  />
                )}

                {/* Main bar */}
                <rect
                  x={x} y={y} rx={4} ry={4}
                  width={barW} height={h}
                  fill={fill} opacity={isHov ? 1 : 0.82}
                  style={{
                    transition: 'height 0.55s cubic-bezier(.34,1.56,.64,1), y 0.55s cubic-bezier(.34,1.56,.64,1)',
                  }}
                />

                {/* Sheen top */}
                <rect
                  x={x} y={y} rx={4} ry={4}
                  width={barW} height={Math.min(h, 18)}
                  fill="rgba(255,255,255,0.11)"
                  style={{ transition: 'height 0.55s, y 0.55s' }}
                />

                {/* Probability label above bar */}
                <text
                  x={x + barW / 2} y={y - 5}
                  textAnchor="middle" fontSize={9}
                  fill={glow}
                  fontFamily="'Courier New',monospace"
                  fontWeight="700"
                  style={{ transition: 'y 0.55s', opacity: h > 12 ? 1 : 0 }}
                >
                  {(entry.prob * 100).toFixed(1)}%
                </text>

                {/* State label below */}
                <text
                  x={x + barW / 2}
                  y={PAD_TOP + barArea + 14}
                  textAnchor="middle" fontSize={10}
                  fill="rgba(148,163,184,0.80)"
                  fontFamily="'Courier New',monospace"
                  fontWeight="700"
                >
                  {entry.state}
                </text>

                {/* Count label */}
                <text
                  x={x + barW / 2}
                  y={PAD_TOP + barArea + 28}
                  textAnchor="middle" fontSize={8}
                  fill="rgba(148,163,184,0.42)"
                  fontFamily="'Courier New',monospace"
                >
                  {Number(entry.count).toLocaleString()}
                </text>

                {/* Hover tooltip */}
                {isHov && h > 0 && (() => {
                  const tipX = Math.min(x + barW / 2, Math.max(totalW, 320) - 50);
                  const tipY = Math.max(PAD_TOP, y - 38);
                  return (
                    <g>
                      <rect x={tipX - 44} y={tipY} width={88} height={28} rx={6}
                        fill="#0a0e1a" stroke={fill} strokeWidth={1} />
                      <text x={tipX} y={tipY + 11} textAnchor="middle" fontSize={9}
                        fill={glow} fontFamily="monospace" fontWeight="700">
                        {entry.state}: {(entry.prob * 100).toFixed(2)}%
                      </text>
                      <text x={tipX} y={tipY + 22} textAnchor="middle" fontSize={8}
                        fill="rgba(148,163,184,0.65)" fontFamily="monospace">
                        {Number(entry.count).toLocaleString()}/{Number(shots).toLocaleString()}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={PAD_L} y1={PAD_TOP + barArea}
            x2={Math.max(totalW, 320)} y2={PAD_TOP + barArea}
            stroke="rgba(148,163,184,0.18)" strokeWidth={1}
          />
        </svg>
      </div>
    </div>
  );
}
