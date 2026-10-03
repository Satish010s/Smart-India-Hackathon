"use client";

import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

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
    <div
      className={`rounded-xl border transition-colors duration-300 ${
        open
          ? "border-[var(--color-primary)]/35 bg-[var(--color-background)]"
          : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-muted)]/40"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4.5 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] rounded-xl"
        aria-expanded={open}
        id={`faq-btn-${index}`}
        aria-controls={`faq-ans-${index}`}
      >
        <span className="text-[14.5px] font-semibold text-[var(--color-text)] leading-snug pr-4">
          {item.q}
        </span>
        <LuChevronDown
          size={18}
          className={`text-[var(--color-muted)] transition-transform duration-300 shrink-0 ${
            open ? "rotate-180 text-[var(--color-primary)]" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={`faq-ans-${index}`}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 sm:px-6 pb-5 text-[13.5px] text-[var(--color-muted)] leading-relaxed">
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="py-24 sm:py-28 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
            Got questions?{" "}
            <span className="text-[var(--color-muted)]">We&apos;ve got answers.</span>
          </h2>
          <p className="mt-4 text-[15.5px] text-[var(--color-muted)] leading-relaxed">
            Everything you need to know about the platform, frameworks, and plans.
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-2.5">
          {FAQS.map((item, i) => (
            <FAQItem key={i} item={item} index={i} open={openIndex === i} onToggle={handleToggle} />
          ))}
        </div>

        {/* Contact note */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]">
          <p className="text-[13.5px] text-[var(--color-muted)]">
            Still curious? We usually reply within a day.
          </p>
          <a
            href="mailto:hello@qubitminds.ai"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-primary)]/40 text-[var(--color-primary)] font-semibold text-[13.5px] hover:bg-[var(--color-primary)]/8 transition-all shrink-0"
          >
            hello@qubitminds.ai →
          </a>
        </div>
      </div>
    </section>
  );
}
