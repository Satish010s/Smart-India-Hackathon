"use client";

import React, { useState } from 'react';
import {
  LuArrowLeft, LuBookOpen, LuUsers, LuClock, LuStar, LuCircleCheck,
  LuFileText, LuFlaskConical, LuZap, LuPencil, LuChevronDown, LuChevronRight
} from 'react-icons/lu';
import { BuilderSkeleton } from './InstructorSkeletons';

const TYPE_INFO = {
  lesson: { icon: LuFileText, color: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30' },
  experiment: { icon: LuFlaskConical, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  quiz: { icon: LuStar, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  challenge: { icon: LuZap, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
};

export default function CoursePreview({ course, courseId, onOpenBuilder, onOpenLesson, onOpenQuiz, onOpenChallenge, onBack }) {
  const [expandedModules, setExpandedModules] = useState({});

  if (!course) {
    return <BuilderSkeleton />;
  }

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEditLesson = (e, lesson, modId) => {
    e.stopPropagation();
    if (lesson.type === 'quiz' && onOpenQuiz) onOpenQuiz({ courseId: course.id, moduleId: modId, quizId: lesson.id });
    else if (lesson.type === 'challenge' && onOpenChallenge) onOpenChallenge({ courseId: course.id, moduleId: modId, challengeId: lesson.id });
    else if (onOpenLesson) onOpenLesson({ courseId: course.id, moduleId: modId, lessonId: lesson.id });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Back nav & Edit Course Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer group"
        >
          <LuArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Courses
        </button>
        <button
          onClick={() => onOpenBuilder(course)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-primary)] transition-colors cursor-pointer shadow-lg shadow-sm"
        >
          <LuPencil size={14} /> Edit Course Structure
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative p-8 sm:p-10 rounded-[2rem] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              {course.category || 'Category'}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)]">
              {course.difficulty || 'Beginner'}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
              {course.status || 'Published'}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-[var(--color-text)] tracking-tight leading-[1.1]">
              {course.title}
            </h1>
            <p className="text-base sm:text-lg text-[var(--color-muted)] max-w-3xl leading-relaxed">
              {course.description || 'No description provided for this course. Click Edit Course Structure to add one.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-[var(--color-border)]/50">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
              <LuClock size={16} className="text-[var(--color-muted)]" /> 
              {course.duration || '0 hrs'}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
              <LuBookOpen size={16} className="text-[var(--color-muted)]" /> 
              {course.totalLessons || 0} Lessons
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
              <LuUsers size={16} className="text-[var(--color-muted)]" /> 
              {course.enrolledStudents || 0} Enrolled
            </div>
            {course.rating && (
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
                <LuStar size={16} className="text-amber-400 fill-amber-400/20" /> 
                {course.rating} Rating
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Layout for Content & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Syllabus */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
            Course Syllabus <span className="text-xs font-mono text-[var(--color-muted)] font-normal ml-2">(Student Preview)</span>
          </h2>

          <div className="space-y-3">
            {(!course.modules || course.modules.length === 0) ? (
              <div className="p-8 text-center border border-dashed border-[var(--color-border)] rounded-2xl">
                <p className="text-sm text-[var(--color-muted)]">No modules found.</p>
                <button onClick={() => onOpenBuilder(course)} className="mt-3 text-xs text-[var(--color-primary)] hover:underline">Add your first module in the Builder</button>
              </div>
            ) : (
              course.modules.map((mod, mIdx) => {
                const isExpanded = expandedModules[mod.id] ?? true; // expanded by default
                return (
                  <div key={mod.id} className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden transition-all hover:border-[var(--color-primary)]/30 group/module">
                    {/* Module Header */}
                    <div 
                      onClick={() => toggleModule(mod.id)}
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-[var(--color-background)]/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] text-sm font-bold shrink-0 shadow-sm">
                          {mIdx + 1}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[var(--color-text)] group-hover/module:text-[var(--color-primary)] transition-colors">{mod.title}</h3>
                          <p className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-2 mt-1">
                            <span>{mod.lessons?.length || 0} Lessons</span>
                            {mod.completionRule && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                                <span className="uppercase tracking-widest text-[9px]">{mod.completionRule}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={(e) => { e.stopPropagation(); onOpenBuilder(course); }} className="opacity-0 group-hover/module:opacity-100 p-2 rounded-xl hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-all text-xs font-bold flex items-center gap-1.5">
                          <LuPencil size={14} /> Edit Module
                        </button>
                        <div className={`p-2 rounded-full transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-[var(--color-background)]' : 'bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-background)]'}`}>
                          <LuChevronDown size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Module Lessons */}
                    {isExpanded && (
                      <div className="border-t border-[var(--color-border)] bg-[var(--color-background)]/50 divide-y divide-[var(--color-border)]/50">
                        {mod.lessons?.length > 0 ? mod.lessons.map((lesson, lIdx) => {
                          const typeData = TYPE_INFO[lesson.type] || TYPE_INFO.lesson;
                          const Icon = typeData.icon;
                          return (
                            <div key={lesson.id} className="flex items-center justify-between p-4 pl-16 hover:bg-[var(--color-background)] transition-colors group/lesson">
                              <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl border ${typeData.color} shadow-sm`}><Icon size={16} /></div>
                                <div>
                                  <div className="text-sm font-semibold text-[var(--color-text)] group-hover/lesson:text-[var(--color-primary)] transition-colors">{lesson.title}</div>
                                  <div className="text-xs text-[var(--color-muted)] font-medium mt-1 flex items-center gap-1.5">
                                    <LuClock size={10} /> {lesson.duration || '0 min'}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => handleEditLesson(e, lesson, mod.id)}
                                className="opacity-0 group-hover/lesson:opacity-100 px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-[var(--color-surface)] shadow-sm transition-all text-xs font-bold flex items-center gap-1.5"
                              >
                                <LuPencil size={12} /> Edit
                              </button>
                            </div>
                          );
                        }) : (
                          <div className="p-4 pl-14 text-xs text-[var(--color-muted)] italic">No lessons in this module.</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Meta Info */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
              <span className="w-1 h-4 bg-[var(--color-primary)] rounded-full" />
              What you'll learn
            </h3>
            <ul className="space-y-4">
              {course.objectives?.length > 0 ? course.objectives.map((obj, i) => (
                <li key={i} className="flex gap-3 text-sm text-[var(--color-text)]">
                  <LuCircleCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{obj}</span>
                </li>
              )) : <li className="text-sm text-[var(--color-muted)] italic">No learning objectives specified.</li>}
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-500 rounded-full" />
              Prerequisites
            </h3>
            <ul className="space-y-3">
              {course.prerequisites?.length > 0 ? course.prerequisites.map((pre, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)] shrink-0" />
                  {pre}
                </li>
              )) : <li className="text-sm text-[var(--color-muted)] italic">No prerequisites required.</li>}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
