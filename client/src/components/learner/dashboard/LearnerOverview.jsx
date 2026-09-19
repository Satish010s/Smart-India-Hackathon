"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LuAtom, LuCpu, LuSparkles, LuFlame, LuZap, LuTrophy, LuMedal,
  LuTarget, LuBrain, LuFlaskConical, LuPlay, LuCheck, LuClock,
  LuBookOpen, LuLayers, LuTrendingUp, LuArrowRight, LuChevronRight,
  LuShield, LuActivity, LuBot, LuCircleCheck
} from 'react-icons/lu';
import toast from 'react-hot-toast';

// ─── User Rank Titles ────────────────────────────────────────────────────────
const getRankTitle = (level = 1) => {
  if (level >= 10) return 'Quantum Grandmaster';
  if (level >= 7) return 'Qubit Architect';
  if (level >= 5) return 'Quantum Researcher';
  if (level >= 3) return 'Circuit Specialist';
  return 'Quantum Explorer';
};

// ─── 1. Welcome Header ────────────────────────────────────────────────────────
function QuantumHero({ user = {}, currentCourse = {}, quickStats = {} }) {
  const xp = user.xp || 0;
  const nextXp = user.nextLevelXp || 1000;
  const level = user.level || 1;
  const streak = user.streak || 0;
  const rankTitle = getRankTitle(level);
  const xpPct = Math.min(100, Math.max(0, Math.round((xp / nextXp) * 100)));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user.name ? user.name.split(' ')[0] : 'Learner';

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* Left: Avatar + User Info */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">

          {/* Avatar with Level Badge */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-center text-[var(--color-text)] font-semibold text-2xl font-mono">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-teal-700 dark:bg-teal-500 text-white text-[10px] font-semibold font-mono">
              L{level}
            </div>
          </div>

          {/* Details & XP Bar */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-mono font-medium text-[var(--color-muted)] bg-[var(--color-background)] px-2.5 py-0.5 rounded-md border border-[var(--color-border)] flex items-center gap-1.5">
                <LuAtom size={13} />
                {rankTitle}
              </span>

              {streak > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-[var(--color-muted)] bg-[var(--color-background)] px-2.5 py-0.5 rounded-md border border-[var(--color-border)]">
                  <LuFlame size={13} />
                  {streak}d streak
                </span>
              )}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                {greeting}, {firstName}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-0.5">
                {currentCourse?.title && currentCourse.title !== 'No active course' ? (
                  <>Continue with <span className="font-medium text-[var(--color-text)]">{currentCourse.title}</span></>
                ) : (
                  'Ready to explore quantum computing algorithms and simulations?'
                )}
              </p>
            </div>

            {/* XP Progress Indicator */}
            <div className="pt-1 max-w-md space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[var(--color-text)] font-medium flex items-center gap-1">
                  <LuZap size={12} /> {xp.toLocaleString()} <span className="text-[var(--color-muted)] font-normal">/ {nextXp.toLocaleString()} XP</span>
                </span>
                <span className="text-xs font-medium text-teal-700 dark:text-teal-400 font-mono">{xpPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-600 dark:bg-teal-500 transition-all duration-500"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Hub */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between sm:justify-start gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--color-border)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Link
              href="/playground"
              className="px-4 py-2.5 rounded-md bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium font-mono transition-colors flex items-center gap-2"
            >
              <LuCpu size={15} /> Circuit Sandbox
            </Link>
            <Link
              href="/learn"
              className="px-4 py-2.5 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-border)]/40 text-[var(--color-text)] text-xs font-medium font-mono transition-colors flex items-center gap-1.5"
            >
              <LuBookOpen size={14} /> Courses
            </Link>
          </div>

          <div className="text-[11px] font-mono text-[var(--color-muted)] flex items-center gap-1.5">
            <span>Global Rank:</span>
            <span className="font-medium text-[var(--color-text)]">#{quickStats.rank || 1}</span>
            <span className="text-[var(--color-border)]">·</span>
            <span className="font-medium text-[var(--color-text)]">{quickStats.badges || 0} Badges</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── 2. Stats Grid ────────────────────────────────────────────────────────────
function QuantumMetricsGrid({ stats = {}, quickStats = {} }) {
  const cards = [
    {
      title: 'Active Courses',
      value: stats.courses?.enrolled || 0,
      sub: `${stats.courses?.completed || 0} completed`,
      icon: LuBookOpen,
      pillText: stats.courses?.enrolled ? `${Math.round((stats.courses.completed / stats.courses.enrolled) * 100)}% done` : 'Enrolled',
    },
    {
      title: 'Lessons Completed',
      value: stats.lessons?.completed || 0,
      sub: `of ${stats.lessons?.total || 0} total units`,
      icon: LuLayers,
      pillText: `${stats.lessons?.total ? Math.round((stats.lessons.completed / stats.lessons.total) * 100) : 0}% progress`,
    },
    {
      title: 'Circuits Simulated',
      value: stats.simulations?.total || 0,
      sub: `${stats.simulations?.thisWeek || 0} this week`,
      icon: LuFlaskConical,
      pillText: 'Aer Simulator',
    },
    {
      title: 'Badges & Honors',
      value: quickStats.badges || 0,
      sub: `Rank #${quickStats.rank || '—'} Global`,
      icon: LuTrophy,
      pillText: 'Top 10%',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-teal-600/40 dark:hover:border-teal-500/40 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
                <Icon size={18} />
              </div>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border border-[var(--color-border)] text-[var(--color-muted)]">
                {c.pillText}
              </span>
            </div>

            <div className="mt-4 space-y-0.5">
              <div className="text-2xl sm:text-3xl font-semibold font-mono tracking-tight text-[var(--color-text)]">
                {typeof c.value === 'number' ? c.value.toLocaleString() : c.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-[var(--color-text)]">{c.title}</div>
              <div className="text-[11px] text-[var(--color-muted)] font-mono">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── 3. Continue Learning ─────────────────────────────────────────────────────
function ContinueLearningStation({ currentCourse = {} }) {
  const hasCourse = currentCourse?.title && currentCourse.title !== 'No active course';

  if (!hasCourse) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 mx-auto rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
            <LuAtom size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Begin Your Quantum Journey</h3>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Explore foundational quantum mechanics, superposition, entanglement, and quantum logic gates with interactive simulations.
            </p>
          </div>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium transition-colors"
          >
            Explore Course Catalog <LuArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const progress = currentCourse.progress || 0;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-teal-600/40 dark:hover:border-teal-500/40 transition-colors">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

        {/* Left Info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] flex-shrink-0">
            <LuPlay size={20} className="ml-0.5" />
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-medium text-teal-700 dark:text-teal-400 bg-teal-700/10 dark:bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-700/20 dark:border-teal-500/20">
                Active Pathway
              </span>
              {currentCourse.difficulty && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-[var(--color-border)] text-[var(--color-muted)]">
                  {currentCourse.difficulty}
                </span>
              )}
            </div>

            <h2 className="text-lg font-semibold text-[var(--color-text)] truncate">
              {currentCourse.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] flex-wrap">
              <span className="font-mono text-[11px] text-[var(--color-text)] font-medium">
                {currentCourse.module || 'Module 1'}
              </span>
              <LuChevronRight size={12} />
              <span className="truncate">{currentCourse.lesson || 'Current Lesson'}</span>
            </div>

            {/* Progress line */}
            <div className="flex items-center gap-3 pt-1 max-w-lg">
              <div className="flex-1 h-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-600 dark:bg-teal-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-mono font-medium text-[var(--color-text)]">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <Link
            href="/learn"
            className="w-full md:w-auto px-6 py-2.5 rounded-md bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium font-mono transition-colors flex items-center justify-center gap-2"
          >
            Resume Lesson <LuArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}

// ─── 4. Daily Protocol & Missions ────────────────────────────────────────────
function DailyQuantumProtocol({ goals = [] }) {
  const [goalStates, setGoalStates] = useState(goals.map(g => !!g.done));
  const completedCount = goalStates.filter(Boolean).length;
  const total = goals.length || 1;
  const progressPct = Math.round((completedCount / total) * 100);

  const toggleGoal = (idx) => {
    setGoalStates(prev => {
      const updated = [...prev];
      const nextState = !updated[idx];
      updated[idx] = nextState;
      if (nextState) {
        toast.success(`Objective marked complete! +${goals[idx]?.xp || 50} XP`);
      }
      return updated;
    });
  };

  const getGoalIcon = (type) => {
    switch (type) {
      case 'simulation': return LuFlaskConical;
      case 'challenge': return LuTrophy;
      case 'quiz': return LuBrain;
      case 'circuit': return LuCpu;
      default: return LuBookOpen;
    }
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
            <LuTarget size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[var(--color-text)]">Daily Quantum Protocol</h3>
            <p className="text-xs text-[var(--color-muted)]">
              {completedCount} of {goals.length} objectives accomplished
            </p>
          </div>
        </div>

        {/* Completion Pill */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-semibold text-teal-700 dark:text-teal-400">{progressPct}%</span>
          <div className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center relative">
            <svg className="w-7 h-7 rotate-[-90deg]">
              <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" fill="none" className="text-[var(--color-border)]" />
              <circle
                cx="14" cy="14" r="12"
                stroke="currentColor" strokeWidth="2" fill="none"
                strokeDasharray={`${2 * Math.PI * 12}`}
                strokeDashoffset={`${2 * Math.PI * 12 * (1 - progressPct / 100)}`}
                strokeLinecap="round"
                className="text-teal-600 dark:text-teal-500 transition-all duration-500"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Goal Check List */}
      <div className="space-y-2">
        {goals.map((g, idx) => {
          const isDone = goalStates[idx];
          const Icon = getGoalIcon(g.type);

          return (
            <div
              key={g.id || idx}
              onClick={() => toggleGoal(idx)}
              className={`group flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-colors ${
                isDone
                  ? 'bg-[var(--color-background)] border-teal-700/30 dark:border-teal-500/30'
                  : 'bg-[var(--color-background)] border-[var(--color-border)] hover:border-teal-600/40 dark:hover:border-teal-500/40'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    isDone
                      ? 'bg-teal-700 border-teal-700 dark:bg-teal-500 dark:border-teal-500 text-white'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {isDone && <LuCheck size={13} className="stroke-[3]" />}
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon size={16} className="text-[var(--color-muted)]" />
                  <span className={`text-xs font-medium truncate ${isDone ? 'line-through text-[var(--color-muted)]' : 'text-[var(--color-text)]'}`}>
                    {g.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border border-[var(--color-border)] text-[var(--color-muted)]">
                  +{g.xp || 50} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {completedCount === goals.length && goals.length > 0 && (
        <div className="p-3 rounded-lg bg-[var(--color-background)] border border-teal-700/30 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 text-xs font-medium flex items-center justify-center gap-2">
          <LuSparkles size={15} /> All daily quantum protocols fulfilled — +150 Bonus XP awarded.
        </div>
      )}
    </div>
  );
}

// ─── 5. AI Quantum Tutor Spotlight ───────────────────────────────────────────
function AIQuantumCopilot({ rec = {} }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
            <LuBot size={16} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-medium text-[var(--color-muted)]">
              AI Quantum Tutor
            </span>
            <h4 className="text-xs font-semibold text-[var(--color-text)]">Adaptive Recommendation</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-teal-700/30 dark:border-teal-500/30 text-teal-700 dark:text-teal-400">
          Personalized
        </span>
      </div>

      <div className="space-y-2 bg-[var(--color-background)] p-4 rounded-lg border border-[var(--color-border)]">
        <div className="text-xs font-semibold text-[var(--color-text)]">{rec.title || 'Superposition & Hadamard Transform'}</div>
        <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
          {rec.reason || 'Based on your recent simulation history, master single-qubit rotations and statevector visualization next.'}
        </p>

        <div className="flex items-center gap-2 pt-2 flex-wrap text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-md border border-[var(--color-border)] text-[var(--color-muted)]">
            {rec.module || 'Core Principles'}
          </span>
          <span className="px-2 py-0.5 rounded-md border border-[var(--color-border)] text-[var(--color-muted)]">
            {rec.difficulty || 'Intermediate'}
          </span>
          <span className="text-[var(--color-muted)] flex items-center gap-1">
            <LuClock size={11} /> {rec.duration || '12 min'}
          </span>
        </div>
      </div>

      <Link
        href="/learn"
        className="w-full py-2.5 rounded-md bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium font-mono transition-colors flex items-center justify-center gap-2"
      >
        <LuZap size={14} /> Start Recommended Unit
      </Link>
    </div>
  );
}

// ─── 6. Circuit Sandbox Quick-Launcher ───────────────────────────────────────
function CircuitLabTeaser() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
            <LuCpu size={16} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-text)]">Interactive Lab</h4>
            <p className="text-[11px] text-[var(--color-muted)]">Quantum Circuit Builder</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]">
          v2.0 Online
        </span>
      </div>

      {/* Mini Circuit Schematic Preview */}
      <div className="bg-[var(--color-background)] p-3 rounded-lg border border-[var(--color-border)] font-mono text-[11px] space-y-1.5 text-[var(--color-muted)]">
        <div className="flex items-center justify-between text-[10px] border-b border-[var(--color-border)] pb-1">
          <span>q[0]: |0⟩ ─[ H ]─●─[ M ]</span>
          <span className="text-teal-700 dark:text-teal-400">Bell State |Φ+⟩</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span>q[1]: |0⟩ ────┼─[ M ]</span>
          <span>P(|00⟩)=50% P(|11⟩)=50%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/playground"
          className="py-2.5 rounded-md bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium font-mono text-center transition-colors flex items-center justify-center gap-1.5"
        >
          <LuPlay size={13} /> Open Canvas
        </Link>
        <Link
          href="/challenges"
          className="py-2.5 rounded-md border border-[var(--color-border)] text-[var(--color-text)] text-xs font-medium font-mono text-center transition-colors hover:bg-[var(--color-background)] flex items-center justify-center gap-1.5"
        >
          <LuTrophy size={13} /> Challenges
        </Link>
      </div>
    </div>
  );
}

// ─── 7. Recent Activity Feed ──────────────────────────────────────────────────
function QuantumActivityFeed({ activities = [] }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'simulation': return LuFlaskConical;
      case 'circuit': return LuCpu;
      case 'course': return LuCircleCheck;
      case 'ai': return LuBot;
      default: return LuActivity;
    }
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
            <LuActivity size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[var(--color-text)]">Recent Activity</h3>
            <p className="text-xs text-[var(--color-muted)]">Execution trace and course completions</p>
          </div>
        </div>
        <Link
          href="/progress"
          className="text-xs font-mono text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium"
        >
          View Full Log <LuChevronRight size={13} />
        </Link>
      </div>

      {!activities.length ? (
        <div className="py-8 text-center text-[var(--color-muted)] text-xs font-mono">
          No experiments recorded yet. Simulate your first circuit in the playground.
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {activities.slice(0, 5).map((act, i) => {
            const Icon = getActivityIcon(act.type);

            return (
              <div key={act.id || i} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 text-[var(--color-muted)]">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[var(--color-text)] truncate">
                      {act.label}
                    </div>
                    {act.meta && (
                      <div className="text-[11px] text-[var(--color-muted)] font-mono">{act.meta}</div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[var(--color-muted)] flex-shrink-0">
                  {act.time || 'recently'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── 8. Badges Shelf & Honors ────────────────────────────────────────────────
function QuantumBadgesShelf({ badgeList = [], total = 0 }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
            <LuMedal size={16} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-text)]">Badges & Honors</h4>
            <p className="text-[11px] text-[var(--color-muted)]">{total} Unlocked</p>
          </div>
        </div>
        <Link href="/achievement" className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-medium font-mono">
          All Badges
        </Link>
      </div>

      {!badgeList.length ? (
        <div className="py-6 text-center text-xs text-[var(--color-muted)]">
          Complete courses and circuit challenges to unlock badges.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {badgeList.slice(0, 4).map((b, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] flex items-center gap-2.5"
            >
              <span className="text-xl">{b.icon || '🏅'}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[var(--color-text)] truncate">{b.title}</div>
                <div className="text-[10px] font-mono text-[var(--color-muted)]">+{b.xp || 50} XP</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 9. Quick Shortcuts Grid ──────────────────────────────────────────────────
function QuantumShortcuts() {
  const links = [
    { title: 'AI Copilot', desc: 'Ask quantum queries', href: '/ai-tutor', icon: LuBrain },
    { title: 'Challenges', desc: 'Solve circuit puzzles', href: '/challenges', icon: LuTrophy },
    { title: 'Leaderboard', desc: 'View global rankings', href: '/achievement', icon: LuTrendingUp },
    { title: 'My Profile', desc: 'Manage credentials', href: '/profile', icon: LuShield },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {links.map((l, i) => {
        const Icon = l.icon;
        return (
          <Link
            key={i}
            href={l.href}
            className="p-3.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-teal-600/40 dark:hover:border-teal-500/40 transition-colors flex flex-col gap-1.5"
          >
            <div className="w-7 h-7 rounded-md border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
              <Icon size={14} />
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--color-text)]">
                {l.title}
              </div>
              <div className="text-[10px] text-[var(--color-muted)]">{l.desc}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LearnerOverview({ user, hubData }) {
  const mergedUser = {
    name: hubData?.user?.name || user?.name || 'Learner',
    level: hubData?.level || 1,
    xp: hubData?.xp || 0,
    nextLevelXp: hubData?.nextLevelXp || 1000,
    streak: hubData?.streak || 0,
    longestStreak: hubData?.longestStreak || 0,
  };

  const currentCourse = hubData?.currentCourse || {
    title: 'No active course',
    module: '—',
    lesson: '—',
    progress: 0,
  };

  const todaysGoals = hubData?.todayGoals || [
    { id: 1, label: 'Run 1 Quantum Circuit in Playground', type: 'simulation', done: false, xp: 50 },
    { id: 2, label: 'Complete Daily Theory Unit', type: 'course', done: false, xp: 75 },
    { id: 3, label: 'Ask AI Copilot 1 Quantum question', type: 'quiz', done: false, xp: 25 },
  ];

  const stats = hubData?.stats || {
    courses: { enrolled: 0, completed: 0 },
    lessons: { completed: 0, total: 0 },
    simulations: { total: 0, thisWeek: 0 },
  };

  const recentActivity = hubData?.recentActivity || [];
  const recommendation = hubData?.recommendation || {
    title: 'Introduction to Superposition & Hadamard',
    reason: 'Master how qubits exist in multiple basis states simultaneously before advancing to entanglement.',
    module: 'Quantum Fundamentals',
    difficulty: 'Beginner',
    duration: '8 min',
  };

  const quickStats = hubData?.quickStats || {
    rank: 14,
    badges: 3,
    badgeList: [
      { title: 'Superposition Pioneer', icon: '🌌', xp: 100 },
      { title: 'First Qubit Run', icon: '⚛️', xp: 50 },
      { title: 'Entanglement Master', icon: '🔗', xp: 150 },
    ],
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Welcome Header */}
      <QuantumHero
        user={mergedUser}
        currentCourse={currentCourse}
        quickStats={quickStats}
      />

      {/* 2. Metrics Grid */}
      <QuantumMetricsGrid stats={stats} quickStats={quickStats} />

      {/* 3. Continue Learning */}
      <ContinueLearningStation currentCourse={currentCourse} />

      {/* 4. Grid: Protocol, AI Copilot, Labs & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <DailyQuantumProtocol goals={todaysGoals} />
          <QuantumActivityFeed activities={recentActivity} />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          <AIQuantumCopilot rec={recommendation} />
          <CircuitLabTeaser />
          <QuantumBadgesShelf badgeList={quickStats.badgeList} total={quickStats.badges} />
          <QuantumShortcuts />
        </div>

      </div>
    </div>
  );
}