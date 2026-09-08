"use client";

import React from 'react';
import {
  LuGraduationCap,
  LuBookOpen,
  LuUsers,
  LuClipboardList,
} from 'react-icons/lu';

export default function InstructorOverview({ user, portalData }) {
  return (
    <div className="space-y-8">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-[var(--color-surface)] to-[var(--color-primary)]/15 border border-[var(--color-border)] shadow-sm">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
            <LuGraduationCap size={14} />
            <span>Faculty & Academic Management</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[var(--color-text)]">
            Professor {user?.name || 'Faculty Member'}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
            Manage your quantum mechanics curriculum, oversee student experiment submissions, and evaluate interactive circuit assignments.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Assigned Courses</span>
            <LuBookOpen size={20} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-heading text-[var(--color-text)]">
            {portalData?.assignedCourses?.length ?? 2} Active
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono">PHYS-401 & CS-550</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Students</span>
            <LuUsers size={20} className="text-[var(--color-primary)]" />
          </div>
          <div className="text-3xl font-bold font-heading text-[var(--color-text)]">
            {portalData?.totalEnrolledStudents ?? 142} Students
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono">Verified Learner Profiles</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex justify-between items-center text-[var(--color-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Reviews</span>
            <LuClipboardList size={20} className="text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-heading text-[var(--color-text)]">
            {portalData?.pendingSubmissions ?? 18} Submissions
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono">Circuits & Code Verifications</p>
        </div>
      </div>
    </div>
  );
}
