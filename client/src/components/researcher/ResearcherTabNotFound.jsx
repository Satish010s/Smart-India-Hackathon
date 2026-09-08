"use client";

import React from 'react';
import Link from 'next/link';
import {
  LuCircleAlert,
  LuLayoutDashboard,
  LuActivity,
  LuDatabase,
  LuFileText,
  LuCpu,
  LuArrowLeft,
  LuSparkles,
} from 'react-icons/lu';

export default function ResearcherTabNotFound({ requestedTab, onSelectTab }) {
  const availableModules = [
    {
      id: 'overview',
      label: 'Workspace Overview',
      desc: 'Active jobs, 64-qubit cluster metrics, and recent experiments',
      icon: LuLayoutDashboard,
      href: '/dashboard/researcher',
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
    },
    {
      id: 'simulations',
      label: 'Simulations & VQE',
      desc: 'Ground state energy solvers, Hamiltonians, and statevectors',
      icon: LuActivity,
      href: '/dashboard/researcher?tab=simulations',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'hardware',
      label: 'QPU Hardware Quota',
      desc: 'Rigetti Aspen, IBM Eagle, and IonQ Forte superconducting nodes',
      icon: LuDatabase,
      href: '/dashboard/researcher?tab=hardware',
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
    },
    {
      id: 'papers',
      label: 'Research Papers',
      desc: 'Preprints, BibTeX citations, and publication manuscripts',
      icon: LuFileText,
      href: '/dashboard/researcher?tab=papers',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
    {
      id: 'playground',
      label: 'Circuit Playground',
      desc: 'Multi-qubit gate drag-and-drop circuit canvas and Bloch spheres',
      icon: LuCpu,
      href: '/playground',
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Notice Card */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-[var(--color-surface)] to-[var(--color-surface)] p-8 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center flex-shrink-0 shadow-inner">
              <LuCircleAlert size={32} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  Tab Not Found (404)
                </span>
                <span className="text-xs font-mono text-[var(--color-muted)]">
                  Cluster Code: ERR_MODULE_UNAVAILABLE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--color-text)]">
                Research Module &ldquo;{requestedTab || 'unknown'}&rdquo; Unavailable
              </h2>
              <p className="text-sm text-[var(--color-muted)] max-w-2xl">
                The requested tab parameter does not match any provisioned quantum research module in this workspace. Choose a verified module below or return to your overview.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/researcher"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-xs shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 transition-all cursor-pointer"
          >
            <LuArrowLeft size={16} />
            <span>Return to Overview</span>
          </Link>
        </div>
      </div>

      {/* Available Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-2">
            <LuSparkles size={16} className="text-cyan-500" />
            Available Verified Modules
          </h3>
          <span className="text-xs font-mono text-[var(--color-muted)]">
            5 Operational Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={mod.href}
                className="group relative p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-cyan-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl ${mod.bg} ${mod.border} border ${mod.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-border)]/50 text-[var(--color-muted)] group-hover:text-cyan-400 transition-colors">
                    Active
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm text-[var(--color-text)] group-hover:text-cyan-400 transition-colors">
                    {mod.label}
                  </h4>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--color-border)]/40 flex items-center justify-between text-xs font-semibold text-cyan-500">
                  <span>Open Module</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
