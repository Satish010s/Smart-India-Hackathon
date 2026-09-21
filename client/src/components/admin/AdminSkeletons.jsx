import React from 'react';
import Skeleton from '../ui/Skeleton';

// ─── OVERVIEW SKELETON (Dashboard) ────────────────────────────────────────────
export function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Top Banner Skeleton */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-10 w-3/4 max-w-md rounded-xl" />
        <Skeleton className="h-4 w-5/6 max-w-xl" />
        <Skeleton className="h-4 w-4/6 max-w-lg" />
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TABLE SKELETON (Users, Content, Logs) ────────────────────────────────────
export function TableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header / Search bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <Skeleton className="h-10 w-full sm:w-32 rounded-xl shrink-0" />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col md:flex-row gap-3 items-center justify-between">
        <Skeleton className="h-10 w-full md:w-80 rounded-xl" />
        <div className="flex w-full md:w-auto gap-3">
          <Skeleton className="h-10 w-full md:w-32 rounded-xl" />
          <Skeleton className="h-10 w-full md:w-32 rounded-xl" />
        </div>
      </div>

      {/* Table Area */}
      <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-background)]">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-8" />
        </div>
        <TableBodySkeleton rows={6} />
      </div>
    </div>
  );
}

export function TableBodySkeleton({ rows = 5 }) {
  return (
    <div className="divide-y divide-[var(--color-border)] w-full">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 w-full">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-5 w-24 rounded-full hidden sm:block" />
          <Skeleton className="h-5 w-20 rounded-full hidden md:block" />
          <Skeleton className="h-4 w-16 hidden lg:block" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
      ))}
    </div>
  );
}

// ─── GRID SKELETON (Settings, AI, Backends, Analytics) ────────────────────────
export function GridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Grid Content */}
      <GridContentSkeleton items={6} />
    </div>
  );
}

export function GridContentSkeleton({ items = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-16 w-full rounded-lg" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TAB ROUTER SKELETON ──────────────────────────────────────────────────────
export default function AdminTabSkeleton({ activeTab }) {
  if (['users', 'roles', 'content', 'audit'].includes(activeTab)) {
    return <TableSkeleton />;
  }
  
  if (['ai', 'backends', 'analytics', 'health', 'settings'].includes(activeTab)) {
    return <GridSkeleton />;
  }

  // Default to Dashboard Overview
  return <OverviewSkeleton />;
}
