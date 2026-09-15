"use client";

import React from 'react';
import {
  LuShieldAlert,
  LuSparkles,
  LuCpu,
  LuActivity,
} from 'react-icons/lu';

export default function AdminOverview({ user, userCount = 0 }) {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-rose-500/15 via-[var(--color-surface)] to-[var(--color-primary)]/15 border border-[var(--color-border)] shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white">
            <LuSparkles size={14} />
            <span>Super Admin Platform Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[var(--color-text)]">
            Command Center: {user?.name || 'Administrator'}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
            Public signups are strictly restricted to Learner roles. You manage platform security policies, provision Instructor faculty accounts, and control role-based access.
          </p>
        </div>
      </div>

      {/* Security Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Password Standard</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full">Enforced</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--color-primary)]">
            Argon2id
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono">64MB memory cost &bull; 3 iterations</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Session Policy</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-cyan-500/10 text-cyan-500 rounded-full">Rotated</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-500">
            HttpOnly Cookies
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono">SameSite=Lax &bull; Family reuse detection</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Email Verification</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full">Resend</span>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-400">
            6-Digit OTP
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono">SHA-256 Hashed &bull; 60s cooldown limit</p>
        </div>
      </div>
    </div>
  );
}
