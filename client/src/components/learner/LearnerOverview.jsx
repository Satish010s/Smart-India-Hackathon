"use client";

import React from 'react';
import Link from 'next/link';
import {
  LuGraduationCap,
  LuTrophy,
  LuSparkles,
  LuBookOpen,
  LuArrowRight,
  LuCircleCheckBig,
} from 'react-icons/lu';

export default function LearnerOverview({ user, hubData }) {
  const tracks = [
    {
      id: 'mod-1',
      title: 'Qubits & Superposition',
      desc: 'Bloch sphere geometry, statevectors, and measurement probabilities.',
      progress: 100,
      xp: 250,
      status: 'Completed',
    },
    {
      id: 'mod-2',
      title: 'Quantum Logic Gates & Multi-Qubit Circuits',
      desc: 'Hadamard, Pauli X/Y/Z, CNOT, and Bell state entanglement.',
      progress: 65,
      xp: 400,
      status: 'In Progress',
    },
    {
      id: 'mod-3',
      title: 'Deutsch-Jozsa & Grover Search Algorithm',
      desc: 'Oracle construction, quantum parallelism, and quadratic speedup.',
      progress: 20,
      xp: 600,
      status: 'In Progress',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[var(--color-primary)]/15 via-[var(--color-surface)] to-[var(--color-secondary)]/15 border border-[var(--color-border)] relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary)] text-white">
            <LuSparkles size={14} />
            <span>Interactive Quantum Learning</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[var(--color-text)]">
            Welcome back, {user?.name || 'Learner'}!
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
            Ready to explore quantum superposition, entangled states, and circuit execution? Continue your current track or test your skills in challenges.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Modules</span>
            <LuGraduationCap size={20} className="text-[var(--color-primary)]" />
          </div>
          <div className="text-3xl font-bold font-heading text-[var(--color-text)]">
            {hubData?.modulesCompleted ?? 4} / {hubData?.totalModules ?? 12}
          </div>
          <div className="w-full bg-[var(--color-border)]/50 h-2 rounded-full overflow-hidden">
            <div className="bg-[var(--color-primary)] h-full rounded-full" style={{ width: '33%' }} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Experience Points (XP)</span>
            <LuTrophy size={20} className="text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-heading text-[var(--color-text)]">
            {hubData?.xp ?? 1250} XP
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono">Rank: Superposition Pioneer</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Session Security</span>
            <LuCircleCheckBig size={20} className="text-emerald-500" />
          </div>
          <div className="text-sm font-semibold text-emerald-500">Argon2id + SameSite Cookies</div>
          <p className="text-xs text-[var(--color-muted)] font-mono">HttpOnly &bull; Auto-Refreshed &bull; Verified</p>
        </div>
      </div>

      {/* Active Tracks List */}
      <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Enrolled Quantum Tracks</h2>
            <p className="text-xs text-[var(--color-muted)]">Progress across fundamental and algorithmic modules</p>
          </div>
          <Link
            href="/learn"
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
          >
            <span>View All Tracks</span>
            <LuArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tracks.map((track, i) => (
            <div
              key={track.id}
              className="p-5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col justify-between space-y-4 hover:border-[var(--color-primary)]/50 transition-all shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    Track 0{i + 1}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--color-muted)]">+{track.xp} XP</span>
                </div>
                <h3 className="font-semibold text-sm text-[var(--color-text)]">{track.title}</h3>
                <p className="text-xs text-[var(--color-muted)] line-clamp-2">{track.desc}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--color-border)]/50">
                <div className="flex justify-between text-[11px] font-mono text-[var(--color-muted)]">
                  <span>{track.status}</span>
                  <span>{track.progress}%</span>
                </div>
                <div className="w-full bg-[var(--color-border)]/40 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--color-primary)] h-full rounded-full"
                    style={{ width: `${track.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
