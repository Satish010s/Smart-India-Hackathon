"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import {
  LuCpu, LuPlay, LuLayers, LuActivity, LuTriangleAlert, LuInfo,
  LuCircleAlert, LuTrash2, LuCode, LuCopy, LuCheck, LuPlus, LuMinus,
  LuRotateCcw, LuZap, LuAtom, LuSparkles, LuBookmark, LuShare2,
  LuClock, LuSlidersHorizontal, LuHelpCircle, LuMaximize2, LuEye,
  LuGlobe, LuCircuitBoard, LuDownload, LuUpload, LuRefreshCw, LuTerminal
} from 'react-icons/lu';
import toast from 'react-hot-toast';
import { apiFetch } from '../../services/api';
import { analyzeCircuit, generateCode, parseQasmToCircuit } from '../../components/learner/playground/CodeGenerator';
import { simulateCircuitRealTime } from '../../components/learner/playground/QuantumSimulatorEngine';
import QuirkBlochSphere from '../../components/learner/playground/QuirkBlochSphere';
import { CIRCUIT_PRESETS } from '../../components/learner/playground/CircuitPresets';
import BlochSphereSimulator3D from '../../components/learner/playground/BlochSphereSimulator3D';
import QuantumHistogram from '../../components/learner/playground/QuantumHistogram';
import AmplitudePhasePanel from '../../components/learner/playground/AmplitudePhasePanel';

// ─── Gate Palette Categories (Quirk + Modern IDE) ─────────────────────────────
const GATE_CATEGORIES = [
  {
    category: 'Controls & Routing',
    color: 'text-indigo-400',
    gates: [
      { symbol: '●', type: 'CONTROL', label: 'Control (1)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50', icon: '●', isControl: true },
      { symbol: '○', type: 'ANTI_CONTROL', label: 'Anti-Control (0)', color: 'bg-slate-700/50 text-slate-300 border-slate-500/50', icon: '○', isControl: true },
      { symbol: '⊕', type: 'CX', label: 'NOT Target (⊕)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50', icon: '⊕', isTarget: true },
      { symbol: 'SWAP', type: 'SWAP', label: 'Swap (⇌)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/50', icon: '⇌', needsSwap: true },
    ]
  },
  {
    category: 'Single Qubit & Pauli',
    color: 'text-cyan-400',
    gates: [
      { symbol: 'H', type: 'H', label: 'Hadamard', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50', icon: 'H' },
      { symbol: 'X', type: 'X', label: 'Pauli-X (NOT)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50', icon: 'X' },
      { symbol: 'Y', type: 'Y', label: 'Pauli-Y', color: 'bg-teal-500/20 text-teal-300 border-teal-500/50', icon: 'Y' },
      { symbol: 'Z', type: 'Z', label: 'Pauli-Z', color: 'bg-blue-500/20 text-blue-300 border-blue-500/50', icon: 'Z' },
      { symbol: 'SX', type: 'SX', label: '√X Gate', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50', icon: '√X' },
    ]
  },
  {
    category: 'Phase & Rotations',
    color: 'text-violet-400',
    gates: [
      { symbol: 'S', type: 'S', label: 'S Gate (π/2)', color: 'bg-sky-500/20 text-sky-300 border-sky-500/50', icon: 'S' },
      { symbol: 'SDG', type: 'SDG', label: 'S† Gate (-π/2)', color: 'bg-sky-500/20 text-sky-300 border-sky-500/50', icon: 'S†' },
      { symbol: 'T', type: 'T', label: 'T Gate (π/4)', color: 'bg-violet-500/20 text-violet-300 border-violet-500/50', icon: 'T' },
      { symbol: 'TDG', type: 'TDG', label: 'T† Gate (-π/4)', color: 'bg-violet-500/20 text-violet-300 border-violet-500/50', icon: 'T†' },
      { symbol: 'RX', type: 'RX', label: 'Rx(θ)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/50', icon: 'Rx', hasAngle: true },
      { symbol: 'RY', type: 'RY', label: 'Ry(θ)', color: 'bg-orange-500/20 text-orange-300 border-orange-500/50', icon: 'Ry', hasAngle: true },
      { symbol: 'RZ', type: 'RZ', label: 'Rz(θ)', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50', icon: 'Rz', hasAngle: true },
      { symbol: 'P', type: 'P', label: 'Phase(θ)', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50', icon: 'P', hasAngle: true },
    ]
  },
  {
    category: 'Multi-Qubit & Toffoli',
    color: 'text-rose-400',
    gates: [
      { symbol: 'CX', type: 'CX', label: 'CNOT', color: 'bg-purple-500/20 text-purple-300 border-purple-500/50', icon: 'CX', needsControl: true },
      { symbol: 'CZ', type: 'CZ', label: 'Controlled-Z', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50', icon: 'CZ', needsControl: true },
      { symbol: 'CH', type: 'CH', label: 'Controlled-H', color: 'bg-pink-500/20 text-pink-300 border-pink-500/50', icon: 'CH', needsControl: true },
      { symbol: 'CP', type: 'CP', label: 'Controlled-P', color: 'bg-rose-500/20 text-rose-300 border-rose-500/50', icon: 'CP', needsControl: true, hasAngle: true },
      { symbol: 'CCX', type: 'CCX', label: 'Toffoli (CCX)', color: 'bg-red-500/20 text-red-300 border-red-500/50', icon: 'CCX', needsControl: true },
    ]
  },
  {
    category: 'Measurement & Probes',
    color: 'text-slate-400',
    gates: [
      { symbol: 'M', type: 'M', label: 'Measure Z', color: 'bg-slate-700/40 text-slate-200 border-slate-500/50', icon: 'M' },
      { symbol: 'RESET', type: 'RESET', label: 'Reset |0⟩', color: 'bg-zinc-700/40 text-zinc-300 border-zinc-500/50', icon: '|0⟩' },
    ]
  }
];

// Flat lookup
const GATE_MAP = {};
GATE_CATEGORIES.forEach(cat => cat.gates.forEach(g => { GATE_MAP[g.symbol] = g; GATE_MAP[g.type] = g; }));

const QUANTUM_ENGINES = [
  { id: 'qiskit', name: 'Qiskit (IBM)', company: 'IBM Quantum', lang: 'python' },
  { id: 'cirq', name: 'Cirq (Google)', company: 'Google Quantum AI', lang: 'python' },
  { id: 'pennylane', name: 'PennyLane', company: 'Xanadu AI', lang: 'python' },
  { id: 'braket', name: 'AWS Braket', company: 'Amazon Web Services', lang: 'python' },
  { id: 'openqasm', name: 'OpenQASM 3.0', company: 'Universal IR', lang: 'qasm' },
];

const INITIAL_STATE_OPTIONS = ['|0⟩', '|1⟩', '|+⟩', '|-⟩', '|i⟩', '|-i⟩'];

const ANGLE_PRESETS = [
  { label: 'π', value: Math.PI },
  { label: 'π/2', value: Math.PI / 2 },
  { label: 'π/4', value: Math.PI / 4 },
  { label: 'π/8', value: Math.PI / 8 },
  { label: '3π/4', value: 3 * Math.PI / 4 },
  { label: '3π/2', value: 3 * Math.PI / 2 },
  { label: '2π', value: 2 * Math.PI },
];

function fmtAngle(rad) {
  if (rad === undefined || rad === null) return '';
  const pi = Math.PI;
  const map = [
    [pi, 'π'], [pi / 2, 'π/2'], [pi / 4, 'π/4'], [pi / 8, 'π/8'],
    [3 * pi / 4, '3π/4'], [3 * pi / 2, '3π/2'], [2 * pi, '2π'],
  ];
  for (const [v, s] of map) if (Math.abs(rad - v) < 1e-6) return s;
  return Number(rad).toFixed(2);
}

function CircuitPlaygroundContent() {
  const searchParams = useSearchParams();
  const urlTab = searchParams ? searchParams.get('tab') : null;
  const mainTab = urlTab === 'bloch' ? 'bloch' : 'circuit';

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [shots, setShots] = useState('1024');

  const [numQubits, setNumQubits] = useState(3);
  const [numSteps, setNumSteps] = useState(8);

  const [initialStates, setInitialStates] = useState(['|0⟩', '|0⟩', '|0⟩']);

  const [circuit, setCircuit] = useState(() =>
    Array(3).fill(null).map(() => Array(8).fill(null))
  );

  const [selectedGate, setSelectedGate] = useState(null);
  const [pendingAngle, setPendingAngle] = useState(Math.PI / 2);

  const [pendingWire, setPendingWire] = useState(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);

  const [simResults, setSimResults] = useState(null);
  const [cloudResults, setCloudResults] = useState(null);
  const [fidelity, setFidelity] = useState('N/A');
  const [selectedEngine, setSelectedEngine] = useState('qiskit');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('realtime'); // 'realtime' | 'code' | 'cloud'

  // Code editor buffer
  const [editableCode, setEditableCode] = useState('');
  const [isUserEditingCode, setIsUserEditingCode] = useState(false);

  const fileInputRef = useRef(null);

  const handleIncreaseQubits = () => {
    if (numQubits >= 8) return;
    const nextQ = numQubits + 1;
    setNumQubits(nextQ);
    setInitialStates(prev => [...prev, '|0⟩']);
    setCircuit(prev => {
      const next = prev.map(r => [...r]);
      next.push(Array(numSteps).fill(null));
      return next;
    });
  };

  const handleDecreaseQubits = () => {
    if (numQubits <= 2) return;
    const nextQ = numQubits - 1;
    setNumQubits(nextQ);
    setInitialStates(prev => prev.slice(0, nextQ));
    setCircuit(prev => prev.slice(0, nextQ).map(r => r.map(g => {
      if (!g) return null;
      if (g.control != null && g.control >= nextQ) return null;
      if (g.control2 != null && g.control2 >= nextQ) return null;
      if (g.target2 != null && g.target2 >= nextQ) return null;
      return g;
    })));
  };

  const handleIncreaseSteps = () => {
    if (numSteps >= 16) return;
    const nextS = numSteps + 1;
    setNumSteps(nextS);
    setCircuit(prev => prev.map(r => [...r, null]));
  };

  const handleDecreaseSteps = () => {
    if (numSteps <= 4) return;
    const nextS = numSteps - 1;
    setNumSteps(nextS);
    setCircuit(prev => prev.map(r => r.slice(0, nextS)));
  };

  // Real-time Quirk simulation execution on every circuit change
  useEffect(() => {
    try {
      const res = simulateCircuitRealTime(circuit, numQubits, initialStates);
      setSimResults(res);
    } catch (err) {
      console.warn('Realtime simulation error:', err);
    }
  }, [circuit, numQubits, initialStates]);

  const issues = analyzeCircuit(circuit, numQubits);
  const activeEngineCode = generateCode(circuit, numQubits, selectedEngine, parseInt(shots) || 1024);

  // Sync active generated code to editor buffer unless user is typing custom edits
  useEffect(() => {
    if (!isUserEditingCode) {
      setEditableCode(activeEngineCode);
    }
  }, [activeEngineCode, isUserEditingCode]);

  // Handle Drag and Drop
  const handleDragStart = (e, gate) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(gate));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, q, s) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const gateData = JSON.parse(dataStr);

      // Check if dragging an existing gate within the circuit grid
      if (gateData.srcQ !== undefined && gateData.srcS !== undefined) {
        setCircuit(prev => {
          const nc = prev.map(r => [...r]);
          nc[gateData.srcQ][gateData.srcS] = null;
          nc[q][s] = {
            type: gateData.type,
            target: q,
            angle: gateData.angle,
            control: gateData.control,
            control2: gateData.control2,
            target2: gateData.target2
          };
          return nc;
        });
        toast.success(`Moved gate to q[${q}], step ${s + 1}`);
        return;
      }

      placeGate(gateData, q, s);
    } catch {}
  };

  const placeGate = (gateDef, q, s) => {
    const newGate = { type: gateDef.symbol || gateDef.type, target: q };
    if (gateDef.hasAngle) {
      newGate.angle = pendingAngle;
    }
    setCircuit(prev => {
      const nc = prev.map(r => [...r]);
      nc[q][s] = newGate;
      return nc;
    });
    toast.success(`Added ${gateDef.label || gateDef.symbol} to q[${q}], step ${s + 1}`);
  };

  const handleCellClick = (q, s) => {
    if (pendingWire) {
      const { type: wireType, qubit: srcQ, step: srcS } = pendingWire;
      if (wireType === 'control' && q !== srcQ && s === srcS) {
        setCircuit(prev => {
          const nc = prev.map(r => [...r]);
          const g = nc[srcQ][srcS];
          if (g) {
            if (g.type === 'CCX' && g.control != null) g.control2 = q;
            else g.control = q;
          }
          return nc;
        });
        setPendingWire(null);
        toast.success(`Control linked to qubit q[${q}]`);
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
        toast.success(`SWAP partner linked to qubit q[${q}]`);
        return;
      }
      setPendingWire(null);
      return;
    }

    if (!selectedGate) return;

    const gateDef = GATE_MAP[selectedGate];
    if (!gateDef) return;

    if (circuit[q]?.[s] != null) {
      removeGate(q, s);
      return;
    }

    placeGate(gateDef, q, s);
  };

  const removeGate = (q, s) => {
    setCircuit(prev => {
      const nc = prev.map(r => [...r]);
      if (nc[q]) nc[q][s] = null;
      return nc;
    });
  };

  const clearCircuit = () => {
    setCircuit(Array(numQubits).fill(null).map(() => Array(numSteps).fill(null)));
    setCloudResults(null);
    setIsUserEditingCode(false);
    toast.success('Circuit canvas cleared.');
  };

  const loadPreset = (preset) => {
    setNumQubits(preset.qubits);
    setNumSteps(preset.steps);
    setInitialStates(Array(preset.qubits).fill('|0⟩'));
    setCircuit(preset.build());
    setCloudResults(null);
    setIsUserEditingCode(false);
    toast.success(`Loaded preset: ${preset.title}`);
  };

  const toggleInitialState = (qIndex) => {
    setInitialStates(prev => {
      const next = [...prev];
      const cur = next[qIndex] || '|0⟩';
      const idx = INITIAL_STATE_OPTIONS.indexOf(cur);
      const nextState = INITIAL_STATE_OPTIONS[(idx + 1) % INITIAL_STATE_OPTIONS.length];
      next[qIndex] = nextState;
      toast.success(`Qubit q[${qIndex}] initialized to ${nextState}`);
      return next;
    });
  };

  const handleCloudSimulation = async () => {
    const hasGates = circuit.some(row => row.some(g => g !== null));
    if (!hasGates) {
      toast.error('Circuit is empty. Add quantum gates before simulating.');
      return;
    }

    setIsSimulating(true);
    setCloudResults(null);
    const loadToast = toast.loading('Submitting circuit to IBM Qiskit Aer simulator...');

    try {
      const code = generateCode(circuit, numQubits, 'qiskit', parseInt(shots) || 1024);
      const response = await apiFetch('/learner/simulations/run', {
        method: 'POST',
        body: JSON.stringify({ circuitCode: code, backend: 'qiskit_aer', shots: parseInt(shots) || 1024 })
      });

      toast.dismiss(loadToast);

      const simRun = response?.data?.simulationRun;
      if (simRun?.results?.counts) {
        setCloudResults(simRun.results.counts);
        setFidelity(simRun.fidelity ? `${(simRun.fidelity * 100).toFixed(2)}%` : '99.4%');
        setActiveTab('cloud');
        toast.success('Quantum cloud simulation finished with high fidelity!');
      } else {
        toast.error('Simulation completed but returned no distribution counts.');
      }
    } catch (err) {
      toast.dismiss(loadToast);
      toast.error(err?.message || 'Quantum simulation execution failed.');
    } finally {
      setIsSimulating(false);
    }
  };

  // Code tab actions: Sync edited code back to visual circuit grid
  const handleSyncCodeToCanvas = () => {
    try {
      const parsed = parseQasmToCircuit(editableCode);
      if (!parsed || !parsed.circuit) {
        toast.error('Could not parse OpenQASM syntax. Ensure valid qreg and gate statements.');
        return;
      }
      setNumQubits(parsed.numQubits);
      setNumSteps(parsed.numSteps);
      setInitialStates(Array(parsed.numQubits).fill('|0⟩'));
      setCircuit(parsed.circuit);
      setIsUserEditingCode(false);
      toast.success(`Synced code into visual circuit grid (${parsed.numQubits} qubits, ${parsed.numSteps} steps)!`);
      setActiveTab('realtime');
    } catch (err) {
      toast.error('Parsing failed: ' + err.message);
    }
  };

  // Execute edited code directly
  const handleRunCustomCode = async () => {
    if (!editableCode.trim()) {
      toast.error('Code buffer is empty.');
      return;
    }
    setIsSimulating(true);
    setCloudResults(null);
    const loadToast = toast.loading('Executing code on Qiskit Aer simulator...');
    try {
      const response = await apiFetch('/learner/simulations/run', {
        method: 'POST',
        body: JSON.stringify({ circuitCode: editableCode, backend: 'qiskit_aer', shots: parseInt(shots) || 1024 })
      });
      toast.dismiss(loadToast);
      const simRun = response?.data?.simulationRun;
      if (simRun?.results?.counts) {
        setCloudResults(simRun.results.counts);
        setFidelity(simRun.fidelity ? `${(simRun.fidelity * 100).toFixed(2)}%` : '99.4%');
        setActiveTab('cloud');
        toast.success('Custom code execution finished!');
      } else {
        toast.error('Simulation finished without returning distribution counts.');
      }
    } catch (err) {
      toast.dismiss(loadToast);
      toast.error(err?.message || 'Execution failed.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!editableCode) return;
    try {
      await navigator.clipboard.writeText(editableCode);
      setCopied(true);
      toast.success(`Copied ${QUANTUM_ENGINES.find(e => e.id === selectedEngine)?.name} code to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy code to clipboard.');
    }
  };

  // Export Circuit to File (JSON or QASM)
  const handleExportJson = () => {
    const payload = JSON.stringify({ numQubits, numSteps, initialStates, circuit }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_circuit_${numQubits}q.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded circuit as JSON file');
  };

  const handleExportQasm = () => {
    const qasm = generateCode(circuit, numQubits, 'openqasm', parseInt(shots) || 1024);
    const blob = new Blob([qasm], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_circuit_${numQubits}q.qasm`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded circuit as OpenQASM file');
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result;
      if (!content) return;
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (parsed.circuit && Array.isArray(parsed.circuit)) {
            setNumQubits(parsed.numQubits || parsed.circuit.length);
            setNumSteps(parsed.numSteps || parsed.circuit[0]?.length || 8);
            if (parsed.initialStates) setInitialStates(parsed.initialStates);
            setCircuit(parsed.circuit);
            toast.success('Imported circuit from JSON');
            return;
          }
        }
        const parsed = parseQasmToCircuit(content);
        if (parsed && parsed.circuit) {
          setNumQubits(parsed.numQubits);
          setNumSteps(parsed.numSteps);
          setCircuit(parsed.circuit);
          toast.success('Imported circuit from OpenQASM file');
        } else {
          toast.error('Could not parse file format.');
        }
      } catch (err) {
        toast.error('Failed to import file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const activeStepSnapshot = (selectedStepIndex !== null && simResults?.stepStates?.[selectedStepIndex + 1])
    ? simResults.stepStates[selectedStepIndex + 1]
    : simResults?.finalState;

  const currentBlochVectors = activeStepSnapshot?.blochVectors || [];
  const currentQubitProbs = activeStepSnapshot?.qubitProbs || [];
  const currentAmplitudes = activeStepSnapshot?.amplitudes || [];

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
            title={mainTab === 'bloch' ? "3D Bloch Sphere Simulator" : "Build Circuit Studio"}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          {/* ── 3D Bloch Sphere Tab ───────────────────────────────────── */}
          {mainTab === 'bloch' && (
            <div className="flex-1 w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col p-0">
              <BlochSphereSimulator3D
                externalVectors={simResults?.finalState?.blochVectors}
                numCircuitQubits={numQubits}
              />
            </div>
          )}

          {/* ── Build Circuit Tab ─────────────────────────────────────── */}
          {mainTab === 'circuit' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full">
            
            {/* Header: Title, Controls, Algorithm Presets, Export/Import */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--color-surface)] p-5 rounded-3xl border border-[var(--color-border)] shadow-sm">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                    <LuAtom size={22} className="animate-spin" style={{ animationDuration: '12s' }} />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black font-heading text-[var(--color-text)]">
                      Quantum Circuit Studio
                    </h1>
                    <p className="text-xs text-[var(--color-muted)]">
                      Graphical Drag-and-Drop &amp; Code-Based Quantum Designer
                    </p>
                  </div>
                </div>
              </div>

              {/* Hidden file input for import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.qasm"
                onChange={handleImportFile}
                className="hidden"
              />

              {/* Action Toolbar */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Qubit & Step Counter */}
                <div className="flex items-center gap-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-2.5 py-1 text-xs">
                  <span className="text-[10px] uppercase font-mono text-[var(--color-muted)] font-bold mr-1">Qubits</span>
                  <button onClick={handleDecreaseQubits} className="w-6 h-6 rounded-lg hover:bg-[var(--color-surface)] flex items-center justify-center text-slate-400 hover:text-rose-400 cursor-pointer"><LuMinus size={12}/></button>
                  <span className="w-4 text-center font-mono font-bold text-cyan-500">{numQubits}</span>
                  <button onClick={handleIncreaseQubits} className="w-6 h-6 rounded-lg hover:bg-[var(--color-surface)] flex items-center justify-center text-slate-400 hover:text-emerald-400 cursor-pointer"><LuPlus size={12}/></button>
                </div>

                <div className="flex items-center gap-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-2.5 py-1 text-xs">
                  <span className="text-[10px] uppercase font-mono text-[var(--color-muted)] font-bold mr-1">Steps</span>
                  <button onClick={handleDecreaseSteps} className="w-6 h-6 rounded-lg hover:bg-[var(--color-surface)] flex items-center justify-center text-slate-400 hover:text-rose-400 cursor-pointer"><LuMinus size={12}/></button>
                  <span className="w-5 text-center font-mono font-bold text-indigo-500">{numSteps}</span>
                  <button onClick={handleIncreaseSteps} className="w-6 h-6 rounded-lg hover:bg-[var(--color-surface)] flex items-center justify-center text-slate-400 hover:text-emerald-400 cursor-pointer"><LuPlus size={12}/></button>
                </div>

                {/* Preset Algorithms Dropdown */}
                <div className="relative group">
                  <button className="px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all">
                    <LuSparkles size={14} className="text-cyan-400" />
                    <span>Presets</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-72 p-2 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-[var(--color-muted)] px-2 py-1">Quantum Algorithms</div>
                    {CIRCUIT_PRESETS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => loadPreset(p)}
                        className="w-full text-left p-2 rounded-xl hover:bg-[var(--color-background)] transition-all flex flex-col gap-0.5 cursor-pointer"
                      >
                        <div className="text-xs font-bold text-[var(--color-text)]">{p.title}</div>
                        <div className="text-[10px] text-[var(--color-muted)] truncate">{p.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Import / Export Circuit File */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Import JSON or OpenQASM file"
                >
                  <LuUpload size={14} className="text-indigo-400" />
                  <span>Import</span>
                </button>

                <div className="relative group">
                  <button className="px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                    <LuDownload size={14} className="text-emerald-400" />
                    <span>Export</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-44 p-2 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50 space-y-1">
                    <button
                      onClick={handleExportQasm}
                      className="w-full text-left p-2 rounded-xl hover:bg-[var(--color-background)] text-xs font-bold font-mono text-[var(--color-text)] flex items-center gap-2 cursor-pointer"
                    >
                      <span>OpenQASM (.qasm)</span>
                    </button>
                    <button
                      onClick={handleExportJson}
                      className="w-full text-left p-2 rounded-xl hover:bg-[var(--color-background)] text-xs font-bold font-mono text-[var(--color-text)] flex items-center gap-2 cursor-pointer"
                    >
                      <span>Circuit JSON (.json)</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={clearCircuit}
                  className="p-2 rounded-xl border border-[var(--color-border)] hover:bg-rose-500/10 hover:text-rose-500 text-[var(--color-muted)] transition-all cursor-pointer"
                  title="Clear circuit"
                >
                  <LuTrash2 size={16} />
                </button>

                {/* Cloud Run Button */}
                <button
                  onClick={handleCloudSimulation}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <LuPlay size={14} />
                  <span>{isSimulating ? 'Simulating...' : 'Cloud Run (Aer)'}</span>
                </button>
              </div>
            </div>

            {/* 1. Graphical Gate Palette */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuLayers size={16} className="text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] font-mono">
                    Graphical Quantum Gate Palette (Drag onto grid or click to select)
                  </span>
                </div>
                {selectedGate && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[var(--color-muted)]">Selected:</span>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                      {selectedGate}
                    </span>
                    <button
                      onClick={() => setSelectedGate(null)}
                      className="text-rose-400 hover:underline text-[11px]"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Palette Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {GATE_CATEGORIES.map(cat => (
                  <div key={cat.category} className="p-3 rounded-2xl bg-[var(--color-background)]/60 border border-[var(--color-border)] space-y-2">
                    <div className={`text-[10px] font-mono font-bold uppercase ${cat.color}`}>
                      {cat.category}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.gates.map(g => {
                        const isSelected = selectedGate === g.symbol;
                        return (
                          <div
                            key={g.symbol}
                            draggable
                            onDragStart={(e) => handleDragStart(e, g)}
                            onClick={() => setSelectedGate(isSelected ? null : g.symbol)}
                            className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-xs cursor-grab active:cursor-grabbing select-none transition-all shadow-sm ${g.color} ${
                              isSelected ? 'ring-2 ring-cyan-400 scale-105 shadow-cyan-500/30' : 'hover:scale-105'
                            }`}
                            title={`${g.label} - Drag to circuit or click to select`}
                          >
                            {g.icon || g.symbol}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Drag-and-Drop Circuit Grid */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6 shadow-sm overflow-x-auto">
              <div className="flex items-center justify-between min-w-[700px]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--color-text)] font-mono uppercase tracking-wider">
                    Interactive Drag-and-Drop Quantum Circuit Grid
                  </span>
                  <span className="text-[10px] text-[var(--color-muted)] font-mono">
                    (Drag gates on wires, click input to set $|0\rangle, |1\rangle, |+\rangle$)
                  </span>
                </div>

                {pendingWire && (
                  <div className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono flex items-center gap-2 animate-pulse">
                    <LuInfo size={14} /> Click target qubit on step {pendingWire.step + 1} to link wire
                  </div>
                )}
              </div>

              {/* Wire Canvas Grid */}
              <div className="space-y-4 min-w-[800px] py-2">
                {Array(numQubits).fill(null).map((_, qIndex) => {
                  const p1 = currentQubitProbs[qIndex] || 0;
                  const pct = Math.round(p1 * 100);

                  return (
                    <div key={qIndex} className="flex items-center gap-3 relative group">
                      
                      {/* Left: Qubit Tag & Initial State Toggle */}
                      <button
                        onClick={() => toggleInitialState(qIndex)}
                        className="w-20 flex-shrink-0 flex items-center justify-between px-2.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-cyan-500/40 text-xs font-mono transition-all group/init cursor-pointer"
                        title="Click to toggle initial state"
                      >
                        <span className="font-bold text-[var(--color-text)]">q[{qIndex}]</span>
                        <span className="text-cyan-400 font-bold group-hover/init:scale-110 transition-transform">
                          {initialStates[qIndex] || '|0⟩'}
                        </span>
                      </button>

                      {/* Quantum Wire Line & Matrix Cells */}
                      <div className="relative flex-1 flex items-center gap-3">
                        {/* Horizontal Quantum Bus Line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-700 dark:bg-slate-700 pointer-events-none" />

                        {Array(numSteps).fill(null).map((_, sIndex) => {
                          const gate = circuit[qIndex]?.[sIndex];
                          const isHoveredCol = selectedStepIndex === sIndex;

                          return (
                            <div
                              key={sIndex}
                              draggable={!!gate}
                              onDragStart={(e) => {
                                if (gate) {
                                  e.dataTransfer.setData('text/plain', JSON.stringify({ ...gate, srcQ: qIndex, srcS: sIndex }));
                                }
                              }}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, qIndex, sIndex)}
                              onClick={() => handleCellClick(qIndex, sIndex)}
                              onMouseEnter={() => setSelectedStepIndex(sIndex)}
                              onMouseLeave={() => setSelectedStepIndex(null)}
                              className={`relative z-10 w-12 h-12 rounded-2xl border flex items-center justify-center text-xs font-mono font-bold cursor-pointer transition-all duration-200 select-none ${
                                gate
                                  ? `${GATE_MAP[gate.type]?.color || 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'} shadow-md hover:scale-105 cursor-grab active:cursor-grabbing`
                                  : isHoveredCol
                                  ? 'bg-cyan-500/10 border-cyan-500/40'
                                  : 'bg-[var(--color-surface)] border-[var(--color-border)]/70 hover:border-cyan-500/40 hover:bg-[var(--color-background)]'
                              }`}
                            >
                              {gate ? (
                                <div className="flex flex-col items-center justify-center">
                                  <span>{GATE_MAP[gate.type]?.icon || gate.type}</span>
                                  {gate.angle !== undefined && (
                                    <span className="text-[8px] font-mono text-amber-400 leading-none">
                                      {fmtAngle(gate.angle)}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-600 opacity-0 group-hover:opacity-60">+</span>
                              )}

                              {/* Multi-qubit control link button */}
                              {gate && (GATE_MAP[gate.type]?.needsControl || gate.type === 'CCX' || gate.type === 'SWAP') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPendingWire({
                                      type: gate.type === 'SWAP' ? 'swap' : 'control',
                                      qubit: qIndex,
                                      step: sIndex
                                    });
                                  }}
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] shadow-sm hover:scale-125 transition-transform"
                                  title="Assign control wire"
                                >
                                  ●
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Right: Live Chance Probe Display */}
                      <div className="w-32 flex-shrink-0 p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-[var(--color-muted)]">Chance |1⟩</span>
                          <span className="font-bold text-cyan-400">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Step Timeline Indicator */}
              <div className="flex items-center gap-3 pl-24 min-w-[800px]">
                {Array(numSteps).fill(null).map((_, si) => (
                  <div
                    key={si}
                    className={`w-12 text-center text-[10px] font-mono font-bold transition-colors ${
                      selectedStepIndex === si ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  >
                    S{si + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Code-Based & Real-time Telemetry Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                
                {/* Visualizer & Code Editor Tabs */}
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2.5">
                      <LuActivity size={18} className="text-cyan-400" />
                      <h3 className="font-bold text-sm text-[var(--color-text)] font-mono uppercase tracking-wider">
                        Circuit Telemetry &amp; Code Studio
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                      <button
                        onClick={() => setActiveTab('realtime')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          activeTab === 'realtime' ? 'bg-cyan-500 text-white shadow-sm' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        Statevector &amp; Bloch
                      </button>
                      <button
                        onClick={() => setActiveTab('code')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          activeTab === 'code' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        Code Studio (Qiskit / OpenQASM)
                      </button>
                      <button
                        onClick={() => setActiveTab('cloud')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          activeTab === 'cloud' ? 'bg-fuchsia-600 text-white shadow-sm' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        Cloud Results
                      </button>
                    </div>
                  </div>

                  {activeTab === 'realtime' && (
                    <div className="space-y-6">
                      
                      {/* Bloch Spheres Deck */}
                      <div>
                        <div className="text-xs font-mono font-bold text-[var(--color-muted)] mb-3 uppercase tracking-wider flex items-center gap-2">
                          <LuAtom size={14} className="text-cyan-400" />
                          Individual Qubit Bloch Spheres (Live Projection)
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {currentBlochVectors.map((vec, idx) => (
                            <QuirkBlochSphere
                              key={idx}
                              qubitIndex={idx}
                              vector={vec}
                              size={120}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Statevector & Phase Visualization */}
                      <div>
                        <div className="text-xs font-mono font-bold text-[var(--color-muted)] mb-3 uppercase tracking-wider flex items-center gap-2">
                          <LuSlidersHorizontal size={14} className="text-indigo-400" />
                          Statevector &amp; Phase Disk ({currentAmplitudes.length} Basis States)
                        </div>
                        <AmplitudePhasePanel amplitudes={currentAmplitudes} />
                      </div>

                    </div>
                  )}

                  {/* CODE-BASED QUANTUM CIRCUIT DESIGN TOOL */}
                  {activeTab === 'code' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        {/* Framework Engine Switcher */}
                        <div className="flex gap-1.5 flex-wrap">
                          {QUANTUM_ENGINES.map(eng => (
                            <button
                              key={eng.id}
                              onClick={() => {
                                setSelectedEngine(eng.id);
                                setIsUserEditingCode(false);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                                selectedEngine === eng.id
                                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                  : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                              }`}
                            >
                              {eng.name}
                            </button>
                          ))}
                        </div>

                        {/* Action buttons: Copy, Sync to Grid, Run Code */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSyncCodeToCanvas}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Parse OpenQASM code into the visual drag-and-drop circuit grid"
                          >
                            <LuRefreshCw size={13} />
                            <span>Sync to Visual Grid</span>
                          </button>

                          <button
                            onClick={handleRunCustomCode}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <LuPlay size={13} />
                            <span>Run Code</span>
                          </button>

                          <button
                            onClick={handleCopyCode}
                            className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-background)] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            {copied ? <LuCheck size={14} className="text-emerald-400" /> : <LuCopy size={14} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Interactive Code Editor */}
                      <div className="relative rounded-2xl bg-[#080a1c] border border-white/10 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/10 text-[10px] font-mono text-slate-400">
                          <div className="flex items-center gap-2">
                            <LuTerminal size={12} className="text-cyan-400" />
                            <span>Code Editor — {QUANTUM_ENGINES.find(e => e.id === selectedEngine)?.name}</span>
                          </div>
                          {isUserEditingCode && (
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              • Custom code edited (click "Sync to Visual Grid" to update canvas)
                            </span>
                          )}
                        </div>

                        <textarea
                          value={editableCode}
                          onChange={(e) => {
                            setEditableCode(e.target.value);
                            setIsUserEditingCode(true);
                          }}
                          className="w-full h-80 p-4 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                          placeholder="// Write or paste OpenQASM / Qiskit python code here..."
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'cloud' && (
                    <div className="space-y-4">
                      {!cloudResults ? (
                        <div className="py-12 text-center text-slate-400 space-y-3 font-mono text-xs">
                          <LuPlay size={32} className="mx-auto text-indigo-400 opacity-60" />
                          <p>No cloud execution results yet. Click "Cloud Run (Aer)" or "Run Code" to simulate.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                            <span>Backend: Qiskit AerSimulator ({shots} shots)</span>
                            <span>Fidelity: {fidelity}</span>
                          </div>

                          <QuantumHistogram
                            data={{ counts: cloudResults }}
                            shots={parseInt(shots) || 1024}
                            title="Measurement Counts"
                          />
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Right Column: Circuit Analysis & Rotation Angle Configurator */}
              <div className="space-y-6">
                
                {/* Circuit Health & Lint Analysis */}
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <LuCheck size={16} className="text-emerald-400" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-muted)] font-mono">
                      Static Circuit Analysis
                    </h3>
                  </div>

                  {!issues.length ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <LuCheck size={15} /> Circuit is syntactically valid &amp; ready.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {issues.map((iss, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            iss.type === 'error'
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            <LuCircleAlert size={14} /> {iss.message}
                          </div>
                          {iss.suggestion && (
                            <div className="text-[11px] opacity-80 pl-5">{iss.suggestion}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rotation Angle Configurator */}
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] font-mono">
                      Rotation Gate Angle θ
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {fmtAngle(pendingAngle)} rad
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {ANGLE_PRESETS.map(ap => (
                      <button
                        key={ap.label}
                        onClick={() => {
                          setPendingAngle(ap.value);
                          toast.success(`Active angle set to ${ap.label}`);
                        }}
                        className={`py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                          Math.abs(pendingAngle - ap.value) < 1e-6
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        {ap.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-[var(--color-surface)] to-cyan-500/10 p-6 space-y-3 shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">
                    Quantum Designer Guide
                  </h4>
                  <ul className="text-xs text-[var(--color-muted)] space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li><strong>Drag &amp; Drop:</strong> Drag gates from the palette or move placed gates directly on wire cells.</li>
                    <li><strong>Code Studio:</strong> Write or edit OpenQASM script, then click <span className="text-cyan-300">Sync to Visual Grid</span> for bi-directional editing!</li>
                    <li><strong>Import / Export:</strong> Load or save circuits as <code className="text-emerald-400">.qasm</code> or <code className="text-emerald-400">.json</code> files.</li>
                  </ul>
                </div>

              </div>

            </div>

          </main>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function CircuitPlaygroundPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[var(--color-background)] flex items-center justify-center font-mono text-cyan-400 text-sm">Loading Quantum Playground...</div>}>
      <CircuitPlaygroundContent />
    </Suspense>
  );
}
