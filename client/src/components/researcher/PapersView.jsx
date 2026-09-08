"use client";

import React, { useState } from 'react';
import { LuFileText, LuDownload, LuShare2, LuCheck, LuSparkles } from 'react-icons/lu';

export default function PapersView({ workspaceData }) {
  const [copiedId, setCopiedId] = useState(null);

  const papers = [
    {
      id: 'paper-1',
      title: 'Variational Quantum Eigensolver for Complex Polyatomic Molecular Ground States',
      authors: 'Dr. Aris Thorne, Dr. Eleanor Vance',
      journal: 'Physical Review A / arXiv:2609.04918',
      date: 'September 2026',
      doi: '10.1103/PhysRevA.2026.04918',
      status: 'Preprint Ready',
    },
    {
      id: 'paper-2',
      title: 'Adaptive Zero-Noise Extrapolation in 127-Qubit Superconducting Processors',
      authors: 'Dr. Aris Thorne et al.',
      journal: 'IEEE Transactions on Quantum Engineering',
      date: 'August 2026',
      doi: '10.1109/TQE.2026.110293',
      status: 'Peer Reviewed',
    },
    {
      id: 'paper-3',
      title: 'Fault-Tolerant Surface Code Thresholds Under Correlated Pauli X-Z Phase Noise',
      authors: 'Quantum Computing Laboratory',
      journal: 'Quantum Science and Technology',
      date: 'July 2026',
      doi: '10.1088/2058-9565/ad8192',
      status: 'Published',
    },
  ];

  const handleCopyBibtex = (id) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
              <LuFileText size={22} className="text-cyan-500" />
              Research Publications & LaTeX Preprints
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Compiled papers, computational results, and verifiable arXiv preprints
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            3 Active Documents
          </span>
        </div>

        <div className="space-y-4">
          {papers.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-3 hover:border-cyan-500/50 transition-all shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="text-xs font-mono text-cyan-500 font-semibold">{p.journal}</span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 self-start md:self-auto">
                  {p.status}
                </span>
              </div>

              <h3 className="font-bold text-base text-[var(--color-text)]">{p.title}</h3>
              <p className="text-xs text-[var(--color-muted)] font-medium">Authors: {p.authors} &bull; {p.date}</p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleCopyBibtex(p.id)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-cyan-500 text-xs font-semibold text-[var(--color-text)] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === p.id ? <LuCheck size={14} className="text-emerald-500" /> : <LuShare2 size={14} />}
                  <span>{copiedId === p.id ? 'BibTeX Copied!' : 'Copy BibTeX'}</span>
                </button>

                <button
                  onClick={() => alert(`Downloading PDF preprint for: ${p.title}`)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <LuDownload size={14} />
                  <span>Download PDF Preprint</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
