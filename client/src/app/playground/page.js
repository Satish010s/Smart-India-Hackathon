"use client";

import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Sidebar from '../../components/sidebar/Sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import {
  LuCpu,
  LuPlay,
  LuRotateCcw,
  LuSparkles,
  LuLayers,
  LuActivity,
  LuShare2,
} from 'react-icons/lu';

const PRESET_CIRCUITS = {
  bell: {
    name: 'Bell State (|Φ⁺⟩)',
    qubits: 2,
    gates: [
      { wire: 0, step: 0, gate: 'H' },
      { wire: 0, step: 1, gate: 'CNOT_CTRL' },
      { wire: 1, step: 1, gate: 'CNOT_TGT' },
    ],
    probabilities: [
      { state: '|00⟩', prob: 0.5 },
      { state: '|01⟩', prob: 0.0 },
      { state: '|10⟩', prob: 0.0 },
      { state: '|11⟩', prob: 0.5 },
    ],
  },
  ghz: {
    name: '3-Qubit GHZ State',
    qubits: 3,
    gates: [
      { wire: 0, step: 0, gate: 'H' },
      { wire: 0, step: 1, gate: 'CNOT_CTRL' },
      { wire: 1, step: 1, gate: 'CNOT_TGT' },
      { wire: 1, step: 2, gate: 'CNOT_CTRL' },
      { wire: 2, step: 2, gate: 'CNOT_TGT' },
    ],
    probabilities: [
      { state: '|000⟩', prob: 0.5 },
      { state: '|001⟩', prob: 0.0 },
      { state: '|010⟩', prob: 0.0 },
      { state: '|011⟩', prob: 0.0 },
      { state: '|100⟩', prob: 0.0 },
      { state: '|101⟩', prob: 0.0 },
      { state: '|110⟩', prob: 0.0 },
      { state: '|111⟩', prob: 0.5 },
    ],
  },
  superposition: {
    name: 'Uniform Superposition (Hadamard)',
    qubits: 2,
    gates: [
      { wire: 0, step: 0, gate: 'H' },
      { wire: 1, step: 0, gate: 'H' },
    ],
    probabilities: [
      { state: '|00⟩', prob: 0.25 },
      { state: '|01⟩', prob: 0.25 },
      { state: '|10⟩', prob: 0.25 },
      { state: '|11⟩', prob: 0.25 },
    ],
  },
};

const GATE_PALETTE = [
  { symbol: 'H', label: 'Hadamard', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
  { symbol: 'X', label: 'Pauli-X (NOT)', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { symbol: 'Y', label: 'Pauli-Y', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { symbol: 'Z', label: 'Pauli-Z (Phase)', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { symbol: 'CNOT', label: 'Controlled-NOT', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  { symbol: 'T', label: 'T-Gate (π/8)', color: 'bg-pink-500/20 text-pink-400 border-pink-500/40' },
  { symbol: 'S', label: 'Phase (π/4)', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
  { symbol: 'M', label: 'Measurement', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
];

export default function CircuitPlaygroundPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('bell');
  const [isSimulating, setIsSimulating] = useState(false);
  const [shots, setShots] = useState('1024');

  const circuit = PRESET_CIRCUITS[activePreset];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 800);
  };

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
            title="Circuit Playground"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Header / Preset Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-[var(--color-text)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] flex items-center justify-center shadow-sm">
                    <LuCpu size={22} />
                  </div>
                  <span>Quantum Circuit Composer</span>
                </h1>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Assemble quantum logic gates on multi-qubit registers and inspect statevector amplitudes.
                </p>
              </div>

              {/* Template Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {Object.keys(PRESET_CIRCUITS).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActivePreset(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activePreset === key
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {PRESET_CIRCUITS[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantum Gate Palette */}
            <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-2">
                  <LuLayers size={14} className="text-cyan-500" />
                  Quantum Gate Library
                </span>
                <span className="text-[11px] font-mono text-[var(--color-muted)]">
                  Click or drag to inject into wire
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {GATE_PALETTE.map((g) => (
                  <div
                    key={g.symbol}
                    className={`p-2.5 rounded-xl border ${g.color} text-center font-mono font-bold cursor-pointer hover:scale-105 transition-all shadow-sm flex flex-col items-center justify-center`}
                    title={g.label}
                  >
                    <span className="text-base">{g.symbol}</span>
                    <span className="text-[9px] font-sans opacity-80 truncate w-full">{g.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Circuit Wire Canvas */}
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] text-cyan-400">
                    {circuit.qubits} Qubits Active
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    Preset: <strong className="text-[var(--color-text)]">{circuit.name}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={shots}
                    onChange={(e) => setShots(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-mono"
                  >
                    <option value="512">512 Shots</option>
                    <option value="1024">1024 Shots</option>
                    <option value="4096">4096 Shots</option>
                  </select>

                  <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <LuPlay size={14} className={isSimulating ? 'animate-spin' : ''} />
                    <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
                  </button>
                </div>
              </div>

              {/* Wire Lines Visualizer */}
              <div className="space-y-6 py-6 px-4 bg-[var(--color-background)]/80 rounded-2xl border border-[var(--color-border)]">
                {Array.from({ length: circuit.qubits }).map((_, wireIdx) => (
                  <div key={wireIdx} className="relative flex items-center gap-4">
                    <span className="w-12 font-mono text-xs font-bold text-[var(--color-muted)] flex-shrink-0">
                      |q_{wireIdx}⟩
                    </span>
                    {/* The wire line */}
                    <div className="flex-1 relative h-1 bg-[var(--color-border)] rounded flex items-center">
                      <div className="absolute inset-0 flex items-center justify-around px-8">
                        {circuit.gates
                          .filter((g) => g.wire === wireIdx)
                          .map((g, idx) => (
                            <div
                              key={idx}
                              className="px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold shadow-md transform hover:scale-110 transition-transform"
                            >
                              {g.gate}
                            </div>
                          ))}
                        <div className="px-2 py-1 rounded bg-[var(--color-border)] text-[var(--color-muted)] font-mono text-[10px]">
                          [M]
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Measurement Probabilities Histogram */}
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
                  <LuActivity size={18} className="text-cyan-400" />
                  Statevector Measurement Probability Spectrum
                </h3>
                <span className="text-xs font-mono text-[var(--color-muted)]">
                  Fidelity: 99.98%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {circuit.probabilities.map((p) => {
                  const percent = (p.prob * 100).toFixed(1);
                  return (
                    <div
                      key={p.state}
                      className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="font-bold text-[var(--color-text)]">{p.state}</span>
                        <span className="text-cyan-400 font-semibold">{percent}%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[var(--color-border)]/50 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
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
