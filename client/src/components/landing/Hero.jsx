"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LuArrowRight, LuFlaskConical, LuSparkles, LuPlay, LuGithub,
} from "react-icons/lu";
import { useAuthModalStore } from "../../store/useAuthModalStore";

/* ── Circuit composer preview (mock) ──────────────────────────────────── */
function CircuitPreview() {
  return (
    <div className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[0_40px_90px_-40px_rgba(2,6,23,0.45)]">
      {/* Window chrome */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="text-[11px] font-mono text-[var(--color-muted)] mx-auto truncate">
          composer · bell-state.qasm
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10.5px] font-mono text-emerald-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Qiskit Aer
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_240px]">
        {/* Circuit canvas */}
        <div className="p-6 sm:p-8 bg-grid relative">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Circuit
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-[var(--color-primary)]">
              <LuPlay size={10} fill="currentColor" /> 1024 shots
            </span>
          </div>

          <div className="relative space-y-9">
            {/* Qubit 0 wire */}
            <div className="relative flex items-center gap-3">
              <span className="w-6 text-[11px] font-mono text-[var(--color-muted)]">q0</span>
              <div className="flex-1 relative h-px bg-[var(--color-border)]">
                <div className="absolute inset-y-0 left-0 w-1/3 animate-wire-pulse bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-70" />
              </div>
              <span className="absolute left-[76px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-[13px] font-mono font-bold">
                H
              </span>
              <span className="absolute right-14 w-9 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted)] flex items-center justify-center text-[11px] font-mono">
                M
              </span>
            </div>

            {/* Qubit 1 wire */}
            <div className="relative flex items-center gap-3">
              <span className="w-6 text-[11px] font-mono text-[var(--color-muted)]">q1</span>
              <div className="flex-1 relative h-px bg-[var(--color-border)]">
                <div
                  className="absolute inset-y-0 left-0 w-1/3 animate-wire-pulse bg-gradient-to-r from-transparent via-[#818cf8] to-transparent opacity-70"
                  style={{ animationDelay: "0.9s" }}
                />
              </div>
              <span className="absolute right-14 w-9 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted)] flex items-center justify-center text-[11px] font-mono">
                M
              </span>
            </div>

            {/* CNOT connector */}
            <div className="absolute left-[76px] top-[18px] flex flex-col items-center" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
              <span className="w-px h-[64px] bg-[var(--color-primary)]/60" />
            </div>
            <span className="absolute left-[76px] top-[86px] w-10 h-10 rounded-lg border border-[var(--color-primary)]/40 bg-[var(--color-background)] text-[var(--color-primary)] flex items-center justify-center">
              <span className="relative w-4 h-4">
                <span className="absolute top-1/2 left-0 w-full h-px bg-current" />
                <span className="absolute left-1/2 top-0 h-full w-px bg-current" />
              </span>
            </span>
          </div>
        </div>

        {/* Results panel */}
        <div className="hidden lg:flex flex-col border-l border-[var(--color-border)] bg-[var(--color-background)] p-5 gap-5">
          <div>
            <div className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-4">
              Probabilities
            </div>
            <div className="space-y-3.5">
              {[
                { state: "|00⟩", pct: 49, tone: "var(--color-primary)" },
                { state: "|01⟩", pct: 1, tone: "var(--color-border)" },
                { state: "|10⟩", pct: 1, tone: "var(--color-border)" },
                { state: "|11⟩", pct: 49, tone: "var(--color-accent)" },
              ].map((row) => (
                <div key={row.state}>
                  <div className="flex justify-between text-[10.5px] font-mono mb-1.5">
                    <span className="text-[var(--color-text)]">{row.state}</span>
                    <span className="text-[var(--color-muted)]">{row.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--color-border)]/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(row.pct, 2)}%`, background: row.tone }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <LuSparkles size={12} className="text-[var(--color-primary)]" />
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                AI insight
              </span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-[var(--color-muted)]">
              Perfectly correlated outcomes — you&apos;ve built a maximally entangled Bell state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
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
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* Backdrop: glows */}
      <div
        className="pointer-events-none absolute -top-56 left-1/2 -translate-x-1/2 w-[820px] h-[520px] rounded-full blur-[140px]"
        style={{ background: "color-mix(in srgb, var(--color-primary) 16%, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 -right-40 w-[420px] h-[420px] rounded-full blur-[130px] opacity-70"
        style={{ background: "color-mix(in srgb, var(--color-accent) 12%, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Copy */}
        <div className="max-w-3xl mx-auto text-center">
          <div className={reveal()}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[12px] font-medium text-[var(--color-muted)] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              AI-powered quantum learning platform
            </div>
          </div>

          <h1
            className={`mt-6 text-4xl sm:text-6xl font-heading font-bold tracking-tight leading-[1.08] text-[var(--color-text)] ${reveal("delay-75")}`}
          >
            The intelligent way to learn{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]">
              quantum computing
            </span>
          </h1>

          <p className={`mt-6 text-base sm:text-lg text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto ${reveal("delay-150")}`}>
            Build circuits visually, run them across Qiskit, PennyLane, Cirq and qBraid, and learn
            with a context-aware AI tutor — all in one clean workspace.
          </p>

          <div className={`mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 ${reveal("delay-200")}`}>
            <button
              onClick={() => openAuthModal("signup")}
              id="hero-cta-primary"
              className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-[15px] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-[0_14px_35px_-12px_color-mix(in_srgb,var(--color-primary)_70%,transparent)] hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Start learning free
              <LuArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </button>

            <Link
              href="/playground"
              id="hero-cta-secondary"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-[15px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <LuFlaskConical size={17} className="text-[var(--color-primary)]" />
              Open the playground
            </Link>
          </div>

          <div className={`mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 ${reveal("delay-300")}`}>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Simulates on
            </span>
            {["Qiskit Aer", "PennyLane", "Cirq", "qBraid"].map((tool, i) => (
              <span key={tool} className="flex items-center gap-5">
                {i > 0 && <span className="w-px h-3.5 bg-[var(--color-border)]" aria-hidden="true" />}
                <span className="text-[12.5px] font-mono font-medium text-[var(--color-muted)]">{tool}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Product preview */}
        <div className={`mt-16 sm:mt-20 max-w-5xl mx-auto ${reveal("delay-300")}`}>
          <CircuitPreview />
        </div>
      </div>
    </section>
  );
}
