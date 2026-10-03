"use client";

import React from "react";
import { LuBrain, LuLayers, LuZap, LuArrowRight } from "react-icons/lu";
import { useAuthModalStore } from "../../store/useAuthModalStore";

const PILLARS = [
  {
    icon: LuBrain,
    title: "Abstract made intuitive",
    desc: "Superposition, phase and entanglement explained through interactive visual models — not static formulas. Build intuition first, math second.",
    tag: "Learn",
  },
  {
    icon: LuLayers,
    title: "One integrated workspace",
    desc: "Lessons, circuit canvas, code editor, simulation and AI tutor live side by side. No tab-switching, no broken learning momentum.",
    tag: "Build",
  },
  {
    icon: LuZap,
    title: "Zero-latency simulation",
    desc: "Run circuits instantly on web-accelerated engines. No hardware queues, no cloud setup — iterate on ideas at the speed of thought.",
    tag: "Run",
  },
];

export default function ProblemSolution() {
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  return (
    <section className="py-24 sm:py-28 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            Why QubitMinds
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
            Quantum education,{" "}
            <span className="text-[var(--color-muted)]">without the friction.</span>
          </h2>
          <p className="mt-4 text-[15.5px] text-[var(--color-muted)] leading-relaxed">
            Traditional material separates theory from practice. QubitMinds closes the loop —
            concept, circuit, simulation and feedback in a single flow.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all duration-300 hover:border-[var(--color-primary)]/40 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_color-mix(in_srgb,var(--color-primary)_45%,transparent)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-center text-[var(--color-primary)]">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {p.tag}
                  </span>
                </div>
                <h3 className="text-[17px] font-semibold text-[var(--color-text)] mb-2.5">{p.title}</h3>
                <p className="text-[13.5px] text-[var(--color-muted)] leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Inline CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between p-6 sm:p-7 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="text-[14.5px] text-[var(--color-muted)]">
            <span className="font-semibold text-[var(--color-text)]">Five-stage learning pipeline</span> —
            from concept to algorithm execution, designed end-to-end.
          </p>
          <button
            onClick={() => openAuthModal("signup")}
            className="group inline-flex items-center gap-2 text-[13.5px] font-semibold text-[var(--color-primary)] hover:gap-3 transition-all cursor-pointer shrink-0"
          >
            Start the pathway
            <LuArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
