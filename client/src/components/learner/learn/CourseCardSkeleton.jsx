import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function CourseCardSkeleton() {
  return (
    <div className="group relative flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <div className="flex flex-col flex-1 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-[22px] w-[60px] rounded" />
            </div>
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Action button */}
        <div className="pt-1 mt-auto">
          <Skeleton className="w-full h-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
