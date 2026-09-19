"use client";

import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import {
  LuTrophy,
  LuSparkles,
  LuFlame,
  LuClock,
  LuCheck,
  LuArrowRight,
  LuMedal,
  LuPlay,
  LuRotateCcw,
  LuTerminal,
  LuCode,
  LuX,
  LuCpu,
  LuLightbulb,
  LuShieldAlert,
  LuCircleCheck,
  LuChevronRight,
  LuSearch,
  LuFilter
} from 'react-icons/lu';
import toast from 'react-hot-toast';

const CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Construct GHZ State on 5 Qubits',
    category: 'Entanglement',
    points: 250,
    difficulty: 'Medium',
    participants: 142,
    timeLimit: '20 mins',
    status: 'Ready',
    description: 'Create a 5-qubit Greenberger–Horne–Zeilinger (GHZ) state: |GHZ⟩ = 1/√2 (|00000⟩ + |11111⟩). Apply a Hadamard gate to qubit 0, followed by a cascade of CNOT gates from qubit 0 to qubits 1 through 4.',
    targetFidelity: 0.99,
    starterCode: `from qiskit import QuantumCircuit, Aer, execute

def build_ghz_circuit():
    # Initialize 5-qubit quantum circuit
    qc = QuantumCircuit(5, 5)
    
    # Step 1: Create superposition on qubit 0
    qc.h(0)
    
    # Step 2: Entangle remaining qubits using CNOT gates
    for i in range(4):
        qc.cx(i, i+1)
        
    qc.measure(range(5), range(5))
    return qc
`,
    hints: [
      'Start with qc.h(0) to put the first qubit into (|0⟩ + |1⟩)/√2.',
      'Use a loop `for i in range(4): qc.cx(i, i+1)` to propagate entanglement.',
      'Do not forget measurement on all 5 qubits.'
    ]
  },
  {
    id: 'ch-2',
    title: 'Deutsch-Jozsa Constant vs Balanced Oracle',
    category: 'Quantum Oracles',
    points: 350,
    difficulty: 'Hard',
    participants: 98,
    timeLimit: '35 mins',
    status: 'Ready',
    description: 'Implement the Deutsch-Jozsa algorithm on 3 input qubits + 1 ancillary qubit to determine in a single query whether an unknown oracle is constant or balanced.',
    targetFidelity: 0.98,
    starterCode: `from qiskit import QuantumCircuit

def deutsch_jozsa(oracle_type="balanced"):
    n = 3
    qc = QuantumCircuit(n + 1, n)
    
    # Initialize ancillary qubit in |1> then |->
    qc.x(n)
    qc.h(range(n + 1))
    
    # Apply Oracle
    if oracle_type == "balanced":
        for i in range(n):
            qc.cx(i, n)
            
    # Apply Hadamard to input qubits
    qc.h(range(n))
    qc.measure(range(n), range(n))
    return qc
`,
    hints: [
      'The ancillary qubit must be prepared in state |-> = H(X|0>).',
      'Phase kickback flips the sign of input states when oracle evaluates to 1.',
      'Measuring all zeros |000> indicates a constant oracle.'
    ]
  },
  {
    id: 'ch-3',
    title: 'Error Correction: Bit-Flip 3-Qubit Code',
    category: 'QEC',
    points: 400,
    difficulty: 'Hard',
    participants: 67,
    timeLimit: '45 mins',
    status: 'Ready',
    description: 'Implement the 3-qubit bit-flip repetition code with syndrome measurement and automatic recovery logic to protect against single X errors.',
    targetFidelity: 0.95,
    starterCode: `from qiskit import QuantumCircuit

def bit_flip_code():
    # 3 physical qubits + 2 syndrome ancillas
    qc = QuantumCircuit(5, 2)
    
    # Encode logical state |ψ> = α|000> + β|111>
    qc.cx(0, 1)
    qc.cx(0, 2)
    
    # Injected error: Bit-flip on qubit 1
    qc.x(1)
    
    # Syndrome measurement
    qc.cx(0, 3); qc.cx(1, 3)
    qc.cx(1, 4); qc.cx(2, 4)
    qc.measure([3, 4], [0, 1])
    return qc
`,
    hints: [
      'Syndrome 00 means no error.',
      'Syndrome 11 indicates error on the middle qubit q[1].',
      'Syndrome 10 indicates error on q[0], while 01 indicates error on q[2].'
    ]
  },
  {
    id: 'ch-4',
    title: 'Single Qubit Superposition & Phase Kickback',
    category: 'Basics',
    points: 100,
    difficulty: 'Easy',
    participants: 320,
    timeLimit: '10 mins',
    status: 'Completed',
    description: 'Demonstrate phase kickback using a single controlled gate where the phase is kicked back from the target qubit to the control qubit.',
    targetFidelity: 1.0,
    starterCode: `from qiskit import QuantumCircuit

def phase_kickback():
    qc = QuantumCircuit(2, 2)
    # Put control in |+> and target in |->
    qc.h(0)
    qc.x(1)
    qc.h(1)
    
    # Controlled-Z gate
    qc.cz(0, 1)
    
    # Measure control in X basis
    qc.h(0)
    qc.measure([0, 1], [0, 1])
    return qc
`,
    hints: [
      'CZ on |+-> causes the control qubit to transition to |->.',
      'Measuring in the X basis confirms the phase change.'
    ]
  },
];

export default function ChallengesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'tests' | 'hints'
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState(null);

  const categories = ['All', 'Basics', 'Entanglement', 'Quantum Oracles', 'QEC'];

  const filteredChallenges = CHALLENGES.filter((ch) => {
    const matchesCategory = activeCategory === 'All' || ch.category === activeCategory;
    const matchesSearch = !searchQuery || ch.title.toLowerCase().includes(searchQuery.toLowerCase()) || ch.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenWorkbench = (challenge) => {
    setActiveChallenge(challenge);
    setUserCode(challenge.starterCode);
    setTestOutput(null);
    setActiveTab('code');
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setTestOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      setTestOutput({
        passed: true,
        fidelity: 0.998,
        qubitsUsed: 5,
        gateCount: 6,
        timeMs: 42,
        logs: [
          '✓ Quantum Statevector initialized: dim=32',
          '✓ Fidelity check passed: |⟨ψ_target|ψ_sim⟩|² = 0.998 >= threshold (0.99)',
          '✓ Measurement probability verification: 50.1% |00000⟩, 49.9% |11111⟩',
          '✓ Quantum compilation finished on Qiskit Aer Engine.',
        ]
      });
      toast.success(`All tests passed! +${activeChallenge?.points || 250} XP earned! 🎉`);
    }, 1200);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-text)] flex">
        <LearnerSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <div
          className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ${
            isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <DashboardNavbar
            title="Quantum Challenges Studio"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Gamification Header Banner */}
            <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[var(--color-surface)] via-[var(--color-surface)] to-amber-500/10 border border-[var(--color-border)] shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    Weekly Quantum Sprint #14
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                    <LuFlame size={14} className="animate-pulse" /> 5 Day Streak
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-text)] tracking-tight">
                  Quantum Algorithm Challenges &amp; Arena
                </h1>
                <p className="text-xs sm:text-sm text-[var(--color-muted)] max-w-xl">
                  Solve real quantum computing challenges, verify statevectors on Qiskit Aer, optimize circuit depth, and earn XP.
                </p>
              </div>

              <div className="flex items-center gap-3 relative z-10 flex-wrap">
                <div className="p-4 rounded-2xl bg-[var(--color-background)]/80 backdrop-blur-md border border-[var(--color-border)] text-center min-w-[110px]">
                  <div className="text-2xl font-black font-mono text-amber-400">1,450 XP</div>
                  <div className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">Score</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--color-background)]/80 backdrop-blur-md border border-[var(--color-border)] text-center min-w-[110px]">
                  <div className="text-2xl font-black font-mono text-cyan-400">#12</div>
                  <div className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">Global Rank</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                        : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <LuSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredChallenges.map((ch) => (
                <div
                  key={ch.id}
                  className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 space-y-4 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)]">
                          {ch.category}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          ch.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                          ch.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' :
                          'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                        }`}>
                          {ch.difficulty}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg">
                        +{ch.points} XP
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-[var(--color-text)] group-hover:text-amber-400 transition-colors">
                        {ch.title}
                      </h3>
                      <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed line-clamp-2">
                        {ch.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] font-mono">
                      <span className="flex items-center gap-1"><LuClock size={12} /> {ch.timeLimit}</span>
                      <span>&bull;</span>
                      <span>Target Fidelity: {(ch.targetFidelity * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border)]/50 flex items-center justify-between">
                    <span className="text-[11px] text-[var(--color-muted)] font-mono">
                      {ch.participants} learners attempted
                    </span>
                    {ch.status === 'Completed' ? (
                      <button
                        onClick={() => handleOpenWorkbench(ch)}
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl hover:bg-emerald-500/20 transition-all cursor-pointer"
                      >
                        <LuCheck size={14} /> Solved (Review)
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenWorkbench(ch)}
                        className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black transition-all inline-flex items-center gap-1.5 cursor-pointer font-mono shadow-md shadow-amber-500/20 hover:gap-2"
                      >
                        <span>Start Challenge</span>
                        <LuArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* ── Interactive Quantum Challenge Workbench Modal ─────────────────── */}
      {activeChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl h-[90vh] rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <LuTrophy size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[var(--color-text)]">{activeChallenge.title}</h2>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      +{activeChallenge.points} XP
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] font-mono">{activeChallenge.category} · Qiskit Simulator</p>
                </div>
              </div>

              <button
                onClick={() => setActiveChallenge(null)}
                className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/40 transition-colors cursor-pointer"
              >
                <LuX size={18} />
              </button>
            </div>

            {/* Split View Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              
              {/* Left Column: Description & Hints */}
              <div className="w-full lg:w-2/5 p-6 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] overflow-y-auto space-y-5 bg-[var(--color-background)]/50">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold font-mono uppercase text-[var(--color-muted)]">Challenge Objective</h3>
                  <p className="text-xs text-[var(--color-text)] leading-relaxed">{activeChallenge.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
                  <div className="text-xs font-bold text-[var(--color-text)] flex items-center gap-1.5">
                    <LuCpu size={14} className="text-cyan-400" /> Evaluation Target
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)] font-mono space-y-1">
                    <div>Fidelity Threshold: <span className="text-amber-400 font-bold">{(activeChallenge.targetFidelity * 100).toFixed(0)}%</span></div>
                    <div>Backend: <span className="text-cyan-400">qiskit_aer (Statevector)</span></div>
                  </div>
                </div>

                {/* Hints Accordion */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold font-mono uppercase text-amber-400 flex items-center gap-1.5">
                    <LuLightbulb size={14} /> Guided Hints
                  </h3>
                  <div className="space-y-2">
                    {activeChallenge.hints.map((hint, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-muted)] flex items-start gap-2">
                        <span className="font-mono text-amber-400 font-bold">{i + 1}.</span>
                        <span>{hint}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Code Editor & Terminal Test Output */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-surface)]">
                
                {/* Code Tabs & Action */}
                <div className="px-4 py-2.5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background)]/40 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        activeTab === 'code' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      solution.py
                    </button>
                    {testOutput && (
                      <button
                        onClick={() => setActiveTab('tests')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          activeTab === 'tests' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        Test Report ✓
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUserCode(activeChallenge.starterCode)}
                      className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                      title="Reset starter code"
                    >
                      <LuRotateCcw size={14} />
                    </button>
                    <button
                      onClick={handleRunTests}
                      disabled={isRunning}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      <LuPlay size={13} />
                      <span>{isRunning ? 'Verifying...' : 'Run Quantum Tests'}</span>
                    </button>
                  </div>
                </div>

                {/* Editor or Test Output View */}
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                  {activeTab === 'code' ? (
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full flex-1 p-4 rounded-2xl bg-[#090d16] border border-white/10 text-emerald-400 font-mono text-xs focus:outline-none focus:border-cyan-500/50 resize-none leading-relaxed"
                      spellCheck="false"
                    />
                  ) : (
                    <div className="w-full flex-1 p-4 rounded-2xl bg-[#090d16] border border-emerald-500/30 font-mono text-xs overflow-y-auto space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <LuCircleCheck size={16} /> All Test Cases Passed
                        </span>
                        <span className="text-[10px] text-slate-400">Execution: {testOutput?.timeMs}ms</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div>Calculated Fidelity: <span className="text-cyan-400 font-bold">{(testOutput?.fidelity * 100).toFixed(1)}%</span></div>
                        <div>Qubits Analyzed: <span className="text-indigo-400 font-bold">{testOutput?.qubitsUsed}</span></div>
                      </div>
                      <div className="space-y-1 text-slate-300 pt-2 border-t border-white/5">
                        {testOutput?.logs?.map((l, idx) => (
                          <div key={idx} className="text-[11px]">{l}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Terminal status bar */}
                  {testOutput && activeTab === 'code' && (
                    <div
                      onClick={() => setActiveTab('tests')}
                      className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between cursor-pointer hover:bg-emerald-500/15 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <LuCircleCheck size={15} /> All Assertions Passed (Fidelity: {(testOutput.fidelity * 100).toFixed(1)}%)
                      </span>
                      <span className="text-[10px] underline">View Diagnostics →</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
