"use client";

import React from "react";
import Link from "next/link";
import {
  LuTarget, LuArrowRight, LuUserCheck, LuCode, LuGraduationCap, LuTrendingUp,
} from "react-icons/lu";

const CHALLENGES = [
  { title: "Create a Bell state", diff: "Beginner", time: "15 min", score: "+100" },
  { title: "Quantum teleportation circuit", diff: "Intermediate", time: "45 min", score: "+250" },
  { title: "Implement Grover's algorithm", diff: "Advanced", time: "2 hrs", score: "+500" },
];

const DIFF_STYLES = {
  Beginner: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Advanced: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const PROGRESS = [
  { n: "Quantum fundamentals", p: 92 },
  { n: "Quantum gates", p: 86 },
  { n: "Entanglement", p: 48 },
  { n: "Algorithms", p: 21 },
];

const AUDIENCE = [
  {
    icon: LuGraduationCap,
    title: "Students",
    desc: "Build strong quantum fundamentals through guided learning and AI assistance.",
  },
  {
    icon: LuCode,
    title: "Advanced learners",
    desc: "Design experiments, compare backends, simulate circuits and export to industry frameworks.",
  },
  {
    icon: LuUserCheck,
    title: "Instructors",
    desc: "Create courses, assign challenges and monitor learner progress through analytics.",
  },
];

export default function ChallengesAndEcosystem() {
  return (
    <div className="w-full">
      {/* Challenges */}
      <section className="py-24 sm:py-28 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
                <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                Challenges
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
                Don&apos;t just learn. <span className="text-[var(--color-muted)]">Build.</span>
              </h2>
              <p className="mt-4 text-[15.5px] text-[var(--color-muted)] leading-relaxed">
                Test your knowledge with hands-on coding and circuit challenges, graded
                automatically with XP rewards.
              </p>
            </div>
            <Link
              href="/challenges"
              className="hidden md:inline-flex items-center gap-2 text-[13.5px] font-semibold text-[var(--color-primary)] hover:gap-3 transition-all shrink-0"
            >
              Explore all challenges <LuArrowRight size={15} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {CHALLENGES.map((c) => (
              <Link
                key={c.title}
                href="/challenges"
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 hover:border-[var(--color-primary)]/40 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_color-mix(in_srgb,var(--color-primary)_45%,transparent)] transition-all duration-300"
              >
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold mb-5 ${DIFF_STYLES[c.diff]}`}>
                  <LuTarget size={11} /> {c.diff}
                </div>
                <h3 className="text-[16.5px] font-semibold text-[var(--color-text)] mb-4 group-hover:text-[var(--color-primary)] transition-colors">
                  {c.title}
                </h3>
                <div className="flex items-center justify-between text-[12.5px] text-[var(--color-muted)] pb-4 border-b border-[var(--color-border)] mb-4">
                  <span>Est. {c.time}</span>
                  <span className="font-mono font-semibold text-[var(--color-primary)]">{c.score} XP</span>
                </div>
                <div className="text-[13px] font-semibold text-[var(--color-primary)] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Start challenge <LuArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Adaptive learning */}
      <section className="py-24 sm:py-28 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
          {/* Progress panel */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <h3 className="text-[15px] font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
              <LuUserCheck size={17} className="text-[var(--color-primary)]" /> Your progress
            </h3>

            <div className="space-y-5">
              {PROGRESS.map((item) => (
                <div key={item.n}>
                  <div className="flex justify-between text-[13px] mb-2">
                    <span className="font-medium text-[var(--color-text)]">{item.n}</span>
                    <span className="text-[var(--color-muted)] font-mono text-[12px]">{item.p}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--color-background)] rounded-full overflow-hidden border border-[var(--color-border)]/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-all duration-700"
                      style={{ width: `${item.p}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 p-4 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/6">
              <div className="flex items-start gap-2.5">
                <LuTrendingUp size={15} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                <p className="text-[13px] text-[var(--color-text)] leading-relaxed">
                  You&apos;re strong in single-qubit operations. Practice Bell states before moving
                  to Grover&apos;s algorithm.
                </p>
              </div>
              <button className="mt-3.5 w-full py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                Continue recommended path
              </button>
            </div>
          </div>

          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
              <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
              Adaptive learning
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight mb-5">
              Your learning path <span className="text-[var(--color-muted)]">adapts to you.</span>
            </h2>
            <p className="text-[15.5px] text-[var(--color-muted)] leading-relaxed mb-9">
              The platform analyzes your performance, identifies knowledge gaps and dynamically
              adjusts your curriculum to ensure true comprehension.
            </p>

            <h3 className="text-[15px] font-semibold text-[var(--color-text)] mb-3">
              Learn across the ecosystem
            </h3>
            <p className="text-[14px] text-[var(--color-muted)] mb-5">
              Build once, explore across multiple quantum frameworks natively.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["Qiskit", "PennyLane", "Cirq", "qBraid"].map((fw) => (
                <span
                  key={fw}
                  className="px-3.5 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[13px] font-mono font-medium text-[var(--color-text)]"
                >
                  {fw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-24 sm:py-28 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
              <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
              Built for everyone
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
              One workspace, <span className="text-[var(--color-muted)]">every level.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {AUDIENCE.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.title}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-7 hover:border-[var(--color-primary)]/40 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-5">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[var(--color-text)] mb-2">{a.title}</h3>
                  <p className="text-[13.5px] text-[var(--color-muted)] leading-relaxed">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
