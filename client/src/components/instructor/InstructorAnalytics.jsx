"use client";

import React, { useState } from 'react';
import {
  LuChartBar, LuTrendingUp, LuUsers, LuStar, LuZap,
  LuBookOpen, LuTriangleAlert, LuCircleCheck, LuBrain,
  LuActivity, LuTarget,
} from 'react-icons/lu';

function BarChart({ data, labelKey, valueKey, color = 'bg-[var(--color-primary)]', unit = '' }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--color-muted)] truncate pr-2">{d[labelKey]}</span>
            <span className="font-mono font-bold text-[var(--color-text)] shrink-0">{d[valueKey]}{unit}</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-background)]">
            <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${(d[valueKey] / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniLineChart({ data, color = 'stroke-[var(--color-primary)]' }) {
  const max = Math.max(...data.map(d => d.students));
  const min = Math.min(...data.map(d => d.students));
  const range = max - min || 1;
  const W = 300, H = 60;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.students - min) / range) * H * 0.8 - H * 0.1;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
      <polyline points={pts} fill="none" className={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((d.students - min) / range) * H * 0.8 - H * 0.1;
        return <circle key={i} cx={x} cy={y} r="3" className="fill-[var(--color-surface)]" strokeWidth="2" stroke="currentColor" style={{ color: 'rgb(139, 92, 246)' }} />;
      })}
    </svg>
  );
}

function DonutChart({ value, max = 100, color = '#7c3aed', size = 80 }) {
  const r = 32, circumference = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="8" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct)}
        strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{Math.round(value)}%</text>
    </svg>
  );
}

const ANALYTICS_DATA = {
  summary: { totalStudents: 142, activeStudents: 118, totalCourses: 3, publishedLessons: 62, avgScore: 86.2, completionRate: 67 },
  weeklyEngagement: [
    { day: 'Mon', students: 82, lessons: 145 }, { day: 'Tue', students: 76, lessons: 132 },
    { day: 'Wed', students: 90, lessons: 168 }, { day: 'Thu', students: 88, lessons: 159 },
    { day: 'Fri', students: 91, lessons: 172 }, { day: 'Sat', students: 84, lessons: 148 },
    { day: 'Sun', students: 79, lessons: 128 },
  ],
  enrollmentTrend: [
    { month: 'Apr', count: 45 }, { month: 'May', count: 62 }, { month: 'Jun', count: 78 },
    { month: 'Jul', count: 95 }, { month: 'Aug', count: 118 }, { month: 'Sep', count: 142 },
  ],
  quizScoreDistribution: [
    { range: '0-50', count: 5 }, { range: '51-65', count: 12 }, { range: '66-75', count: 28 },
    { range: '76-85', count: 38 }, { range: '86-100', count: 59 },
  ],
  completionByModule: [
    { module: 'Quantum Fundamentals', completion: 94 }, { module: 'Gates & Circuits', completion: 87 },
    { module: "Grover's Search", completion: 72 }, { module: 'Phase Estimation', completion: 48 },
    { module: "Shor's Algorithm", completion: 35 },
  ],
  lessonDropoff: [
    { lesson: 'What is a Qubit?', dropoff: 5 }, { lesson: 'Superposition & Bloch Sphere', dropoff: 8 },
    { lesson: 'CNOT & Entanglement', dropoff: 12 }, { lesson: 'Quantum Interference', dropoff: 23 },
    { lesson: 'Phase Estimation Theory', dropoff: 31 }, { lesson: 'Shor Algorithm Intro', dropoff: 38 },
  ],
  challengeSuccessRate: [
    { challenge: 'Bell State Circuit', successRate: 84 }, { challenge: 'Multi-qubit Circuit', successRate: 76 },
    { challenge: 'Oracle Optimization', successRate: 62 }, { challenge: 'QPE Implementation', successRate: 48 },
    { challenge: "Factor N=15 (Shor)", successRate: 35 },
  ],
  conceptPerformance: [
    { concept: 'Superposition', avgScore: 91 }, { concept: 'Entanglement', avgScore: 87 },
    { concept: 'Hadamard Gate', avgScore: 89 }, { concept: 'CNOT Gate', avgScore: 84 },
    { concept: 'Quantum Interference', avgScore: 76 }, { concept: 'Oracle Design', avgScore: 71 },
    { concept: 'Amplitude Amplification', avgScore: 68 }, { concept: 'Phase Kickback', avgScore: 64 },
    { concept: 'QPE Circuit', avgScore: 61 }, { concept: "Shor's Algorithm", avgScore: 55 },
  ],
};

export default function InstructorAnalytics() {
  const [data, setData] = useState(ANALYTICS_DATA);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiFetch('/instructor/analytics');
        if (res?.success && res.data) {
          // Merge with fallback data for any missing fields to ensure UI doesn't break
          setData({ ...ANALYTICS_DATA, ...res.data });
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <LuChartBar size={20} className="text-[var(--color-primary)]" /> Instructor Analytics
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">Comprehensive insights into student performance, content effectiveness, and engagement.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Students', value: data.summary.totalStudents, color: 'text-[var(--color-primary)]', icon: LuUsers },
          { label: 'Active Students', value: data.summary.activeStudents, color: 'text-emerald-400', icon: LuActivity },
          { label: 'Courses', value: data.summary.totalCourses, color: 'text-cyan-400', icon: LuBookOpen },
          { label: 'Lessons', value: data.summary.publishedLessons, color: 'text-amber-400', icon: LuStar },
          { label: 'Avg Score', value: `${data.summary.avgScore}%`, color: 'text-pink-400', icon: LuTarget },
          { label: 'Completion', value: `${data.summary.completionRate}%`, color: 'text-teal-400', icon: LuCircleCheck },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-[var(--color-muted)] uppercase tracking-wider">{s.label}</span>
                <Icon size={14} className={s.color} />
              </div>
              <div className={`text-xl font-bold font-heading ${s.color}`}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid — Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Engagement */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">Weekly Active Students</h3>
          <MiniLineChart data={data.weeklyEngagement} />
          <div className="flex items-end justify-between gap-1 mt-2">
            {data.weeklyEngagement.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full rounded-t-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary)] transition-colors" style={{ height: `${(d.students / 100) * 48}px` }} />
                <span className="text-[9px] font-mono text-[var(--color-muted)]">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Rate Donut */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">Overall Completion Rate</h3>
          <div className="flex items-center justify-center gap-8 py-2">
            <DonutChart value={data.summary.completionRate} color="#7c3aed" />
            <div className="space-y-2">
              {[
                { label: 'Completed', value: `${Math.round(data.summary.totalStudents * data.summary.completionRate / 100)}`, color: 'text-[var(--color-primary)]' },
                { label: 'In Progress', value: `${data.summary.activeStudents - Math.round(data.summary.totalStudents * data.summary.completionRate / 100)}`, color: 'text-amber-400' },
                { label: 'Not Started', value: `${data.summary.totalStudents - data.summary.activeStudents}`, color: 'text-rose-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${s.color.replace('text-', 'bg-')}`} />
                  <span className="text-[var(--color-muted)]">{s.label}</span>
                  <span className={`font-bold font-mono ml-auto ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollment Trend */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">Enrollment Trend</h3>
          <div className="flex items-end gap-2 h-28">
            {data.enrollmentTrend.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[9px] font-mono text-emerald-400">{d.count}</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-500 transition-colors" style={{ height: `${(d.count / 145) * 80}px` }} />
                <span className="text-[9px] font-mono text-[var(--color-muted)]">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid — Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Score Distribution */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">Quiz Score Distribution</h3>
          <BarChart data={data.quizScoreDistribution} labelKey="range" valueKey="count" color="bg-amber-500" unit=" students" />
        </div>

        {/* Module Completion */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">Module Completion Rate</h3>
          <BarChart data={data.completionByModule} labelKey="module" valueKey="completion" color="bg-cyan-500" unit="%" />
        </div>
      </div>

      {/* Charts Grid — Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lesson Dropoff Funnel */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuTriangleAlert size={14} className="text-amber-400" /> Lesson Drop-off Rate
          </h3>
          <div className="space-y-2">
            {data.lessonDropoff.map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-muted)] truncate pr-2">{d.lesson}</span>
                  <span className={`font-mono font-bold ${d.dropoff > 25 ? 'text-rose-400' : d.dropoff > 15 ? 'text-amber-400' : 'text-emerald-400'}`}>{d.dropoff}%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-background)]">
                  <div className={`h-2 rounded-full transition-all duration-700 ${d.dropoff > 25 ? 'bg-rose-500' : d.dropoff > 15 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${d.dropoff}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Success */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuZap size={14} className="text-pink-400" /> Challenge Success Rate
          </h3>
          <BarChart data={data.challengeSuccessRate} labelKey="challenge" valueKey="successRate" color="bg-pink-500" unit="%" />
        </div>
      </div>

      {/* Concept Heatmap */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
          <LuBrain size={14} className="text-[var(--color-primary)]" /> Concept-Level Performance
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {data.conceptPerformance.map((c, i) => {
            const pct = c.avgScore;
            const bg = pct >= 85 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
              pct >= 72 ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' :
              'bg-rose-500/20 border-rose-500/30 text-rose-300';
            return (
              <div key={i} className={`p-3 rounded-xl border ${bg} space-y-1`}>
                <div className="text-[10px] font-semibold leading-tight">{c.concept}</div>
                <div className="text-lg font-bold font-mono">{pct}%</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--color-muted)]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/30 inline-block" /> Strong (≥85%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/30 inline-block" /> Needs Attention (72-84%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/30 inline-block" /> Weak (&lt;72%)</span>
        </div>
      </div>
    </div>
  );
}
