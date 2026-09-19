"use client";

import React, { useEffect, useRef, useState } from "react";
import { LuStar, LuQuote, LuUsers, LuActivity, LuTarget } from "react-icons/lu";

const STATS = [
  { label: "Circuits Run", value: 18400, suffix: "+", icon: LuActivity, color: "text-cyan-400" },
  { label: "Active Learners", value: 3800, suffix: "+", icon: LuUsers, color: "text-violet-400" },
  { label: "Challenges Solved", value: 940, suffix: "+", icon: LuTarget, color: "text-pink-400" },
  { label: "Avg. Rating", value: 4.9, suffix: "/5", icon: LuStar, color: "text-amber-400", decimal: true },
];

const TESTIMONIALS = [
  {
    quote: "I tried textbooks, I tried YouTube — nothing clicked. QubitMinds was the first thing that made superposition feel intuitive. The live histogram changing as I dragged gates was the \"aha\" moment I needed.",
    name: "Arjun Kapoor",
    role: "B.Tech CSE, IIT Bombay",
    initials: "AK",
    color: "from-cyan-500 to-blue-600",
    rating: 5,
  },
  {
    quote: "As an instructor running a graduate quantum computing course, I needed something I could actually assign. QubitMinds' heatmaps tell me exactly which students are stuck on entanglement versus just falling behind on gates.",
    name: "Dr. Priya Sharma",
    role: "Assistant Professor, Quantum Computing",
    initials: "PS",
    color: "from-violet-500 to-purple-600",
    rating: 5,
  },
  {
    quote: "I'm a software engineer, not a physicist. The AI tutor explains everything in programmer terms — 'it's like a function that operates on probability amplitudes'. Game-changer for self-learners.",
    name: "Ravi Menon",
    role: "Senior SWE → Quantum ML researcher",
    initials: "RM",
    color: "from-emerald-500 to-teal-600",
    rating: 5,
  },
];

const UNIVERSITIES = [
  "IIT Bombay", "IIT Delhi", "IISc Bangalore",
  "BITS Pilani", "NIT Trichy", "VIT University",
];

function CountUp({ target, suffix, decimal }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let count = 0;
          const timer = setInterval(() => {
            count = Math.min(count + increment, target);
            setCurrent(count);
            if (count >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = decimal
    ? current.toFixed(1)
    : Math.round(current).toLocaleString();

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export default function SocialProof() {
  return (
    <section id="social-proof" className="py-28 bg-[var(--color-surface)] relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}
                className="bento-card p-6 text-center flex flex-col items-center gap-3"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                }}>
                <div className="bento-glow" aria-hidden="true" />
                <div className={`w-10 h-10 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center ${stat.color}`}>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <div className={`text-4xl font-heading font-bold tabular-nums ${stat.color}`}>
                  <CountUp target={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
                </div>
                <div className="text-sm text-[var(--color-muted)] font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4 tracking-tight">
            Loved by learners.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              Trusted by instructors.
            </span>
          </h2>
          <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">
            From first-year students to graduate researchers — here's what they're saying.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bento-card p-7 flex flex-col gap-5"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
              }}
            >
              <div className="bento-glow" aria-hidden="true" />
              <div className="relative z-10 flex flex-col gap-5 flex-1">
                {/* Stars */}
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <LuStar key={si} size={14} className="text-amber-400 fill-amber-400" aria-hidden="true" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative">
                  <LuQuote size={24} className="text-[var(--color-border)] absolute -top-1 -left-1" aria-hidden="true" />
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed pl-5 italic">
                    {t.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--color-border)]/50">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`} aria-hidden="true">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--color-text)]">{t.name}</div>
                    <div className="text-xs text-[var(--color-muted)]">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institution logo strip */}
        <div className="text-center">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest font-semibold mb-6">
            Used by students at leading institutions
          </p>
          <div className="flex flex-wrap justify-center gap-4" role="list" aria-label="Partner institutions">
            {UNIVERSITIES.map((uni) => (
              <div key={uni}
                className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 text-sm font-semibold text-[var(--color-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text)] transition-all cursor-default"
                role="listitem">
                {uni}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
