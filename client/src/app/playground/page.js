"use client";

import React, { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import {
  LuCpu, LuPlay, LuLayers, LuActivity, LuTriangleAlert, LuInfo,
  LuCircleAlert, LuTrash2, LuCode, LuCopy, LuCheck, LuPlus, LuMinus,
  LuRotateCcw, LuZap, LuAtom
} from 'react-icons/lu';
import { apiFetch } from '../../services/api';
import { analyzeCircuit, generateCode } from '../../components/learner/playground/CodeGenerator';

// ── Gate definitions ─────────────────────────────────────────────────────────
const GATE_CATEGORIES = [
  {
    label: 'Single Qubit — Clifford',
    color: 'text-cyan-400',
    gates: [
      { symbol: 'H',   label: 'Hadamard',  color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',       icon: 'H' },
      { symbol: 'X',   label: 'Pauli-X',   color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: 'X' },
      { symbol: 'Y',   label: 'Pauli-Y',   color: 'bg-green-500/20 text-green-300 border-green-500/40',    icon: 'Y' },
      { symbol: 'Z',   label: 'Pauli-Z',   color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',      icon: 'Z' },
      { symbol: 'S',   label: 'S Gate (√Z)',color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',         icon: 'S' },
      { symbol: 'SDG', label: 'S† Gate',   color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',         icon: 'S†' },
      { symbol: 'T',   label: 'T Gate (π/8)',color:'bg-blue-500/20 text-blue-300 border-blue-500/40',       icon: 'T' },
      { symbol: 'TDG', label: 'T† Gate',   color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',      icon: 'T†' },
      { symbol: 'SX',  label: '√X Gate',   color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', icon: '√X' },
    ]
  },
  {
    label: 'Rotation Gates',
    color: 'text-amber-400',
    gates: [
      { symbol: 'RX',  label: 'X Rotation', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',  icon: 'Rx', hasAngle: true },
      { symbol: 'RY',  label: 'Y Rotation', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40',icon: 'Ry', hasAngle: true },
      { symbol: 'RZ',  label: 'Z Rotation', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',icon: 'Rz', hasAngle: true },
      { symbol: 'P',   label: 'Phase Shift',color: 'bg-lime-500/20 text-lime-300 border-lime-500/40',      icon: 'P', hasAngle: true },
    ]
  },
  {
    label: 'Two-Qubit Gates',
    color: 'text-purple-400',
    gates: [
      { symbol: 'CX',   label: 'CNOT',          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',   icon: 'CX',  needsControl: true },
      { symbol: 'CY',   label: 'Controlled-Y',  color: 'bg-violet-500/20 text-violet-300 border-violet-500/40',   icon: 'CY',  needsControl: true },
      { symbol: 'CZ',   label: 'Controlled-Z',  color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',icon: 'CZ',  needsControl: true },
      { symbol: 'CH',   label: 'Controlled-H',  color: 'bg-pink-500/20 text-pink-300 border-pink-500/40',          icon: 'CH',  needsControl: true },
      { symbol: 'CP',   label: 'Controlled-P',  color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',          icon: 'CP',  needsControl: true, hasAngle: true },
      { symbol: 'SWAP', label: 'SWAP',           color: 'bg-orange-500/20 text-orange-300 border-orange-500/40',   icon: '⇌',  needsSwap: true },
    ]
  },
  {
    label: 'Three-Qubit Gates',
    color: 'text-red-400',
    gates: [
      { symbol: 'CCX',  label: 'Toffoli (CCX)',  color: 'bg-red-500/20 text-red-300 border-red-500/40',             icon: 'CCX', needsControl: true },
      { symbol: 'CSWAP',label: 'Fredkin (CSWAP)',color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',          icon: 'CS',  needsControl: true },
    ]
  },
  {
    label: 'Measurement',
    color: 'text-gray-400',
    gates: [
      { symbol: 'M',    label: 'Measure',        color: 'bg-gray-500/20 text-gray-300 border-gray-500/40',           icon: 'M' },
      { symbol: 'RESET',label: 'Reset |0⟩',      color: 'bg-slate-500/20 text-slate-300 border-slate-500/40',        icon: '|0⟩' },
    ]
  }
];

// Flat map for quick lookup
const GATE_MAP = {};
GATE_CATEGORIES.forEach(cat => cat.gates.forEach(g => { GATE_MAP[g.symbol] = g; }));

const QUANTUM_ENGINES = [
  { id: 'qiskit',   name: 'Qiskit',       company: 'IBM Quantum' },
  { id: 'cirq',     name: 'Cirq',         company: 'Google' },
  { id: 'pennylane',name: 'PennyLane',    company: 'Xanadu' },
  { id: 'braket',   name: 'Braket',       company: 'AWS' },
  { id: 'openqasm', name: 'OpenQASM',     company: 'Universal IR' },
];

const ANGLE_PRESETS = [
  { label: 'π',     value: Math.PI },
  { label: 'π/2',   value: Math.PI / 2 },
  { label: 'π/4',   value: Math.PI / 4 },
  { label: 'π/8',   value: Math.PI / 8 },
  { label: '3π/4',  value: 3 * Math.PI / 4 },
  { label: '3π/2',  value: 3 * Math.PI / 2 },
  { label: '2π',    value: 2 * Math.PI },
];

function fmtAngle(rad) {
  if (rad === undefined || rad === null) return '';
  const pi = Math.PI;
  const map = [
    [pi, 'π'], [pi/2, 'π/2'], [pi/4, 'π/4'], [pi/8, 'π/8'],
    [3*pi/4, '3π/4'], [3*pi/2, '3π/2'], [2*pi, '2π'],
  ];
  for (const [v, s] of map) if (Math.abs(rad - v) < 1e-9) return s;
  return rad.toFixed(3);
}

export default function CircuitPlaygroundPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [shots, setShots] = useState('1024');

  const [numQubits, setNumQubits] = useState(4);
  const [numSteps, setNumSteps] = useState(10);

  const [circuit, setCircuit] = useState(() =>
    Array(4).fill(null).map(() => Array(10).fill(null))
  );

  const [selectedGate, setSelectedGate] = useState(null);
  const [pendingAngle, setPendingAngle] = useState(Math.PI / 2);
  const [showAnglePicker, setShowAnglePicker] = useState(false);

  // For multi-qubit gate wiring: step 1 = place target, step 2 = assign control/swap
  const [pendingWire, setPendingWire] = useState(null); // { type:'control'|'swap'|'control2', qubit, step }

  const [issues, setIssues] = useState([]);
  const [simulationResults, setSimulationResults] = useState(null);
  const [fidelity, setFidelity] = useState('N/A');
  const [selectedEngine, setSelectedEngine] = useState('qiskit');
  const [copied, setCopied] = useState(false);

  const activeEngineCode = simulationResults
    ? generateCode(circuit, numQubits, selectedEngine, parseInt(shots))
    : null;

  // Resize circuit
  useEffect(() => {
    setCircuit(prev => {
      const newC = Array(numQubits).fill(null).map((_, qi) =>
        Array(numSteps).fill(null).map((_, si) => {
          if (prev[qi] && si < prev[qi].length) {
            const g = prev[qi][si];
            if (!g) return null;
            // Drop gates that reference out-of-bound qubits
            if (g.control != null && g.control >= numQubits) return null;
            if (g.control2 != null && g.control2 >= numQubits) return null;
            if (g.target2 != null && g.target2 >= numQubits) return null;
            return g;
          }
          return null;
        })
      );
      return newC;
    });
    setSimulationResults(null);
  }, [numQubits, numSteps]);

  useEffect(() => {
    setIssues(analyzeCircuit(circuit, numQubits));
    setSimulationResults(null);
  }, [circuit]);

  const getGateInfo = (type) => GATE_MAP[type] || { color: 'bg-gray-500/20 text-gray-300 border-gray-500/40', icon: type };

  const handleCellClick = (q, s) => {
    // Resolve pending wire (assign control/swap target)
    if (pendingWire) {
      const { type: wireType, qubit: srcQ, step: srcS } = pendingWire;

      if (wireType === 'control' && q !== srcQ && s === srcS) {
        setCircuit(prev => {
          const nc = prev.map(r => [...r]);
          const g = nc[srcQ][srcS];
          if (g) {
            // If CCX already has control, assign control2
            if (g.type === 'CCX' && g.control != null) g.control2 = q;
            else g.control = q;
          }
          return nc;
        });
        // For CCX still needs control2 if not yet assigned
        const g = circuit[srcQ][srcS];
        if (g?.type === 'CCX' && g.control == null) {
          // first assignment done, pendingWire done
        }
        setPendingWire(null);
        return;
      }
      if (wireType === 'swap' && q !== srcQ && s === srcS) {
        setCircuit(prev => {
          const nc = prev.map(r => [...r]);
          const g = nc[srcQ][srcS];
          if (g) g.target2 = q;
          return nc;
        });
        setPendingWire(null);
        return;
      }
      // clicked elsewhere — cancel
      setPendingWire(null);
      return;
    }

    if (!selectedGate) return;

    const gateDef = GATE_MAP[selectedGate];
    if (!gateDef) return;

    // Check cell is empty
    if (circuit[q][s] !== null) return;

    const newGate = { type: selectedGate, target: q };
    if (gateDef.hasAngle) newGate.angle = pendingAngle;

    setCircuit(prev => {
      const nc = prev.map(r => [...r]);
      nc[q][s] = newGate;
      return nc;
    });
  };

  const removeGate = (q, s) => {
    setCircuit(prev => {
      const nc = prev.map(r => [...r]);
      nc[q][s] = null;
      return nc;
    });
  };

  const startWire = (type, q, s) => {
    setPendingWire({ type, qubit: q, step: s });
  };

  const handleRunSimulation = async () => {
    const hasGates = circuit.some(row => row.some(g => g !== null));
    if (!hasGates) { alert('Circuit is empty.'); return; }
    const hasMeasurements = circuit.some(row => row.some(g => g?.type === 'M'));
    if (!hasMeasurements) { alert('Please add at least one Measurement (M) gate.'); return; }

    setIsSimulating(true);
    setSimulationResults(null);
    try {
      const code = generateCode(circuit, numQubits, 'qiskit', parseInt(shots));
      const response = await apiFetch('/learner/simulations/run', {
        method: 'POST',
        body: JSON.stringify({ circuitCode: code, backend: 'qiskit_aer', shots: parseInt(shots) })
      });
      const simRun = response?.data?.simulationRun;
      if (simRun?.results?.counts) {
        setSimulationResults(simRun.results.counts);
        setFidelity(simRun.fidelity ? `${(simRun.fidelity * 100).toFixed(2)}%` : 'N/A');
      } else {
        alert('Simulation completed but no probability data was returned.');
      }
    } catch (error) {
      alert(error?.message || 'Simulation failed.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!activeEngineCode) return;
    try {
      await navigator.clipboard.writeText(activeEngineCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const formatResults = () => {
    if (!simulationResults) return [];
    const total = Object.values(simulationResults).reduce((a, b) => a + b, 0);
    return Object.entries(simulationResults)
      .map(([state, count]) => ({ state: `|${state}⟩`, prob: count / total }))
      .sort((a, b) => a.state.localeCompare(b.state));
  };
  const resultsData = formatResults();

  // Gate label for cell display
  function gateLabel(gate) {
    const info = getGateInfo(gate.type);
    let label = info.icon || gate.type;
    if (gate.angle !== undefined) label += ` ${fmtAngle(gate.angle)}`;
    return label;
  }

  // Vertical wire positions for 2-qubit controlled gates
  function getControlWireStyle(gate, qIndex) {
    const ctrl = gate.control;
    if (ctrl === undefined || ctrl === null) return null;
    const top = Math.min(ctrl, qIndex);
    const bot = Math.max(ctrl, qIndex);
    const height = (bot - top) * 3.5;
    return {
      top: ctrl < qIndex ? `-${height}rem` : 'auto',
      bottom: ctrl > qIndex ? `-${height}rem` : 'auto',
      height: `${height}rem`,
      left: '50%',
      transform: 'translateX(-50%)',
    };
  }

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
            title="Circuit Playground"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-sm">
                    <LuAtom size={22} />
                  </div>
                  Quantum Circuit Composer
                </h1>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Build any quantum circuit — Clifford, rotation, multi-qubit, Toffoli, and more.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Qubit count */}
                <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-1.5">
                  <span className="text-[10px] text-[var(--color-muted)] uppercase font-semibold">Qubits</span>
                  <button onClick={() => setNumQubits(n => Math.max(2, n-1))} className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--color-background)] text-[var(--color-muted)] hover:text-red-400 cursor-pointer"><LuMinus size={10}/></button>
                  <span className="font-mono text-sm font-bold text-cyan-400 w-4 text-center">{numQubits}</span>
                  <button onClick={() => setNumQubits(n => Math.min(8, n+1))} className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--color-background)] text-[var(--color-muted)] hover:text-emerald-400 cursor-pointer"><LuPlus size={10}/></button>
                </div>

                {/* Step count */}
                <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-1.5">
                  <span className="text-[10px] text-[var(--color-muted)] uppercase font-semibold">Steps</span>
                  <button onClick={() => setNumSteps(n => Math.max(4, n-2))} className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--color-background)] text-[var(--color-muted)] hover:text-red-400 cursor-pointer"><LuMinus size={10}/></button>
                  <span className="font-mono text-sm font-bold text-cyan-400 w-5 text-center">{numSteps}</span>
                  <button onClick={() => setNumSteps(n => Math.min(20, n+2))} className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--color-background)] text-[var(--color-muted)] hover:text-emerald-400 cursor-pointer"><LuPlus size={10}/></button>
                </div>

                <button
                  onClick={() => setCircuit(Array(numQubits).fill(null).map(() => Array(numSteps).fill(null)))}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-muted)] hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LuRotateCcw size={13}/> Clear
                </button>
              </div>
            </div>

            {/* Static Analysis */}
            {issues.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl overflow-hidden">
                <div className="bg-amber-500/20 px-4 py-2 border-b border-amber-500/30 flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
                  <LuTriangleAlert size={14} /> Static Analysis ({issues.length} issue{issues.length > 1 ? 's' : ''})
                </div>
                <div className="p-3 max-h-28 overflow-y-auto space-y-1.5">
                  {issues.map((issue, idx) => (
                    <div key={idx} className="flex gap-2 text-xs">
                      <div className="mt-0.5 flex-shrink-0">
                        {issue.type === 'error' ? <LuCircleAlert size={13} className="text-red-400"/> :
                         issue.type === 'warning' ? <LuTriangleAlert size={13} className="text-amber-400"/> :
                         <LuInfo size={13} className="text-blue-400"/>}
                      </div>
                      <div>
                        <div className={`font-semibold ${issue.type === 'error' ? 'text-red-400' : issue.type === 'warning' ? 'text-amber-400' : 'text-blue-400'}`}>{issue.message}</div>
                        {issue.suggestion && <div className="text-[10px] text-[var(--color-muted)]">{issue.suggestion}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gate Palette */}
            <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-2">
                  <LuLayers size={14} className="text-cyan-500"/> Quantum Gate Library
                </span>
                <span className="text-[11px] text-[var(--color-muted)] font-mono">
                  {selectedGate
                    ? `Selected: ${selectedGate}${GATE_MAP[selectedGate]?.hasAngle ? ` (${fmtAngle(pendingAngle)})` : ''} — click wire to place`
                    : 'Select a gate, then click a wire cell'}
                </span>
              </div>

              {/* Rotation angle picker */}
              {selectedGate && GATE_MAP[selectedGate]?.hasAngle && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-xs text-amber-400 font-semibold">Angle:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ANGLE_PRESETS.map(p => (
                      <button
                        key={p.label}
                        onClick={() => setPendingAngle(p.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                          Math.abs(pendingAngle - p.value) < 1e-9
                            ? 'bg-amber-500 text-black font-bold shadow'
                            : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-amber-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-[var(--color-muted)] ml-auto font-mono">{fmtAngle(pendingAngle)}</span>
                </div>
              )}

              {/* Gate categories */}
              <div className="space-y-3">
                {GATE_CATEGORIES.map(cat => (
                  <div key={cat.label}>
                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${cat.color}`}>{cat.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {cat.gates.map(g => (
                        <button
                          key={g.symbol}
                          onClick={() => {
                            if (selectedGate === g.symbol) { setSelectedGate(null); setPendingWire(null); }
                            else { setSelectedGate(g.symbol); setPendingWire(null); }
                          }}
                          className={`px-3 py-2 rounded-xl border font-mono text-xs font-bold cursor-pointer transition-all min-w-[52px] text-center
                            ${g.color}
                            ${selectedGate === g.symbol ? 'ring-2 ring-cyan-400 scale-105 opacity-100 shadow-md shadow-cyan-500/20' : 'opacity-65 hover:opacity-100 hover:scale-105'}
                          `}
                          title={g.label}
                        >
                          {g.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Circuit Canvas */}
            <div className={`p-5 rounded-3xl bg-[var(--color-surface)] border space-y-5 shadow-md transition-all duration-200 ${selectedGate || pendingWire ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.12)]' : 'border-[var(--color-border)]'}`}>
              {/* Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] text-cyan-400">
                    {numQubits}Q × {numSteps}T
                  </span>
                  <span className="text-[11px] text-[var(--color-muted)] italic">
                    {pendingWire
                      ? `Click another qubit in step ${pendingWire.step} to assign ${pendingWire.type}`
                      : selectedGate
                        ? `Placing ${selectedGate}${GATE_MAP[selectedGate]?.hasAngle ? ` (${fmtAngle(pendingAngle)})` : ''} — click an empty cell`
                        : 'Select a gate from the library above'}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Engine picker */}
                  <div className="flex items-center gap-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-2.5 py-1">
                    <LuZap size={12} className="text-cyan-400"/>
                    <select
                      value={selectedEngine}
                      onChange={e => setSelectedEngine(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-cyan-400 focus:outline-none cursor-pointer"
                    >
                      {QUANTUM_ENGINES.map(eng => (
                        <option key={eng.id} value={eng.id} className="bg-gray-900 text-white">
                          {eng.name} ({eng.company})
                        </option>
                      ))}
                    </select>
                  </div>

                  <select
                    value={shots}
                    onChange={e => setShots(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-mono focus:outline-none"
                  >
                    <option value="256">256 Shots</option>
                    <option value="512">512 Shots</option>
                    <option value="1024">1024 Shots</option>
                    <option value="4096">4096 Shots</option>
                    <option value="8192">8192 Shots</option>
                  </select>

                  <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <LuPlay size={14} className={isSimulating ? 'animate-spin' : ''} />
                    {isSimulating ? 'Simulating...' : 'Run Simulation'}
                  </button>
                </div>
              </div>

              {/* Wire Canvas */}
              <div className="overflow-x-auto rounded-2xl bg-[var(--color-background)]/80 border border-[var(--color-border)] p-4">
                <div className="relative" style={{ minWidth: `${numSteps * 60 + 80}px` }}>
                  {circuit.map((row, qIndex) => (
                    <div key={`q-${qIndex}`} className="relative flex items-center mb-1" style={{ height: '56px' }}>
                      {/* Qubit label */}
                      <div className="w-16 flex-shrink-0 font-mono text-xs font-bold text-[var(--color-muted)] text-right pr-3">
                        |q{qIndex}⟩
                      </div>

                      {/* Horizontal wire */}
                      <div className="absolute h-px bg-[var(--color-border)] z-0" style={{ left: '64px', right: 0, top: '50%' }} />

                      {/* Gate cells */}
                      <div className="flex items-center gap-1 pl-2 relative z-10 flex-1">
                        {row.map((gate, sIndex) => (
                          <div
                            key={`c-${qIndex}-${sIndex}`}
                            onClick={() => handleCellClick(qIndex, sIndex)}
                            className={`w-12 h-10 flex-shrink-0 flex items-center justify-center rounded-lg transition-all relative
                              ${gate
                                ? 'cursor-default'
                                : (selectedGate || pendingWire)
                                  ? 'border-dashed border border-cyan-500/40 hover:bg-cyan-500/10 cursor-crosshair'
                                  : 'border-dashed border border-[var(--color-border)]/50 hover:border-[var(--color-border)]'}
                            `}
                          >
                            {/* Pending wire indicator (pulsing dot) */}
                            {!gate && pendingWire?.step === sIndex && (
                              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            )}

                            {gate && (() => {
                              const info = getGateInfo(gate.type);
                              const label = gateLabel(gate);
                              const needsCtrl = info.needsControl && (gate.control === undefined || gate.control === null);
                              const needsSwapTarget = info.needsSwap && (gate.target2 === undefined || gate.target2 === null);
                              const needsCtrl2 = gate.type === 'CCX' && gate.control != null && (gate.control2 === undefined || gate.control2 === null);

                              return (
                                <div className={`absolute inset-0.5 flex flex-col items-center justify-center rounded-lg border ${info.color} shadow-sm group z-20 select-none`}>
                                  {/* Gate symbol */}
                                  <span className="font-bold font-mono text-[11px] leading-tight text-center px-0.5 truncate max-w-full">
                                    {label}
                                  </span>

                                  {/* Delete on hover */}
                                  <div
                                    onClick={e => { e.stopPropagation(); removeGate(qIndex, sIndex); }}
                                    className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-red-500 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow z-30"
                                    title="Remove gate"
                                  >
                                    <LuTrash2 size={9} className="text-white" />
                                  </div>

                                  {/* Assign control button (red dot) */}
                                  {needsCtrl && (
                                    <div
                                      onClick={e => { e.stopPropagation(); startWire('control', qIndex, sIndex); }}
                                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full cursor-pointer border-2 border-[var(--color-background)] hover:scale-125 transition-transform shadow z-30 animate-pulse"
                                      title="Click to assign control qubit"
                                    />
                                  )}
                                  {/* Assign control2 button for CCX (blue dot) */}
                                  {needsCtrl2 && (
                                    <div
                                      onClick={e => { e.stopPropagation(); startWire('control', qIndex, sIndex); }}
                                      className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-2 border-[var(--color-background)] hover:scale-125 transition-transform shadow z-30 animate-pulse"
                                      title="Click to assign 2nd control qubit"
                                    />
                                  )}
                                  {/* Assign swap target (orange dot) */}
                                  {needsSwapTarget && (
                                    <div
                                      onClick={e => { e.stopPropagation(); startWire('swap', qIndex, sIndex); }}
                                      className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-orange-500 rounded-full cursor-pointer border-2 border-[var(--color-background)] hover:scale-125 transition-transform shadow z-30 animate-pulse"
                                      title="Click to assign SWAP partner"
                                    />
                                  )}

                                  {/* Vertical control wire */}
                                  {['CX','CY','CZ','CH','CP','CCX','CSWAP'].includes(gate.type) && gate.control != null && (() => {
                                    const ctrl = gate.control;
                                    const top = Math.min(ctrl, qIndex);
                                    const bot = Math.max(ctrl, qIndex);
                                    const h = (bot - top) * 56;
                                    return (
                                      <>
                                        <div className="absolute left-1/2 w-0.5 bg-purple-500 z-10"
                                          style={{
                                            top: ctrl < qIndex ? `-${h}px` : 'auto',
                                            bottom: ctrl > qIndex ? `-${h}px` : 'auto',
                                            height: `${h}px`,
                                            transform: 'translateX(-50%)'
                                          }}
                                        />
                                        {/* Control dot */}
                                        <div className="absolute w-3 h-3 bg-purple-500 rounded-full z-20"
                                          style={{
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            top: ctrl < qIndex ? `-${h + 6}px` : 'auto',
                                            bottom: ctrl > qIndex ? `-${h + 6}px` : 'auto',
                                          }}
                                        />
                                      </>
                                    );
                                  })()}

                                  {/* SWAP wire */}
                                  {gate.type === 'SWAP' && gate.target2 != null && (() => {
                                    const t2 = gate.target2;
                                    const top2 = Math.min(t2, qIndex);
                                    const bot2 = Math.max(t2, qIndex);
                                    const h = (bot2 - top2) * 56;
                                    return (
                                      <div className="absolute left-1/2 w-0.5 bg-orange-400 z-10"
                                        style={{
                                          top: t2 > qIndex ? '50%' : 'auto',
                                          bottom: t2 < qIndex ? '50%' : 'auto',
                                          height: `${h / 2}px`,
                                          transform: 'translateX(-50%)'
                                        }}
                                      />
                                    );
                                  })()}
                                </div>
                              );
                            })()}
                          </div>
                        ))}
                      </div>

                      {/* Qubit state label at end */}
                      <div className="w-8 flex-shrink-0 font-mono text-[10px] text-[var(--color-muted)] pl-1">
                        {/* End cap */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Measurement Probability Spectrum */}
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <h3 className="font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
                  <LuActivity size={18} className="text-cyan-400" />
                  Statevector Measurement Probability Spectrum
                </h3>
                {simulationResults && (
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                    Fidelity: {fidelity}
                  </span>
                )}
              </div>

              {!simulationResults && !isSimulating && (
                <div className="py-12 text-center text-[var(--color-muted)] text-sm">
                  Add Measurement (M) gates and click "Run Simulation" to generate probability data.
                </div>
              )}

              {isSimulating && (
                <div className="py-12 flex flex-col items-center gap-4">
                  <LuCpu size={32} className="text-cyan-500 animate-pulse" />
                  <p className="text-sm font-mono text-cyan-400 animate-pulse">Computing statevector amplitudes over {shots} shots...</p>
                </div>
              )}

              {simulationResults && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {resultsData.map(p => {
                    const pct = (p.prob * 100).toFixed(1);
                    return (
                      <div key={p.state} className="p-3 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-2 flex flex-col justify-end">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="font-bold text-[var(--color-text)]">{p.state}</span>
                          <span className="text-cyan-400 font-semibold">{pct}%</span>
                        </div>
                        <div className="w-full h-20 rounded bg-[var(--color-border)]/50 flex flex-col justify-end overflow-hidden p-0.5">
                          <div
                            className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded transition-all duration-1000"
                            style={{ height: `${Math.max(4, parseFloat(pct))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Generated Code (post-simulation) */}
            {simulationResults && activeEngineCode && (
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <LuCode size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
                        Generated Circuit Code
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Simulation Succeeded</span>
                      </h3>
                      <p className="text-xs text-[var(--color-muted)]">Export to any quantum engine — switch tabs to translate</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {copied ? <LuCheck size={14} className="text-emerald-400"/> : <LuCopy size={14}/>}
                    {copied ? 'Copied!' : `Copy ${QUANTUM_ENGINES.find(e => e.id === selectedEngine)?.name} Code`}
                  </button>
                </div>

                {/* Engine tabs */}
                <div className="flex flex-wrap gap-2 pb-3 border-b border-[var(--color-border)]">
                  {QUANTUM_ENGINES.map(eng => {
                    const active = selectedEngine === eng.id;
                    return (
                      <button
                        key={eng.id}
                        onClick={() => setSelectedEngine(eng.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                          active
                            ? 'bg-cyan-500 text-black shadow-lg ring-2 ring-cyan-400'
                            : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-gray-500'
                        }`}
                      >
                        <span className="font-bold">{eng.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${active ? 'bg-black/20 text-black' : 'bg-[var(--color-surface)] text-gray-400'}`}>
                          {eng.company}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-[#0d1117] border border-gray-800 text-gray-200 font-mono text-xs overflow-x-auto leading-relaxed select-text">
                  <pre className="whitespace-pre">{activeEngineCode}</pre>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
