"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import { apiFetch } from '../../services/api';
import {
  LuMedal, LuTrophy, LuStar, LuFlame, LuZap, LuCheck,
  LuLock, LuCpu, LuBookOpen, LuBrain, LuTarget, LuCalendar,
  LuActivity, LuSparkles, LuGraduationCap,
} from 'react-icons/lu';

const BADGES = [
  { id: 'b1', title: 'Qubit Pioneer', desc: 'Completed your first quantum lesson', icon: '⚛️', earned: true, xp: 50, date: 'Aug 12', rarity: 'Common' },
  { id: 'b2', title: 'Bell State Builder', desc: 'Successfully created a Bell entangled pair', icon: '🔔', earned: true, xp: 150, date: 'Aug 18', rarity: 'Uncommon' },
  { id: 'b3', title: 'Grover Explorer', desc: "Completed Grover's search module", icon: '🔍', earned: true, xp: 250, date: 'Sep 2', rarity: 'Rare' },
  { id: 'b4', title: 'Circuit Architect', desc: 'Built 10+ unique quantum circuits in playground', icon: '🏗️', earned: true, xp: 200, date: 'Sep 5', rarity: 'Uncommon' },
  { id: 'b5', title: '7-Day Streak', desc: 'Learned for 7 consecutive days', icon: '🔥', earned: true, xp: 100, date: 'Sep 8', rarity: 'Common' },
  { id: 'b6', title: 'Quiz Ace', desc: 'Scored 100% on 3 consecutive quizzes', icon: '🎯', earned: true, xp: 300, date: 'Sep 10', rarity: 'Rare' },
  { id: 'b7', title: 'Shor Specialist', desc: "Master Shor's factoring algorithm", icon: '🔐', earned: false, xp: 500, rarity: 'Epic' },
  { id: 'b8', title: 'QML Trailblazer', desc: 'Complete the Quantum ML track', icon: '🤖', earned: false, xp: 600, rarity: 'Epic' },
  { id: 'b9', title: 'Grand Quantum Master', desc: 'Complete all courses with 90%+ quiz avg', icon: '🏆', earned: false, xp: 2000, rarity: 'Legendary' },
];

const MILESTONES = [
  { xp: 0, label: 'Novice', icon: '🌱', reached: true },
  { xp: 500, label: 'Apprentice', icon: '⚗️', reached: true },
  { xp: 1000, label: 'Explorer', icon: '🔭', reached: true },
  { xp: 2000, label: 'Practitioner', icon: '⚛️', reached: true },
  { xp: 3500, label: 'Specialist', icon: '🧬', reached: false },
  { xp: 5000, label: 'Expert', icon: '🌌', reached: false },
  { xp: 8000, label: 'Master', icon: '🏆', reached: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'Neha Gupta', xp: 8420, avatar: 'N', badge: '🏆' },
  { rank: 2, name: 'Rohan Verma', xp: 7890, avatar: 'R', badge: '🥈' },
  { rank: 3, name: 'Aisha Khan', xp: 7230, avatar: 'A', badge: '🥉' },
  { rank: 4, name: 'Vijay Patil', xp: 6540, avatar: 'V', badge: null },
  { rank: 5, name: 'Priya Reddy', xp: 5980, avatar: 'P', badge: null },
  { rank: 42, name: 'Arjun Sharma', xp: 4250, avatar: 'A', badge: null, isYou: true },
];

const RARITY_STYLES = {
  Common: 'text-slate-400 border-slate-400/30 bg-slate-400/10',
  Uncommon: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Rare: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  Epic: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
  Legendary: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
};

const USER_XP = 4250;

export default function AchievementPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    apiFetch('/learner/achievements')
      .then(res => { if (res?.success) setApiData(res.data); })
      .catch(() => {}); // fallback to embedded mock data below
  }, []);

  const badges = apiData?.badges || BADGES;
  const milestones = apiData?.milestones || MILESTONES;
  const leaderboard = apiData?.leaderboard || LEADERBOARD;
  const userXp = apiData?.xp || USER_XP;

  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);
  const filtered = filter === 'earned' ? earned : filter === 'locked' ? locked : badges;

  // XP milestone progress
  const currentMilestone = milestones.filter(m => userXp >= m.xp).slice(-1)[0];
  const nextMilestone = milestones.find(m => userXp < m.xp);
  const pct = nextMilestone ? Math.round(((userXp - currentMilestone.xp) / (nextMilestone.xp - currentMilestone.xp)) * 100) : 100;

  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-text)] flex">
        <LearnerSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <div className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <DashboardNavbar
            title="Achievements"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-[var(--color-surface)] to-[var(--color-primary)]/10 p-6 sm:p-8">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-4xl shadow-xl flex-shrink-0">
                  🏆
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-text)]">Your Achievements</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">Track your badges, XP milestones, streaks, and global ranking.</p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {[
                      { label: 'XP', value: '4,250', icon: LuZap, color: 'text-amber-400' },
                      { label: 'Badges', value: `${earned.length}/${BADGES.length}`, icon: LuMedal, color: 'text-violet-400' },
                      { label: 'Streak', value: '12 days', icon: LuFlame, color: 'text-rose-400' },
                      { label: 'Global Rank', value: '#42', icon: LuTrophy, color: 'text-cyan-400' },
                    ].map(s => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-background)]/60 border border-[var(--color-border)]/50">
                          <Icon size={14} className={s.color} />
                          <div>
                            <div className="text-sm font-bold font-mono text-[var(--color-text)]">{s.value}</div>
                            <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{s.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* XP Level path */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5">
              <h2 className="font-semibold text-base text-[var(--color-text)]">XP Level Path</h2>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {milestones.map((m, i) => (
                  <React.Fragment key={m.label}>
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border-2 transition-all ${
                        m.reached ? 'border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10' : 'border-[var(--color-border)] bg-[var(--color-background)] opacity-50'
                      }`}>
                        {m.icon}
                      </div>
                      <div className="text-[10px] font-semibold text-center text-[var(--color-muted)] whitespace-nowrap">{m.label}</div>
                      <div className="text-[9px] font-mono text-[var(--color-muted)]/60">{m.xp.toLocaleString()} XP</div>
                    </div>
                    {i < milestones.length - 1 && (
                      <div className={`flex-1 h-0.5 min-w-8 rounded-full ${m.reached ? 'bg-amber-500/40' : 'bg-[var(--color-border)]/30'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
                {nextMilestone && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-[var(--color-muted)]">
                    <span>{currentMilestone.label} → {nextMilestone.label}</span>
                    <span className="text-amber-400 font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 bg-[var(--color-border)]/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-[var(--color-muted)]">
                    {(nextMilestone.xp - userXp).toLocaleString()} XP to reach {nextMilestone.label}
                  </div>
                </div>
              )}
            </div>

            {/* Badges section */}
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-semibold text-base text-[var(--color-text)]">Badges & Awards</h2>
                <div className="flex gap-1.5">
                  {[{ id: 'all', label: 'All' }, { id: 'earned', label: `Earned (${earned.length})` }, { id: 'locked', label: `Locked (${locked.length})` }].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        filter === f.id ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(badge => (
                  <div
                    key={badge.id}
                    className={`relative p-5 rounded-2xl border transition-all ${
                      badge.earned
                        ? 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-amber-500/30 hover:shadow-lg hover:-translate-y-0.5'
                        : 'bg-[var(--color-surface)]/50 border-[var(--color-border)]/40 opacity-60'
                    }`}
                  >
                    {!badge.earned && (
                      <div className="absolute top-3 right-3">
                        <LuLock size={14} className="text-[var(--color-muted)]" />
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`text-3xl flex-shrink-0 ${!badge.earned ? 'grayscale opacity-40' : ''}`}>{badge.icon}</div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="font-semibold text-sm text-[var(--color-text)] truncate">{badge.title}</div>
                        <p className="text-xs text-[var(--color-muted)] leading-relaxed">{badge.desc}</p>
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${RARITY_STYLES[badge.rarity]}`}>
                            {badge.rarity}
                          </span>
                          <span className="text-[10px] font-mono text-amber-400">+{badge.xp} XP</span>
                          {badge.earned && badge.date && (
                            <span className="text-[10px] font-mono text-[var(--color-muted)] ml-1">Lvl {apiData?.level || 7}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
                <LuTrophy size={16} className="text-amber-400" />
                <h2 className="font-semibold text-base text-[var(--color-text)]">Global Leaderboard</h2>
              </div>
              <div className="divide-y divide-[var(--color-border)]/50">
                {leaderboard.map(user => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-4 px-6 py-4 transition-all ${user.isYou ? 'bg-[var(--color-primary)]/5 border-l-2 border-l-[var(--color-primary)]' : 'hover:bg-[var(--color-background)]'}`}
                  >
                    <div className="w-7 text-center">
                      {user.badge ? (
                        <span className="text-lg">{user.badge}</span>
                      ) : (
                        <span className="text-sm font-mono font-bold text-[var(--color-muted)]">#{user.rank}</span>
                      )}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                        {user.name}
                        {user.isYou && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">YOU</span>}
                      </div>
                    </div>
                    <div className="text-sm font-bold font-mono text-amber-400">{user.xp.toLocaleString()} XP</div>
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
