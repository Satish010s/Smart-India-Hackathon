"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowRight, LuFlaskConical } from "react-icons/lu";

/* ── Palettes: neutral + single teal accent (no purple) ─────────────────── */
const THEMES = {
  dark: {
    bg: "#0a0c0f",
    surface: "#0f1318",
    surface2: "#141a21",
    border: "#1f2730",
    borderStrong: "#2b3540",
    text: "#e8ecf1",
    muted: "#8a95a3",
    accent: "#5eead4",
    accentSoft: "rgba(94,234,212,0.08)",
    neutral: "#cbd5e1",
    shadow: "0 30px 80px -30px rgba(0,0,0,0.8)",
    gridOpacity: 0.35,
  },
  light: {
    bg: "#fafaf9",
    surface: "#ffffff",
    surface2: "#f4f4f5",
    border: "#e4e4e7",
    borderStrong: "#d4d4d8",
    text: "#111418",
    muted: "#5b6572",
    accent: "#0f766e",
    accentSoft: "rgba(15,118,110,0.08)",
    neutral: "#475569",
    shadow: "0 30px 70px -30px rgba(15,23,42,0.2)",
    gridOpacity: 0.7,
  },
};

/* ── Theme detection: follows your toggle (class / data-attr / color-scheme)
   and falls back to the OS preference. Re-runs live on every toggle.
   If your toggle uses something else, adjust readTheme() only.            */
function readTheme() {
  const roots = [document.documentElement, document.body];
  for (const el of roots) {
    if (!el) continue;
    const attr = el.getAttribute("data-theme") || el.getAttribute("data-mode");
    if (el.classList.contains("dark") || attr === "dark") return "dark";
    if (el.classList.contains("light") || attr === "light") return "light";
  }
  const cs = document.documentElement.style.colorScheme;
  if (cs === "dark" || cs === "light") return cs;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useTheme() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const apply = () => setTheme(readTheme());
    apply();

    const opts = { attributes: true, attributeFilter: ["class", "data-theme", "data-mode", "style"] };
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, opts);
    if (document.body) mo.observe(document.body, opts);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);

    return () => {
      mo.disconnect();
      mq.removeEventListener("change", apply);
    };
  }, []);

  return theme;
}

/* ── Bell-state simulation ───────────────────────────────────────────────
   H ON:  |ψ⟩ = 1/√2(|00⟩ + |11⟩) → 50/50
   H OFF: |ψ⟩ = |00⟩               → 100/0                                */
function simulate(hOn) {
  if (hOn) return { p00: 50, p11: 50, state: "1/√2 (|00⟩ + |11⟩)", blochLabel: "|+⟩" };
  return { p00: 100, p11: 0, state: "|00⟩", blochLabel: "|0⟩" };
}

function BlochSphere({ superposed, c }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      role="img"
      aria-label={`Bloch sphere showing ${superposed ? "|+⟩" : "|0⟩"}`}
    >
      <circle cx="100" cy="100" r="78" fill={c.surface2} stroke={c.borderStrong} strokeWidth="1.5" />
      <ellipse cx="100" cy="100" rx="78" ry="22" fill="none" stroke={c.border} strokeWidth="1" strokeDasharray="3 4" />
      <line x1="100" y1="22" x2="100" y2="178" stroke={c.border} strokeWidth="1" />
      <line x1="22" y1="100" x2="178" y2="100" stroke={c.border} strokeWidth="1" />

      <text x="106" y="16" fill={c.muted} fontSize="11" fontFamily="monospace">|0⟩</text>
      <text x="106" y="196" fill={c.muted} fontSize="11" fontFamily="monospace">|1⟩</text>
      <text x="168" y="94" fill={c.muted} fontSize="11" fontFamily="monospace">|+⟩</text>

      {/* State vector: |0⟩ points up, rotates 90° to |+⟩ (+x axis) */}
      <g
        style={{
          transform: `rotate(${superposed ? 90 : 0}deg)`,
          transformOrigin: "100px 100px",
          transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <line x1="100" y1="100" x2="100" y2="32" stroke={c.accent} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="30" r="4.5" fill={c.accent} />
      </g>
      <circle cx="100" cy="100" r="3" fill={c.text} />
    </svg>
  );
}

export default function Hero() {
  const theme = useTheme();
  const C = THEMES[theme];
  const [hOn, setHOn] = useState(true);
  const [mounted, setMounted] = useState(false);
  const result = simulate(hOn);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reveal = (delay = "") =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${delay} ${
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`;

  return (
    <section
      id="hero"
      aria-label="QubitMinds introduction"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-16 transition-colors duration-300"
      style={{ background: mounted ? C.bg : "transparent", color: C.text }}
    >
      {/* Subtle grid, faded at the edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          opacity: C.gridOpacity,
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 100%)",
        }}
      />
      {/* Single soft accent wash */}
      <div
        className="absolute -top-56 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ background: C.accentSoft, filter: "blur(140px)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-14 xl:gap-24">
          {/* LEFT: Copy */}
          <div className={`flex-1 flex flex-col items-center lg:items-start text-center lg:text-left ${reveal()}`}>
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8"
              style={{ border: `1px solid ${C.border}`, background: C.surface, color: C.muted }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} aria-hidden="true" />
              Smart India Hackathon 2026 · Now in Beta
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-heading font-semibold tracking-tight leading-[1.06] mb-6">
              See quantum.{" "}
              <span style={{ color: C.accent }}>Build it.</span> Run it.
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-lg" style={{ color: C.muted }}>
              Drag gates, watch quantum states evolve in real time, simulate on 4 backends, and get AI guidance — no
              physics degree needed.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start mb-12">
              <Link
                href="/signup"
                id="hero-cta-primary"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-[15px] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: C.text, color: C.bg, outlineColor: C.accent }}
              >
                Start Learning Free
                <LuArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>

              <Link
                href="/playground"
                id="hero-cta-secondary"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-[15px] transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ border: `1px solid ${C.borderStrong}`, color: C.text, outlineColor: C.accent }}
              >
                <LuFlaskConical size={16} style={{ color: C.accent }} aria-hidden="true" />
                Try Circuit Builder
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start">
              <span className="text-xs font-medium uppercase tracking-widest" style={{ color: C.muted }}>
                Runs on
              </span>
              {["Qiskit Aer", "PennyLane", "Cirq", "qBraid"].map((tool, i) => (
                <span key={tool} className="flex items-center gap-5">
                  {i > 0 && <span className="w-px h-3" style={{ background: C.borderStrong }} aria-hidden="true" />}
                  <span className="font-mono text-xs font-medium" style={{ color: C.text }}>
                    {tool}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Live demo */}
          <div className={`flex-1 w-full max-w-xl lg:max-w-[540px] ${reveal("delay-200")}`}>
            <div
              className="rounded-2xl overflow-hidden transition-colors duration-300"
              style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.shadow }}
            >
              {/* Window chrome */}
              <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div className="flex gap-1.5" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: C.borderStrong }} />
                  ))}
                </div>
                <div className="flex-1 text-center text-xs font-mono" style={{ color: C.muted }}>
                  QubitMinds · Bell State
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                      style={{ background: C.accent }}
                    />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: C.accent }} />
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: C.accent }}>
                    live
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col gap-3">
                {/* Circuit */}
                <div
                  className="p-4 rounded-xl font-mono"
                  style={{ background: C.bg, border: `1px solid ${C.border}` }}
                  aria-label="Interactive quantum circuit diagram"
                >
                  <div className="flex flex-col gap-8">
                    {/* q0 */}
                    <div className="relative flex items-center gap-3 h-11">
                      <div className="absolute left-8 right-0 top-1/2 h-px" style={{ background: C.borderStrong }} aria-hidden="true" />
                      <span className="relative text-xs font-bold w-5" style={{ color: C.muted }}>q0</span>

                      <button
                        type="button"
                        onClick={() => setHOn((v) => !v)}
                        aria-pressed={hOn}
                        aria-label={`H gate — ${hOn ? "active (superposition)" : "inactive"}`}
                        className="relative w-11 h-11 rounded-lg text-sm font-bold cursor-pointer transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{
                          background: hOn ? C.accentSoft : C.surface2,
                          border: `1px solid ${hOn ? C.accent : C.borderStrong}`,
                          color: hOn ? C.accent : C.muted,
                          outlineColor: C.accent,
                        }}
                      >
                        H
                      </button>

                      {/* CNOT control + connector */}
                      <div className="relative w-11 h-11 flex items-center justify-center">
                        <div
                          className="absolute left-1/2 top-1/2 w-px h-[76px] -translate-x-1/2"
                          style={{ background: C.neutral, opacity: 0.6 }}
                          aria-hidden="true"
                        />
                        <div className="relative w-3.5 h-3.5 rounded-full" style={{ background: C.neutral }} />
                      </div>

                      <div className="flex-1" />
                      <div
                        className="relative w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.muted }}
                      >
                        M
                      </div>
                    </div>

                    {/* q1 */}
                    <div className="relative flex items-center gap-3 h-11">
                      <div className="absolute left-8 right-0 top-1/2 h-px" style={{ background: C.borderStrong }} aria-hidden="true" />
                      <span className="relative text-xs font-bold w-5" style={{ color: C.muted }}>q1</span>
                      <div className="w-11" />

                      {/* CNOT target */}
                      <div className="relative w-11 h-11 flex items-center justify-center">
                        <div
                          className="relative w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: C.bg, border: `1.5px solid ${C.neutral}` }}
                        >
                          <span className="absolute w-4 h-px" style={{ background: C.neutral }} />
                          <span className="absolute w-px h-4" style={{ background: C.neutral }} />
                        </div>
                      </div>

                      <div className="flex-1" />
                      <div
                        className="relative w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.muted }}
                      >
                        M
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-[10px] mt-5" style={{ color: C.muted }} aria-live="polite">
                    {hOn ? "H gate ON — Bell state (maximally entangled)" : "H gate OFF — deterministic |00⟩"}
                  </p>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Histogram */}
                  <div className="p-4 rounded-xl" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>
                      Probabilities
                    </div>
                    <div
                      className="flex items-end gap-3 h-14 mb-2 pb-px"
                      style={{ borderBottom: `1px solid ${C.borderStrong}` }}
                      role="img"
                      aria-label={`Probability histogram: |00⟩ ${result.p00}%, |11⟩ ${result.p11}%`}
                    >
                      {[
                        { v: result.p00, color: C.accent },
                        { v: result.p11, color: C.neutral },
                      ].map((b, i) => (
                        <div key={i} className="flex-1 relative h-full">
                          <div
                            className="w-full rounded-t absolute bottom-0 transition-all duration-700 ease-out motion-reduce:transition-none"
                            style={{ height: `${b.v}%`, background: b.color }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-around font-mono text-[10px] font-semibold tabular-nums">
                      <span style={{ color: C.accent }}>|00⟩ {result.p00}%</span>
                      <span style={{ color: C.neutral }}>|11⟩ {result.p11}%</span>
                    </div>
                  </div>

                  {/* Bloch sphere */}
                  <div
                    className="p-4 rounded-xl flex flex-col items-center"
                    style={{ background: C.bg, border: `1px solid ${C.border}` }}
                  >
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-widest mb-1 self-start" style={{ color: C.muted }}>
                      Bloch Sphere
                    </div>
                    <div className="w-full h-[84px]">
                      <BlochSphere superposed={hOn} c={C} />
                    </div>
                    <div className="font-mono text-[10px] mt-1" style={{ color: C.accent }}>
                      {result.blochLabel}
                    </div>
                  </div>
                </div>

                {/* State equation */}
                <div
                  className="px-4 py-2.5 rounded-xl flex items-center justify-between gap-3"
                  style={{ background: C.bg, border: `1px solid ${C.border}` }}
                >
                  <span className="text-[11px] font-mono" style={{ color: C.muted }}>|ψ⟩ =</span>
                  <span className="text-[11px] font-mono font-semibold" style={{ color: C.text }}>
                    {result.state}
                  </span>
                  <span className="text-[10px] font-mono shrink-0" style={{ color: C.muted }}>
                    Qiskit Aer
                  </span>
                </div>
              </div>
            </div>

            <p className="text-center text-xs mt-4" style={{ color: C.muted }}>
              Click the{" "}
              <span className="font-mono font-bold" style={{ color: C.accent }}>H</span>{" "}
              gate to toggle superposition
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}