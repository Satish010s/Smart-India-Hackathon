"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LuArrowRight, LuZap, LuFlaskConical } from "react-icons/lu";

/* ── Simple 2-qubit Bell-state simulation ──────────────────────────────────
   H ON:  |ψ⟩ = 1/√2(|00⟩ + |11⟩) → 50/50
   H OFF: |ψ⟩ = |00⟩               → 100/0                                */
function simulate(hOn) {
  if (hOn) return { p00: 50, p11: 50, state: "1/√2(|00⟩+|11⟩)", blochLabel: "|+⟩" };
  return { p00: 100, p11: 0, state: "|00⟩", blochLabel: "|0⟩" };
}

function BlochSphere({ superposed }) {
  const angle = superposed ? 45 : 2;
  const rad = (angle * Math.PI) / 180;
  const vx = 100 + 70 * Math.sin(rad);
  const vy = 100 - 70 * Math.cos(rad);

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-label={`Bloch sphere showing ${superposed ? "|+⟩" : "|0⟩"}`}>
      <defs>
        <radialGradient id="bsG" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#1e2d45" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
        </radialGradient>
        <marker id="bsA" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
        </marker>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#bsG)" stroke="#1e2d45" strokeWidth="1.5" />
      <ellipse cx="100" cy="100" rx="80" ry="22" fill="none" stroke="#1e2d45" strokeWidth="1" strokeDasharray="3 3" />
      <ellipse cx="100" cy="100" rx="22" ry="80" fill="none" stroke="#1e2d45" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="100" y1="18" x2="100" y2="182" stroke="#334155" strokeWidth="1" opacity="0.6" />
      <line x1="18" y1="100" x2="182" y2="100" stroke="#334155" strokeWidth="1" opacity="0.6" />
      <text x="105" y="14" fill="#94a3b8" fontSize="10" fontFamily="monospace">|0⟩</text>
      <text x="105" y="192" fill="#94a3b8" fontSize="10" fontFamily="monospace">|1⟩</text>
      <text x="162" y="103" fill="#94a3b8" fontSize="10" fontFamily="monospace">|+⟩</text>
      <line
        x1="100" y1="100"
        x2={vx} y2={vy}
        stroke="#6366f1"
        strokeWidth="2.5"
        markerEnd="url(#bsA)"
        style={{ transition: "x2 0.7s ease, y2 0.7s ease" }}
      />
      <circle cx="100" cy="100" r="3.5" fill="#6366f1" />
    </svg>
  );
}

export default function Hero() {
  const [hOn, setHOn] = useState(true);
  const [mounted, setMounted] = useState(false);
  const result = simulate(hOn);

  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      id="hero"
      aria-label="QubitMinds introduction"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 pb-12"
    >
      {/* Background grid */}
      <div className="absolute inset-0 landing-grid-bg" aria-hidden="true" />

      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-[var(--color-primary)]/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[var(--color-secondary)]/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[var(--color-accent)]/5 blur-[100px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[
          { x: "15%", y: "20%", delay: "0s", size: 3, c: "bg-cyan-400" },
          { x: "85%", y: "15%", delay: "1s", size: 2, c: "bg-violet-400" },
          { x: "10%", y: "70%", delay: "2s", size: 2, c: "bg-cyan-400" },
          { x: "90%", y: "75%", delay: "0.5s", size: 3, c: "bg-violet-400" },
          { x: "50%", y: "8%", delay: "1.5s", size: 2, c: "bg-pink-400" },
          { x: "75%", y: "50%", delay: "2.5s", size: 2, c: "bg-cyan-400" },
        ].map((p, i) => (
          <div key={i} className={`absolute rounded-full ${p.c} animate-float opacity-50`}
            style={{ left: p.x, top: p.y, width: p.size * 2, height: p.size * 2, animationDelay: p.delay }} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">

          {/* LEFT: Copy */}
          <div className={`flex-1 flex flex-col items-center lg:items-start text-center lg:text-left transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/8 text-[var(--color-accent)] text-xs font-semibold tracking-wide mb-7">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
              </span>
              Smart India Hackathon 2026 · Now in Beta
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-heading font-bold tracking-tight leading-[1.08] mb-6">
              See quantum.{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] animate-shimmer">
                Build it.
              </span>{" "}
              Run it.
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-xl text-[var(--color-muted)] mb-10 max-w-lg leading-relaxed">
              Drag gates, watch quantum states evolve in real time, simulate on 4 backends, and get AI guidance — no physics degree needed.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start mb-10">
              <Link
                href="/signup"
                id="hero-cta-primary"
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base text-white shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                style={{ background: "linear-gradient(135deg, #6366f1, #e879f9)" }}
              >
                <LuZap size={18} aria-hidden="true" />
                Start Learning Free
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                href="/playground"
                id="hero-cta-secondary"
                className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 backdrop-blur-sm text-[var(--color-text)] font-semibold text-base hover:border-[var(--color-secondary)]/50 hover:bg-[var(--color-secondary)]/5 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]"
              >
                <LuFlaskConical size={18} className="text-[var(--color-secondary)]" aria-hidden="true" />
                Try Circuit Builder
                <LuArrowRight size={16} className="transition-transform group-hover:translate-x-1 text-[var(--color-muted)]" aria-hidden="true" />
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
              <span className="text-xs text-[var(--color-muted)] font-medium">Runs on</span>
              {["Qiskit Aer", "PennyLane", "Cirq", "qBraid"].map((tool) => (
                <span key={tool} className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" aria-hidden="true" />
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Live demo */}
          <div className={`flex-1 w-full max-w-xl lg:max-w-[540px] transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl glow-violet"
              style={{ background: "rgba(7,15,30,0.88)", backdropFilter: "blur(20px)" }}>

              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)]/50 bg-[var(--color-surface)]/20">
                <div className="flex gap-1.5" aria-hidden="true">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-xs font-mono text-[var(--color-muted)]">QubitMinds · Bell State Demo</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                  <span className="text-[10px] text-green-400 font-mono">live</span>
                </div>
              </div>

              <div className="p-5 sm:p-6">

                {/* Circuit */}
                <div
                  className="mb-4 p-4 rounded-xl border border-[var(--color-border)]/40 bg-[var(--color-background)]/60 font-mono relative overflow-hidden"
                  aria-label="Interactive quantum circuit diagram"
                >
                  {/* Wires */}
                  <div className="absolute top-[38px] left-[58px] right-[58px] h-px bg-[var(--color-border)]/60 overflow-hidden">
                    <div className="animate-wire-pulse absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent" />
                  </div>
                  <div className="absolute top-[94px] left-[58px] right-[58px] h-px bg-[var(--color-border)]/60 overflow-hidden">
                    <div className="animate-wire-pulse absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" style={{ animationDelay: "0.6s" }} />
                  </div>

                  <div className="flex flex-col gap-8 relative z-10">
                    {/* q0 */}
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--color-muted)] text-xs font-bold w-5">q0</span>
                      <div className="w-5" />
                      <button
                        type="button"
                        onClick={() => setHOn(v => !v)}
                        aria-pressed={hOn}
                        aria-label={`H gate — ${hOn ? "active (superposition)" : "inactive"}`}
                        className={`w-11 h-11 rounded-xl border font-bold text-sm transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer ${
                          hOn
                            ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)]/40 text-[var(--color-muted)]"
                        }`}
                      >H</button>
                      <div className="w-3" />
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-[46px] bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary)]/30" />
                      </div>
                      <div className="flex-1" />
                      <div className="w-11 h-11 rounded-xl bg-[var(--color-surface)]/30 border border-[var(--color-border)]/40 flex items-center justify-center text-[var(--color-muted)] text-sm font-bold">M</div>
                    </div>

                    {/* q1 */}
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--color-muted)] text-xs font-bold w-5">q1</span>
                      <div className="w-[84px]" />
                      <div className="w-11 h-11 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-background)]/60 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.2)] relative">
                        <div className="absolute w-5 h-px bg-[var(--color-primary)]" />
                        <div className="absolute w-px h-5 bg-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1" />
                      <div className="w-11 h-11 rounded-xl bg-[var(--color-surface)]/30 border border-[var(--color-border)]/40 flex items-center justify-center text-[var(--color-muted)] text-sm font-bold">M</div>
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-[var(--color-muted)] mt-3" aria-live="polite">
                    {hOn ? "H gate ON — Bell state (maximally entangled)" : "H gate OFF — deterministic |00⟩"}
                  </p>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 gap-3">

                  {/* Histogram */}
                  <div className="p-4 rounded-xl border border-[var(--color-border)]/40 bg-[var(--color-background)]/50">
                    <div className="text-[10px] text-[var(--color-muted)] font-mono font-semibold uppercase tracking-wider mb-3">Probabilities</div>
                    <div className="flex items-end gap-2 h-14 mb-2" role="img" aria-label="Probability histogram">
                      <div className="flex-1 relative h-full">
                        <div
                          className="w-full rounded-t absolute bottom-0 bg-gradient-to-t from-[var(--color-primary)]/50 to-[var(--color-primary)] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                          style={{ height: `${result.p00}%` }}
                        />
                      </div>
                      <div className="flex-1 relative h-full">
                        <div
                          className="w-full rounded-t absolute bottom-0 bg-gradient-to-t from-[var(--color-secondary)]/50 to-[var(--color-secondary)] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                          style={{ height: `${result.p11}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-around font-mono text-[10px]">
                      <span className="text-[var(--color-primary)] font-bold">|00⟩ {result.p00}%</span>
                      <span className="text-[var(--color-secondary)] font-bold">|11⟩ {result.p11}%</span>
                    </div>
                  </div>

                  {/* Bloch sphere */}
                  <div className="p-4 rounded-xl border border-[var(--color-border)]/40 bg-[var(--color-background)]/50 flex flex-col items-center">
                    <div className="text-[10px] text-[var(--color-muted)] font-mono font-semibold uppercase tracking-wider mb-1 self-start">Bloch Sphere</div>
                    <div className="w-full max-h-[80px] flex-1">
                      <BlochSphere superposed={hOn} />
                    </div>
                    <div className="font-mono text-[10px] text-[var(--color-primary)] mt-1">{result.blochLabel}</div>
                  </div>
                </div>

                {/* State equation */}
                <div className="mt-3 px-4 py-2.5 rounded-xl border border-[var(--color-border)]/40 bg-[var(--color-surface)]/15 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-[var(--color-muted)]">|ψ⟩ =</span>
                  <span className="text-[11px] font-mono text-[var(--color-text)] font-semibold transition-all duration-500">{result.state}</span>
                  <span className="text-[10px] flex items-center gap-1 text-[var(--color-secondary)] font-mono shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" aria-hidden="true" />
                    Qiskit Aer
                  </span>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-[var(--color-muted)] mt-3">
              ↑ Click the <span className="font-mono font-bold text-[var(--color-secondary)]">H</span> gate to toggle superposition
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
