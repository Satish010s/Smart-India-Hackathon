"use client";

import React from 'react';
import { LuFileText, LuPlay, LuActivity, LuSparkles } from 'react-icons/lu';

export default function ResearchExperiments({ workspaceData }) {
  const experiments = [
    {
      title: 'Variational Quantum Eigensolver (VQE) for LiH Molecule Ground State',
      qpu: 'IBM Eagle (127-Qubit)',
      shots: 8192,
      status: 'Converged',
      loss: '0.0024 Ha',
    },
    {
      title: 'Zero-Noise Extrapolation (ZNE) Error Mitigation Benchmarking',
      qpu: 'IonQ Forte (32-Aria)',
      shots: 4096,
      status: 'Executing',
      loss: 'Scale Factor: 1.5, 2.0',
    },
    {
      title: 'Quantum Phase Estimation for Discrete Logarithm Verification',
      qpu: 'Local Simulator',
      shots: 16384,
      status: 'Completed',
      loss: 'Precision: 10 Qubits',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
              <LuActivity size={22} className="text-cyan-500" />
              Active Research Experiments & Jobs
            </h2>
            <p className="text-xs text-[var(--color-muted)]">Live circuit simulations running across cloud QPU backends</p>
          </div>
          <button className="text-xs font-semibold px-4 py-2 rounded-xl bg-cyan-600 text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer">
            <LuPlay size={13} />
            <span>Submit New Batch</span>
          </button>
        </div>

        <div className="space-y-3">
          {experiments.map((exp) => (
            <div
              key={exp.title}
              className="p-5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="font-semibold text-sm text-[var(--color-text)]">{exp.title}</div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] font-mono">
                  <span>Backend: {exp.qpu}</span>
                  <span>&bull;</span>
                  <span>Shots: {exp.shots.toLocaleString()}</span>
                  <span>&bull;</span>
                  <span>Metric: {exp.loss}</span>
                </div>
              </div>

              <span
                className={`text-xs font-mono font-semibold px-3 py-1 rounded-full border self-start md:self-auto ${
                  exp.status === 'Executing'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}
              >
                {exp.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Publications / Papers */}
      <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <LuFileText size={22} className="text-[var(--color-primary)]" />
          Preprints & Compiled Artifacts
        </h2>
        <div className="space-y-3">
          {(workspaceData?.recentPapers || [
            'Variational Quantum Eigensolver for Molecular Binding',
            'Error Mitigation in 127-Qubit Systems',
          ]).map((paper) => (
            <div
              key={paper}
              className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <LuFileText size={18} className="text-cyan-500" />
                <span className="font-medium text-sm text-[var(--color-text)]">{paper}</span>
              </div>
              <span className="text-xs font-mono text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                LaTeX Compiled
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
