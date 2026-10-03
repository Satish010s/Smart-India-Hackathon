"use client";

import React from "react";
import { LuActivity, LuChartColumn, LuCircle } from "react-icons/lu";

export default function SimulationVisuals() {
  return (
    <section className="py-24 sm:py-28 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            Visual analytics
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
            From circuit to <span className="text-[var(--color-muted)]">quantum state.</span>
          </h2>
          <p className="mt-4 text-[15.5px] text-[var(--color-muted)] leading-relaxed">
            Every measurement made visible — Bloch spheres, outcome distributions and amplitude
            matrices update in real time as you build.
          </p>
        </div>

        {/* Visualizer panels */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Bloch sphere */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 flex flex-col items-center">
            <div className="w-full text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-6 flex items-center gap-2">
              <LuCircle size={13} className="text-[var(--color-primary)]" /> Bloch sphere
            </div>
            <svg viewBox="0 0 200 200" className="w-52 h-52">
              <defs>
                <marker id="arrowHead" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="var(--color-primary)" />
                </marker>
              </defs>
              <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
              <ellipse cx="100" cy="100" rx="80" ry="24" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
              <ellipse cx="100" cy="100" rx="24" ry="80" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="100" y1="20" x2="100" y2="180" stroke="var(--color-border)" strokeWidth="1" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="var(--color-border)" strokeWidth="1" />
              <text x="105" y="16" fill="var(--color-muted)" fontSize="11" fontFamily="monospace">|0⟩</text>
              <text x="105" y="194" fill="var(--color-muted)" fontSize="11" fontFamily="monospace">|1⟩</text>
              <text x="184" y="104" fill="var(--color-muted)" fontSize="10" fontFamily="monospace">x</text>
              <line x1="100" y1="100" x2="150" y2="50" stroke="var(--color-primary)" strokeWidth="2.5" markerEnd="url(#arrowHead)" />
              <circle cx="100" cy="100" r="3.5" fill="var(--color-primary)" />
              <text x="155" y="46" fill="var(--color-text)" fontSize="12.5" fontFamily="monospace" fontWeight="bold">|ψ⟩</text>
            </svg>
            <div className="mt-6 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-mono text-[11.5px] flex justify-between">
              <span className="text-[var(--color-muted)]">θ <span className="text-[var(--color-text)]">1.57</span></span>
              <span className="text-[var(--color-muted)]">φ <span className="text-[var(--color-text)]">0.00</span></span>
              <span className="text-[var(--color-muted)]">State <span className="text-[var(--color-primary)] font-semibold">|+⟩</span></span>
            </div>
          </div>

          {/* Histogram */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 flex flex-col">
            <div className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-6 flex items-center gap-2">
              <LuChartColumn size={13} className="text-[var(--color-primary)]" /> Probabilities · 1024 shots
            </div>
            <div className="flex-1 flex items-end justify-around gap-3 min-h-[180px] border-b border-[var(--color-border)] pb-3">
              {[
                { s: "|00⟩", v: 49, tone: "var(--color-primary)" },
                { s: "|01⟩", v: 2, tone: "var(--color-border)" },
                { s: "|10⟩", v: 2, tone: "var(--color-border)" },
                { s: "|11⟩", v: 47, tone: "var(--color-accent)" },
              ].map((bar) => (
                <div key={bar.s} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <span className="font-mono text-[10px] text-[var(--color-muted)]">{bar.v}%</span>
                  <div
                    className="w-full max-w-[46px] rounded-t-lg transition-all duration-700"
                    style={{ height: `${bar.v}%`, background: bar.tone, opacity: bar.v > 10 ? 1 : 0.5 }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-around mt-2.5 font-mono text-[10.5px] text-[var(--color-muted)]">
              <span>|00⟩</span>
              <span>|01⟩</span>
              <span>|10⟩</span>
              <span>|11⟩</span>
            </div>
          </div>

          {/* Amplitudes */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 flex flex-col">
            <div className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-6 flex items-center gap-2">
              <LuActivity size={13} className="text-[var(--color-primary)]" /> Amplitude matrix
            </div>
            <div className="space-y-2.5 font-mono text-[12.5px] flex-1">
              {[
                { s: "|00⟩", re: "0.707", im: "0.000", strong: true },
                { s: "|01⟩", re: "0.000", im: "0.000", strong: false },
                { s: "|10⟩", re: "0.000", im: "0.000", strong: false },
                { s: "|11⟩", re: "0.707", im: "0.000", strong: true },
              ].map((row) => (
                <div
                  key={row.s}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] ${
                    row.strong ? "" : "opacity-45"
                  }`}
                >
                  <span className={`font-semibold ${row.strong ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`}>
                    {row.s}
                  </span>
                  <span className="text-[var(--color-text)] text-[11.5px]">
                    {row.re} {row.im.startsWith("-") ? "−" : "+"} {row.im.replace("-", "")}j
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[12px] text-[var(--color-muted)] leading-relaxed">
              Density matrices, statevectors and Q-sphere renders available for every execution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
