"use client";

import React, { useEffect, useRef, useState } from "react";
import { LuStar, LuUsers, LuActivity, LuTarget } from "react-icons/lu";

const STATS = [
  { label: "Circuits run", value: 18400, suffix: "+", icon: LuActivity },
  { label: "Active learners", value: 3800, suffix: "+", icon: LuUsers },
  { label: "Challenges solved", value: 940, suffix: "+", icon: LuTarget },
  { label: "Average rating", value: 4.9, suffix: "/5", icon: LuStar, decimal: true },
];

const TESTIMONIALS = [
  {
    quote:
      "I tried textbooks, I tried YouTube — nothing clicked. QubitMinds was the first thing that made superposition feel intuitive. The live histogram changing as I dragged gates was the \"aha\" moment I needed.",
    name: "Arjun Kapoor",
    role: "B.Tech CSE, IIT Bombay",
    initials: "AK",
    tint: "primary",
    rating: 5,
  },
  {
    quote:
      "As an instructor running a graduate quantum computing course, I needed something I could actually assign. QubitMinds' heatmaps tell me exactly which students are stuck on entanglement versus just falling behind on gates.",
    name: "Dr. Priya Sharma",
    role: "Assistant Professor, Quantum Computing",
    initials: "PS",
    tint: "accent",
    rating: 5,
  },
  {
    quote:
      "I'm a software engineer, not a physicist. The AI tutor explains everything in programmer terms — 'it's like a function that operates on probability amplitudes'. Game-changer for self-learners.",
    name: "Ravi Menon",
    role: "Senior SWE → Quantum ML researcher",
    initials: "RM",
    tint: "secondary",
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
    <section id="social-proof" className="py-24 sm:py-28 border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 sm:mb-24">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <div className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] mb-4">
                  <Icon size={13} className="text-[var(--color-primary)]" aria-hidden="true" />
                  {stat.label}
                </div>
                <div className="text-[30px] sm:text-4xl font-heading font-bold tracking-tight tabular-nums text-[var(--color-text)]">
                  <CountUp target={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[var(--color-text)] leading-tight">
            Loved by learners.{" "}
            <span className="text-[var(--color-muted)]">Trusted by instructors.</span>
          </h2>
          <p className="mt-4 text-[15.5px] text-[var(--color-muted)] leading-relaxed">
            From first-year students to graduate researchers — here&apos;s what they&apos;re saying.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-4 mb-20">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, si) => (
                  <LuStar
                    key={si}
                    size={13}
                    className="text-[var(--color-primary)] fill-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[14px] text-[var(--color-muted)] leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-[var(--color-border)]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                  style={{
                    background: `color-mix(in srgb, var(--color-${t.tint}) 14%, transparent)`,
                    color: `var(--color-${t.tint})`,
                  }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-[var(--color-text)]">{t.name}</div>
                  <div className="text-[12px] text-[var(--color-muted)]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institution strip */}
        <div className="flex flex-col items-center">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-6">
            Used by students at leading institutions
          </p>
          <div className="flex flex-wrap justify-center gap-2.5" role="list" aria-label="Partner institutions">
            {UNIVERSITIES.map((uni) => (
              <div
                key={uni}
                className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[12.5px] font-medium text-[var(--color-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text)] transition-colors cursor-default"
                role="listitem"
              >
                {uni}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
