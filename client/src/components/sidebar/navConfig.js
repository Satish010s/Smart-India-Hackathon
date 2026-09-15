import {
  LuLayoutDashboard,
  LuBookOpen,
  LuCpu,
  LuTrophy,
  LuBot,
  LuMicroscope,
  LuActivity,
  LuDatabase,
  LuFileText,
  LuFlaskConical,
  LuGraduationCap,
  LuUsers,
  LuClipboardList,
  LuShieldAlert,
  LuUserPlus,
  LuChartBar,
  LuSettings,
  LuMedal,
  LuUser,
  LuHistory,
  LuGitCompare,
  LuCircuitBoard,
  LuBrain,
  LuKeyRound,
} from 'react-icons/lu';

export const ROLE_NAV_ITEMS = {
  LEARNER: [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LuLayoutDashboard,
    },
    {
      label: 'Learn',
      href: '/learn',
      icon: LuBookOpen,
      badge: '12',
    },
    {
      label: 'Playground',
      href: '/playground',
      icon: LuCpu,
    },
    {
      label: 'Challenges',
      href: '/challenges',
      icon: LuTrophy,
      badge: 'XP',
    },
    {
      label: 'AI Tutor',
      href: '/ai-tutor',
      icon: LuBot,
      badge: 'NEW',
    },
    {
      label: 'Experiments',
      href: '/dashboard?tab=experiments',
      icon: LuFlaskConical,
    },
    {
      label: 'Backend Compare',
      href: '/dashboard?tab=backend-compare',
      icon: LuGitCompare,
      badge: '4 Backends',
    },
    {
      label: 'Sim History',
      href: '/dashboard?tab=sim-history',
      icon: LuHistory,
    },
    {
      label: 'Saved Circuits',
      href: '/dashboard?tab=saved-circuits',
      icon: LuCircuitBoard,
    },
    {
      label: 'Progress',
      href: '/progress',
      icon: LuChartBar,
    },
    {
      label: 'Achievement',
      href: '/achievement',
      icon: LuMedal,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: LuUser,
    },
  ],

  INSTRUCTOR: [
    {
      label: 'Dashboard',
      href: '/instructor',
      icon: LuLayoutDashboard,
      badge: 'Faculty',
    },
    {
      label: 'Courses',
      href: '/instructor?tab=courses',
      icon: LuBookOpen,
      badge: '3',
    },
    {
      label: 'Course Builder',
      href: '/instructor?tab=course-builder',
      icon: LuFlaskConical,
    },
    {
      label: 'Lesson Builder',
      href: '/instructor?tab=lesson-builder',
      icon: LuFileText,
    },
    {
      label: 'Quiz Builder',
      href: '/instructor?tab=quiz-builder',
      icon: LuClipboardList,
    },
    {
      label: 'Challenge Builder',
      href: '/instructor?tab=challenge-builder',
      icon: LuMicroscope,
    },
    {
      label: 'Students',
      href: '/instructor?tab=students',
      icon: LuUsers,
      badge: '142',
    },
    {
      label: 'Analytics',
      href: '/instructor?tab=analytics',
      icon: LuChartBar,
    },
    {
      label: 'Content',
      href: '/instructor?tab=content',
      icon: LuDatabase,
    },
    {
      label: 'Settings',
      href: '/instructor?tab=settings',
      icon: LuSettings,
    },
  ],

  ADMIN: [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LuShieldAlert,
      badge: 'Live',
    },
    {
      label: 'Users',
      href: '/admin?tab=users',
      icon: LuUsers,
    },
    {
      label: 'Roles & Permissions',
      href: '/admin?tab=roles',
      icon: LuKeyRound,
      badge: '3 Roles',
    },
    {
      label: 'Content Governance',
      href: '/admin?tab=content',
      icon: LuDatabase,
    },
    {
      label: 'AI Management',
      href: '/admin?tab=ai',
      icon: LuBrain,
      badge: 'FastAPI',
    },
    {
      label: 'Quantum Backends',
      href: '/admin?tab=backends',
      icon: LuCpu,
      badge: '4 QPU',
    },
    {
      label: 'Platform Analytics',
      href: '/admin?tab=analytics',
      icon: LuChartBar,
    },
    {
      label: 'System Health',
      href: '/admin?tab=health',
      icon: LuActivity,
    },
    {
      label: 'Audit Logs',
      href: '/admin?tab=audit',
      icon: LuHistory,
    },
    {
      label: 'Platform Settings',
      href: '/admin?tab=settings',
      icon: LuSettings,
    },
  ],
};

export const ROLE_THEMES = {
  LEARNER: {
    color: 'var(--color-primary)',
    badgeBg: 'bg-[var(--color-primary)]/10',
    badgeText: 'text-[var(--color-primary)]',
    badgeBorder: 'border-[var(--color-primary)]/20',
    name: 'Learner',
  },
  INSTRUCTOR: {
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-500',
    badgeBorder: 'border-emerald-500/20',
    name: 'Instructor',
  },
  ADMIN: {
    color: '#f43f5e',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-500',
    badgeBorder: 'border-rose-500/20',
    name: 'Super Admin',
  },
};


