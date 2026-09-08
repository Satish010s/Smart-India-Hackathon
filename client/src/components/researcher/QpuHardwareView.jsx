"use client";

import React from 'react';
import { LuDatabase, LuCpu, LuClock, LuZap, LuCircleCheckBig, LuCircleAlert } from 'react-icons/lu';

export default function QpuHardwareView({ workspaceData }) {
  const qpuBackends = [
    {
      name: 'IBM Quantum Eagle',
      topology: 'Heavy-Hexagon Lattice',
      qubits: 127,
      t1: '142 μs',
      t2: '118 μs',
      fidelity: '99.82%',
      queue: '4 Jobs (approx. 12m)',
      status: 'Online',
      allocation: '42 / 64 Qubits Used',
    },
    {
      name: 'IonQ Forte',
      topology: 'All-to-All Trapped Ion',
      qubits: 32,
      t1: '> 10,000 μs',
      t2: '1,200 μs',
      fidelity: '99.95%',
      queue: '1 Job (approx. 3m)',
      status: 'Online',
      allocation: '16 / 32 Qubits Used',
    },
    {
      name: 'Rigetti Aspen-M3',
      topology: 'Octagonal Dual-Die',
      qubits: 80,
      t1: '35 μs',
      t2: '28 μs',
      fidelity: '98.90%',
      queue: 'Idle (Available Now)',
      status: 'Standby',
      allocation: '0 / 40 Qubits Used',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Compute Quota Usage Card */}
      <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
              <LuDatabase size={22} className="text-cyan-500" />
              Monthly Quantum Compute Quota (QPU Hours)
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              High-priority research tier compute credit balance for physical hardware jobs
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-cyan-500">18.4 / 25.0</span>
            <span className="text-xs text-[var(--color-muted)] ml-1 font-mono">QPU Hours</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-[var(--color-background)] border border-[var(--color-border)] h-3 rounded-full overflow-hidden p-0.5">
            <div className="bg-gradient-to-r from-cyan-500 to-[var(--color-primary)] h-full rounded-full transition-all" style={{ width: '73.6%' }} />
          </div>
          <div className="flex justify-between text-xs font-mono text-[var(--color-muted)]">
            <span>Cycle resets in 14 days</span>
            <span>73.6% Consumed</span>
          </div>
        </div>
      </div>

      {/* Available Backends Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--color-text)]">Connected Physical QPU Backends</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {qpuBackends.map((b) => (
            <div
              key={b.name}
              className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 hover:border-cyan-500/50 transition-all shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-base text-[var(--color-text)]">{b.name}</h4>
                  <p className="text-xs text-[var(--color-muted)]">{b.topology}</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {b.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[var(--color-border)]/40">
                  <span className="text-[var(--color-muted)]">Qubits:</span>
                  <span className="font-bold text-[var(--color-text)]">{b.qubits} Qubits</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--color-border)]/40">
                  <span className="text-[var(--color-muted)]">Coherence (T1/T2):</span>
                  <span className="font-semibold text-[var(--color-text)]">{b.t1} / {b.t2}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--color-border)]/40">
                  <span className="text-[var(--color-muted)]">Gate Fidelity:</span>
                  <span className="text-emerald-500 font-semibold">{b.fidelity}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--color-muted)]">Queue Time:</span>
                  <span className="text-amber-500 font-semibold">{b.queue}</span>
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full py-2.5 px-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-cyan-500 text-xs font-semibold text-[var(--color-text)] transition-colors cursor-pointer">
                  Reserve Calibration Window
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
