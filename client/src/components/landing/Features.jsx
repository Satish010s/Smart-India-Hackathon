"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuBlocks, LuCpu, LuActivity, LuBot,
  LuPlay, LuCode, LuMessageSquare, LuSparkles, LuChevronRight
} from "react-icons/lu";

const TABS = [
  {
    id: "builder",
    label: "Circuit Builder",
    icon: LuBlocks,
    headline: "Visual + Code — always in sync.",
    desc: "Drag quantum gates onto the canvas and watch Qiskit or Cirq code generate live. Switch between visual and code mode at any time.",
    color: "from-cyan-500 to-blue-600",
    accent: "cyan",
    accentHex: "#22d3ee",
    demo: "CircuitBuilderDemo",
  },
  {
    id: "backends",
    label: "Multi-Backend",
    icon: LuCpu,
    headline: "One circuit. Four frameworks.",
    desc: "Click a backend — Qiskit Aer, PennyLane, Cirq, or qBraid — and compare outputs side by side. No queue wait.",
    color: "from-violet-500 to-indigo-600",
    accent: "violet",
    accentHex: "#6366f1",
    demo: "BackendSwitcherDemo",
  },
  {
    id: "visuals",
    label: "Visualizations",
    icon: LuActivity,
    headline: "See inside the quantum state.",
    desc: "Bloch spheres, statevectors, density matrices, and probability histograms update live as you build.",
    color: "from-emerald-500 to-teal-600",
    accent: "emerald",
    accentHex: "#10b981",
    demo: "VisualizationsDemo",
  },
  {
    id: "ai",
    label: "AI Tutor",
    icon: LuBot,
    headline: "Ask. Generate. Debug. Learn.",
    desc: "Context-aware AI understands your circuit, current lesson, and recent errors. It explains, generates code, and guides without giving answers away.",
    color: "from-amber-500 to-orange-600",
    accent: "amber",
    accentHex: "#f59e0b",
    demo: "AiTutorDemo",
  },
];

function CircuitBuilderDemo() {
  const [activeGate, setActiveGate] = useState("H");
  const GATES = ["H", "X", "Y", "Z", "S", "T", "CNOT"];
  const codeLines = [
    { n: 1, parts: [{ t: "kw", v: "from" }, { t: "tx", v: " qiskit " }, { t: "kw", v: "import" }, { t: "fn", v: " QuantumCircuit" }] },
    { n: 2, parts: [] },
    { n: 3, parts: [{ t: "va", v: "qc" }, { t: "op", v: " = " }, { t: "fn", v: "QuantumCircuit" }, { t: "tx", v: "(" }, { t: "nu", v: "2" }, { t: "tx", v: ")" }] },
    { n: 4, parts: [{ t: "va", v: "qc" }, { t: "tx", v: "." }, { t: "fn", v: "h" }, { t: "tx", v: "(" }, { t: "nu", v: "0" }, { t: "tx", v: ")" }] },
    { n: 5, parts: [{ t: "va", v: "qc" }, { t: "tx", v: "." }, { t: "fn", v: "cx" }, { t: "tx", v: "(" }, { t: "nu", v: "0" }, { t: "tx", v: ", " }, { t: "nu", v: "1" }, { t: "tx", v: ")" }] },
  ];
  const colors = { kw: "text-pink-400", fn: "text-green-300", va: "text-blue-400", nu: "text-purple-400", op: "text-pink-400", tx: "text-gray-300" };

  return (
    <div className="grid lg:grid-cols-2 gap-4 h-full">
      {/* Visual canvas */}
      <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-background)]/70 p-5 flex flex-col gap-4">
        <div className="text-xs font-mono font-bold text-[var(--color-muted)] uppercase tracking-wider">Circuit Canvas</div>
        <div className="flex gap-2 flex-wrap">
          {GATES.map(g => (
            <button key={g} onClick={() => setActiveGate(g)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${activeGate === g ? "border-cyan-500 bg-cyan-500/15 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]" : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-cyan-500/40"}`}>
              {g}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-6 relative flex-1">
          {/* Wire 1 */}
          <div className="absolute top-[20px] left-6 right-6 h-px bg-[var(--color-border)]/60 overflow-hidden">
            <div className="animate-wire-pulse absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </div>
          {/* Wire 2 */}
          <div className="absolute top-[76px] left-6 right-6 h-px bg-[var(--color-border)]/60 overflow-hidden">
            <div className="animate-wire-pulse absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-violet-400 to-transparent" style={{ animationDelay: "0.7s" }} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <span className="text-[var(--color-muted)] font-mono text-xs w-4">q0</span>
            <div className="w-11 h-11 rounded-xl border border-cyan-500 bg-cyan-500/15 flex items-center justify-center font-mono font-bold text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)] text-sm">H</div>
            <div className="relative"><div className="w-4 h-4 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_rgba(99,102,241,0.5)]" /><div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary)]/20" /></div>
            <div className="flex-1" />
            <div className="w-11 h-11 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 flex items-center justify-center text-[var(--color-muted)] font-bold text-sm font-mono">M</div>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <span className="text-[var(--color-muted)] font-mono text-xs w-4">q1</span>
            <div className="w-[72px]" />
            <div className="w-11 h-11 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-background)]/60 flex items-center justify-center relative shadow-[0_0_12px_rgba(99,102,241,0.15)]">
              <div className="absolute w-5 h-px bg-[var(--color-primary)]" /><div className="absolute w-px h-5 bg-[var(--color-primary)]" />
            </div>
            <div className="flex-1" />
            <div className="w-11 h-11 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 flex items-center justify-center text-[var(--color-muted)] font-bold text-sm font-mono">M</div>
          </div>
        </div>
      </div>
      {/* Code panel */}
      <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[#060d1a] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono font-bold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-2">
            <LuCode size={14} /> Qiskit Code
          </div>
          <span className="text-[10px] font-mono text-green-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Synced
          </span>
        </div>
        <div className="font-mono text-sm">
          {codeLines.map(line => (
            <div key={line.n} className="flex gap-4 leading-7">
              <span className="text-gray-600 select-none w-4 text-right shrink-0">{line.n}</span>
              <span>{line.parts.map((p, i) => <span key={i} className={colors[p.t] || "text-gray-300"}>{p.v}</span>)}</span>
            </div>
          ))}
        </div>
        <button className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-sans text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #22d3ee, #6366f1)" }}>
          <LuPlay size={14} fill="currentColor" /> Run Circuit
        </button>
      </div>
    </div>
  );
}

function BackendSwitcherDemo() {
  const [active, setActive] = useState(0);
  const backends = [
    { name: "Qiskit Aer", color: "#6366f1", result: { "00": 511, "11": 513 }, shots: 1024 },
    { name: "PennyLane", color: "#22d3ee", result: { "00": 508, "11": 516 }, shots: 1024 },
    { name: "Cirq", color: "#e879f9", result: { "00": 497, "11": 527 }, shots: 1024 },
    { name: "qBraid", color: "#f59e0b", result: { "00": 512, "11": 512 }, shots: 1024 },
  ];
  const b = backends[active];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-wrap gap-2">
        {backends.map((bk, i) => (
          <button key={bk.name} onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${active === i ? "text-white shadow-lg border-transparent" : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border)]"}`}
            style={active === i ? { background: bk.color, boxShadow: `0 0 20px ${bk.color}40` } : {}}>
            {bk.name}
          </button>
        ))}
      </div>
      <div className="flex-1 rounded-2xl border border-[var(--color-border)]/50 bg-[#060d1a] p-5 font-mono text-sm">
        <div className="text-[var(--color-muted)] text-xs font-bold uppercase tracking-wider mb-4">Execution Result — {b.shots} shots</div>
        <div className="space-y-3">
          {Object.entries(b.result).map(([state, count]) => {
            const pct = Math.round((count / b.shots) * 100);
            return (
              <div key={state}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: b.color }} className="font-bold">|{state}⟩</span>
                  <span className="text-[var(--color-muted)]">{count} / {pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--color-border)]/40 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: b.color }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 p-3 rounded-xl bg-[var(--color-surface)]/20 border border-[var(--color-border)]/30">
          <div className="text-[10px] text-[var(--color-muted)] mb-2">Raw output</div>
          <div className="text-green-400 text-[11px]">{"{"} {Object.entries(b.result).map(([k,v]) => `'${k}': ${v}`).join(", ")} {"}"}</div>
        </div>
      </div>
    </div>
  );
}

function VisualizationsDemo() {
  return (
    <div className="grid grid-cols-3 gap-3 h-full">
      {/* Bloch sphere */}
      <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-background)]/70 p-4 flex flex-col items-center">
        <div className="text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-wider mb-3 w-full">Bloch Sphere</div>
        <svg viewBox="0 0 200 200" className="w-full max-h-[120px]">
          <defs>
            <radialGradient id="bvg" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#1e2d45" stopOpacity="0.8" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
            </radialGradient>
            <marker id="bva" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
            </marker>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#bvg)" stroke="#1e2d45" strokeWidth="1.5" />
          <ellipse cx="100" cy="100" rx="80" ry="22" fill="none" stroke="#1e2d45" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="100" y1="18" x2="100" y2="182" stroke="#334155" strokeWidth="1" opacity="0.6" />
          <line x1="18" y1="100" x2="182" y2="100" stroke="#334155" strokeWidth="1" opacity="0.6" />
          <text x="105" y="14" fill="#94a3b8" fontSize="10" fontFamily="monospace">|0⟩</text>
          <text x="105" y="192" fill="#94a3b8" fontSize="10" fontFamily="monospace">|1⟩</text>
          <line x1="100" y1="100" x2="150" y2="50" stroke="#6366f1" strokeWidth="2.5" markerEnd="url(#bva)" />
          <circle cx="100" cy="100" r="3.5" fill="#6366f1" />
          <text x="154" y="45" fill="#f1f5f9" fontSize="11" fontFamily="monospace" fontWeight="bold">|ψ⟩</text>
        </svg>
        <div className="font-mono text-[10px] text-[var(--color-muted)] mt-1">θ=π/4 φ=0</div>
      </div>
      {/* Histogram */}
      <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-background)]/70 p-4">
        <div className="text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-wider mb-3">Probabilities</div>
        <div className="flex items-end gap-1.5 h-24 mb-2">
          {[{ s: "|00⟩", v: 50, c: "#6366f1" }, { s: "|01⟩", v: 3, c: "#334155" }, { s: "|10⟩", v: 2, c: "#334155" }, { s: "|11⟩", v: 50, c: "#22d3ee" }].map(b => (
            <div key={b.s} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t relative overflow-hidden" style={{ height: "100%" }}>
                <div className="w-full rounded-t absolute bottom-0 transition-all duration-700" style={{ height: `${b.v}%`, background: b.c, boxShadow: b.v > 20 ? `0 0 10px ${b.c}50` : "none" }} />
              </div>
              <span className="font-mono text-[8px] text-[var(--color-muted)]">{b.s}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Statevector */}
      <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-background)]/70 p-4">
        <div className="text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-wider mb-3">Amplitude</div>
        <div className="space-y-2 font-mono text-[11px]">
          {[{ s: "|00⟩", a: "0.707+0j", c: "text-[var(--color-primary)]" }, { s: "|01⟩", a: "0.000+0j", c: "text-[var(--color-muted)] opacity-40" }, { s: "|10⟩", a: "0.000+0j", c: "text-[var(--color-muted)] opacity-40" }, { s: "|11⟩", a: "0.707+0j", c: "text-[var(--color-secondary)]" }].map(r => (
            <div key={r.s} className="flex justify-between p-2 rounded-lg bg-[var(--color-surface)]/30 border border-[var(--color-border)]/30">
              <span className={`font-bold ${r.c}`}>{r.s}</span>
              <span className={r.c}>{r.a}</span>
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
    { role: "ai", text: "The H gate transforms |0⟩ into 1/√2(|0⟩+|1⟩). It's a 45° rotation on the Bloch sphere — placing the qubit exactly on the equator, equidistant from both poles.", code: null },
    { role: "user", text: "Show me the Qiskit code for a Bell state." },
    { role: "ai", text: null, code: "qc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-background)]/60 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)]/50 bg-[var(--color-surface)]/30">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #6366f1, #e879f9)" }}>
            <LuSparkles size={14} />
          </div>
          <span className="text-xs font-bold text-[var(--color-text)]">QubitMinds AI</span>
          <span className="text-[10px] text-green-400 font-mono ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Always online
          </span>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "ai" && (
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white mt-0.5" style={{ background: "linear-gradient(135deg, #6366f1, #e879f9)" }}>
                  <LuSparkles size={12} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-[var(--color-surface)]/60 border border-[var(--color-border)]/50 rounded-tr-sm text-[var(--color-text)]" : "bg-[var(--color-primary)]/12 border border-[var(--color-primary)]/20 rounded-tl-sm"}`}>
                {m.text && <p className="text-[var(--color-text)] text-xs leading-relaxed">{m.text}</p>}
                {m.code && (
                  <pre className="font-mono text-[11px] text-green-300 bg-[#060d1a] p-3 rounded-lg border border-[var(--color-border)]/30 mt-1 overflow-x-auto">
                    {m.code}
                  </pre>
                )}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-full flex-shrink-0 bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] mt-0.5">
                  <LuMessageSquare size={12} />
                </div>
              )}
            </div>
          ))}
          {/* typing indicator */}
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #6366f1, #e879f9)" }}>
              <LuSparkles size={12} />
            </div>
            <div className="bg-[var(--color-surface)]/40 border border-[var(--color-border)]/40 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
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
    <section id="features" className="py-28 bg-[var(--color-surface)] relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 text-[var(--color-primary)] text-xs font-semibold tracking-wider mb-5">
            <LuBlocks size={13} /> FEATURE SHOWCASE
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-5 tracking-tight">
            Everything you need to go from{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              curious to quantum-ready.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
            One platform, fully integrated — no switching between tools.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((t, i) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] ${
                  activeTab === i
                    ? "text-white shadow-lg"
                    : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text)]"
                }`}
                style={activeTab === i ? { background: `linear-gradient(135deg, ${t.accentHex}cc, ${t.accentHex}88)` } : {}}
              >
                <Icon size={16} aria-hidden="true" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Info panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id + "-info"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-5"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white w-fit bg-gradient-to-r ${tab.color}`}>
                <tab.icon size={14} aria-hidden="true" />
                {tab.label}
              </div>
              <h3 className="text-3xl font-heading font-bold leading-tight">{tab.headline}</h3>
              <p className="text-base text-[var(--color-muted)] leading-relaxed">{tab.desc}</p>
              <button className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:gap-3 transition-all w-fit">
                Explore this feature <LuChevronRight size={16} aria-hidden="true" />
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Demo panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id + "-demo"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)]/60 backdrop-blur p-5 min-h-[340px]"
            >
              <DemoComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
