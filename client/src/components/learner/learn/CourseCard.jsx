"use client";

import React from 'react';
import Link from 'next/link';
import {
  LuBookOpen, LuClock, LuUsers, LuStar, LuPlay,
  LuArrowRight, LuCheck, LuLock, LuChevronRight,
  LuGraduationCap, LuChartBar,
} from 'react-icons/lu';

const DIFFICULTY_STYLES = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function CourseCard({ course, onSelect }) {
  const {
    title, description, difficulty, duration, modules, lessons,
    instructor, progress, status, enrolled, thumbnail,
  } = course;

  const isEnrolled = enrolled || progress > 0;
  const isCompleted = progress >= 100;

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-primary)]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => onSelect && onSelect(course)}
    >
      {/* Thumbnail strip */}
      <div className="relative h-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
        {isCompleted && (
          <div className="absolute inset-0 bg-emerald-500" />
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.Beginner}`}>
                {difficulty}
              </span>
              {isCompleted && (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <LuCheck size={9} /> Completed
                </span>
              )}
            </div>
            <h3 className="font-bold text-[var(--color-text)] text-sm leading-tight line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
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
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
            {instructor?.[0] || 'I'}
          </div>
          <span className="text-xs text-[var(--color-muted)] truncate">{instructor}</span>
        </div>

        {/* Progress bar (if enrolled) */}
        {isEnrolled && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[var(--color-muted)]">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="pt-1 mt-auto">
          {isCompleted ? (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect && onSelect(course); }}
              className="w-full py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center gap-2"
            >
              <LuBookOpen size={13} /> View Course
            </button>
          ) : isEnrolled ? (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect && onSelect(course); }}
              className="w-full py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md shadow-[var(--color-primary)]/20"
            >
              <LuPlay size={13} className="ml-0.5" /> Continue
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect && onSelect(course); }}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <LuGraduationCap size={13} /> Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
