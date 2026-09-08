"use client";

import React from 'react';
import {
  LuMicroscope,
  LuCpu,
  LuActivity,
  LuCircleCheckBig,
  LuSparkles,
} from 'react-icons/lu';

export default function ResearcherOverview({ user, workspaceData }) {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-500/15 via-[var(--color-surface)] to-[var(--color-primary)]/15 border border-[var(--color-border)] shadow-sm">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-600 text-white">
            <LuMicroscope size={14} />
            <span>Advanced Quantum Research Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[var(--color-text)]">
            Researcher Lab: {user?.name || 'Dr. Researcher'}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
            Execute high-performance statevector simulations, analyze Hamiltonian energy spectrums, and submit quantum job batches to QPU hardware targets.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Allocated Qubits</span>
            <LuCpu size={20} className="text-cyan-500" />
          </div>
          <div className="text-3xl font-bold font-heading text-[var(--color-text)]">
            {workspaceData?.allocatedQubits ?? 64} Qubits
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono">
            Target: {workspaceData?.hardwareTarget ?? 'IBM Eagle / IonQ Forte'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Simulations</span>
            <LuActivity size={20} className="text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-heading text-[var(--color-text)]">
            {workspaceData?.activeSimulations ?? 3} Running
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono">Statevector & Density Matrix</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">RBAC Security Clearance</span>
            <LuCircleCheckBig size={20} className="text-emerald-500" />
          </div>
          <div className="text-sm font-semibold text-emerald-500">Tier 2 Clearance Verified</div>
          <p className="text-xs text-[var(--color-muted)] font-mono">Role: RESEARCHER &bull; HttpOnly Protected</p>
        </div>
      </div>
    </div>
  );
}
