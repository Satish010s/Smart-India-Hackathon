"use client";

import React from "react";
import {
  LuSparkles, LuTerminal, LuCode, LuCircleHelp, LuLightbulb, LuUser,
} from "react-icons/lu";

const CAPABILITIES = [
  { icon: LuCircleHelp, text: "Explain concepts" },
  { icon: LuCode, text: "Generate code" },
  { icon: LuTerminal, text: "Debug circuits" },
  { icon: LuSparkles, text: "Optimize circuits" },
  { icon: LuLightbulb, text: "Give calibrated hints" },
  { icon: LuUser, text: "Recommend lessons" },
];

export default function AITutor() {
  return (
    <section className="py-24 sm:py-28 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Conversation UI */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-[0_35px_80px_-45px_rgba(2,6,23,0.4)] overflow-hidden flex flex-col h-[440px]">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/12 text-[var(--color-primary)] flex items-center justify-center">
                  <LuSparkles size={15} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[var(--color-text)]">QubitMinds AI</div>
                  <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Context-aware
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
                <div className="flex justify-end">
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-[13px] text-[var(--color-text)]">
                    Why does the Hadamard gate create superposition?
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/20 rounded-2xl rounded-tl-sm px-4 py-3.5 max-w-[85%] text-[13px] leading-relaxed text-[var(--color-text)]">
                    <p className="mb-2.5">
                      The Hadamard gate (H) transforms the basis state{" "}
                      <strong className="font-mono text-[12px]">|0⟩</strong> into an equal superposition of{" "}
                      <strong className="font-mono text-[12px]">|0⟩</strong> and{" "}
                      <strong className="font-mono text-[12px]">|1⟩</strong>.
                    </p>
                    <p>
                      Mathematically it creates{" "}
                      <strong className="font-mono text-[12px]">|+⟩ = 1/√2(|0⟩ + |1⟩)</strong>.
                    </p>
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      <button className="text-[11.5px] px-3 py-1.5 rounded-lg border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer">
                        Explain visually
                      </button>
                      <button className="text-[11.5px] px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors cursor-pointer">
                        Show example
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>

              {/* Input mock */}
              <div className="p-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <span className="text-[13px] text-[var(--color-muted)] flex-1">Ask anything about your circuit...</span>
                  <span className="text-[10px] font-mono text-[var(--color-muted)] border border-[var(--color-border)] px-1.5 py-0.5 rounded">
                    ⏎
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
              <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
              AI tutor
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight mb-4">
              Your quantum tutor is{" "}
              <span className="text-[var(--color-muted)]">always with you.</span>
            </h2>

            <p className="text-[15.5px] text-[var(--color-muted)] leading-relaxed mb-9 max-w-xl">
              Not a generic chatbot. The AI understands your current lesson, your circuit canvas,
              your code and your simulation results — so every answer fits exactly where you are.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {CAPABILITIES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.text}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]"
                  >
                    <Icon size={16} className="text-[var(--color-primary)] shrink-0" />
                    <span className="text-[13.5px] font-medium text-[var(--color-text)]">{f.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
