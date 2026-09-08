"use client";

import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Sidebar from '../../components/sidebar/Sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import {
  LuBookOpen,
  LuFlaskConical,
  LuClock,
  LuSparkles,
  LuCode,
  LuArrowRight,
  LuGraduationCap,
  LuCheck,
} from 'react-icons/lu';

const ALGORITHM_LABS = [
  {
    id: 'grover',
    title: "Grover's Quantum Search Algorithm",
    category: 'Quantum Algorithms',
    difficulty: 'Intermediate',
    time: '45 mins',
    qubits: 4,
    description: 'Quadratic speedup for unstructured database lookups using amplitude amplification and phase inversion.',
    codeSnippet: '# Phase inversion and diffusion operator\ncircuit.h(range(n))\ncircuit.append(oracle)\ncircuit.append(diffusion_operator)',
    completed: true,
  },
  {
    id: 'shor',
    title: "Shor's Period Finding & Factoring",
    category: 'Quantum Algorithms',
    difficulty: 'Advanced',
    time: '90 mins',
    qubits: 8,
    description: 'Polynomial time prime factorization using quantum phase estimation and modular exponentiation.',
    codeSnippet: '# Quantum Phase Estimation for Shor\nqpe = QuantumPhaseEstimation(unitary=modular_op)\ncircuit.compose(qpe, inplace=True)',
    completed: false,
  },
  {
    id: 'vqe',
    title: 'Variational Quantum Eigensolver (VQE)',
    category: 'Quantum Chemistry',
    difficulty: 'Advanced',
    time: '60 mins',
    qubits: 12,
    description: 'Hybrid quantum-classical optimization to calculate molecular ground-state electronic energies.',
    codeSnippet: '# Classical optimizer loop with quantum circuit\nenergy = vqe.compute_minimum_eigenvalue(operator=H2_hamiltonian)',
    completed: true,
  },
  {
    id: 'qft',
    title: 'Quantum Fourier Transform (QFT)',
    category: 'Foundations',
    difficulty: 'Intermediate',
    time: '35 mins',
    qubits: 4,
    description: 'Discrete Fourier transform mapped onto state amplitude vectors using controlled phase rotation gates.',
    codeSnippet: 'for j in range(n):\n    circuit.h(j)\n    for k in range(j + 1, n):\n        circuit.cp(pi / 2**(k - j), k, j)',
    completed: false,
  },
  {
    id: 'bb84',
    title: 'BB84 Quantum Key Distribution',
    category: 'Quantum Cryptography',
    difficulty: 'Beginner',
    time: '25 mins',
    qubits: 2,
    description: 'Unconditionally secure cryptographic key exchange leveraging no-cloning theorem and conjugate bases.',
    codeSnippet: '# Alice sends polarized photons, Bob measures randomly\nbases = np.random.choice(["rectilinear", "diagonal"], size=100)',
    completed: true,
  },
  {
    id: 'teleportation',
    title: 'Quantum Teleportation Protocol',
    category: 'Foundations',
    difficulty: 'Beginner',
    time: '30 mins',
    qubits: 3,
    description: 'Transfers arbitrary quantum state across spatial coordinates without sending the physical particle.',
    codeSnippet: 'circuit.h(1)\ncircuit.cx(1, 2)\ncircuit.cx(0, 1)\ncircuit.h(0)',
    completed: true,
  },
];

export default function LearnPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const categories = ['ALL', 'Foundations', 'Quantum Algorithms', 'Quantum Chemistry', 'Quantum Cryptography'];

  const filteredLabs = filterCategory === 'ALL'
    ? ALGORITHM_LABS
    : ALGORITHM_LABS.filter((lab) => lab.category === filterCategory);

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
            title="Algorithms Lab & Tracks"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Hero Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[var(--color-surface)] via-[var(--color-surface)] to-cyan-500/10 border border-[var(--color-border)] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Interactive Quantum Academy
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-text)]">
                  Quantum Algorithms & Experimentation Lab
                </h1>
                <p className="text-xs text-[var(--color-muted)] max-w-xl">
                  Step-by-step interactive notebooks, theoretical mathematical proofs, and runnable circuit implementations.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-[var(--color-text)]">4 / 6 Completed</div>
                  <div className="text-xs text-[var(--color-muted)]">Core Curriculum</div>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterCategory === c
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {c === 'ALL' ? 'All Modules' : c}
                </button>
              ))}
            </div>

            {/* Lab Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-cyan-500/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)]">
                        {lab.category}
                      </span>
                      {lab.completed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                          <LuCheck size={12} />
                          <span>Passed</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400 font-semibold">In Progress</span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-[var(--color-text)]">{lab.title}</h3>
                    <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">{lab.description}</p>
                  </div>

                  {/* Code snippet preview */}
                  <div className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] font-mono text-[11px] text-cyan-300 overflow-x-auto">
                    <pre>{lab.codeSnippet}</pre>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-border)]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)] font-mono">
                      <LuClock size={12} />
                      <span>{lab.time}</span>
                      <span>&bull;</span>
                      <span>{lab.qubits} Qubits</span>
                    </div>

                    <button className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors inline-flex items-center gap-1 cursor-pointer">
                      <span>Launch Lab</span>
                      <LuArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
