"use client";

import React from "react";
import Link from "next/link";
import { LuPlay, LuBug, LuSparkles, LuMessageSquare, LuArrowRight } from "react-icons/lu";
import { useAuthModalStore } from "../../store/useAuthModalStore";

const GATES = ["H", "X", "Y", "Z", "S", "T", "CNOT"];

export default function InteractiveBuilder() {
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  return (
    <section id="playground" className="py-24 sm:py-28 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            Playground
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
            Build quantum circuits <span className="text-[var(--color-muted)]">without the complexity.</span>
          </h2>
          <p className="mt-4 text-[15.5px] text-[var(--color-muted)] leading-relaxed">
            A professional circuit editor with live code generation, instant simulation and an AI
            assistant that understands your work.
          </p>
        </div>

        {/* Workspace mock */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden shadow-[0_40px_90px_-45px_rgba(2,6,23,0.4)] flex flex-col lg:flex-row lg:h-[560px]">
          {/* LEFT: Gate library */}
          <div className="lg:w-[88px] border-b lg:border-b-0 lg:border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-row lg:flex-col items-center p-4 gap-3 overflow-x-auto lg:overflow-x-visible">
            <div className="hidden lg:block text-[9.5px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)] mb-1">
              Gates
            </div>
            {GATES.map((gate) => (
              <div
                key={gate}
                className="w-11 h-11 shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-center font-mono font-bold text-[13px] text-[var(--color-text)] cursor-grab hover:border-[var(--color-primary)]/60 hover:text-[var(--color-primary)] hover:-translate-y-0.5 transition-all duration-200"
              >
                {gate}
              </div>
            ))}
          </div>

          {/* CENTER: Circuit canvas + code */}
          <div className="flex-1 bg-[var(--color-background)] relative flex flex-col">
            <div className="px-6 py-4 flex justify-between items-center border-b border-[var(--color-border)]">
              <div className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Circuit editor
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10.5px] font-mono uppercase text-[var(--color-muted)]">Backend ready</span>
              </div>
            </div>

            <div className="flex-1 px-6 sm:px-8 py-8 bg-grid">
              <div className="relative flex flex-col gap-9 max-w-2xl">
                {/* Qubit 0 */}
                <div className="relative flex items-center gap-3">
                  <span className="text-[11px] font-mono font-semibold text-[var(--color-muted)] w-6">q0</span>
                  <div className="flex-1 relative h-px bg-[var(--color-border)]">
                    <div className="absolute inset-y-0 left-0 w-1/3 animate-wire-pulse bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-70" />
                  </div>
                  <span className="absolute left-[52px] w-11 h-11 rounded-xl border border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-mono font-bold text-[14px]">
                    H
                  </span>
                  <span className="absolute right-3 w-10 h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] flex items-center justify-center text-[11px] font-mono">
                    M
                  </span>
                </div>

                {/* Qubit 1 */}
                <div className="relative flex items-center gap-3">
                  <span className="text-[11px] font-mono font-semibold text-[var(--color-muted)] w-6">q1</span>
                  <div className="flex-1 relative h-px bg-[var(--color-border)]">
                    <div
                      className="absolute inset-y-0 left-0 w-1/3 animate-wire-pulse bg-gradient-to-r from-transparent via-[#818cf8] to-transparent opacity-70"
                      style={{ animationDelay: "0.9s" }}
                    />
                  </div>
                  <span className="absolute right-3 w-10 h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] flex items-center justify-center text-[11px] font-mono">
                    M
                  </span>
                </div>

                {/* CNOT connector */}
                <div className="absolute left-[52px] top-[22px] flex flex-col items-center" aria-hidden="true">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                  <span className="w-px h-[70px] bg-[var(--color-primary)]/60" />
                </div>
                <span className="absolute left-[52px] top-[86px] w-11 h-11 rounded-xl border border-[var(--color-primary)]/50 bg-[var(--color-background)] text-[var(--color-primary)] flex items-center justify-center">
                  <span className="relative w-4 h-4">
                    <span className="absolute top-1/2 left-0 w-full h-px bg-current" />
                    <span className="absolute left-1/2 top-0 h-full w-px bg-current" />
                  </span>
                </span>
              </div>
            </div>

            {/* Code editor */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="rounded-xl border border-zinc-800 bg-[#0b0f14] p-4 font-mono text-[12.5px]">
                <div className="flex gap-4">
                  <div className="flex flex-col text-right text-zinc-600 select-none">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                  <div className="flex flex-col text-zinc-300">
                    <div>
                      <span className="text-fuchsia-400">from</span> qiskit <span className="text-fuchsia-400">import</span>{" "}
                      <span className="text-sky-300">QuantumCircuit</span>
                    </div>
                    <div>&nbsp;</div>
                    <div>
                      <span className="text-teal-300">qc</span> <span className="text-fuchsia-400">=</span>{" "}
                      <span className="text-sky-300">QuantumCircuit</span>(<span className="text-amber-300">2</span>)
                    </div>
                    <div>
                      <span className="text-teal-300">qc</span>.<span className="text-emerald-300">h</span>(
                      <span className="text-amber-300">0</span>)
                    </div>
                    <div>
                      <span className="text-teal-300">qc</span>.<span className="text-emerald-300">cx</span>(
                      <span className="text-amber-300">0</span>, <span className="text-amber-300">1</span>)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: AI assistant */}
          <div className="w-full lg:w-[300px] border-t lg:border-t-0 lg:border-l border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
              <LuSparkles size={14} className="text-[var(--color-primary)]" />
              <span className="text-[12.5px] font-semibold text-[var(--color-text)]">AI assistant</span>
            </div>

            <div className="p-5 flex-1 flex flex-col gap-4">
              <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/6 p-4">
                <p className="text-[12.5px] leading-relaxed text-[var(--color-text)]">
                  Your circuit creates a <strong className="text-[var(--color-primary)]">Bell state</strong> —
                  maximally entangled qubits. Measuring them will yield perfectly correlated results.
                </p>
              </div>

              <div className="mt-auto space-y-2">
                {[
                  { icon: LuMessageSquare, label: "Explain code", shortcut: "⌘E" },
                  { icon: LuBug, label: "Debug circuit", shortcut: "⌘D" },
                  { icon: LuSparkles, label: "Optimize", shortcut: "⌘O" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[12.5px] text-[var(--color-text)] hover:border-[var(--color-primary)]/50 transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={14} className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                        {action.label}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--color-muted)] border border-[var(--color-border)] px-1.5 rounded">
                        {action.shortcut}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => openAuthModal("signup")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 transition-all cursor-pointer"
              >
                <LuPlay size={14} fill="currentColor" /> Try it live
              </button>
            </div>
          </div>
        </div>

        {/* Bottom link */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-[13.5px] text-[var(--color-muted)]">
            Everything runs in your browser — no installs, no cloud credentials.
          </p>
          <Link
            href="/playground"
            className="group inline-flex items-center gap-2 text-[13.5px] font-semibold text-[var(--color-primary)] hover:gap-3 transition-all"
          >
            Open full playground
            <LuArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
