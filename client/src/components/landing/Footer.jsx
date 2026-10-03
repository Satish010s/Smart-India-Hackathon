"use client";

import React from "react";
import Link from "next/link";
import QubitMindLogo from "../common/QubitMindLogo";
import { LuArrowRight } from "react-icons/lu";
import { useAuthModalStore } from "../../store/useAuthModalStore";

const LINK_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Learning courses", href: "/learn" },
      { label: "Circuit playground", href: "/playground" },
      { label: "Challenges", href: "/challenges" },
      { label: "AI tutor", href: "/ai-tutor" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Simulation backends", href: "#backends" },
      { label: "For instructors", href: "#instructors" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Learning path", href: "#learn" },
      { label: "Instructor tools", href: "#instructors" },
      { label: "Contact", href: "mailto:hello@qubitminds.ai" },
    ],
  },
];

export default function Footer() {
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      {/* Final CTA */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-[var(--color-text)]">
              Your quantum journey starts with one qubit.
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
              Learn the fundamentals, build circuits, run simulations, and master quantum
              computing — free to start.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => openAuthModal("signup")}
                className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-[15px] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                Start learning free
                <LuArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <Link
                href="/playground"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-[15px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]/50 transition-all"
              >
                Explore the playground
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-2 max-w-xs">
            <QubitMindLogo iconSize={34} />
            <p className="mt-5 text-[13.5px] text-[var(--color-muted)] leading-relaxed">
              A professional learning platform for the next generation of quantum engineers —
              curriculum, playground, and AI tutor in a single workspace.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-[var(--color-muted)]">All systems operational</span>
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="text-[12px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)] mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-7 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12.5px] text-[var(--color-muted)]">
            © {new Date().getFullYear()} QubitMinds. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-[12.5px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[12.5px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              Terms
            </a>
            <a href="mailto:hello@qubitminds.ai" className="text-[12.5px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              hello@qubitminds.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
