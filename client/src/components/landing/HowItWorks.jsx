"use client";

import React, { useState } from "react";
import { LuBrain, LuBlocks, LuCpu, LuSparkles } from "react-icons/lu";

const STEPS = [
  {
    num: "01",
    icon: LuBrain,
    title: "Pick a concept",
    desc: "Choose from a structured curriculum — from superposition basics to Grover's algorithm — and start with an interactive visual explainer.",
  },
  {
    num: "02",
    icon: LuBlocks,
    title: "Build the circuit",
    desc: "Drag and drop quantum gates onto the canvas, or type code. Visual and code views stay perfectly in sync as you experiment.",
  },
  {
    num: "03",
    icon: LuCpu,
    title: "Run the simulation",
    desc: "Hit run. Qiskit Aer, PennyLane, Cirq or qBraid executes your circuit instantly — no queue, no cloud setup required.",
  },
  {
    num: "04",
    icon: LuSparkles,
    title: "Ask the AI tutor",
    desc: "The AI knows your circuit, current lesson and code. Ask anything — from concept explanations to bug fixes and optimizations.",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="py-24 sm:py-28 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            How it works
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
            Four steps from <span className="text-[var(--color-muted)]">zero to quantum.</span>
          </h2>
          <p className="mt-4 text-[15.5px] text-[var(--color-muted)] leading-relaxed">
            Every tool you need, woven into a single frictionless learning loop.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = active === i;
            return (
              <button
                key={step.num}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-selected={isActive}
                className={`group relative text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] ${
                  isActive
                    ? "border-[var(--color-primary)]/50 bg-[var(--color-surface)] shadow-[0_20px_45px_-25px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]/60 hover:border-[var(--color-primary)]/30"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[var(--color-primary)]/12 text-[var(--color-primary)]"
                        : "bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)]"
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <span
                    className={`font-mono text-[22px] font-bold transition-colors ${
                      isActive ? "text-[var(--color-primary)]/60" : "text-[var(--color-border)]"
                    }`}
                  >
                    {step.num}
                  </span>
                </div>

                <h3 className="text-[15.5px] font-semibold text-[var(--color-text)] mb-2">{step.title}</h3>
                <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">{step.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Connector line (desktop) */}
        <div className="hidden lg:flex items-center mt-8 px-2" aria-hidden="true">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                    active >= i
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-transparent"
                  }`}
                />
                <span className="text-[9.5px] font-mono uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  {step.title.split(" ")[0]}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-3 bg-[var(--color-border)] relative overflow-hidden -mt-5">
                  <div
                    className="absolute inset-0 bg-[var(--color-primary)] transition-all duration-500 origin-left"
                    style={{ transform: active > i ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
