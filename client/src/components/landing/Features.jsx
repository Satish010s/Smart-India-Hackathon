"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuBlocks, LuCpu, LuActivity, LuBot, LuPlay, LuCode, LuSparkles, LuChevronRight,
} from "react-icons/lu";

const TABS = [
  {
    id: "builder",
    label: "Circuit builder",
    icon: LuBlocks,
    headline: "Visual and code, always in sync.",
    desc: "Drag quantum gates onto the canvas and watch Qiskit or Cirq code generate live. Switch between visual and code mode at any time.",
    demo: "CircuitBuilderDemo",
  },
  {
    id: "backends",
    label: "Multi-backend",
    icon: LuCpu,
    headline: "One circuit. Four frameworks.",
    desc: "Click a backend — Qiskit Aer, PennyLane, Cirq or qBraid — and compare outputs side by side. No queue wait.",
    demo: "BackendSwitcherDemo",
  },
  {
    id: "visuals",
    label: "Visualizations",
    icon: LuActivity,
    headline: "See inside the quantum state.",
    desc: "Bloch spheres, statevectors, amplitudes and probability histograms update live as you build.",
    demo: "VisualizationsDemo",
  },
  {
    id: "ai",
    label: "AI tutor",
    icon: LuBot,
    headline: "Ask. Generate. Debug. Learn.",
    desc: "The AI understands your circuit, current lesson and recent errors. It explains, generates code, and guides without giving answers away.",
    demo: "AiTutorDemo",
  },
];

/* ── Demos ────────────────────────────────────────────────────────────── */
function CircuitBuilderDemo() {
  const [activeGate, setActiveGate] = useState("H");
  const GATES = ["H", "X", "Y", "Z", "S", "T", "CNOT"];
  const codeLines = [
    [{ t: "kw", v: "from" }, { t: "tx", v: " qiskit " }, { t: "kw", v: "import" }, { t: "ty", v: " QuantumCircuit" }],
    [],
    [{ t: "va", v: "qc" }, { t: "op", v: " = " }, { t: "ty", v: "QuantumCircuit" }, { t: "tx", v: "(" }, { t: "nu", v: "2" }, { t: "tx", v: ")" }],
    [{ t: "va", v: "qc" }, { t: "tx", v: "." }, { t: "fn", v: "h" }, { t: "tx", v: "(" }, { t: "nu", v: "0" }, { t: "tx", v: ")" }],
    [{ t: "va", v: "qc" }, { t: "tx", v: "." }, { t: "fn", v: "cx" }, { t: "tx", v: "(" }, { t: "nu", v: "0" }, { t: "tx", v: ", " }, { t: "nu", v: "1" }, { t: "tx", v: ")" }],
  ];
  const colors = {
    kw: "text-fuchsia-400",
    ty: "text-sky-300",
    fn: "text-emerald-300",
    va: "text-teal-300",
    nu: "text-amber-300",
    op: "text-fuchsia-400",
    tx: "text-zinc-300",
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4 h-full">
      {/* Visual canvas */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 flex flex-col gap-4">
        <div className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Gate palette
        </div>
        <div className="flex gap-2 flex-wrap">
          {GATES.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGate(g)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-[12px] font-semibold transition-all cursor-pointer ${
                activeGate === g
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/40"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-7 relative flex-1 pt-4">
          <div className="relative flex items-center gap-3">
            <span className="text-[11px] font-mono text-[var(--color-muted)] w-5">q0</span>
            <div className="flex-1 relative h-px bg-[var(--color-border)]">
              <div className="absolute inset-y-0 left-0 w-1/3 animate-wire-pulse bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-70" />
            </div>
            <span className="absolute left-12 w-10 h-10 rounded-lg border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-[13px] font-mono font-bold">
              H
            </span>
            <span className="absolute right-2 w-9 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] flex items-center justify-center text-[11px] font-mono">
              M
            </span>
          </div>
          <div className="relative flex items-center gap-3">
            <span className="text-[11px] font-mono text-[var(--color-muted)] w-5">q1</span>
            <div className="flex-1 relative h-px bg-[var(--color-border)]" />
            <span className="absolute right-2 w-9 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] flex items-center justify-center text-[11px] font-mono">
              M
            </span>
          </div>
          {/* CNOT */}
          <div className="absolute left-12 top-[22px] flex flex-col items-center" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
            <span className="w-px h-[46px] bg-[var(--color-primary)]/60" />
          </div>
          <span className="absolute left-12 top-[72px] w-10 h-10 rounded-lg border border-[var(--color-primary)]/40 bg-[var(--color-background)] text-[var(--color-primary)] flex items-center justify-center">
            <span className="relative w-4 h-4">
              <span className="absolute top-1/2 left-0 w-full h-px bg-current" />
              <span className="absolute left-1/2 top-0 h-full w-px bg-current" />
            </span>
          </span>
        </div>
      </div>

      {/* Code panel */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[#0b0f14] p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-zinc-500 flex items-center gap-2">
            <LuCode size={13} /> Qiskit
          </div>
          <span className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Synced
          </span>
        </div>
        <div className="font-mono text-[12.5px] flex-1">
          {codeLines.map((line, i) => (
            <div key={i} className="flex gap-4 leading-7">
              <span className="text-zinc-600 select-none w-4 text-right shrink-0">{i + 1}</span>
              <span>
                {line.map((p, j) => (
                  <span key={j} className={colors[p.t] || "text-zinc-300"}>
                    {p.v}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 transition-all cursor-pointer">
          <LuPlay size={13} fill="currentColor" /> Run circuit
        </button>
      </div>
    </div>
  );
}

function BackendSwitcherDemo() {
  const [active, setActive] = useState(0);
  const backends = [
    { name: "Qiskit Aer", result: { "00": 511, "11": 513 } },
    { name: "PennyLane", result: { "00": 508, "11": 516 } },
    { name: "Cirq", result: { "00": 497, "11": 527 } },
    { name: "qBraid", result: { "00": 512, "11": 512 } },
  ];
  const b = backends[active];
  const shots = 1024;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-wrap gap-2">
        {backends.map((bk, i) => (
          <button
            key={bk.name}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-lg border text-[12px] font-mono font-semibold transition-all cursor-pointer ${
              active === i
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/40"
            }`}
          >
            {bk.name}
          </button>
        ))}
      </div>
      <div className="flex-1 rounded-xl border border-[var(--color-border)] bg-[#0b0f14] p-5 font-mono text-[13px]">
        <div className="text-zinc-500 text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-4">
          Execution result — {shots} shots
        </div>
        <div className="space-y-3">
          {Object.entries(b.result).map(([state, count]) => {
            const pct = Math.round((count / shots) * 100);
            return (
              <div key={state}>
                <div className="flex justify-between text-[11.5px] mb-1.5">
                  <span className="text-teal-300 font-semibold">|{state}⟩</span>
                  <span className="text-zinc-500">
                    {count} / {pct}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-400 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="text-[10px] text-zinc-600 mb-1.5">Raw output</div>
          <div className="text-emerald-400 text-[11px]">
            {"{"} {Object.entries(b.result).map(([k, v]) => `'${k}': ${v}`).join(", ")} {"}"}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualizationsDemo() {
  return (
    <div className="grid sm:grid-cols-3 gap-3 h-full">
      {/* Bloch sphere */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 flex flex-col items-center">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-3 w-full">
          Bloch sphere
        </div>
        <svg viewBox="0 0 200 200" className="w-full max-h-[118px]">
          <defs>
            <marker id="bva" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L8,3 z" fill="var(--color-primary)" />
            </marker>
          </defs>
          <circle cx="100" cy="100" r="78" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
          <ellipse cx="100" cy="100" rx="78" ry="22" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="100" y1="22" x2="100" y2="178" stroke="var(--color-border)" strokeWidth="1" />
          <line x1="22" y1="100" x2="178" y2="100" stroke="var(--color-border)" strokeWidth="1" />
          <text x="105" y="18" fill="var(--color-muted)" fontSize="11" fontFamily="monospace">|0⟩</text>
          <text x="105" y="192" fill="var(--color-muted)" fontSize="11" fontFamily="monospace">|1⟩</text>
          <line x1="100" y1="100" x2="148" y2="52" stroke="var(--color-primary)" strokeWidth="2.5" markerEnd="url(#bva)" />
          <circle cx="100" cy="100" r="3.5" fill="var(--color-primary)" />
          <text x="152" y="48" fill="var(--color-text)" fontSize="12" fontFamily="monospace" fontWeight="bold">|ψ⟩</text>
        </svg>
        <div className="font-mono text-[10px] text-[var(--color-muted)] mt-2">θ = π/4 · φ = 0</div>
      </div>

      {/* Histogram */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-3">
          Probabilities
        </div>
        <div className="flex items-end gap-1.5 h-24 mb-2">
          {[
            { s: "|00⟩", v: 50, c: "var(--color-primary)" },
            { s: "|01⟩", v: 3, c: "var(--color-border)" },
            { s: "|10⟩", v: 2, c: "var(--color-border)" },
            { s: "|11⟩", v: 50, c: "var(--color-accent)" },
          ].map((bar) => (
            <div key={bar.s} className="flex-1 flex flex-col items-center gap-1 h-full">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t transition-all duration-700"
                  style={{ height: `${bar.v}%`, background: bar.c, opacity: bar.v > 10 ? 1 : 0.5 }}
                />
              </div>
              <span className="font-mono text-[9px] text-[var(--color-muted)]">{bar.s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amplitudes */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-3">
          Amplitudes
        </div>
        <div className="space-y-2 font-mono text-[11px]">
          {[
            { s: "|00⟩", a: "0.707 + 0j", strong: true },
            { s: "|01⟩", a: "0.000 + 0j", strong: false },
            { s: "|10⟩", a: "0.000 + 0j", strong: false },
            { s: "|11⟩", a: "0.707 + 0j", strong: true },
          ].map((row) => (
            <div
              key={row.s}
              className={`flex justify-between p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] ${
                row.strong ? "" : "opacity-45"
              }`}
            >
              <span className={`font-semibold ${row.strong ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`}>
                {row.s}
              </span>
              <span className={row.strong ? "text-[var(--color-text)]" : "text-[var(--color-muted)]"}>{row.a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AiTutorDemo() {
  const msgs = [
    { role: "user", text: "Why does the Hadamard gate create superposition?" },
    {
      role: "ai",
      text: "The H gate transforms |0⟩ into 1/√2(|0⟩+|1⟩) — a 45° rotation on the Bloch sphere that places the qubit on the equator, equidistant from both poles.",
    },
    { role: "user", text: "Show me the Qiskit code for a Bell state." },
    { role: "ai", code: "qc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden flex flex-col">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--color-border)]">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/12 text-[var(--color-primary)] flex items-center justify-center">
            <LuSparkles size={13} />
          </div>
          <span className="text-[12.5px] font-semibold text-[var(--color-text)]">QubitMinds AI</span>
          <span className="text-[10px] text-emerald-500 font-mono ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
          </span>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-3.5 overflow-y-auto">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]"
                    : "bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/20 text-[var(--color-text)]"
                }`}
              >
                {m.text && <p>{m.text}</p>}
                {m.code && (
                  <pre className="font-mono text-[11px] text-emerald-300 bg-[#0b0f14] p-3 rounded-lg border border-zinc-800 mt-1.5 overflow-x-auto">
                    {m.code}
                  </pre>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-start">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEMOS = { CircuitBuilderDemo, BackendSwitcherDemo, VisualizationsDemo, AiTutorDemo };

export default function Features() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab];
  const DemoComponent = DEMOS[tab.demo];

  return (
    <section id="features" className="py-24 sm:py-28 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
            Everything you need to go from{" "}
            <span className="text-[var(--color-muted)]">curious to quantum-ready.</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t, i) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] ${
                  activeTab === i
                    ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/8 text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)]/40"
                }`}
              >
                <Icon size={15} aria-hidden="true" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[340px_1fr] gap-8 items-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id + "-info"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:pt-4"
            >
              <h3 className="text-xl sm:text-2xl font-heading font-semibold leading-snug text-[var(--color-text)] mb-3">
                {tab.headline}
              </h3>
              <p className="text-[14.5px] text-[var(--color-muted)] leading-relaxed mb-6">{tab.desc}</p>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-primary)]">
                Explore this feature <LuChevronRight size={15} aria-hidden="true" />
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id + "-demo"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 sm:p-5 min-h-[340px]"
            >
              <DemoComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
