import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 1. Hero / User Profile Skeleton */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <Skeleton className="w-16 h-16 rounded-lg" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <Skeleton className="h-7 w-64 mt-1" />
              <div className="mt-3 flex items-center gap-3">
                <Skeleton className="h-1.5 w-48 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-28 rounded-md" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <div className="mt-4 space-y-1.5">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Columns Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Course Banner Skeleton */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
             <div className="flex flex-col md:flex-row md:items-center gap-5">
               <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
               <div className="flex-1 min-w-0 space-y-2">
                 <div className="flex gap-2">
                   <Skeleton className="h-5 w-20 rounded-md" />
                   <Skeleton className="h-5 w-24 rounded-md" />
                 </div>
                 <Skeleton className="h-5 w-3/4" />
                 <div className="flex items-center gap-3 mt-1">
                   <Skeleton className="h-2 flex-1 rounded-full max-w-[200px]" />
                   <Skeleton className="h-4 w-12" />
                 </div>
               </div>
               <Skeleton className="h-10 w-32 rounded-md flex-shrink-0" />
             </div>
          </div>
          
          {/* Recent Activity Skeleton */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <Skeleton className="h-6 w-48 mb-6" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2 border-b border-[var(--color-border)] pb-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Daily Goals Skeleton */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
             <div className="flex justify-between items-center mb-4">
               <Skeleton className="h-6 w-32" />
               <Skeleton className="h-5 w-16 rounded-md" />
             </div>
             <Skeleton className="h-2 w-full rounded-full mb-4" />
             <div className="space-y-3">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="p-3 rounded-lg border border-[var(--color-border)] flex items-start gap-3">
                   <Skeleton className="w-4 h-4 rounded border mt-0.5 flex-shrink-0" />
                   <div className="flex-1 space-y-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-5 w-16 rounded-md" />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
