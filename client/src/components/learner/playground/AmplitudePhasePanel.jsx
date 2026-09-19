"use client";

import React, { useMemo } from 'react';


export default function AmplitudePhasePanel({ amplitudes = [] }) {
  if (!amplitudes || amplitudes.length === 0) return null;

  const nonZero  = amplitudes.filter(a => a.prob > 0.0004);
  const maxProb  = Math.max(...amplitudes.map(a => a.prob), 0.001);

  // Phase-disk geometry
  const DISK_R  = 58;
  const CX      = 75;
  const CY      = 75;
  const DISK_SZ = 150;

  // Colour from phase angle
  const phaseHue  = (phase) => (((phase * 180) / Math.PI) + 360) % 360;
  const phaseColor = (phase, prob) => {
    if (prob < 0.0004) return 'rgba(71,85,105,0.4)';
    const h = phaseHue(phase);
    return `hsl(${h}, 82%, 60%)`;
  };

  // Summary top-N for the right card
  const topStates = [...amplitudes]
    .sort((a, b) => b.prob - a.prob)
    .slice(0, 5);

  return (
    <div className="space-y-3">

      {/* ── Top row: Phase Disk + Amplitude Summary ─────────────────────── */}
      <div className="flex gap-3">

        {/* Phase Disk */}
        <div className="flex-shrink-0 rounded-lg border border-[var(--db-border)] bg-[var(--db-surface-2)] px-3 pt-3 pb-2">
          <p className="text-[9px] font-mono font-semibold uppercase tracking-widest text-[var(--db-muted)] mb-2 text-center">
            Phase Disk
          </p>
          <svg width={DISK_SZ} height={DISK_SZ} overflow="visible">

            {/* Concentric grid rings */}
            {[0.33, 0.66, 1].map(r => (
              <circle key={r} cx={CX} cy={CY} r={DISK_R * r}
                fill="none" stroke="var(--db-border)" strokeWidth={0.8} />
            ))}

            {/* Axis lines */}
            {[0, 90, 180, 270].map(deg => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line key={deg}
                  x1={CX} y1={CY}
                  x2={CX + Math.cos(rad) * (DISK_R + 6)}
                  y2={CY - Math.sin(rad) * (DISK_R + 6)}
                  stroke="var(--db-border-strong)" strokeWidth={0.8} strokeDasharray="2 3"
                />
              );
            })}

            {/* Axis labels */}
            <text x={CX + DISK_R + 8} y={CY + 3.5}
              fontSize={7.5} fill="var(--db-muted)" fontFamily="monospace" textAnchor="start">+Re</text>
            <text x={CX - DISK_R - 8} y={CY + 3.5}
              fontSize={7.5} fill="var(--db-muted)" fontFamily="monospace" textAnchor="end">-Re</text>
            <text x={CX} y={CY - DISK_R - 8}
              fontSize={7.5} fill="var(--db-muted)" fontFamily="monospace" textAnchor="middle">+i</text>
            <text x={CX} y={CY + DISK_R + 14}
              fontSize={7.5} fill="var(--db-muted)" fontFamily="monospace" textAnchor="middle">-i</text>

            {/* Amplitude vectors — color encodes phase angle, kept intentional */}
            {amplitudes.map((amp) => {
              if (amp.prob < 0.0001) return null;
              const mag   = Math.sqrt(amp.prob);          // |alpha|
              const tipX  = CX + Math.cos(amp.phase) * DISK_R * mag;
              const tipY  = CY - Math.sin(amp.phase) * DISK_R * mag;
              const color = phaseColor(amp.phase, amp.prob);

              return (
                <g key={amp.state}>
                  {/* Arrow shaft */}
                  <line
                    x1={CX} y1={CY} x2={tipX} y2={tipY}
                    stroke={color} strokeWidth={1.8} strokeLinecap="round"
                  />
                  {/* Arrowhead dot */}
                  <circle cx={tipX} cy={tipY} r={3} fill={color} />

                  {/* Label for significant components */}
                  {mag > 0.18 && (
                    <text
                      x={tipX + (tipX > CX ? 6 : -6)}
                      y={tipY + 3.5}
                      fontSize={7} fill={color}
                      fontFamily="monospace" fontWeight="bold"
                      textAnchor={tipX > CX ? 'start' : 'end'}
                    >
                      {amp.state}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Phase arc legend (colour wheel fragment) — kept, it's the key to the phase color scheme */}
            {Array.from({ length: 36 }, (_, i) => {
              const a1 = (i / 36) * 2 * Math.PI;
              const a2 = ((i + 1) / 36) * 2 * Math.PI;
              const r  = DISK_R + 11;
              const x1 = CX + Math.cos(a1) * r;
              const y1 = CY - Math.sin(a1) * r;
              const x2 = CX + Math.cos(a2) * r;
              const y2 = CY - Math.sin(a2) * r;
              const hue = (i / 36) * 360;
              return (
                <line key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={`hsl(${hue},80%,60%)`} strokeWidth={4} strokeLinecap="round"
                  opacity={0.55}
                />
              );
            })}

            {/* Origin dot */}
            <circle cx={CX} cy={CY} r={2.5} fill="var(--db-muted)" />
          </svg>

          {/* Phase legend label */}
          <p className="text-[8px] text-center font-mono text-[var(--db-muted)] mt-1">
            colour = phase angle
          </p>
        </div>

        {/* Amplitude summary bars */}
        <div className="flex-1 rounded-lg border border-[var(--db-border)] bg-[var(--db-surface-2)] p-4">
          <p className="text-[9px] font-mono font-semibold uppercase tracking-widest text-[var(--db-muted)] mb-3">
            Top Amplitudes
          </p>
          <div className="space-y-2.5">
            {topStates.map((amp) => {
              const hue   = phaseHue(amp.phase);
              const color = `hsl(${hue},80%,58%)`;
              const pct   = (amp.prob * 100).toFixed(1);
              return (
                <div key={amp.state} className="flex items-center gap-2.5">
                  {/* Phase swatch */}
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-[var(--db-border-strong)]"
                    style={{ background: color }}
                  />
                  {/* State */}
                  <span className="font-mono text-xs font-semibold text-[var(--db-accent)] w-12 flex-shrink-0">
                    {amp.state}
                  </span>
                  {/* Probability bar */}
                  <div className="flex-1 h-2 bg-[var(--db-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (amp.prob / maxProb) * 100)}%`, background: color }}
                    />
                  </div>
                  {/* Percent */}
                  <span className="text-[10px] font-mono text-[var(--db-muted)] w-10 text-right flex-shrink-0">
                    {pct}%
                  </span>
                </div>
              );
            })}
            {nonZero.length === 0 && (
              <p className="text-xs text-[var(--db-muted)] text-center py-4">All amplitudes zero</p>
            )}
          </div>

          {/* Entanglement indicator */}
          <div className="mt-4 pt-3 border-t border-[var(--db-border)]">
            <div className="flex items-center justify-between text-[9px] font-mono text-[var(--db-muted)]">
              <span>Non-zero states</span>
              <span className="text-[var(--db-accent)] font-semibold">{nonZero.length} / {amplitudes.length}</span>
            </div>
            <div className="mt-1.5 h-1.5 bg-[var(--db-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--db-accent)] rounded-full transition-all duration-500"
                style={{ width: `${(nonZero.length / amplitudes.length) * 100}%` }}
              />
            </div>
            <p className="text-[8px] text-[var(--db-muted)] mt-1">
              {nonZero.length <= 1 ? 'Product state (separable)' : nonZero.length <= 2 ? 'Likely entangled' : 'Multi-component superposition'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Amplitude Table ──────────────────────────────────────────────── */}
      <div className="rounded-lg border border-[var(--db-border)] bg-[var(--db-surface-2)] overflow-hidden">
        {/* Table header */}
        <div className="grid gap-1 px-4 py-2 bg-[var(--db-surface)] border-b border-[var(--db-border)]"
          style={{ gridTemplateColumns: '72px 72px 80px 1fr 56px 32px' }}>
          {['State', 'Re(α)', 'Im(α)', 'Probability', '|α|²', 'φ'].map(h => (
            <span key={h} className="text-[9px] font-mono font-semibold uppercase tracking-wider text-[var(--db-muted)]">{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="max-h-52 overflow-y-auto divide-y divide-[var(--db-border)]">
          {amplitudes.map((amp) => {
            const hue   = phaseHue(amp.phase);
            const color = phaseColor(amp.phase, amp.prob);
            const pct   = (amp.prob * 100).toFixed(2);
            const dim   = amp.prob < 0.0005;

            return (
              <div
                key={amp.state}
                className="grid gap-1 px-4 py-2.5 items-center transition-colors hover:bg-[var(--db-surface)]"
                style={{ gridTemplateColumns: '72px 72px 80px 1fr 56px 32px', opacity: dim ? 0.3 : 1 }}
              >
                <span className="font-mono text-xs font-semibold text-[var(--db-accent)]">{amp.state}</span>
                <span className="font-mono text-xs text-[var(--db-neutral)]">
                  {amp.re >= 0 ? '+' : ''}{amp.re.toFixed(3)}
                </span>
                <span className="font-mono text-xs text-[var(--db-neutral)]">
                  {amp.im >= 0 ? '+' : ''}{amp.im.toFixed(3)}i
                </span>
                {/* Probability mini-bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[var(--db-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (amp.prob / maxProb) * 100)}%`, background: color }}
                    />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[var(--db-muted)] text-right">{pct}%</span>
                {/* Phase swatch */}
                <div
                  className="w-4 h-4 rounded-full border border-[var(--db-border-strong)] justify-self-center"
                  style={{ background: dim ? 'var(--db-border-strong)' : color }}
                  title={`Phase: ${((amp.phase * 180) / Math.PI).toFixed(1)}°`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
