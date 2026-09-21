"use client";

import React, { useState } from 'react';
import {
  LuBookOpen, LuClock, LuUsers, LuPlay,
  LuArrowRight, LuCheck, LuChartBar, LuGraduationCap, LuLock,
} from 'react-icons/lu';

const DIFFICULTY_STYLES = {
  Beginner:     'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/10  text-amber-700  dark:text-amber-400  border-amber-500/20',
  Advanced:     'bg-rose-500/10   text-rose-700   dark:text-rose-400   border-rose-500/20',
};

export default function CourseCard({ course, onSelect, onEnroll }) {
  const {
    id, title, description, difficulty, duration, modules, lessons,
    instructor, progress, enrolled,
  } = course;

  const [isEnrolling, setIsEnrolling] = useState(false);

  const isEnrolled = !!(enrolled || progress > 0);
  const isCompleted = progress >= 100;

  const handleEnrollClick = async (e) => {
    e.stopPropagation();
    if (onEnroll) {
      setIsEnrolling(true);
      try {
        await onEnroll(id);
      } finally {
        setIsEnrolling(false);
      }
    } else if (onSelect) {
      onSelect(course);
    }
  };

  return (
    <div
      className="group relative flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-primary)]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={() => onSelect && onSelect(course)}
    >
      <div className="flex flex-col flex-1 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.Beginner}`}>
                {difficulty}
              </span>
              {isCompleted ? (
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                  <LuCheck size={9} /> Completed
                </span>
              ) : isEnrolled ? (
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                  <LuCheck size={9} /> Enrolled
                </span>
              ) : null}
            </div>
            <h3 className="font-semibold text-sm text-[var(--color-text)] leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-2">{description}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-[var(--color-muted)] font-mono flex-wrap">
          <span className="flex items-center gap-1"><LuClock size={11} />{duration}</span>
          <span className="flex items-center gap-1"><LuBookOpen size={11} />{modules} modules</span>
          <span className="flex items-center gap-1"><LuChartBar size={11} />{lessons} lessons</span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-semibold uppercase flex-shrink-0"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
              color: 'var(--color-primary)',
            }}
          >
            {instructor?.[0] || 'I'}
          </div>
          <span className="text-xs text-[var(--color-muted)] truncate">{instructor}</span>
        </div>

        {/* Progress bar (only for enrolled) */}
        {isEnrolled && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[var(--color-muted)]">
              <span>Progress</span>
              <span>{progress || 0}%</span>
            </div>
            <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress || 0}%`,
                  background: isCompleted ? '#10b981' : 'var(--color-primary)',
                }}
              />
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="pt-1 mt-auto">
          {isCompleted ? (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect && onSelect(course); }}
              className="w-full py-2 rounded-lg border border-[var(--color-border)] text-xs font-medium text-[var(--color-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-all flex items-center justify-center gap-2"
            >
              <LuBookOpen size={13} /> Review Course
            </button>
          ) : isEnrolled ? (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect && onSelect(course); }}
              className="w-full py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              style={{ background: 'var(--color-primary)' }}
            >
              <LuPlay size={13} className="ml-0.5" /> Continue Learning
            </button>
          ) : (
            <button
              onClick={handleEnrollClick}
              disabled={isEnrolling}
              className="w-full py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              style={{ background: 'var(--color-primary)' }}
            >
              {isEnrolling ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Enrolling...</span>
                </>
              ) : (
                <>
                  <LuGraduationCap size={13} />
                  <span>Enroll Now</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
