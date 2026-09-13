"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import { useAuthStore } from '../../store/useAuthStore';
import { apiFetch } from '../../services/api';
import {
  LuUser, LuMail, LuCalendar, LuPencil, LuSave, LuX,
  LuTrophy, LuBookOpen, LuFlame, LuZap, LuTarget,
  LuStar, LuClock, LuActivity, LuGraduationCap, LuMedal,
  LuCheck, LuCamera, LuShield,
} from 'react-icons/lu';

const ACTIVITY_HEATMAP = Array.from({ length: 52 * 7 }, (_, i) => ({
  value: Math.random() > 0.6 ? Math.floor(Math.random() * 4) : 0,
}));

const ENROLLED_COURSES = [
  { title: 'Quantum Fundamentals', progress: 100, modules: 5 },
  { title: 'Quantum Algorithms Masterclass', progress: 62, modules: 6 },
  { title: 'Variational Quantum Eigensolver', progress: 25, modules: 5 },
];

const RECENT_CERTS = [
  { title: 'Quantum Fundamentals', date: 'Aug 2026', icon: '🎓' },
];

function HeatmapCalendar() {
  const weeks = [];
  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(ACTIVITY_HEATMAP[w * 7 + d]);
    }
    weeks.push(week);
  }

  const colorMap = ['bg-[var(--color-border)]/20', 'bg-[var(--color-primary)]/20', 'bg-[var(--color-primary)]/50', 'bg-[var(--color-primary)]/80', 'bg-[var(--color-primary)]'];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-0.5 min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day, di) => (
              <div
                key={di}
                title={`Activity level: ${day.value}`}
                className={`w-3 h-3 rounded-sm ${colorMap[day.value] || colorMap[0]} transition-colors hover:ring-1 hover:ring-[var(--color-primary)] cursor-default`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [bio, setBio] = useState("Quantum computing enthusiast with a background in physics. Passionate about quantum algorithms and their applications in cryptography and machine learning.");
  const [tempBio, setTempBio] = useState(bio);

  useEffect(() => {
    apiFetch('/learner/profile')
      .then(res => {
        if (res?.success && res.data) {
          setApiData(res.data);
          if (res.data.bio) { setBio(res.data.bio); setTempBio(res.data.bio); }
        }
      })
      .catch(() => {});
  }, []);

  const profileStats = apiData?.stats || { xp: 4250, lessons: 54, streak: 12, challenges: 13, hours: 38.5, rank: 42 };

  const profileData = {
    name: user?.name || 'Arjun Sharma',
    email: user?.email || 'arjun.sharma@iit.ac.in',
    joined: apiData?.joined || 'August 2026',
    institution: apiData?.institution || 'IIT Bombay',
    level: apiData?.level || 7,
    xp: profileStats.xp,
    streak: profileStats.streak,
    rank: `#${profileStats.rank}`,
  };

  const enrolledCourses = apiData?.enrolledCourses || [
    { title: 'Quantum Fundamentals', progress: 100, modules: 5 },
    { title: 'Quantum Algorithms Masterclass', progress: 62, modules: 6 },
    { title: 'Variational Quantum Eigensolver', progress: 25, modules: 5 },
  ];

  const certificates = apiData?.certificates || [
    { title: 'Quantum Fundamentals', date: 'Aug 2026', icon: '🎓' },
  ];

  const stats = [
    { label: 'XP Earned', value: profileStats.xp?.toLocaleString?.() || '4,250', icon: LuZap, color: 'text-amber-400' },
    { label: 'Lessons Done', value: profileStats.lessons || 54, icon: LuBookOpen, color: 'text-blue-400' },
    { label: 'Day Streak', value: profileStats.streak || 12, icon: LuFlame, color: 'text-rose-400' },
    { label: 'Challenges', value: profileStats.challenges || 13, icon: LuTrophy, color: 'text-cyan-400' },
    { label: 'Hours Spent', value: `${profileStats.hours || 38.5}h`, icon: LuClock, color: 'text-violet-400' },
    { label: 'Global Rank', value: profileData.rank, icon: LuTarget, color: 'text-emerald-400' },
  ];

  // Save bio via API
  async function saveBio() {
    setBio(tempBio);
    setEditing(false);
    try {
      await apiFetch('/learner/profile', { method: 'PATCH', body: JSON.stringify({ bio: tempBio }) });
    } catch {}
  }

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
            title="Profile"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            {/* Profile header card */}
            <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/15 via-[var(--color-surface)] to-[var(--color-secondary)]/10 p-6 sm:p-8">
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--color-primary)]/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                    {profileData.name[0]}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors shadow-md">
                    <LuCamera size={13} />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl font-bold font-heading text-[var(--color-text)]">{profileData.name}</h1>
                      <span className="px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold border border-[var(--color-primary)]/20">
                        Level {profileData.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--color-muted)] mt-1 flex-wrap">
                      <span className="flex items-center gap-1.5"><LuMail size={13} />{profileData.email}</span>
                      <span className="flex items-center gap-1.5"><LuGraduationCap size={13} />{profileData.institution}</span>
                      <span className="flex items-center gap-1.5"><LuCalendar size={13} />Joined {profileData.joined}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {editing ? (
                    <div className="space-y-2">
                      <textarea
                        value={tempBio}
                        onChange={e => setTempBio(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary)]/40 bg-[var(--color-background)] text-sm text-[var(--color-text)] focus:outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setBio(tempBio); setEditing(false); }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                        >
                          <LuSave size={12} /> Save
                        </button>
                        <button
                          onClick={() => { setTempBio(bio); setEditing(false); }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                        >
                          <LuX size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 group">
                      <p className="text-sm text-[var(--color-muted)] leading-relaxed flex-1">{bio}</p>
                      <button
                        onClick={() => setEditing(true)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[var(--color-border)]/30 text-[var(--color-muted)] transition-all flex-shrink-0"
                      >
                        <LuPencil size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit button */}
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)]/40 transition-all"
                  >
                    <LuPencil size={14} /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-2 text-center hover:-translate-y-0.5 transition-all">
                    <Icon size={20} className={`${s.color} mx-auto`} />
                    <div className="text-xl font-bold font-mono text-[var(--color-text)]">{s.value}</div>
                    <div className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider leading-tight">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Activity heatmap */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-base text-[var(--color-text)]">Activity Heatmap</h2>
                <span className="text-xs font-mono text-[var(--color-muted)]">Last 52 weeks</span>
              </div>
              <HeatmapCalendar />
              <div className="flex items-center gap-2 text-[10px] text-[var(--color-muted)]">
                <span>Less</span>
                {['bg-[var(--color-border)]/20', 'bg-[var(--color-primary)]/20', 'bg-[var(--color-primary)]/50', 'bg-[var(--color-primary)]/80', 'bg-[var(--color-primary)]'].map((c, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                ))}
                <span>More</span>
              </div>
            </div>

            {/* Enrolled courses + Certificates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrolled */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
                <h2 className="font-semibold text-base text-[var(--color-text)]">Enrolled Courses</h2>
                <div className="space-y-3">
                  {ENROLLED_COURSES.map(c => (
                    <div key={c.title} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-[var(--color-text)] truncate pr-4">{c.title}</div>
                        <span className="text-xs font-mono text-[var(--color-muted)] flex-shrink-0">{c.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${c.progress === 100 ? 'bg-emerald-500' : 'bg-[var(--color-primary)]'}`}
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
                <h2 className="font-semibold text-base text-[var(--color-text)]">Certificates</h2>
                {RECENT_CERTS.map(cert => (
                  <div key={cert.title} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-[var(--color-surface)] border border-amber-500/20 hover:shadow-md transition-all">
                    <span className="text-3xl">{cert.icon}</span>
                    <div>
                      <div className="font-semibold text-sm text-[var(--color-text)]">{cert.title}</div>
                      <div className="text-xs text-[var(--color-muted)]">Issued {cert.date}</div>
                    </div>
                    <button className="ml-auto text-xs font-semibold text-[var(--color-primary)] hover:underline">Download</button>
                  </div>
                ))}
                <div className="text-xs text-[var(--color-muted)] text-center py-2">
                  Complete more courses to earn certificates
                </div>
              </div>
            </div>

            {/* Account info */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
              <div className="flex items-center gap-2">
                <LuShield size={16} className="text-emerald-400" />
                <h2 className="font-semibold text-base text-[var(--color-text)]">Account & Security</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Email', value: profileData.email, icon: LuMail },
                  { label: 'Account Type', value: 'Learner', icon: LuUser },
                  { label: 'Auth Method', value: 'Argon2id + JWT', icon: LuShield },
                  { label: 'Session', value: 'Active · Verified', icon: LuCheck },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]/50">
                      <Icon size={14} className="text-[var(--color-muted)] flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm text-[var(--color-text)] font-medium">{item.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
