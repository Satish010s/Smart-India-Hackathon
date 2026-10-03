"use client";

import React from "react";
import Link from "next/link";
import {
  LuUserCheck, LuTrendingUp, LuBookOpen, LuArrowRight,
  LuAward, LuUsers, LuChartBar, LuBrainCircuit,
} from "react-icons/lu";
import { useAuthModalStore } from "../../store/useAuthModalStore";

const HEATMAP_DATA = [
  { topic: "Superposition", vals: [90, 85, 78, 60, 45] },
  { topic: "Gates & ops", vals: [70, 80, 65, 72, 55] },
  { topic: "Entanglement", vals: [40, 55, 48, 38, 30] },
  { topic: "QFT", vals: [20, 30, 25, 18, 22] },
  { topic: "Grover's algo", vals: [15, 20, 28, 12, 10] },
];

function heatStyle(v) {
  const alpha = Math.max(0.08, v / 100);
  return {
    background: `color-mix(in srgb, var(--color-primary) ${Math.round(alpha * 100)}%, var(--color-background))`,
  };
}

const FEATURES = [
  { icon: LuChartBar, text: "Live per-student progress and performance dashboards" },
  { icon: LuUsers, text: "Assign courses, set deadlines and grade challenges" },
  { icon: LuBrainCircuit, text: "Weak-topic heatmaps to spot struggling concepts instantly" },
  { icon: LuAward, text: "Gamification engine — track streaks, XP and badges" },
];

export default function ForInstructors() {
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  return (
    <section id="instructors" className="py-24 sm:py-28 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
              <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
              For instructors
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight mb-5">
              Run your quantum class.{" "}
              <span className="text-[var(--color-muted)]">Track every learner.</span>
            </h2>

            <p className="text-[15.5px] text-[var(--color-muted)] leading-relaxed mb-9">
              A full teaching studio — course creation, assignment management and per-student
              analytics, all in one place.
            </p>

            <ul className="space-y-4 mb-10" role="list">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-[var(--color-primary)]" aria-hidden="true" />
                    </div>
                    <span className="text-[14px] text-[var(--color-text)] leading-relaxed pt-1.5">{f.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openAuthModal("signup")}
                id="instructor-cta"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[14px] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer"
              >
                Request instructor access
                <LuArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
              <Link
                href="#faq"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] font-semibold text-[14px] hover:border-[var(--color-primary)]/40 transition-all"
              >
                Read the FAQ
              </Link>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[0_35px_80px_-45px_rgba(2,6,23,0.4)]">
            {/* Chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-background)]">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <span className="text-[11px] font-mono text-[var(--color-muted)] mx-auto truncate">
                Instructor dashboard · CS 4810 Quantum Computing
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Students", value: "32", icon: LuUsers },
                  { label: "Avg progress", value: "68%", icon: LuTrendingUp },
                  { label: "Assignments", value: "8/12", icon: LuBookOpen },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-center">
                      <Icon size={15} className="text-[var(--color-primary)] mx-auto mb-1.5" aria-hidden="true" />
                      <div className="text-[17px] font-bold font-mono text-[var(--color-text)]">{stat.value}</div>
                      <div className="text-[10.5px] text-[var(--color-muted)]">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Heatmap */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                <div className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-3.5 flex items-center gap-2">
                  <LuChartBar size={13} aria-hidden="true" /> Topic mastery heatmap
                </div>
                <div className="space-y-2" role="table" aria-label="Topic mastery heatmap">
                  {HEATMAP_DATA.map((row) => (
                    <div key={row.topic} className="flex items-center gap-3" role="row">
                      <span className="text-[11px] text-[var(--color-muted)] w-28 shrink-0 truncate" role="rowheader">
                        {row.topic}
                      </span>
                      <div className="flex gap-1 flex-1" role="group">
                        {row.vals.map((v, i) => (
                          <div
                            key={i}
                            className="flex-1 h-5 rounded border border-[var(--color-border)]/40"
                            style={heatStyle(v)}
                            title={`Student ${i + 1}: ${v}%`}
                            role="cell"
                            aria-label={`${v}% mastery`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-[var(--color-muted)] w-8 text-right">
                        {Math.round(row.vals.reduce((a, b) => a + b, 0) / row.vals.length)}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-3.5 pt-3.5 border-t border-[var(--color-border)]">
                  <span className="text-[9.5px] text-[var(--color-muted)]">Legend</span>
                  {[15, 40, 65, 90].map((v) => (
                    <div key={v} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded border border-[var(--color-border)]/40" style={heatStyle(v)} aria-hidden="true" />
                      <span className="text-[9.5px] text-[var(--color-muted)]">{v}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                <div className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-3">
                  Recent activity
                </div>
                <div className="space-y-1">
                  {[
                    { name: "Arjun K.", action: "Completed Bell State challenge", xp: "+120 XP", tone: "text-emerald-500" },
                    { name: "Priya M.", action: "Started Grover's algorithm", xp: "+50 XP", tone: "text-[var(--color-primary)]" },
                    { name: "Rahul S.", action: "Submitted QFT circuit (needs review)", xp: "pending", tone: "text-amber-500" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[12px] py-2 border-b border-[var(--color-border)]/50 last:border-0">
                      <div className="min-w-0">
                        <span className="font-semibold text-[var(--color-text)]">{s.name}</span>
                        <span className="text-[var(--color-muted)] ml-2">{s.action}</span>
                      </div>
                      <span className={`font-mono font-semibold shrink-0 ml-2 ${s.tone}`}>{s.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
