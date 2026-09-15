"use client";

import React from 'react';
import Link from 'next/link';
import {
  LuCpu,
  LuArrowLeft,
  LuHouse,
  LuCompass,
  LuSparkles,
  LuLayoutDashboard,
} from 'react-icons/lu';
import { useAuthStore } from '../store/useAuthStore';

export default function NotFound() {
  const { user, isAuthenticated } = useAuthStore();

  const getDashboardHref = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'ADMIN':
        return '/admin';
      case 'INSTRUCTOR':
        return '/instructor';
      default:
        return '/dashboard';
    }
  };

  const getRoleLabel = () => {
    if (!user) return 'Dashboard';
    switch (user.role) {
      case 'ADMIN':
        return 'Admin Console';
      case 'INSTRUCTOR':
        return 'Instructor Portal';
      default:
        return 'Learner Hub';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background Quantum Grid & Glow Effect */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 dark:opacity-20">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] blur-[140px] -z-10" />
      </div>

      <div className="max-w-xl w-full text-center space-y-8 relative z-10">
        {/* Quantum Logo Badge */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white shadow-xl shadow-[var(--color-primary)]/25 group-hover:scale-105 transition-transform">
            <LuCpu size={24} />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-[var(--color-text)]">
            QubitMind
          </span>
        </Link>

        {/* 404 Visual Indicator */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm">
            <LuSparkles size={14} />
            <span>ERROR 404 &bull; QUANTUM STATE COLLAPSED</span>
          </div>

          <h1 className="text-7xl sm:text-9xl font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-text)] via-[var(--color-text)]/80 to-[var(--color-muted)]/30 select-none">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
              Wavefunction Not Found
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-muted)] max-w-md mx-auto leading-relaxed">
              The quantum coordinates or route you are observing do not exist in this Hilbert space. The state may have decohered or moved.
            </p>
          </div>
        </div>

        {/* Quantum Matrix Code Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)]/80 border border-[var(--color-border)] backdrop-blur-md shadow-lg text-left font-mono text-xs text-[var(--color-muted)] space-y-1.5 max-w-md mx-auto">
          <div className="flex items-center justify-between text-[11px] text-[var(--color-text)] font-semibold border-b border-[var(--color-border)]/50 pb-1.5">
            <span>Statevector Analysis</span>
            <span className="text-rose-500 font-bold">|ψ⟩ = Undefined</span>
          </div>
          <div className="text-[11px] text-[var(--color-muted)] pt-1">
            &gt; Prob(|0⟩) = 0.000 &bull; Prob(|1⟩) = 0.000
          </div>
          <div className="text-[11px] text-amber-500">
            &gt; Quantum Phase: Desynchronized (Path Not Resolved)
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <Link
              href={getDashboardHref()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25 hover:opacity-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <LuLayoutDashboard size={16} />
              <span>Return to {getRoleLabel()}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-[var(--color-text)] text-[var(--color-background)] hover:opacity-90 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <LuHouse size={16} />
              <span>Return to Home</span>
            </Link>
          )}

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]/50 transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <LuCompass size={16} />
            <span>Explore Platform</span>
          </Link>
        </div>

        {/* Subtle Footer Note */}
        <p className="text-xs text-[var(--color-muted)] font-mono pt-4">
          QubitMind &bull; Quantum Error Correction Active
        </p>
      </div>
    </div>
  );
}
