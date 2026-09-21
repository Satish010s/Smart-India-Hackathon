import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function PlaygroundSkeleton() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full h-[calc(100vh-64px)] overflow-hidden">
      
      {/* 1. Header Toolbar Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--color-surface)] p-5 rounded-3xl border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-10 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
      </div>

      {/* 2. Graphical Gate Palette Skeleton */}
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
           <Skeleton className="h-5 w-64" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, catIdx) => (
            <div key={catIdx} className="p-3 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-2">
              <Skeleton className="h-3 w-32" />
              <div className="flex flex-wrap gap-1.5">
                {[...Array(catIdx % 2 === 0 ? 4 : 3)].map((_, gateIdx) => (
                  <Skeleton key={gateIdx} className="w-10 h-8 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Circuit Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-20">
        <div className="xl:col-span-8 space-y-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 overflow-hidden h-[400px]">
            <div className="space-y-12 mt-4">
              {[...Array(3)].map((_, wireIdx) => (
                <div key={wireIdx} className="flex items-center">
                  <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 ml-4 border-t border-[var(--color-border)] flex items-center justify-around">
                     <Skeleton className="w-10 h-10 rounded-xl" />
                     <Skeleton className="w-10 h-10 rounded-xl" />
                     <Skeleton className="w-10 h-10 rounded-xl" />
                     <Skeleton className="w-10 h-10 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Output / Inspector Panel Skeleton */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 h-[400px] flex flex-col">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="flex-1 flex items-center justify-center">
              <Skeleton className="w-48 h-48 rounded-full" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
