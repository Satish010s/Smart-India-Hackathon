"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import CourseCard from '../../components/learner/learn/CourseCard';
import CourseDetail from '../../components/learner/learn/CourseDetail';
import ModuleOverview from '../../components/learner/learn/ModuleOverview';
import LessonView from '../../components/learner/learn/LessonView';
import { CourseCardSkeleton } from '../../components/learner/learn/CourseCardSkeleton';
import InteractiveExperiment from '../../components/learner/learn/InteractiveExperiment';
import { apiFetch } from '../../services/api';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  LuBookOpen, LuCompass, LuStar, LuGraduationCap, LuSparkles,
  LuArrowLeft, LuSearch, LuFilter, LuFlaskConical,
  LuTrendingUp, LuClock, LuZap, LuBrain, LuCheck,
} from 'react-icons/lu';

// ─── Course catalogue data ────────────────────────────────────────────────────
const COURSES = [
  {
    id: 'c1',
    title: 'Quantum Fundamentals: From Bits to Qubits',
    description: 'Master the core principles of quantum mechanics and how they form the foundation of quantum computing.',
    difficulty: 'Beginner',
    duration: '8 hrs',
    modules: 5,
    lessons: 24,
    instructor: 'Dr. Anjali Singh',
    progress: 100,
    enrolled: true,
    studentsEnrolled: 3420,
    category: 'Foundations',
    rating: 4.9,
  },
  {
    id: 'c2',
    title: 'Quantum Algorithms Masterclass',
    description: "Deep dive into Grover's search, Shor's factoring, and quantum phase estimation with working Qiskit implementations.",
    difficulty: 'Intermediate',
    duration: '14 hrs',
    modules: 6,
    lessons: 38,
    instructor: 'Dr. Priya Nair',
    progress: 62,
    enrolled: true,
    studentsEnrolled: 1840,
    category: 'Algorithms',
    rating: 4.8,
  },
  {
    id: 'c3',
    title: 'Quantum Error Correction & Fault Tolerance',
    description: 'Learn stabilizer codes, surface codes, and logical qubit construction to build noise-resilient quantum computers.',
    difficulty: 'Advanced',
    duration: '18 hrs',
    modules: 7,
    lessons: 42,
    instructor: 'Prof. Rajan Mehta',
    progress: 0,
    enrolled: false,
    studentsEnrolled: 720,
    category: 'Error Correction',
    rating: 4.7,
  },
  {
    id: 'c4',
    title: 'Quantum Machine Learning',
    description: 'Explore variational quantum circuits, quantum kernels, and hybrid QML algorithms for near-term quantum devices.',
    difficulty: 'Advanced',
    duration: '16 hrs',
    modules: 8,
    lessons: 45,
    instructor: 'Dr. Kavya Iyer',
    progress: 0,
    enrolled: false,
    studentsEnrolled: 560,
    category: 'QML',
    rating: 4.6,
  },
  {
    id: 'c5',
    title: 'Quantum Cryptography & BB84',
    description: 'From no-cloning theorem to quantum key distribution protocols. Build provably secure communication channels.',
    difficulty: 'Intermediate',
    duration: '10 hrs',
    modules: 4,
    lessons: 22,
    instructor: 'Dr. Aryan Kapoor',
    progress: 0,
    enrolled: false,
    studentsEnrolled: 980,
    category: 'Cryptography',
    rating: 4.8,
  },
  {
    id: 'c6',
    title: 'Variational Quantum Eigensolver (VQE)',
    description: 'Master the VQE hybrid algorithm for molecular simulation and quantum chemistry applications.',
    difficulty: 'Advanced',
    duration: '12 hrs',
    modules: 5,
    lessons: 28,
    instructor: 'Dr. Sruthi Varma',
    progress: 25,
    enrolled: true,
    studentsEnrolled: 340,
    category: 'Quantum Chemistry',
    rating: 4.5,
  },
];

const LEARNING_PATHS = [
  {
    id: 'p1',
    title: 'Quantum Computing Foundations',
    description: 'The complete beginner to intermediate path. Start from zero and build up to running real quantum algorithms.',
    courses: 3,
    totalHours: '32 hrs',
    difficulty: 'Beginner → Intermediate',
    progress: 72,
    enrolled: true,
    icon: LuBookOpen,
  },
  {
    id: 'p2',
    title: 'Quantum Algorithm Specialist',
    description: 'Deep dive into the canonical quantum algorithms. Implement Grover, Shor, QFT, and QPE from scratch.',
    courses: 2,
    totalHours: '24 hrs',
    difficulty: 'Intermediate → Advanced',
    progress: 40,
    enrolled: true,
    icon: LuBrain,
  },
  {
    id: 'p3',
    title: 'Quantum Machine Learning Track',
    description: 'Combine classical ML with quantum advantage. Build VQC, quantum kernels, and quantum GANs.',
    courses: 3,
    totalHours: '40 hrs',
    difficulty: 'Advanced',
    progress: 0,
    enrolled: false,
    icon: LuSparkles,
  },
  {
    id: 'p4',
    title: 'Quantum Security & Cryptography',
    description: 'From BB84 to post-quantum cryptography. Master quantum-resistant algorithms and QKD protocols.',
    courses: 2,
    totalHours: '18 hrs',
    difficulty: 'Intermediate',
    progress: 0,
    enrolled: false,
    icon: LuTrendingUp,
  },
];

const RECOMMENDED = [
  { ...COURSES[2], recommendedReason: 'Next step in your algorithm track' },
  { ...COURSES[4], recommendedReason: 'Based on your cryptography quiz scores' },
  { ...COURSES[3], recommendedReason: 'Matches your interest in ML' },
];

const CATEGORIES = ['All', 'Foundations', 'Algorithms', 'Error Correction', 'QML', 'Cryptography', 'Quantum Chemistry'];

// ─── Sub-views ────────────────────────────────────────────────────────────────

function LearningPathCard({ path }) {
  const Icon = path.icon;
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
              color: 'var(--color-primary)',
            }}
          >
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
              {path.title}
            </h3>
            <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-2 leading-relaxed">
              {path.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[var(--color-muted)] font-mono flex-wrap">
          <span className="flex items-center gap-1"><LuBookOpen size={11} />{path.courses} courses</span>
          <span className="flex items-center gap-1"><LuClock size={11} />{path.totalHours}</span>
          <span className="flex items-center gap-1"><LuZap size={11} />{path.difficulty}</span>
        </div>

        {path.enrolled && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[var(--color-muted)]">
              <span>Progress</span>
              <span>{path.progress}%</span>
            </div>
            <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${path.progress}%`,
                  background: path.progress >= 100 ? '#10b981' : 'var(--color-primary)',
                }}
              />
            </div>
          </div>
        )}

        <button
          className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            path.enrolled
              ? 'text-white dark:text-zinc-950 font-bold hover:opacity-90'
              : 'border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]'
          }`}
          style={path.enrolled ? { background: 'var(--color-primary)' } : {}}
        >
          {path.enrolled ? '▶ Continue Path' : '+ Enroll in Path'}
        </button>
      </div>
    </div>
  );
}

function CoursesGrid({ courses, onSelect, onEnroll, filter, loading, onBrowseMore }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = courses.filter(c => {
    const isEnrolled = !!(c.enrolled || c.progress > 0);
    const matchesFilter = filter === 'all' || (filter === 'my' ? isEnrolled : !isEnrolled);
    const matchesCategory = category === 'All' || c.category === category;
    const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <LuSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-[var(--color-primary)] text-white dark:text-zinc-950 font-bold'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        filter === 'my' ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full border border-[var(--color-border)] bg-[var(--color-background,var(--bg))] flex items-center justify-center mx-auto text-[var(--color-muted)]">
              <LuGraduationCap size={22} />
            </div>
            <h3 className="font-semibold text-sm text-[var(--color-text)]">No enrolled courses yet</h3>
            <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto leading-relaxed">
              Explore our quantum catalog and enroll in courses to start tracking your modules and lessons here.
            </p>
            {onBrowseMore && (
              <button
                onClick={onBrowseMore}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white mt-2 hover:opacity-90 transition-opacity"
                style={{ background: 'var(--color-primary)' }}
              >
                Browse All Courses
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--color-muted)]">
            <LuSearch size={32} className="mx-auto mb-3 opacity-40" />
            <p>No courses found matching your criteria.</p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={onSelect}
              onEnroll={onEnroll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'paths', label: 'Learning Paths', icon: LuCompass },
  { id: 'courses', label: 'Courses', icon: LuBookOpen },
  { id: 'my', label: 'My Courses', icon: LuGraduationCap },
  { id: 'recommended', label: 'Recommended', icon: LuSparkles },
];

export default function LearnPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('paths');
  const [courses, setCourses] = useState(COURSES);
  const [paths, setPaths] = useState(LEARNING_PATHS);
  const [loading, setLoading] = useState(true);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Drill-down state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showExperiment, setShowExperiment] = useState(false);

  // Navigation state: flat lesson list within a course for prev/next
  const [courseLessons, setCourseLessons] = useState([]);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function loadCourses() {
      try {
        setLoading(true);
        const res = await apiFetch('/learner/courses');
        if (mounted) {
          if (res?.data?.courses?.length) {
            setCourses(res.data.courses);
          }
          if (res?.data?.paths?.length) {
            setPaths(res.data.paths.map(p => ({
              ...p,
              icon: p.id === 'p1' ? LuBookOpen : p.id === 'p2' ? LuBrain : p.id === 'p3' ? LuSparkles : LuTrendingUp,
            })));
          }
          setApiLoaded(true);
        }
      } catch (err) {
        console.warn('LearnPage: API unavailable, using demo data:', err.message);
        if (mounted) setApiLoaded(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCourses();
    return () => { mounted = false; };
  }, []);

  async function handleEnroll(courseId) {
    try {
      await apiFetch(`/learner/courses/${courseId}/enroll`, { method: 'POST' });
    } catch (err) {
      console.warn('Enroll API unavailable, updating local state:', err.message);
    }
    // Update courses list
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolled: true, progress: c.progress || 0 } : c));
    // Update currently viewed course if open
    setSelectedCourse(prev => prev && prev.id === courseId ? { ...prev, enrolled: true, progress: prev.progress || 0 } : prev);
  }

  function handleSelectLesson(item, curriculum) {
    const isEnrolled = !!(selectedCourse?.enrolled || (selectedCourse?.progress || 0) > 0);
    if (!isEnrolled) {
      console.warn('Please enroll in the course to access the player');
      return;
    }

    const allLessons = (curriculum || []).flatMap(mod => mod.items || []);
    const idx = allLessons.findIndex(l => l.id === item.id);
    setCourseLessons(allLessons);
    setCurrentLessonIdx(idx >= 0 ? idx : 0);

    if (item.type === 'experiment') {
      setShowExperiment(true);
    } else {
      setSelectedLesson(item);
    }
  }

  // View stack: 'list' | 'course' | 'lesson' | 'experiment'
  const view = showExperiment ? 'experiment' : selectedLesson ? 'lesson' : selectedCourse ? 'course' : 'list';

  function goBack() {
    if (showExperiment) { setShowExperiment(false); return; }
    if (selectedLesson) { setSelectedLesson(null); return; }
    if (selectedCourse) { setSelectedCourse(null); return; }
  }

  function handlePrevLesson() {
    const idx = currentLessonIdx - 1;
    if (idx >= 0) {
      setCurrentLessonIdx(idx);
      setSelectedLesson(courseLessons[idx]);
    }
  }

  function handleNextLesson() {
    const idx = currentLessonIdx + 1;
    if (idx < courseLessons.length) {
      setCurrentLessonIdx(idx);
      setSelectedLesson(courseLessons[idx]);
    } else {
      setSelectedLesson(null);
    }
  }

  const enrolledCount = courses.filter(c => c.enrolled || c.progress > 0).length;

  const pageTitle = view === 'experiment' ? 'Interactive Lab' :
                    view === 'lesson' ? selectedLesson?.title || 'Lesson' :
                    view === 'course' ? selectedCourse?.title || 'Course Details' :
                    'Learn';

  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-text)] flex">
        <LearnerSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <div className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <DashboardNavbar
            title={pageTitle}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">

            {/* Breadcrumb / Back button for drill-down views */}
            {view !== 'list' && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors group"
              >
                <LuArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                {view === 'course' ? 'Back to Courses' :
                 view === 'lesson' ? 'Back to Course Details' :
                 'Back to Course Details'}
              </button>
            )}

            {/* ── DRILL-DOWN VIEWS ── */}
            {view === 'experiment' && (
              <InteractiveExperiment onClose={goBack} />
            )}

            {view === 'lesson' && (
              <LessonView
                lesson={selectedLesson}
                onClose={goBack}
                onNext={currentLessonIdx < courseLessons.length - 1 ? handleNextLesson : null}
                onPrev={currentLessonIdx > 0 ? handlePrevLesson : null}
                lessonIndex={currentLessonIdx + 1}
                totalLessons={courseLessons.length || 1}
              />
            )}

            {view === 'course' && (
              <CourseDetail
                course={selectedCourse}
                onClose={goBack}
                onSelectLesson={(item, curriculum) => handleSelectLesson(item, curriculum)}
                onEnroll={handleEnroll}
              />
            )}

            {/* ── LIST VIEW ── */}
            {view === 'list' && (
              <>
                {/* Tab bar */}
                <div className="flex gap-1 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl w-fit">
                  {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                          activeTab === tab.id
                            ? 'text-white dark:text-zinc-950 font-bold shadow-sm'
                            : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                        }`}
                        style={activeTab === tab.id ? { background: 'var(--color-primary)' } : {}}
                      >
                        <Icon size={14} className={activeTab === tab.id ? 'text-white dark:text-zinc-950' : ''} />
                        <span className="hidden sm:inline">{tab.label}</span>
                        {tab.id === 'my' && enrolledCount > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                            activeTab === 'my'
                              ? 'bg-black/15 text-white dark:text-zinc-950 font-bold'
                              : 'bg-[var(--color-border)] text-[var(--color-muted)]'
                          }`}>
                            {enrolledCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Learning Paths tab */}
                {activeTab === 'paths' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {paths.map(path => (
                      <LearningPathCard key={path.id} path={path} />
                    ))}
                  </div>
                )}

                {/* All Courses tab */}
                {activeTab === 'courses' && (
                  <CoursesGrid
                    courses={courses}
                    onSelect={setSelectedCourse}
                    onEnroll={handleEnroll}
                    filter="all"
                    loading={loading}
                  />
                )}

                {/* My Courses tab */}
                {activeTab === 'my' && (
                  <div className="space-y-5">
                    <div className="text-sm text-[var(--color-muted)]">
                      You are enrolled in <span className="text-[var(--color-text)] font-semibold">{enrolledCount} courses</span>.
                    </div>
                    <CoursesGrid
                      courses={courses}
                      onSelect={setSelectedCourse}
                      onEnroll={handleEnroll}
                      filter="my"
                      loading={loading}
                      onBrowseMore={() => setActiveTab('courses')}
                    />
                  </div>
                )}

                {/* Recommended tab */}
                {activeTab === 'recommended' && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex items-start gap-3">
                      <LuSparkles size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-[var(--color-text)]">AI-Powered Recommendations</div>
                        <div className="text-xs text-[var(--color-muted)] mt-1">Based on your progress, quiz scores, and learning history, here's what we suggest next.</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {RECOMMENDED.map(course => (
                        <div key={course.id} className="space-y-2">
                          <div className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1.5">
                            <LuSparkles size={11} /> {course.recommendedReason}
                          </div>
                          <CourseCard
                            course={course}
                            onSelect={setSelectedCourse}
                            onEnroll={handleEnroll}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
