"use client";

import React from "react";
import Link from "next/link";
import {
  LuUserCheck, LuTrendingUp, LuBookOpen, LuArrowRight,
  LuAward, LuUsers, LuChartBar, LuBrainCircuit,
} from "react-icons/lu";

const HEATMAP_DATA = [
  { topic: "Superposition", vals: [90, 85, 78, 60, 45] },
  { topic: "Gates & Ops",   vals: [70, 80, 65, 72, 55] },
  { topic: "Entanglement",  vals: [40, 55, 48, 38, 30] },
  { topic: "QFT",           vals: [20, 30, 25, 18, 22] },
  { topic: "Grover's Algo", vals: [15, 20, 28, 12, 10] },
];

function heatColor(v) {
  if (v > 70) return "bg-[#f1a17e]/80";
  if (v > 50) return "bg-[#e7b46a]/60";
  if (v > 30) return "bg-[#d64a17]/60";
  return "bg-rose-500/60";
}

const FEATURES = [
  { icon: LuChartBar, text: "Live per-student progress and performance dashboards" },
  { icon: LuUsers, text: "Assign courses, set deadlines, and grade challenges" },
  { icon: LuBrainCircuit, text: "Weak-topic heatmaps to spot struggling concepts instantly" },
  { icon: LuAward, text: "Gamification engine — track streaks, XP, and badges" },
];

export default function ForInstructors() {
  return (
    <section id="instructors" className="py-28 bg-[var(--color-surface)] relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px section-divider" />

      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--color-secondary)]/8 blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/8 text-[var(--color-secondary)] text-xs font-semibold tracking-wider mb-6">
              <LuUserCheck size={13} aria-hidden="true" /> FOR INSTRUCTORS
            </div>

            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 tracking-tight leading-tight">
              Run your quantum class.{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]">
                Track every learner.
              </span>
            </h2>

            <p className="text-lg text-[var(--color-muted)] mb-10 leading-relaxed">
              QubitMinds gives instructors a full teaching studio — from course creation to per-student analytics, all in one place.
            </p>

            <ul className="space-y-4 mb-10" role="list">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--color-secondary)]/12 border border-[var(--color-secondary)]/20 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[var(--color-secondary)]" aria-hidden="true" />
                    </div>
                    <span className="text-[var(--color-text)] text-sm leading-relaxed pt-1">{f.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/signup"
                className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white shadow-lg hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #e7b46a, #d64a17)" }}
                id="instructor-cta">
                Request Instructor Demo
                <LuArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link href="#faq"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] font-semibold text-sm hover:border-[var(--color-secondary)]/40 hover:bg-[var(--color-secondary)]/5 transition-all">
                View Pricing FAQ
              </Link>
            </div>
          </div>

          {/* RIGHT: Dashboard mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-[var(--color-secondary)]/6 rounded-3xl blur-xl" aria-hidden="true" />
            <div className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-xl overflow-hidden shadow-2xl">

              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--color-border)]/60 bg-[var(--color-surface)]/40">
                <div className="flex gap-1.5" aria-hidden="true">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs font-mono text-[var(--color-muted)] mx-auto">Instructor Dashboard · CS 4810 Quantum Computing</span>
              </div>

              <div className="p-5 space-y-5">

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Students", value: "32", icon: LuUsers, color: "text-[#e7b46a]" },
                    { label: "Avg Progress", value: "68%", icon: LuTrendingUp, color: "text-[#f1a17e]" },
                    { label: "Assignments", value: "8/12", icon: LuBookOpen, color: "text-[#dee64c]" },
                  ].map(stat => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="p-3 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/40 text-center">
                        <Icon size={16} className={`${stat.color} mx-auto mb-1`} aria-hidden="true" />
                        <div className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] text-[var(--color-muted)]">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Heatmap */}
                <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/20 p-4">
                  <div className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <LuChartBar size={14} aria-hidden="true" /> Topic Mastery Heatmap
                  </div>
                  <div className="space-y-2" role="table" aria-label="Topic mastery heatmap">
                    {HEATMAP_DATA.map(row => (
                      <div key={row.topic} className="flex items-center gap-3" role="row">
                        <span className="text-[11px] text-[var(--color-muted)] w-28 shrink-0 truncate" role="rowheader">{row.topic}</span>
                        <div className="flex gap-1 flex-1" role="group">
                          {row.vals.map((v, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-5 rounded ${heatColor(v)} transition-all duration-300`}
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
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--color-border)]/40">
                    <span className="text-[9px] text-[var(--color-muted)]">Legend:</span>
                    {[["Excellent", "bg-[#f1a17e]/80"], ["Good", "bg-[#e7b46a]/60"], ["Needs work", "bg-[#d64a17]/60"], ["Struggling", "bg-rose-500/60"]].map(([label, cls]) => (
                      <div key={label} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded ${cls}`} aria-hidden="true" />
                        <span className="text-[9px] text-[var(--color-muted)]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student list */}
                <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/20 p-4">
                  <div className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-3">Recent Activity</div>
                  <div className="space-y-2">
                    {[
                      { name: "Arjun K.", action: "Completed Bell State Challenge", xp: "+120 XP", color: "text-[#f1a17e]" },
                      { name: "Priya M.", action: "Started Grover's Algorithm", xp: "+50 XP", color: "text-[#e7b46a]" },
                      { name: "Rahul S.", action: "Submitted QFT circuit (needs review)", xp: "pending", color: "text-[#d64a17]" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--color-border)]/30 last:border-0">
                        <div>
                          <span className="font-semibold text-[var(--color-text)]">{s.name}</span>
                          <span className="text-[var(--color-muted)] ml-2">{s.action}</span>
                        </div>
                        <span className={`font-mono font-bold ${s.color} shrink-0 ml-2`}>{s.xp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
