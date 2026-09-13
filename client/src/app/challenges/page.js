"use client";

import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import {
  LuTrophy,
  LuSparkles,
  LuFlame,
  LuClock,
  LuCheck,
  LuArrowRight,
  LuMedal,
} from 'react-icons/lu';

const CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Construct GHZ State on 5 Qubits',
    category: 'Entanglement',
    points: 250,
    difficulty: 'Medium',
    participants: 142,
    timeLimit: '20 mins',
    status: 'Ready',
  },
  {
    id: 'ch-2',
    title: 'Implement Deutsch-Jozsa Constant vs Balanced Oracle',
    category: 'Quantum Oracles',
    points: 350,
    difficulty: 'Hard',
    participants: 98,
    timeLimit: '35 mins',
    status: 'Ready',
  },
  {
    id: 'ch-3',
    title: 'Error Correction: Bit-Flip 3-Qubit Code',
    category: 'QEC',
    points: 400,
    difficulty: 'Hard',
    participants: 67,
    timeLimit: '45 mins',
    status: 'Ready',
  },
  {
    id: 'ch-4',
    title: 'Single Qubit Superposition & Phase Kickback',
    category: 'Basics',
    points: 100,
    difficulty: 'Easy',
    participants: 320,
    timeLimit: '10 mins',
    status: 'Completed',
  },
];

export default function ChallengesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex">
        <LearnerSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <DashboardNavbar
            title="Quantum Challenges"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Gamification Header */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[var(--color-surface)] via-[var(--color-surface)] to-amber-500/10 border border-[var(--color-border)] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Weekly Sprint #14
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-rose-400 font-bold">
                    <LuFlame size={14} /> 5 Day Streak
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-text)]">
                  Quantum Code Challenges & XP
                </h1>
                <p className="text-xs text-[var(--color-muted)] max-w-xl">
                  Solve live circuit puzzles, optimize gate counts, and climb the platform leaderboard.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] text-center">
                  <div className="text-xl font-bold font-mono text-amber-400">1,450 XP</div>
                  <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Total Score</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] text-center">
                  <div className="text-xl font-bold font-mono text-cyan-400">#12</div>
                  <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Global Rank</div>
                </div>
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CHALLENGES.map((ch) => (
                <div
                  key={ch.id}
                  className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-amber-500/40 hover:shadow-lg transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)]">
                      {ch.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      +{ch.points} XP
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[var(--color-text)]">{ch.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] font-mono mt-1">
                      <span>Difficulty: {ch.difficulty}</span>
                      <span>&bull;</span>
                      <span>{ch.timeLimit}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-border)]/40 flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">
                      {ch.participants} participants submitted
                    </span>
                    {ch.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold font-mono">
                        <LuCheck size={14} /> Solved
                      </span>
                    ) : (
                      <button className="text-xs font-semibold px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black transition-colors inline-flex items-center gap-1.5 cursor-pointer font-sans shadow-md">
                        <span>Start Challenge</span>
                        <LuArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
