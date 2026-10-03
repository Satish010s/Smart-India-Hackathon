"use client";

import React from "react";
import Link from "next/link";
import QubitMindLogo from "../common/QubitMindLogo";

/**
 * AuthShell — minimal, professional full-page shell for standalone auth routes
 * (/login, /signup, /forgot-password, /reset-password, /verify-email).
 */
export default function AuthShell({ children, badge = "Secured session" }) {
  return (
    <div className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-text)] overflow-hidden flex flex-col">
      {/* Subtle grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, #000 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, #000 55%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* Soft brand glow */}
      <div
        className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[720px] h-[460px] rounded-full blur-[130px]"
        style={{ background: "color-mix(in srgb, var(--color-primary) 14%, transparent)" }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 h-16 shrink-0">
        <QubitMindLogo iconSize={32} />
        <Link
          href="/"
          className="text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Back to home
        </Link>
      </header>

      {/* Card */}
      <main className="relative z-10 flex-1 flex items-start sm:items-center justify-center px-4 pb-16 pt-4 sm:pt-0">
        <div className="w-full max-w-[440px] rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-9 shadow-[0_35px_90px_-35px_rgba(2,6,23,0.35)]">
          {children}
        </div>
      </main>

      {/* Footer strip */}
      <footer className="relative z-10 pb-6 flex items-center justify-center gap-2 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-mono text-[var(--color-muted)] tracking-wide">{badge}</span>
      </footer>
    </div>
  );
}
