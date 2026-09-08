"use client";

import React from 'react';
import { LuBookOpen, LuUsers, LuClipboardList, LuCheck, LuArrowRight } from 'react-icons/lu';

export default function CourseManagement({ portalData }) {
  const courses = [
    {
      code: 'PHYS-401',
      title: 'Introduction to Quantum Information and Qubits',
      term: 'Fall 2026',
      students: 84,
      avgScore: '89.4%',
      status: 'Active',
    },
    {
      code: 'CS-550',
      title: 'Quantum Algorithms: Shor, Grover, and QPE',
      term: 'Fall 2026',
      students: 58,
      avgScore: '92.1%',
      status: 'Active',
    },
  ];

  const submissions = [
    { student: 'Kai Chen', course: 'PHYS-401', assignment: 'Bell State Measurement', date: '2 hours ago' },
    { student: 'Maya Patel', course: 'CS-550', assignment: 'Grover Oracle Implementation', date: '5 hours ago' },
    { student: 'Liam O’Connor', course: 'PHYS-401', assignment: 'Quantum Teleportation Circuit', date: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Active Courses Table */}
      <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuBookOpen size={22} className="text-emerald-500" />
            Curriculum & Courses
          </h2>
          <span className="text-xs font-mono font-semibold text-[var(--color-muted)]">
            2 Assigned Sections
          </span>
        </div>

        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.code}
              className="p-5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-emerald-500 font-bold px-2 py-0.5 rounded bg-emerald-500/10">
                    {course.code}
                  </span>
                  <span className="text-xs text-[var(--color-muted)] font-mono">{course.term}</span>
                </div>
                <h3 className="font-semibold text-sm text-[var(--color-text)]">{course.title}</h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[var(--color-muted)]">
                <span>{course.students} enrolled students</span>
                <span>&bull;</span>
                <span className="text-emerald-500 font-semibold">{course.avgScore} class average</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions Queue */}
      <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <LuClipboardList size={22} className="text-amber-500" />
          Recent Student Submissions
        </h2>

        <div className="space-y-3">
          {submissions.map((sub, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-sm text-[var(--color-text)]">{sub.student}</div>
                <div className="text-xs text-[var(--color-muted)]">
                  {sub.course} &bull; {sub.assignment}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[var(--color-muted)] hidden sm:inline">{sub.date}</span>
                <button className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-1 cursor-pointer">
                  <LuCheck size={14} />
                  <span>Grade</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
