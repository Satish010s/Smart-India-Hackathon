"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../services/api';
import {
  LuX, LuBookOpen, LuFlaskConical, LuBrain, LuTrophy, LuCheck,
  LuLock, LuChevronDown, LuChevronRight, LuPlay,
  LuClock, LuUsers, LuTarget, LuGraduationCap, LuSparkles,
  LuArrowLeft, LuAward, LuFileText, LuCode, LuBeaker, LuCircleCheck, LuChartBar,
  LuShieldCheck,
  LuLayers
} from 'react-icons/lu';
import { Skeleton } from '@/components/ui/Skeleton';
import { CourseDetailSkeleton } from '@/components/learner/learn/CourseDetailSkeleton';

/* Neutral type palette — no banned colors */
const TYPE_STYLES = {
  lesson:     { icon: LuBookOpen,     color: 'text-[var(--color-muted)]',              bg: 'bg-[var(--color-border)]/40',  label: 'Lesson'    },
  experiment: { icon: LuFlaskConical, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10',           label: 'Lab'       },
  quiz:       { icon: LuBrain,        color: 'text-amber-700 dark:text-amber-400',     bg: 'bg-amber-500/10',             label: 'Quiz'      },
  challenge:  { icon: LuTrophy,       color: 'text-rose-700 dark:text-rose-400',       bg: 'bg-rose-500/10',              label: 'Challenge' },
};

const DEFAULT_DEMO_CURRICULUM = [
  {
    id: 'm1',
    title: 'Module 1: Foundations & Qubit Physics',
    description: 'Explore the fundamental difference between classical and quantum information, superposition, and state representation.',
    completed: false,
    locked: false,
    progress: 50,
    items: [
      { id: 'l1', type: 'lesson', title: 'Classical vs Quantum Information', duration: '15 min', completed: true },
      { id: 'l2', type: 'lesson', title: 'Superposition and Statevectors', duration: '20 min', completed: true },
      { id: 'l3', type: 'experiment', title: 'Lab: Qubit Measurement Statistics', duration: '25 min', completed: false },
      { id: 'q1', type: 'quiz', title: 'Foundations Knowledge Check', duration: '10 min', completed: false },
    ],
  },
  {
    id: 'm2',
    title: 'Module 2: Quantum Gates & Multi-Qubit Systems',
    description: 'Master single-qubit rotations, Pauli operators, and two-qubit entangling gates including CNOT and CZ.',
    completed: false,
    locked: false,
    progress: 0,
    items: [
      { id: 'l4', type: 'lesson', title: 'Single-Qubit Rotations (Pauli, Hadamard)', duration: '20 min', completed: false },
      { id: 'l5', type: 'lesson', title: 'Entanglement & Bell States', duration: '25 min', completed: false },
      { id: 'e2', type: 'experiment', title: 'Lab: Creating Maximally Entangled Pairs', duration: '30 min', completed: false },
      { id: 'c1', type: 'challenge', title: 'Coding Challenge: State Tomography', duration: '40 min', completed: false },
    ],
  },
  {
    id: 'm3',
    title: 'Module 3: Quantum Algorithms & Applications',
    description: 'Implement canon quantum algorithms with phase kickback, amplitude amplification, and quantum parallelism.',
    completed: false,
    locked: false,
    progress: 0,
    items: [
      { id: 'l6', type: 'lesson', title: 'Deutsch-Jozsa & Quantum Parallelism', duration: '25 min', completed: false },
      { id: 'l7', type: 'lesson', title: "Grover's Search Algorithm", duration: '35 min', completed: false },
      { id: 'e3', type: 'experiment', title: 'Lab: Grover Iteration on 3 Qubits', duration: '40 min', completed: false },
      { id: 'q2', type: 'quiz', title: 'Algorithms Mastery Assessment', duration: '15 min', completed: false },
    ],
  },
];

const DEFAULT_LEARNING_OUTCOMES = [
  'Formulate quantum states, density matrices, and Dirac notation',
  'Synthesize single and multi-qubit circuits with unitary transformations',
  'Simulate Bell states, entanglement verification, and measurement statistics',
  'Execute and benchmark quantum algorithms with noise analysis',
  'Gain hands-on experience with interactive circuit sandbox and code execution',
];

function CurriculumItem({ item, onSelectLesson, isEnrolled, onLockedClick }) {
  const style = TYPE_STYLES[item.type] || TYPE_STYLES.lesson;
  const Icon = style.icon;

  const handleClick = () => {
    if (isEnrolled) {
      if (onSelectLesson) onSelectLesson(item);
    } else {
      if (onLockedClick) onLockedClick(item);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
        isEnrolled
          ? item.completed
            ? 'bg-emerald-500/5 border-emerald-500/15 hover:border-emerald-500/30 cursor-pointer group'
            : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-background,var(--bg))] cursor-pointer group'
          : 'bg-[var(--color-surface)]/50 border-[var(--color-border)]/60 hover:border-amber-500/30 cursor-pointer group'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}>
        <Icon size={14} className={style.color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium truncate transition-colors ${
          isEnrolled
            ? 'text-[var(--color-text)] group-hover:text-[var(--color-primary)]'
            : 'text-[var(--color-muted)] group-hover:text-[var(--color-text)]'
        }`}>
          {item.title}
        </div>
        <div className="flex items-center gap-2.5 text-[11px] text-[var(--color-muted)] font-mono mt-0.5">
          <span className={`px-1.5 py-0.2 rounded text-[10px] ${style.bg} ${style.color} font-semibold`}>
            {style.label}
          </span>
          <span className="flex items-center gap-1">
            <LuClock size={10} /> {item.duration}
          </span>
          {!isEnrolled && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <LuLock size={10} /> Locked
            </span>
          )}
        </div>
      </div>

      {isEnrolled ? (
        item.completed ? (
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <LuCheck size={11} className="text-white" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-md border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/10 transition-all flex-shrink-0">
            <LuPlay size={11} className="ml-0.5" />
          </div>
        )
      ) : (
        <div className="text-[var(--color-muted)] group-hover:text-amber-500 transition-colors flex-shrink-0">
          <LuLock size={13} />
        </div>
      )}
    </div>
  );
}

function ModuleSection({ module, index, onSelectLesson, curriculum, isEnrolled, onLockedClick, isOpen, onToggle }) {
  const completedCount = (module.items || []).filter(i => i.completed).length;
  const totalCount = module.items?.length || 0;

  return (
    <div className={`rounded-xl border transition-all overflow-hidden ${
      !isEnrolled && module.locked ? 'border-[var(--color-border)]/50 opacity-75' : 'border-[var(--color-border)]'
    }`}>
      <button
        type="button"
        className="w-full flex items-center gap-3.5 px-5 py-4 bg-[var(--color-surface)] hover:bg-[var(--color-border)]/20 transition-colors text-left"
        onClick={onToggle}
      >
        <div className="w-7 h-7 rounded-lg border border-[var(--color-border)] bg-[var(--color-background,var(--bg))] flex items-center justify-center text-xs font-mono font-semibold text-[var(--color-muted)] flex-shrink-0">
          0{index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-[var(--color-text)] truncate">{module.title}</h4>
          </div>
          <div className="text-[11px] text-[var(--color-muted)] font-mono mt-0.5 flex items-center gap-2">
            <span>{totalCount} lessons</span>
            {isEnrolled && (
              <>
                <span>•</span>
                <span className={completedCount === totalCount && totalCount > 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
                  {completedCount}/{totalCount} completed
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[var(--color-muted)]">
          {isOpen ? <LuChevronDown size={16} /> : <LuChevronRight size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-2 bg-[var(--color-background,var(--bg))] border-t border-[var(--color-border)]/60">
          {module.description && (
            <p className="text-xs text-[var(--color-muted)] pt-2 pb-1 px-1 leading-relaxed">
              {module.description}
            </p>
          )}

          {isEnrolled && module.progress > 0 && (
            <div className="flex items-center gap-2 my-2 px-1">
              <div className="flex-1 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${module.progress}%`,
                    background: module.completed ? '#10b981' : 'var(--color-primary)',
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-[var(--color-muted)]">{module.progress}%</span>
            </div>
          )}

          <div className="space-y-1.5 pt-1">
            {(module.items || []).map(item => (
              <CurriculumItem
                key={item.id}
                item={item}
                isEnrolled={isEnrolled}
                onSelectLesson={(i) => onSelectLesson && onSelectLesson(i, curriculum)}
                onLockedClick={onLockedClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseDetail({
  course: initialCourse,
  onClose,
  onSelectLesson,
  onEnroll,
}) {
  const [course, setCourse] = useState(initialCourse);
  const [loading, setLoading] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollNotice, setEnrollNotice] = useState(false);
  const [openModules, setOpenModules] = useState({ 0: true, 1: true });

  useEffect(() => {
    let mounted = true;
    if (initialCourse) {
      if (!initialCourse.curriculum) {
        setLoading(true);
        apiFetch(`/learner/courses/${initialCourse.id}`)
          .then(res => {
            if (mounted && res?.data?.course) {
              setCourse({
                ...res.data.course,
                curriculum: res.data.curriculum?.length ? res.data.curriculum : DEFAULT_DEMO_CURRICULUM,
              });
            }
          })
          .catch(() => {
            if (mounted) {
              setCourse({
                ...initialCourse,
                curriculum: DEFAULT_DEMO_CURRICULUM,
              });
            }
          })
          .finally(() => { if (mounted) setLoading(false); });
      } else {
        setCourse(initialCourse);
      }
    }
    return () => { mounted = false; };
  }, [initialCourse]);

  if (!course) return null;

  const isEnrolled = !!(course.enrolled || course.progress > 0);
  const curriculumData = course.curriculum || DEFAULT_DEMO_CURRICULUM;
  const totalItems = curriculumData.reduce((s, m) => s + (m.items?.length || 0), 0);
  const completedItems = curriculumData.reduce((s, m) => s + (m.items || []).filter(i => i.completed).length, 0);
  const overallPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : (course.progress || 0);

  // Find next lesson to open
  let nextItem = null;
  for (const mod of curriculumData) {
    for (const item of (mod.items || [])) {
      if (!item.completed && !mod.locked) { nextItem = item; break; }
    }
    if (nextItem) break;
  }
  if (!nextItem && curriculumData[0]?.items?.[0]) {
    nextItem = curriculumData[0].items[0];
  }

  const handleEnrollClick = async () => {
    setIsEnrolling(true);
    setEnrollNotice(false);
    try {
      if (onEnroll) {
        await onEnroll(course.id);
      }
      setCourse(prev => ({
        ...prev,
        enrolled: true,
        progress: prev.progress || 0,
      }));
    } catch (err) {
      console.warn('Enrollment error:', err);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleLockedClick = () => {
    setEnrollNotice(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleModule = (idx) => {
    setOpenModules(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAll = () => {
    const all = {};
    curriculumData.forEach((_, i) => { all[i] = true; });
    setOpenModules(all);
  };

  const collapseAll = () => {
    setOpenModules({});
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* ── Main Two-Column Coaching Layout ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* ── Left Column: Course Details & Curriculum (8 cols) ─────────── */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. Course Header Overview */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-mono font-medium px-2.5 py-1 rounded border ${
                  course.difficulty === 'Advanced'
                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                    : course.difficulty === 'Intermediate'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                }`}>
                  {course.difficulty} Level
                </span>

                {isEnrolled && (
                  <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded border bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                    <LuCheck size={10} /> Enrolled
                  </span>
                )}

                <span className="text-[10px] font-mono text-amber-500 font-semibold flex items-center gap-1 px-2.5 py-1 rounded border border-amber-500/20 bg-amber-500/10">
                  ★ {course.rating || '4.9'}
                </span>

                <span className="text-[10px] font-mono text-[var(--color-muted)] px-2.5 py-1 rounded border border-[var(--color-border)]">
                  {course.category || 'Quantum Foundations'}
                </span>

                <span className="text-[10px] font-mono text-[var(--color-muted)] flex items-center gap-1">
                  <LuClock size={11} /> {course.duration}
                </span>

                <span className="text-[10px] font-mono text-[var(--color-muted)] flex items-center gap-1">
                  <LuUsers size={11} /> {(course.studentsEnrolled || 1420).toLocaleString()} learners
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
                {course.title}
              </h1>

              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Instructor snippet */}
            <div className="pt-4 border-t border-[var(--color-border)]/60 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border flex items-center justify-center text-sm font-semibold uppercase flex-shrink-0"
                style={{
                  background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
                  color: 'var(--color-primary)',
                }}
              >
                {course.instructor?.[0] || 'I'}
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--color-text)]">
                  {course.instructor || 'Quantum Platform Faculty'}
                </div>
                <div className="text-[11px] text-[var(--color-muted)]">
                  Senior Quantum Researcher & Educator
                </div>
              </div>
            </div>
          </div>

          {/* 2. "What You'll Learn" / Learning Outcomes */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
              <LuCircleCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
              What You'll Learn in This Course
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {DEFAULT_LEARNING_OUTCOMES.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-muted)] leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0 font-bold">✓</span>
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Course Syllabus / Curriculum Accordion */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Course Curriculum
                </h3>
                <p className="text-[11px] text-[var(--color-muted)] font-mono mt-0.5">
                  {curriculumData.length} modules • {totalItems} total lessons and labs
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={expandAll}
                  className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors px-2 py-1 rounded"
                >
                  Expand all
                </button>
                <span className="text-[var(--color-border)]">|</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors px-2 py-1 rounded"
                >
                  Collapse all
                </button>
              </div>
            </div>

            {/* Notice if learner tapped locked item */}
            {enrollNotice && !isEnrolled && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Enrollment required:</span> Please enroll in this course to access the interactive player, labs, and quizzes.
                </div>
                <button
                  onClick={handleEnrollClick}
                  disabled={isEnrolling}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white dark:text-zinc-950 whitespace-nowrap hover:opacity-90 transition-opacity"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            )}

            {/* Modules List */}
            {loading ? (
              <CourseDetailSkeleton />
            ) : (
              <div className="space-y-3">
                {curriculumData.map((module, idx) => (
                  <ModuleSection
                    key={module.id}
                    index={idx}
                    module={module}
                    isOpen={!!openModules[idx]}
                    onToggle={() => toggleModule(idx)}
                    isEnrolled={isEnrolled}
                    onSelectLesson={onSelectLesson}
                    onLockedClick={handleLockedClick}
                    curriculum={curriculumData}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 4. Requirements & Prerequisites */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
              <LuShieldCheck size={16} className="text-[var(--color-primary)]" />
              Requirements & Prerequisites
            </h3>
            <ul className="space-y-2 text-xs text-[var(--color-muted)] list-disc pl-5 leading-relaxed">
              <li>Basic understanding of high-school linear algebra (vectors, matrices, dot products)</li>
              <li>Familiarity with basic programming concepts (Python syntax helpful but not strictly required)</li>
              <li>No prior quantum mechanics or physics background is needed — topics are built from first principles</li>
            </ul>
          </div>
        </div>

        {/* ── Right Column: Sticky Action & Enrollment Card (4 cols) ────── */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5 shadow-sm">

            {/* Header Status */}
            <div>
              <div className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-wider">
                {isEnrolled ? 'Your Enrollment' : 'Course Access'}
              </div>
              <div className="text-xl font-bold text-[var(--color-text)] mt-1">
                {isEnrolled ? (
                  <span className="flex items-center gap-2">
                    <span>{overallPct}%</span>
                    <span className="text-xs font-normal text-[var(--color-muted)]">Completed</span>
                  </span>
                ) : (
                  <span>Free • Included</span>
                )}
              </div>
            </div>

            {/* Enrolled Progress Bar */}
            {isEnrolled ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-[var(--color-muted)]">
                  <span>{completedItems} of {totalItems} items completed</span>
                  <span className="font-semibold text-[var(--color-primary)]">{overallPct}%</span>
                </div>
                <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${overallPct}%`, background: 'var(--color-primary)' }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Enroll to get lifetime access to all lessons, interactive quantum circuits, quizzes, and AI tutor support.
              </p>
            )}

            {/* Primary Action Button */}
            <div className="space-y-2.5 pt-1">
              {isEnrolled ? (
                <>
                  <button
                    type="button"
                    onClick={() => onSelectLesson && nextItem && onSelectLesson(nextItem, curriculumData)}
                    className="w-full py-3 rounded-lg text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    <LuPlay size={14} className="ml-0.5" />
                    {overallPct > 0 ? 'Resume Course Player' : 'Open Course Player'}
                  </button>

                  {nextItem && (
                    <div className="text-[11px] text-[var(--color-muted)] text-center truncate px-1">
                      Next up: <span className="font-medium text-[var(--color-text)]">{nextItem.title}</span>
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  disabled={isEnrolling}
                  className="w-full py-3 rounded-lg text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {isEnrolling ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      <span>Enrolling you...</span>
                    </>
                  ) : (
                    <>
                      <LuGraduationCap size={15} />
                      <span>Enroll in Course</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Course Features Checklist */}
            <div className="pt-4 border-t border-[var(--color-border)]/60 space-y-3">
              <div className="text-xs font-semibold text-[var(--color-text)]">
                Course Includes
              </div>

              <div className="space-y-2.5 text-xs text-[var(--color-muted)] font-mono">
                <div className="flex items-center gap-2.5">
                  <LuClock size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                  <span>{course.duration} self-paced learning</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <LuLayers size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                  <span>{curriculumData.length} modules • {totalItems} lessons</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <LuFlaskConical size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                  <span>Interactive quantum circuit labs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <LuBrain size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                  <span>24/7 AI Quantum Tutor assistance</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <LuAward size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                  <span>Verified course completion badge</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
