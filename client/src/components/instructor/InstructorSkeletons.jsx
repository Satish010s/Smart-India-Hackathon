import React from 'react';
import Skeleton from '../ui/Skeleton';

// ─── OVERVIEW SKELETON ────────────────────────────────────────────────────────
export function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-12" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Alerts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-[var(--color-border)] space-y-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-[var(--color-border)] flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-6 h-6 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-full max-w-[200px]" />
                  <Skeleton className="h-2 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LIST SKELETON (Courses, Students, Content) ───────────────────────────────
export function ListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header / Search bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-7 w-48" />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl shrink-0" />
          <Skeleton className="h-10 w-24 rounded-xl shrink-0" />
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-start gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Skeleton className="h-7 w-20 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BUILDER SKELETON (Forms) ─────────────────────────────────────────────────
export function BuilderSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Form Area */}
      <div className="flex-1 max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar / Preview Area */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TABLE SKELETON (Students) ────────────────────────────────────────────────
export function TableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header / Search bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-7 w-48" />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl shrink-0" />
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-background)]">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        {/* Table Rows */}
        <div className="divide-y divide-[var(--color-border)]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-6 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONTENT SKELETON (Content Management) ────────────────────────────────────
export function ContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header / Search bar */}
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl shrink-0" />
      </div>

      {/* Content list */}
      <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden divide-y divide-[var(--color-border)]/50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <div className="w-16" /> {/* Spacer for hover buttons */}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB ROUTER SKELETON ──────────────────────────────────────────────────────
export default function InstructorTabSkeleton({ activeTab }) {
  if (['course-builder', 'lesson-builder', 'quiz-builder', 'challenge-builder'].includes(activeTab)) {
    return <BuilderSkeleton />;
  }
  if (['students'].includes(activeTab)) {
    return <TableSkeleton />;
  }

  if (['content'].includes(activeTab)) {
    return <ContentSkeleton />;
  }

  if (['courses', 'analytics'].includes(activeTab)) {
    return <ListSkeleton />;
  }

  // Default to Dashboard Overview
  return <OverviewSkeleton />;
}
