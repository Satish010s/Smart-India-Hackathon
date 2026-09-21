import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function CourseDetailSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="w-full flex items-center gap-3.5 px-5 py-4 bg-[var(--color-surface)]">
            <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" />
            
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-2 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
