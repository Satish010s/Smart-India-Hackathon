"use client";

import React from "react";
import Link from "next/link";
import { LuZap, LuBrainCircuit, LuAtom, LuNetwork } from "react-icons/lu";

const BACKENDS = [
  {
    name: "Qiskit Aer",
    tag: "IBM · Python",
    icon: LuAtom,
    strength: "Industry-standard statevector and shot-based simulation with full noise modeling.",
    badges: ["Statevector", "Shot-based", "Noise model"],
  },
  {
    name: "PennyLane",
    tag: "Xanadu · Python",
    icon: LuBrainCircuit,
    strength: "Hybrid quantum-classical machine learning with differentiable circuits.",
    badges: ["Gradients", "ML / QML", "Auto-diff"],
  },
  {
    name: "Cirq",
    tag: "Google · Python",
    icon: LuNetwork,
    strength: "NISQ algorithms with hardware-aware circuit compilation and gate fidelity control.",
    badges: ["NISQ", "Hardware-aware", "Sycamore"],
  },
  {
    name: "qBraid",
    tag: "qBraid · Cloud",
    icon: LuZap,
    strength: "Unified cloud access to multiple real quantum processors with one API.",
    badges: ["Multi-hardware", "Cloud", "IonQ / Rigetti"],
  },
];

export default function Backends() {
  return (
    <section id="backends" className="py-24 sm:py-28 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            Simulation backends
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
            One circuit.{" "}
            <span className="text-[var(--color-muted)]">Four world-class simulators.</span>
          </h2>
          <p className="mt-4 text-[15.5px] text-[var(--color-muted)] leading-relaxed">
            Build once, run anywhere. Switch between backends with a single click — no config
            files, no installs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BACKENDS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.name}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-[var(--color-primary)]/40 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_color-mix(in_srgb,var(--color-primary)_45%,transparent)]"
              >
                <div className="w-11 h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary)]">
                  <Icon size={20} aria-hidden="true" />
                </div>

                <div>
                  <h3 className="text-[15.5px] font-semibold text-[var(--color-text)] mb-1.5">{b.name}</h3>
                  <span className="text-[10.5px] font-mono text-[var(--color-muted)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                    {b.tag}
                  </span>
                </div>

                <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">{b.strength}</p>

                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {b.badges.map((badge) => (
                    <span
                      key={badge}
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] group-hover:border-[var(--color-primary)]/30 group-hover:text-[var(--color-primary)] transition-colors"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]">
          <p className="text-[13.5px] text-[var(--color-muted)]">
            All backends available instantly — no IBM Quantum account or cloud credentials needed
            for simulation.
          </p>
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-primary)]/40 text-[var(--color-primary)] font-semibold text-[13.5px] hover:bg-[var(--color-primary)]/8 transition-all shrink-0"
          >
            Open the playground →
          </Link>
        </div>
      </div>
    </section>
  );
}
