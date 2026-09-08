"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { useAuthStore } from '../../store/useAuthStore';
import { apiFetch } from '../../services/api';
import { InstructorSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import { InstructorOverview, CourseManagement } from '../../components/instructor';
import {
  LuLayoutDashboard,
  LuBookOpen,
  LuUsers,
  LuClipboardList,
  LuSlidersHorizontal,
  LuCircleAlert,
  LuCheck,
  LuArrowLeft,
  LuSearch,
} from 'react-icons/lu';

const INSTRUCTOR_TABS = [
  { id: 'overview', label: 'Faculty Hub', icon: LuLayoutDashboard, badge: null },
  { id: 'courses', label: 'Assigned Courses', icon: LuBookOpen, badge: '2 Active' },
  { id: 'students', label: 'Enrolled Students', icon: LuUsers, badge: '142' },
  { id: 'grading', label: 'Grading & Submissions', icon: LuClipboardList, badge: '18 Pending' },
  { id: 'settings', label: 'Course Settings', icon: LuSlidersHorizontal, badge: null },
];

const VALID_TAB_IDS = ['overview', 'courses', 'students', 'grading', 'settings'];

function InstructorPortalContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get('tab');
  const activeTab = (rawTab || 'overview').toLowerCase();

  const [portalData, setPortalData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    async function fetchPortalData() {
      try {
        const res = await apiFetch('/instructor/portal');
        if (res?.success) setPortalData(res.data);
      } catch (err) {
        console.warn('Could not fetch instructor data:', err);
      }
    }
    fetchPortalData();
  }, []);

  const handleTabChange = (tabId) => {
    if (tabId === 'overview') {
      router.push('/instructor');
    } else {
      router.push(`/instructor?tab=${tabId}`);
    }
  };

  const isValidTab = VALID_TAB_IDS.includes(activeTab);

  const sampleStudents = [
    { name: 'Kai Chen', email: 'kai.chen@quantum.platform', course: 'PHYS-401', score: '94%', progress: '12/12 Labs', status: 'On Track' },
    { name: 'Maya Patel', email: 'maya.patel@quantum.platform', course: 'CS-550', score: '91%', progress: '10/12 Labs', status: 'On Track' },
    { name: 'Liam O’Connor', email: 'liam.oc@quantum.platform', course: 'PHYS-401', score: '88%', progress: '9/12 Labs', status: 'Needs Review' },
    { name: 'Sophia Rodriguez', email: 'sophia.r@quantum.platform', course: 'CS-550', score: '96%', progress: '12/12 Labs', status: 'Top Performer' },
    { name: 'Aiden Brooks', email: 'aiden.b@quantum.platform', course: 'PHYS-401', score: '79%', progress: '7/12 Labs', status: 'At Risk' },
  ];

  const filteredStudents = sampleStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.course.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex">
      {/* Collapsible Role Sidebar */}
      <InstructorSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <DashboardNavbar
          title="Instructor Portal"
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onMobileMenuClick={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Interactive Tab Switcher Bar */}
          <div className="p-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {INSTRUCTOR_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/30'
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? 'text-white' : 'text-[var(--color-muted)]'}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-[var(--color-border)]/60 text-[var(--color-muted)]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Overview View */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <InstructorOverview user={user} portalData={portalData} />
              <CourseManagement portalData={portalData} />
            </div>
          )}

          {/* Courses View */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-fadeIn">
              <CourseManagement portalData={portalData} />
            </div>
          )}

          {/* Enrolled Students View */}
          {activeTab === 'students' && (
            <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                    <LuUsers size={22} className="text-emerald-500" />
                    <span>Enrolled Student Cohort</span>
                  </h2>
                  <p className="text-xs text-[var(--color-muted)]">
                    Active learners enrolled in your assigned quantum physics & computing sections
                  </p>
                </div>

                <div className="relative">
                  <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={14} />
                  <input
                    type="text"
                    placeholder="Search student or course..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-64 pl-9 pr-3 py-1.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--color-border)] text-[var(--color-muted)] font-mono uppercase tracking-wider">
                    <tr>
                      <th className="pb-3 font-semibold">Student</th>
                      <th className="pb-3 font-semibold">Course</th>
                      <th className="pb-3 font-semibold">Lab Completion</th>
                      <th className="pb-3 font-semibold">Avg Score</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]/50">
                    {filteredStudents.map((s, idx) => (
                      <tr key={idx} className="hover:bg-[var(--color-background)]/50 transition-colors">
                        <td className="py-3.5">
                          <div className="font-semibold text-[var(--color-text)]">{s.name}</div>
                          <div className="text-[11px] text-[var(--color-muted)] font-mono">{s.email}</div>
                        </td>
                        <td className="py-3.5 font-mono text-emerald-500 font-semibold">{s.course}</td>
                        <td className="py-3.5 font-mono text-[var(--color-muted)]">{s.progress}</td>
                        <td className="py-3.5 font-mono font-bold text-[var(--color-text)]">{s.score}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              s.status === 'Top Performer'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : s.status === 'On Track'
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : s.status === 'At Risk'
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Grading & Submissions View */}
          {activeTab === 'grading' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                    <LuClipboardList size={22} className="text-amber-500" />
                    Pending Evaluation & Circuit Submissions
                  </h2>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    18 Submissions In Queue
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { student: 'Kai Chen', course: 'PHYS-401', assignment: 'Bell State Entanglement Measurement', date: '2 hours ago', qubits: 2 },
                    { student: 'Maya Patel', course: 'CS-550', assignment: 'Grover Search Oracle 4-Qubit Circuit', date: '5 hours ago', qubits: 4 },
                    { student: 'Liam O’Connor', course: 'PHYS-401', assignment: 'Quantum Teleportation Protocol Wire', date: '1 day ago', qubits: 3 },
                    { student: 'Sophia Rodriguez', course: 'CS-550', assignment: 'Quantum Fourier Transform 3-Qubit Implementation', date: '1 day ago', qubits: 3 },
                  ].map((sub, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[var(--color-text)]">{sub.student}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                            {sub.course}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--color-muted)]">
                            {sub.qubits} Qubits
                          </span>
                        </div>
                        <div className="text-xs text-[var(--color-muted)]">{sub.assignment}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[var(--color-muted)]">{sub.date}</span>
                        <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md">
                          <LuCheck size={14} />
                          <span>Review Circuit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Course Settings View */}
          {activeTab === 'settings' && (
            <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                  <LuSlidersHorizontal size={22} className="text-emerald-500" />
                  <span>Curriculum & Grading Configuration</span>
                </h2>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Adjust evaluation thresholds, simulator shot limits, and late policy rules for your courses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--color-text)]">Auto-Grader Simulation Strictness</h4>
                  <p className="text-xs text-[var(--color-muted)]">
                    Sets minimum statevector fidelity required for an automated pass grade.
                  </p>
                  <select className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono">
                    <option value="99.5">Strict (Fidelity ≥ 99.5%)</option>
                    <option value="95.0">Standard (Fidelity ≥ 95.0%)</option>
                    <option value="90.0">Relaxed (Fidelity ≥ 90.0%)</option>
                  </select>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--color-text)]">Max Simulation Shots per Run</h4>
                  <p className="text-xs text-[var(--color-muted)]">
                    Limits learner simulator compute quota per assignment execution.
                  </p>
                  <select className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono">
                    <option value="1024">1,024 Shots (Default)</option>
                    <option value="2048">2,048 Shots</option>
                    <option value="4096">4,096 Shots (High Precision)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for Invalid Tab */}
          {!isValidTab && (
            <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-amber-500/30 shadow-lg space-y-4">
              <div className="flex items-center gap-3 text-amber-500">
                <LuCircleAlert size={24} />
                <h3 className="text-lg font-bold">Instructor Module &ldquo;{rawTab}&rdquo; Not Available</h3>
              </div>
              <p className="text-xs text-[var(--color-muted)]">
                The requested tab does not match any configured faculty module.
              </p>
              <Link
                href="/instructor"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors"
              >
                <LuArrowLeft size={14} />
                <span>Return to Faculty Hub</span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function InstructorPortalPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['INSTRUCTOR', 'ADMIN']}>
        <Suspense fallback={null}>
          <InstructorPortalContent />
        </Suspense>
      </RoleGuard>
    </ProtectedRoute>
  );
}
