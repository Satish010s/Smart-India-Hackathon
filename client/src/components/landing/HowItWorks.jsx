"use client";

import React, { useEffect, useRef, useState } from "react";
import { LuBrain, LuBlocks, LuCpu, LuSparkles } from "react-icons/lu";

const STEPS = [
  {
    num: "01", icon: LuBrain, color: "from-[#d64a17] to-[#d64a17]", accentHex: "#d64a17",
    title: "Pick a Concept", desc: "Choose from our structured curriculum — from superposition basics to Grover's algorithm — and start with an interactive visual explainer.",
  },
  {
    num: "02", icon: LuBlocks, color: "from-[#e7b46a] to-[#e7b46a]", accentHex: "#e7b46a",
    title: "Build the Circuit", desc: "Drag and drop quantum gates onto the canvas, or type code. Visual and code views stay perfectly in sync as you experiment.",
  },
  {
    num: "03", icon: LuCpu, color: "from-[#dee64c] to-[#d64a17]", accentHex: "#dee64c",
    title: "Run the Simulation", desc: "Hit Run. Qiskit Aer, PennyLane, Cirq, or qBraid executes your circuit instantly — no queue, no cloud setup required.",
  },
  {
    num: "04", icon: LuSparkles, color: "from-[#d64a17] to-[#d64a17]", accentHex: "#d64a17",
    title: "Ask the AI Tutor", desc: "Got a question? The AI knows your circuit, your current lesson, and your code. Ask it anything — from concept explanations to bug fixes.",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance steps
  useEffect(() => {
    const t = setInterval(() => setActiveStep(v => (v + 1) % STEPS.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-28 bg-[var(--color-background)] relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px section-divider" />

      {/* Faint orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[var(--color-primary)]/6 blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/8 text-[var(--color-secondary)] text-xs font-semibold tracking-wider mb-5">
            HOW IT WORKS
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-5 tracking-tight">
            Four steps from{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]">
              zero to quantum.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
            Every tool you need, woven into a single frictionless learning loop.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(i)}
                aria-selected={isActive}
                className={`group relative text-left p-6 rounded-3xl border transition-all duration-500 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] ${
                  isActive
                    ? "border-transparent shadow-2xl scale-[1.02] bg-[var(--color-surface)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-border)]/80 bg-[var(--color-surface)]/60"
                } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  transitionDelay: `${i * 100}ms`,
                  boxShadow: isActive ? `0 0 0 1px ${step.accentHex}60, 0 25px 50px ${step.accentHex}20` : undefined,
                }}
              >
                {/* Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <span className="font-mono text-4xl font-black opacity-20" style={{ color: step.accentHex }}>{step.num}</span>
                </div>

                <h3 className="text-lg font-bold mb-2 text-[var(--color-text)]">{step.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{step.desc}</p>

                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent" />
                )}
              </button>
            );
          })}
        </div>

        {/* Connector visualization */}
        <div className={`hidden lg:flex items-center justify-center gap-0 transition-all duration-700 delay-300 ${visible ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.num}>
              <div className={`flex flex-col items-center transition-all duration-300 ${activeStep === i ? "scale-110" : ""}`}>
                <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-500"
                  style={{
                    borderColor: activeStep === i ? step.accentHex : "var(--color-border)",
                    color: activeStep === i ? step.accentHex : "var(--color-muted)",
                    background: activeStep === i ? `${step.accentHex}15` : "transparent",
                    boxShadow: activeStep === i ? `0 0 20px ${step.accentHex}30` : "none",
                  }}>
                  {step.num}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-4 bg-gradient-to-r from-[var(--color-border)] to-[var(--color-border)] relative overflow-hidden">
                  {activeStep > i && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-700" />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
