"use client";

import React, { useState } from "react";
import {
  LuBrain, LuBlocks, LuLayers, LuSparkles, LuClock,
} from "react-icons/lu";

const LEVELS = [
  {
    num: "01",
    tag: "Foundations",
    title: "Quantum mechanics & qubit principles",
    desc: "Master superposition, state vector rotations and entanglement through visual Bloch sphere intuition before tackling matrix algebra.",
    icon: LuBrain,
    time: "2 h",
    topics: ["Qubit superposition", "Statevectors", "Entanglement", "Bloch spheres"],
  },
  {
    num: "02",
    tag: "Gates & operations",
    title: "Quantum gate primitives",
    desc: "Construct single and multi-qubit transformations using Hadamard, Pauli X/Y/Z, phase (S/T) and CNOT entangling gates.",
    icon: LuBlocks,
    time: "3.5 h",
    topics: ["Hadamard gate", "Pauli matrices", "CNOT & SWAP", "Phase interference"],
  },
  {
    num: "03",
    tag: "Circuit synthesis",
    title: "Multi-qubit circuit engineering",
    desc: "Build complex quantum circuits, generate Bell states, implement quantum teleportation and observe phase kickback in action.",
    icon: LuLayers,
    time: "4.5 h",
    topics: ["Bell states", "Teleportation", "Phase kickback", "Quantum Fourier transform"],
  },
  {
    num: "04",
    tag: "Algorithms & mastery",
    title: "Quantum algorithms & hardware execution",
    desc: "Implement Grover's search, Deutsch-Jozsa, QAOA and VQE, and transpile circuits to Qiskit and Cirq backends.",
    icon: LuSparkles,
    time: "6 h",
    topics: ["Grover's algorithm", "Deutsch-Jozsa", "QAOA & VQE", "Qiskit / Cirq transpilation"],
  },
];

export default function LearningPath() {
  const [active, setActive] = useState(0);

  return (
    <section id="learn" className="py-24 sm:py-28 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            Curriculum
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
            A structured pathway{" "}
            <span className="text-[var(--color-muted)]">from qubit zero to quantum engineer.</span>
          </h2>
          <p className="mt-4 text-[15.5px] text-[var(--color-muted)] leading-relaxed">
            Follow a step-by-step curriculum engineered to build deep intuition, hands-on circuit
            synthesis and algorithmic proficiency.
          </p>
        </div>

        {/* Levels */}
        <div className="grid lg:grid-cols-2 gap-5">
          {LEVELS.map((level, idx) => {
            const Icon = level.icon;
            const isActive = active === idx;
            return (
              <button
                key={level.num}
                onClick={() => setActive(idx)}
                onMouseEnter={() => setActive(idx)}
                className={`group text-left rounded-2xl border p-6 sm:p-7 transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] ${
                  isActive
                    ? "border-[var(--color-primary)]/50 bg-[var(--color-surface)] shadow-[0_24px_55px_-30px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]/60 hover:border-[var(--color-primary)]/30"
                }`}
              >
                {/* Meta row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-[var(--color-primary)]/12 text-[var(--color-primary)]"
                          : "bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)]"
                      }`}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <span className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Level {level.num} · {level.tag}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11.5px] font-mono text-[var(--color-muted)]">
                    <LuClock size={12} /> {level.time}
                  </span>
                </div>

                {/* Title & desc */}
                <h3 className="text-[17px] sm:text-lg font-semibold text-[var(--color-text)] leading-snug mb-2.5">
                  {level.title}
                </h3>
                <p className="text-[13.5px] text-[var(--color-muted)] leading-relaxed mb-5">{level.desc}</p>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--color-border)]">
                  {level.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[11px] font-mono text-[var(--color-muted)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
