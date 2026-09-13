"use client";

import React, { useState } from 'react';
import {
  LuX, LuBookOpen, LuFlaskConical, LuBrain, LuTrophy,
  LuCheck, LuTarget, LuPlay, LuChevronRight, LuArrowLeft,
  LuClock, LuZap, LuCircle,
} from 'react-icons/lu';

const MODULE_DATA = {
  id: 'm3',
  title: "Module 3: Grover's Search Algorithm",
  objective: "Master Grover's quantum search algorithm and understand how amplitude amplification provides quadratic speedup over classical search.",
  concepts: ['Quantum oracles', 'Phase inversion', 'Amplitude amplification', 'Diffusion operator', 'Quadratic speedup'],
  progress: 40,
  requirements: ['Complete Module 2', 'Basic circuit understanding'],
  lessons: [
    { id: 'l6', type: 'lesson', title: 'Oracle Construction', duration: '20 min', completed: true, description: 'Learn how to design quantum oracles that mark solution states.' },
    { id: 'l7', type: 'lesson', title: 'Amplitude Amplification', duration: '25 min', completed: true, description: 'Understand how Grover iterations boost amplitude of marked states.' },
    { id: 'l8', type: 'lesson', title: 'Diffusion Operator', duration: '20 min', completed: false, description: 'Master the inversion about average operation.' },
    { id: 'e3', type: 'experiment', title: "Lab: Grover on 3 Qubits", duration: '35 min', completed: false, description: 'Build a complete Grover circuit for a 3-qubit search space.' },
    { id: 'q2', type: 'quiz', title: 'Module 3 Quiz', duration: '10 min', completed: false, description: 'Test your knowledge of Grover\'s algorithm concepts.' },
    { id: 'c2', type: 'challenge', title: "Challenge: Optimize Oracle Depth", duration: '45 min', completed: false, description: 'Reduce the gate depth of your oracle implementation.' },
  ],
};

const TYPE_CONFIG = {
  lesson: { icon: LuBookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Lesson' },
  experiment: { icon: LuFlaskConical, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Lab' },
  quiz: { icon: LuBrain, color: 'text-violet-400', bg: 'bg-violet-500/10', label: 'Quiz' },
  challenge: { icon: LuTrophy, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Challenge' },
};

export default function ModuleOverview({ module = MODULE_DATA, onSelectLesson, onClose }) {
  const completedCount = module.lessons.filter(l => l.completed).length;
  const pct = Math.round((completedCount / module.lessons.length) * 100);

  // Find next incomplete
  const nextLesson = module.lessons.find(l => !l.completed);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-cyan-500/10 via-[var(--color-surface)] to-violet-500/10 p-6 sm:p-8">
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[var(--color-border)]/30 text-[var(--color-muted)] transition-colors">
            <LuArrowLeft size={18} />
          </button>
        )}

        <div className="relative z-10 space-y-4 pr-10">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Module Overview</div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-text)]">{module.title}</h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-2xl">{module.objective}</p>

          {/* Completion progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-[var(--color-muted)]">
              <span>{completedCount}/{module.lessons.length} items</span>
              <span className="font-bold text-cyan-400">{pct}% complete</span>
            </div>
            <div className="h-2 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {nextLesson && (
            <button
              onClick={() => onSelectLesson && onSelectLesson(nextLesson)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
            >
              <LuPlay size={14} /> Continue Module
            </button>
          )}
        </div>
      </div>

      {/* Concepts covered */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
          <LuTarget size={15} className="text-[var(--color-primary)]" /> Concepts Covered
        </h3>
        <div className="flex flex-wrap gap-2">
          {module.concepts.map(c => (
            <span key={c} className="text-xs px-3 py-1 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)] font-mono">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Requirements */}
      {module.requirements?.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
            <LuZap size={13} /> Requirements
          </div>
          <ul className="space-y-1">
            {module.requirements.map(r => (
              <li key={r} className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <LuCheck size={11} className="text-emerald-400" /> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lesson List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Lessons & Activities</h3>
        {module.lessons.map((lesson, i) => {
          const cfg = TYPE_CONFIG[lesson.type] || TYPE_CONFIG.lesson;
          const Icon = cfg.icon;
          const isNext = lesson.id === nextLesson?.id;

          return (
            <div
              key={lesson.id}
              className={`relative flex items-center gap-4 p-4 rounded-2xl border cursor-pointer group transition-all ${
                lesson.completed
                  ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                  : isNext
                  ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/30 hover:border-[var(--color-primary)]/60'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border)]'
              }`}
              onClick={() => onSelectLesson && onSelectLesson(lesson)}
            >
              {isNext && (
                <div className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-bold uppercase tracking-wider">
                  Next
                </div>
              )}

              {/* Step number / check */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono ${
                lesson.completed ? 'bg-emerald-500 text-white' : isNext ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-[var(--color-border)]/30 text-[var(--color-muted)]'
              }`}>
                {lesson.completed ? <LuCheck size={14} /> : i + 1}
              </div>

              {/* Type icon */}
              <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={cfg.color} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{lesson.title}</div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-1">{lesson.description}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} font-semibold`}>{cfg.label}</span>
                  <span className="text-[10px] text-[var(--color-muted)] font-mono flex items-center gap-1"><LuClock size={9} />{lesson.duration}</span>
                </div>
              </div>

              <LuChevronRight size={16} className="text-[var(--color-muted)] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
