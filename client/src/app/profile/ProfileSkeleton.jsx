import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile header card */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-3xl flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <Skeleton className="w-32 h-10 rounded-xl flex-shrink-0" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center space-y-2">
            <Skeleton className="w-8 h-8 rounded-lg mx-auto" />
            <Skeleton className="h-6 w-16 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Heatmap */}
          <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>

          {/* Enrolled Courses */}
          <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-[var(--color-border)]/50 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Account Security */}
          <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Certificates */}
          <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
