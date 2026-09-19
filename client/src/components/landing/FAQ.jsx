"use client";

import React, { useState } from "react";
import { LuChevronDown, LuInfo } from "react-icons/lu";

const FAQS = [
  {
    q: "Do I need a physics or math background to start?",
    a: "Not at all. We designed QubitMinds for programmers, engineers, and curious beginners. We start from scratch — what a qubit is, what superposition means, and why it matters — using visual intuition before any math. Linear algebra becomes relevant only at the intermediate level, and we explain it as you need it.",
  },
  {
    q: "Is QubitMinds free?",
    a: "Yes — a generous free tier gives you access to all beginner lessons, the circuit builder with Qiskit Aer simulation, the first 10 coding challenges, and 50 AI tutor messages per month. Pro and Instructor plans unlock unlimited simulations, all backends, advanced courses, and class management tools.",
  },
  {
    q: "Which quantum frameworks does the platform support?",
    a: "We support Qiskit Aer (IBM), PennyLane (Xanadu), Cirq (Google), and qBraid for multi-cloud hardware access. Your visual circuit automatically transpiles to any of these backends. All simulations run server-side — no local Python installation needed.",
  },
  {
    q: "Can I run circuits on real quantum hardware?",
    a: "Yes, through qBraid integration (Pro plan). You can submit jobs to IonQ, Rigetti, and OQC processors. Note that real hardware jobs may have queue times — we recommend simulators for learning and use real hardware for experiments once you're comfortable.",
  },
  {
    q: "What makes the AI tutor different from ChatGPT?",
    a: "Our AI is context-aware in a way general-purpose models aren't. It knows your current lesson, sees your exact circuit diagram and code, understands your recent error messages, and tracks your learning history. It won't just give you answers — it gives hints calibrated to your level so you actually learn.",
  },
  {
    q: "Are there instructor plans for universities or bootcamps?",
    a: "Yes. The Instructor plan includes course creation tools, assignment management, student progress dashboards, weak-topic heatmaps, and grading queues. Contact us at instructors@qubitminds.ai for institutional pricing and LMS integrations (Canvas, Moodle, Google Classroom).",
  },
  {
    q: "How does the drag-and-drop circuit builder work on mobile?",
    a: "On mobile, circuits are built by tap-to-place: tap a gate from the palette, then tap the qubit wire position where you want it placed. You can also use the code editor on mobile if you prefer. All simulations and visualizations are fully touch-optimized.",
  },
  {
    q: "Is there a certificate at the end of a course?",
    a: "Yes. Completing a learning path (all lessons + coding challenges + final assessment) awards a verified certificate of completion. Certificates are shareable on LinkedIn and carry a unique verification ID. Advanced certificates also list the algorithms and frameworks covered.",
  },
];

function FAQItem({ item, index, open, onToggle }) {
  return (
    <div className={`rounded-2xl border transition-all duration-300 ${open ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5" : "border-[var(--color-border)] bg-[var(--color-surface)]/40"}`}>
      <button
        type="button"
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] rounded-2xl"
        aria-expanded={open}
        id={`faq-btn-${index}`}
        aria-controls={`faq-ans-${index}`}
      >
        <span className="text-base font-semibold text-[var(--color-text)] leading-snug pr-4">{item.q}</span>
        <LuChevronDown
          size={20}
          className={`text-[var(--color-muted)] transition-transform duration-300 shrink-0 ${open ? "rotate-180 text-[var(--color-primary)]" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={`faq-ans-${index}`}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        className={`overflow-hidden transition-all duration-400 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="px-6 pb-5 text-sm text-[var(--color-muted)] leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="py-28 bg-[var(--color-background)] relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px section-divider" />

      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--color-accent)]/6 blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/8 text-[var(--color-accent)] text-xs font-semibold tracking-wider mb-5">
            <LuInfo size={13} aria-hidden="true" /> FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-5 tracking-tight">
            Got questions?{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)]">
              We've got answers.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-muted)]">
            Still curious? Reach us at{" "}
            <a href="mailto:hello@qubitminds.ai" className="text-[var(--color-primary)] hover:underline">
              hello@qubitminds.ai
            </a>
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-3" role="list">
          {FAQS.map((item, i) => (
            <div key={i} role="listitem">
              <FAQItem item={item} index={i} open={openIndex === i} onToggle={handleToggle} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
