import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function ProgressSkeleton() {
  return (
    <div className="space-y-8">
      {/* 1. Hero Card Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-full" />
            <Skeleton className="h-8 w-64 md:w-96 mt-2" />
            <Skeleton className="h-4 w-full md:w-[500px]" />
          </div>

          <div className="flex items-center gap-4 bg-[var(--color-background)]/80 border border-[var(--color-border)] p-4 rounded-2xl">
            <div className="text-center px-3 space-y-1">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="h-8 w-px bg-[var(--color-border)]" />
            <div className="text-center px-3 space-y-1">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Progress bar skeleton */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>
      </div>

      {/* 2. Stat Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="w-9 h-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32 mt-2" />
          </div>
        ))}
      </div>

      {/* 3. Learning Activity & Detailed Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          
          <div className="h-48 w-full flex items-end gap-2 sm:gap-4 mt-8 pt-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <Skeleton className="w-full rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
                <Skeleton className="h-3 w-full max-w-[30px]" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
