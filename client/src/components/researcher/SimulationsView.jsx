"use client";

import React, { useState } from 'react';
import { LuActivity, LuPlay, LuRotateCcw, LuCheck, LuCpu } from 'react-icons/lu';

export default function SimulationsView() {
  const [molecule, setMolecule] = useState('LiH');
  const [ansatz, setAnsatz] = useState('UCCSD');
  const [optimizer, setOptimizer] = useState('COBYLA');
  const [simulating, setSimulating] = useState(false);
  const [resultEnergy, setResultEnergy] = useState('-7.8823 Hartree');

  const handleRunVqe = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      const randomFidelity = (99.8 + Math.random() * 0.15).toFixed(2);
      setResultEnergy(`${(-7.88 - Math.random() * 0.01).toFixed(4)} Hartree (Fidelity: ${randomFidelity}%)`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* VQE Simulation Interactive Console */}
      <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
              <LuActivity size={22} className="text-cyan-500" />
              Variational Quantum Eigensolver (VQE) Workbench
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Calculate molecular ground state energies and orbital potential curves
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            Statevector Simulator Active
          </span>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">
              Target Hamiltonian
            </label>
            <select
              value={molecule}
              onChange={(e) => setMolecule(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="H2">Hydrogen Molecule (H₂ - 4 Qubits)</option>
              <option value="LiH">Lithium Hydride (LiH - 12 Qubits)</option>
              <option value="BeH2">Beryllium Hydride (BeH₂ - 14 Qubits)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">
              Wavefunction Ansatz
            </label>
            <select
              value={ansatz}
              onChange={(e) => setAnsatz(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="UCCSD">Unitary Coupled Cluster (UCCSD)</option>
              <option value="HardwareEfficient">Hardware-Efficient RY-RZ</option>
              <option value="ADAPT-VQE">ADAPT-VQE Operator Pool</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">
              Classical Optimizer
            </label>
            <select
              value={optimizer}
              onChange={(e) => setOptimizer(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="COBYLA">Constrained Optimization BY Linear Approx (COBYLA)</option>
              <option value="SPSA">Simultaneous Perturbation Stochastic (SPSA)</option>
              <option value="SLSQP">Sequential Least SQuares Programming (SLSQP)</option>
            </select>
          </div>
        </div>

        {/* Run Simulation Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs font-mono text-[var(--color-muted)]">
            Ground Energy Result: <strong className="text-cyan-500">{resultEnergy}</strong>
          </div>

          <button
            onClick={handleRunVqe}
            disabled={simulating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LuPlay size={14} className={simulating ? 'animate-spin' : ''} />
            <span>{simulating ? 'Optimizing Parameters...' : 'Run Simulation Convergence'}</span>
          </button>
        </div>
      </div>

      {/* Active Density Matrix & Qubit Fidelity Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
          <h3 className="font-bold text-sm text-[var(--color-text)]">Density Matrix Trace & Purity</h3>
          <p className="text-xs text-[var(--color-muted)]">Observable state purity: Tr(ρ²) = 0.9994</p>
          <div className="p-4 rounded-xl bg-[var(--color-background)] font-mono text-[11px] text-[var(--color-muted)] space-y-1">
            <div>|00⟩⟨00|: 0.4998 + 0.0000i</div>
            <div>|00⟩⟨11|: 0.4994 - 0.0002i</div>
            <div>|11⟩⟨00|: 0.4994 + 0.0002i</div>
            <div>|11⟩⟨11|: 0.5002 + 0.0000i</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
          <h3 className="font-bold text-sm text-[var(--color-text)]">Zero-Noise Extrapolated Fidelity</h3>
          <p className="text-xs text-[var(--color-muted)]">Polynomial Richardson extrapolation across λ=[1.0, 1.5, 2.0]</p>
          <div className="p-4 rounded-xl bg-[var(--color-background)] font-mono text-[11px] text-emerald-500 space-y-1">
            <div>&gt; Unmitigated Error Rate: 1.84 x 10⁻²</div>
            <div>&gt; Extrapolated Error Rate: 3.12 x 10⁻³</div>
            <div>&gt; Mitigation Gain Factor: 5.9x Accuracy Improvement</div>
          </div>
        </div>
      </div>
    </div>
  );
}
