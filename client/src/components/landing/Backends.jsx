"use client";

import React, { useState } from "react";
import { LuZap, LuBrainCircuit, LuAtom, LuNetwork } from "react-icons/lu";

const BACKENDS = [
  {
    name: "Qiskit Aer",
    tag: "IBM · Python",
    icon: LuAtom,
    color: "from-indigo-500 to-purple-600",
    accentHex: "#6366f1",
    borderHex: "#6366f120",
    strength: "Industry-standard statevector + shot-based simulation with full noise modeling.",
    badges: ["Statevector", "Shot-based", "Noise model", "QASM 3"],
    detail: "Used by researchers and industry teams worldwide. Supports advanced noise models, density matrix simulation, and full Qiskit ecosystem integration.",
  },
  {
    name: "PennyLane",
    tag: "Xanadu · Python",
    icon: LuBrainCircuit,
    color: "from-cyan-500 to-teal-600",
    accentHex: "#22d3ee",
    borderHex: "#22d3ee20",
    strength: "Best for hybrid quantum-classical ML and differentiable quantum computing.",
    badges: ["Gradient-based", "ML/QML", "Auto-diff", "Hybrid"],
    detail: "Enables quantum machine learning workflows with automatic differentiation. Perfect for VQE, QAOA, and quantum neural network experiments.",
  },
  {
    name: "Cirq",
    tag: "Google · Python",
    icon: LuNetwork,
    color: "from-rose-500 to-pink-600",
    accentHex: "#f43f5e",
    borderHex: "#f43f5e20",
    strength: "Google's framework for NISQ algorithms with native hardware-aware circuit compilation.",
    badges: ["NISQ", "Hardware-aware", "Gate fidelity", "Sycamore"],
    detail: "Designed for near-term quantum hardware. Cirq circuits map directly to Google Sycamore architecture with fine-grained gate decomposition control.",
  },
  {
    name: "qBraid",
    tag: "qBraid · Cloud",
    icon: LuZap,
    color: "from-amber-500 to-orange-600",
    accentHex: "#f59e0b",
    borderHex: "#f59e0b20",
    strength: "Unified cloud platform — run on multiple real quantum processors with one API.",
    badges: ["Multi-hardware", "Cloud", "IonQ", "Rigetti"],
    detail: "qBraid bridges multiple hardware providers. Run the same circuit on IonQ, Rigetti, or Oxford Quantum Computing backends through a single unified interface.",
  },
];

export default function Backends() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="backends" className="py-28 bg-[var(--color-background)] relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px section-divider" />

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[var(--color-primary)]/6 blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 text-[var(--color-primary)] text-xs font-semibold tracking-wider mb-5">
            SIMULATION BACKENDS
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-5 tracking-tight">
            One circuit.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)]">
              Four world-class simulators.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
            Build once, run anywhere. Switch between backends with a single click — no config files, no installs.
          </p>
        </div>

        {/* Backend cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BACKENDS.map((b, i) => {
            const Icon = b.icon;
            const isHovered = hovered === i;
            return (
              <div
                key={b.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group relative rounded-3xl border p-6 flex flex-col gap-4 cursor-default transition-all duration-400"
                style={{
                  borderColor: isHovered ? b.accentHex : "var(--color-border)",
                  background: isHovered ? `${b.accentHex}08` : "var(--color-surface)",
                  boxShadow: isHovered ? `0 0 40px ${b.accentHex}20, 0 20px 40px rgba(0,0,0,0.2)` : "none",
                  transform: isHovered ? "translateY(-4px)" : "none",
                }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={26} aria-hidden="true" />
                </div>

                {/* Name & tag */}
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-1">{b.name}</h3>
                  <span className="text-[10px] font-mono text-[var(--color-muted)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">{b.tag}</span>
                </div>

                {/* Strength */}
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{b.strength}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {b.badges.map(badge => (
                    <span
                      key={badge}
                      className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border transition-all duration-300"
                      style={{
                        borderColor: isHovered ? `${b.accentHex}40` : "var(--color-border)",
                        color: isHovered ? b.accentHex : "var(--color-muted)",
                        background: isHovered ? `${b.accentHex}10` : "transparent",
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Expanded detail on hover */}
                <div className={`overflow-hidden transition-all duration-400 ${isHovered ? "max-h-24 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                  <div className="pt-3 border-t border-[var(--color-border)]/50">
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">{b.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--color-muted)] mb-4">
            All backends available instantly — no IBM Quantum account or cloud credentials needed for simulation.
          </p>
          <a href="/playground"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-primary)]/40 text-[var(--color-primary)] font-semibold text-sm hover:bg-[var(--color-primary)]/8 hover:border-[var(--color-primary)]/60 transition-all">
            Open the Quantum Playground →
          </a>
        </div>
      </div>
    </section>
  );
}
