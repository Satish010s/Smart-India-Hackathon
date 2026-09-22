import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function AchievementSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)]/50">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* XP Level path */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {[...Array(7)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2 w-10" />
              </div>
              {i < 6 && (
                <Skeleton className="flex-1 h-0.5 min-w-8 rounded-full" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      {/* Badges section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Skeleton className="h-6 w-36" />
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-16 h-8 rounded-xl" />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-start gap-4">
              <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
                <div className="pt-2 flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)]/50">
              <div className="flex items-center gap-4">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
