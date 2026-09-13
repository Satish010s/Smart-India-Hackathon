"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import { apiFetch } from '../../services/api';
import {
  LuChartBar,
  LuSparkles,
  LuAward,
  LuGraduationCap,
  LuCheck,
  LuClock,
  LuFlame,
  LuCpu,
  LuActivity,
  LuTrophy,
  LuBookOpen,
  LuBrain,
  LuBot,
} from 'react-icons/lu';

const DEFAULT_PROGRESS = {
  overallProgress: 62,
  coursesCompleted: 1,
  totalCourses: 6,
  lessonsCompleted: 54,
  totalLessons: 87,
  challengesSolved: 13,
  challengesAttempted: 18,
  quizAvgScore: 84,
  learningHours: 38.5,
  currentStreak: 12,
  longestStreak: 18,
  weeklyActivity: [2, 4, 3, 5, 4, 6, 3],
  milestones: [
    { title: 'Superposition & Qubit Measurement', status: 'Completed', date: 'Aug 2026', xp: 200 },
    { title: 'Quantum Teleportation Protocol', status: 'Completed', date: 'Aug 2026', xp: 350 },
    { title: "Grover's Oracles", status: 'In Progress', date: 'Expected Oct 2026', xp: 500 },
    { title: 'Variational Quantum Eigensolver', status: 'Upcoming', date: 'Expected Nov 2026', xp: 800 },
  ],
  circuitsBuilt: 18,
  simulationsRun: 84,
  aiInteractions: 42,
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ProgressPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchProgress() {
      try {
        const res = await apiFetch('/learner/progress');
        if (mounted && res?.data) {
          setProgress(res.data);
        }
      } catch (err) {
        console.warn('ProgressPage using fallback data:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProgress();
    return () => { mounted = false; };
  }, []);

  const stats = [
    { label: 'Circuits Created', value: progress.circuitsBuilt, icon: LuCpu, color: 'text-cyan-400', change: '+3 this week' },
    { label: 'Simulations Run', value: progress.simulationsRun, icon: LuActivity, color: 'text-violet-400', change: '+12 this week' },
    { label: 'Challenges Solved', value: `${progress.challengesSolved}/${progress.challengesAttempted}`, icon: LuTrophy, color: 'text-amber-400', change: `${Math.round((progress.challengesSolved / (progress.challengesAttempted || 1)) * 100)}% Accuracy` },
    { label: 'Learning Hours', value: `${progress.learningHours}h`, icon: LuClock, color: 'text-emerald-400', change: `${progress.currentStreak} day streak 🔥` },
  ];

  const maxWeeklyHours = Math.max(...(progress.weeklyActivity || [1]), 6);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex">
        <LearnerSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <DashboardNavbar
            title="Learning Analytics & Progress"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface)] to-cyan-500/10 p-6 sm:p-8">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[var(--color-primary)]/10 blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Comprehensive Analytics
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-text)]">
                    Quantum Competency Overview
                  </h1>
                  <p className="text-sm text-[var(--color-muted)] max-w-xl">
                    Track your journey across quantum circuits, foundational courses, algorithms, and simulation benchmarks.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-[var(--color-background)]/80 backdrop-blur-md border border-[var(--color-border)] p-4 rounded-2xl">
                  <div className="text-center px-3">
                    <div className="text-2xl font-black font-mono text-[var(--color-primary)]">{progress.overallProgress}%</div>
                    <div className="text-[10px] uppercase font-mono text-[var(--color-muted)]">Overall Completion</div>
                  </div>
                  <div className="h-8 w-px bg-[var(--color-border)]" />
                  <div className="text-center px-3">
                    <div className="text-2xl font-black font-mono text-amber-400 flex items-center justify-center gap-1">
                      <LuFlame size={20} /> {progress.currentStreak}
                    </div>
                    <div className="text-[10px] uppercase font-mono text-[var(--color-muted)]">Day Streak</div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-mono text-[var(--color-muted)]">
                  <span>Overall Curriculum Mastery</span>
                  <span>{progress.overallProgress}%</span>
                </div>
                <div className="h-2.5 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-700"
                    style={{ width: `${progress.overallProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-3 hover:border-[var(--color-primary)]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--color-muted)]">{s.label}</span>
                      <div className={`p-2 rounded-xl bg-[var(--color-border)]/20 ${s.color}`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-[var(--color-text)]">
                      {s.value}
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold block">
                      {s.change}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Learning Activity & Detailed Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Activity Chart */}
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                      <LuActivity size={20} className="text-cyan-400" />
                      <span>Weekly Learning Activity</span>
                    </h2>
                    <p className="text-xs text-[var(--color-muted)] mt-1">Hours spent learning and practicing over the past 7 days</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                    {progress.weeklyActivity?.reduce((a, b) => a + b, 0)} hrs this week
                  </span>
                </div>

                <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                  {(progress.weeklyActivity || [2, 4, 3, 5, 4, 6, 3]).map((hrs, idx) => {
                    const heightPct = Math.round((hrs / maxWeeklyHours) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                          {hrs}h
                        </span>
                        <div className="w-full bg-[var(--color-border)]/30 rounded-xl h-32 flex items-end overflow-hidden p-1">
                          <div
                            className="w-full bg-gradient-to-t from-[var(--color-primary)] to-cyan-400 rounded-lg transition-all duration-500 group-hover:brightness-110"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-[var(--color-muted)]">{DAYS[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Breakdown */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-5">
                <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                  <LuChartBar size={20} className="text-violet-400" />
                  <span>Curriculum Breakdown</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-[var(--color-muted)]">Courses</span>
                      <span className="font-semibold text-[var(--color-text)]">{progress.coursesCompleted} / {progress.totalCourses}</span>
                    </div>
                    <div className="h-2 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.round((progress.coursesCompleted / progress.totalCourses) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-[var(--color-muted)]">Lessons Completed</span>
                      <span className="font-semibold text-[var(--color-text)]">{progress.lessonsCompleted} / {progress.totalLessons}</span>
                    </div>
                    <div className="h-2 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${Math.round((progress.lessonsCompleted / progress.totalLessons) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-[var(--color-muted)]">Challenges Solved</span>
                      <span className="font-semibold text-[var(--color-text)]">{progress.challengesSolved} / {progress.challengesAttempted}</span>
                    </div>
                    <div className="h-2 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.round((progress.challengesSolved / progress.challengesAttempted) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-[var(--color-muted)]">Quiz Average</span>
                      <span className="font-semibold text-emerald-400">{progress.quizAvgScore}%</span>
                    </div>
                    <div className="h-2 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${progress.quizAvgScore}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-border)]/50 flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-[var(--color-muted)]">
                      <LuBot size={14} className="text-cyan-400" /> AI Tutor Sessions
                    </span>
                    <span className="font-bold text-[var(--color-text)]">{progress.aiInteractions} queried</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                <LuAward size={20} className="text-cyan-400" />
                <span>Quantum Learning Roadmap</span>
              </h2>

              <div className="space-y-4">
                {(progress.milestones || []).map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[var(--color-primary)]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          m.status === 'Completed'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : m.status === 'In Progress'
                            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                            : 'bg-[var(--color-border)]/50 text-[var(--color-muted)]'
                        }`}
                      >
                        {m.status === 'Completed' ? <LuCheck size={16} /> : idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[var(--color-text)]">{m.title}</div>
                        <div className="text-[11px] text-[var(--color-muted)] font-mono">{m.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {m.xp && (
                        <span className="text-xs font-mono text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                          +{m.xp} XP
                        </span>
                      )}
                      <span
                        className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full ${
                          m.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : m.status === 'In Progress'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-[var(--color-border)]/50 text-[var(--color-muted)] border border-[var(--color-border)]'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
