"use client";

import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Sidebar from '../../components/sidebar/Sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import {
  LuChartBar,
  LuSparkles,
  LuAward,
  LuGraduationCap,
  LuCheck,
  LuCircleCheckBig,
} from 'react-icons/lu';

export default function ProgressPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const stats = [
    { label: 'Circuits Created', value: '18', change: '+3 this week' },
    { label: 'Simulations Run', value: '84', change: '+12 this week' },
    { label: 'Challenges Solved', value: '14', change: '85% Accuracy' },
    { label: 'Certificates Earned', value: '2', change: 'Quantum Foundations' },
  ];

  const milestones = [
    { title: 'Superposition & Qubit Measurement', status: 'Completed', date: 'Sept 2026' },
    { title: 'Quantum Teleportation Protocol', status: 'Completed', date: 'Sept 2026' },
    { title: 'Deutsch-Jozsa & Grover Oracles', status: 'In Progress', date: 'Expected Oct 2026' },
    { title: 'Variational Quantum Eigensolver', status: 'Upcoming', date: 'Expected Nov 2026' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex">
        <Sidebar
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
            title="Learning Analytics & Progress"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-2"
                >
                  <span className="text-xs font-medium text-[var(--color-muted)]">{s.label}</span>
                  <div className="text-3xl font-extrabold font-mono text-[var(--color-text)]">
                    {s.value}
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold block">
                    {s.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Milestones Timeline */}
            <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                <LuAward size={20} className="text-cyan-400" />
                <span>Quantum Learning Roadmap</span>
              </h2>

              <div className="space-y-4">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
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

                    <span
                      className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                        m.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : m.status === 'In Progress'
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'bg-[var(--color-border)]/50 text-[var(--color-muted)]'
                      }`}
                    >
                      {m.status}
                    </span>
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
