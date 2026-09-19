"use client";

import React from 'react';
import Link from 'next/link';

export function QuantumIcon({ size = 36, className = "" }) {
  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient aura glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 blur-[6px] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main Glassmorphic Container Box */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-slate-950 via-indigo-950/90 to-cyan-950 border border-cyan-400/40 p-1.5 shadow-lg flex items-center justify-center overflow-hidden ring-1 ring-white/20 group-hover:border-cyan-300 group-hover:scale-105 transition-all duration-300">
        
        {/* Subtle background circuit overlay grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)] pointer-events-none" />

        {/* Custom High-Precision SVG Quantum Qubit Logo */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
        >
          <defs>
            <linearGradient id="qGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#3b82f6" />
            </radialGradient>
          </defs>

          {/* Intersecting Bloch Quantum Orbits */}
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            transform="rotate(-45 12 12)"
            stroke="url(#qGlow)"
            strokeWidth="1.6"
            strokeDasharray="24 4"
            className="animate-[spin_12s_linear_infinite] origin-center opacity-90"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            transform="rotate(45 12 12)"
            stroke="url(#qGlow)"
            strokeWidth="1.6"
            className="animate-[spin_16s_linear_infinite_reverse] origin-center opacity-90"
          />

          {/* Central Entangled Core Particle */}
          <circle cx="12" cy="12" r="2.8" fill="url(#coreGlow)" className="animate-pulse" />
          <circle cx="12" cy="12" r="1.2" fill="#ffffff" />

          {/* Orbital Quantum Nodes */}
          <circle cx="17.2" cy="6.8" r="1.2" fill="#22d3ee" className="animate-ping" />
          <circle cx="6.8" cy="17.2" r="1" fill="#c084fc" />
        </svg>

        {/* Live Status Indicator Node */}
        <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 shadow-[0_0_6px_#34d399]" />
      </div>
    </div>
  );
}

export default function QubitMindLogo({
  href = "/",
  iconSize = 38,
  showText = true,
  isCollapsed = false,
  badgeText = null,
  subtitle = "Quantum Learning Lab",
  className = "",
}) {
  const content = (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      <QuantumIcon size={iconSize} />

      {!isCollapsed && showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-lg tracking-tight flex items-center">
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                Qubit
              </span>
              <span className="text-[var(--color-text)] font-extrabold ml-0.5">
                Mind
              </span>
            </span>

            {badgeText && (
              <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {badgeText}
              </span>
            )}
          </div>

          {subtitle && (
            <span className="text-[10px] text-[var(--color-muted)] font-mono uppercase tracking-wider truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
