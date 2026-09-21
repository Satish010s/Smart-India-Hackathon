"use client";

import React from 'react';
import {
  LuKeyRound, LuShield, LuCheck, LuX, LuLock, LuUsers, LuUserCheck,
  LuSparkles, LuHistory, LuGraduationCap, LuBookOpen,
} from 'react-icons/lu';

const PERMISSION_DOMAINS = [
  {
    domain: 'Content Governance',
    permissions: [
      { name: 'Browse Global Courses & Lessons', learner: true, instructor: true, admin: true },
      { name: 'Create Draft Lessons & Quizzes', learner: false, instructor: true, admin: true },
      { name: 'Edit & Manage Owned Content', learner: false, instructor: true, admin: true },
      { name: 'Approve & Publish Global Catalog', learner: false, instructor: false, admin: true },
      { name: 'Delete & Archive Content Items', learner: false, instructor: false, admin: true },
    ],
  },
  {
    domain: 'Quantum Simulations',
    permissions: [
      { name: 'Run Basic Simulations (Qiskit Aer)', learner: true, instructor: true, admin: true },
      { name: 'Multi-Backend Comparison (PennyLane, Cirq, qBraid)', learner: true, instructor: true, admin: true },
      { name: 'High-Depth & Noise Modeling Quota', learner: true, instructor: true, admin: true },
      { name: 'Configure Hardware Drivers & Timeouts', learner: false, instructor: false, admin: true },
    ],
  },
  {
    domain: 'Analytics & Reporting',
    permissions: [
      { name: 'Personal Learning Progress & History', learner: true, instructor: true, admin: true },
      { name: 'Cohort Learning & Assessment Analytics', learner: false, instructor: true, admin: true },
      { name: 'Platform-Wide Telemetry & Infrastructure Costs', learner: false, instructor: false, admin: true },
    ],
  },
  {
    domain: 'User & Faculty Administration',
    permissions: [
      { name: 'View Platform User Directory', learner: false, instructor: false, admin: true },
      { name: 'Provision & Invite Faculty Members', learner: false, instructor: false, admin: true },
      { name: 'Suspend or Activate User Accounts', learner: false, instructor: false, admin: true },
      { name: 'Change Role or Delete User Accounts', learner: false, instructor: false, admin: true },
    ],
  },
  {
    domain: 'System & Security Controls',
    permissions: [
      { name: 'Configure AI Models & System Prompts', learner: false, instructor: false, admin: true },
      { name: 'Enable/Disable Quantum Backends', learner: false, instructor: false, admin: true },
      { name: 'Inspect Security Audit Logs', learner: false, instructor: false, admin: true },
      { name: 'Modify Global Security & Session Policies', learner: false, instructor: false, admin: true },
    ],
  },
];

export default function AdminRolesPermissions() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <LuKeyRound className="text-rose-700 dark:text-rose-500" />
          Roles &amp; Fine-Grained Permissions
        </h2>
        <p className="text-xs text-[var(--color-muted)]">
          Explicit three-tier role-based access control (RBAC). The Researcher role is permanently deprecated and consolidated into the Learner tier.
        </p>
      </div>

      {/* 3 Active Roles Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Learner */}
        <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-blue-500/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ROLE: LEARNER
            </span>
            <LuBookOpen className="text-blue-400" size={18} />
          </div>
          <h3 className="text-base font-bold text-[var(--color-text)]">Self-Paced Quantum Learner</h3>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            Full access to interactive courses, circuit playground, multi-backend comparisons, experiments, and AI tutoring. Public registration available.
          </p>
          <div className="pt-2 border-t border-[var(--color-border)]/50 text-[11px] text-[var(--color-muted)] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Public signup permitted</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-emerald-500/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              ROLE: INSTRUCTOR
            </span>
            <LuGraduationCap className="text-emerald-700 dark:text-emerald-400" size={18} />
          </div>
          <h3 className="text-base font-bold text-[var(--color-text)]">Academic Faculty Member</h3>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            Course curriculum builder, challenge authoring, student performance analytics, and assignment review. Must be provisioned by an administrator.
          </p>
          <div className="pt-2 border-t border-[var(--color-border)]/50 text-[11px] text-[var(--color-muted)] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Invitation / approval only</span>
          </div>
        </div>

        {/* Admin */}
        <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-rose-500/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
              ROLE: ADMIN
            </span>
            <LuShield className="text-rose-700 dark:text-rose-400" size={18} />
          </div>
          <h3 className="text-base font-bold text-[var(--color-text)]">Platform Super Administrator</h3>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            Total platform control: user administration, role assignment, content approval, quantum simulator configuration, AI engine settings, and audit logs.
          </p>
          <div className="pt-2 border-t border-[var(--color-border)]/50 text-[11px] text-[var(--color-muted)] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Protected root privilege</span>
          </div>
        </div>
      </div>

      {/* Security Governance Policies Callout */}
      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
        <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <LuLock size={15} />
          <span>Security Governance Guardrails</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[var(--color-muted)]">
          <li><strong>No Self-Selection for Admin:</strong> Admin privileges cannot be chosen during signup under any circumstance.</li>
          <li><strong>Faculty Provisioning:</strong> Instructor accounts must be created or approved via the Admin console with temporary credentials dispatched to verified emails.</li>
          <li><strong>Immutable Audit Logging:</strong> Every change in user role, account suspension, or permission alteration is recorded in the platform Audit Log.</li>
        </ul>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--color-text)]">RBAC Matrix by Capability</h3>
          <span className="text-xs text-[var(--color-muted)]">Standardized across all platform routes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]/50 text-[var(--color-muted)] uppercase tracking-wider">
                <th className="py-3 px-4 w-1/2">Capability</th>
                <th className="py-3 px-4 text-center font-bold text-blue-400">LEARNER</th>
                <th className="py-3 px-4 text-center font-bold text-emerald-700 dark:text-emerald-400">INSTRUCTOR</th>
                <th className="py-3 px-4 text-center font-bold text-rose-700 dark:text-rose-400">ADMIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/40">
              {PERMISSION_DOMAINS.map((domain, dIdx) => (
                <React.Fragment key={dIdx}>
                  <tr className="bg-[var(--color-background)]/80">
                    <td colSpan={4} className="py-2.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                      {domain.domain}
                    </td>
                  </tr>
                  {domain.permissions.map((p, pIdx) => (
                    <tr key={pIdx} className="hover:bg-[var(--color-background)]/30 transition-colors">
                      <td className="py-3 px-4 text-[var(--color-text)] font-medium">{p.name}</td>
                      <td className="py-3 px-4 text-center">
                        {p.learner ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"><LuCheck size={12} /></span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-500/10 text-slate-500"><LuX size={12} /></span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {p.instructor ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"><LuCheck size={12} /></span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-500/10 text-slate-500"><LuX size={12} /></span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {p.admin ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"><LuCheck size={12} /></span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-500/10 text-slate-500"><LuX size={12} /></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
