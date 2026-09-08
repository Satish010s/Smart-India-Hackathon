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
  LuSlidersHorizontal,
  LuShieldAlert,
  LuUserPlus,
  LuChartBar,
  LuSettings,
} from 'react-icons/lu';

export const ROLE_NAV_ITEMS = {
  LEARNER: [
    {
      label: 'Learner Hub',
      href: '/dashboard',
      icon: LuLayoutDashboard,
      badge: 'Main',
    },
    {
      label: 'Quantum Tracks',
      href: '/learn',
      icon: LuBookOpen,
      badge: '12 Tracks',
    },
    {
      label: 'Circuit Playground',
      href: '/playground',
      icon: LuCpu,
    },
    {
      label: 'Challenges & Quizzes',
      href: '/challenges',
      icon: LuTrophy,
      badge: 'XP',
    },
    {
      label: 'My Progress',
      href: '/progress',
      icon: LuChartBar,
    },
  ],

  RESEARCHER: [
    {
      label: 'Research Hub',
      href: '/dashboard/researcher',
      icon: LuLayoutDashboard,
      badge: 'Active',
    },
    {
      label: 'Quantum Circuits',
      href: '/playground',
      icon: LuCpu,
    },
    {
      label: 'Simulations & VQE',
      href: '/dashboard/researcher?tab=simulations',
      icon: LuActivity,
      badge: '64 Qubits',
    },
    {
      label: 'QPU Hardware Quota',
      href: '/dashboard/researcher?tab=hardware',
      icon: LuDatabase,
    },
    {
      label: 'Research Papers',
      href: '/dashboard/researcher?tab=papers',
      icon: LuFileText,
      badge: '3 Docs',
    },
    {
      label: 'Algorithms Lab',
      href: '/learn',
      icon: LuFlaskConical,
    },
  ],

  INSTRUCTOR: [
    {
      label: 'Instructor Portal',
      href: '/instructor',
      icon: LuLayoutDashboard,
      badge: 'Faculty',
    },
    {
      label: 'Assigned Courses',
      href: '/instructor?tab=courses',
      icon: LuBookOpen,
      badge: '2 Active',
    },
    {
      label: 'Enrolled Students',
      href: '/instructor?tab=students',
      icon: LuUsers,
      badge: '142',
    },
    {
      label: 'Grading & Submissions',
      href: '/instructor?tab=grading',
      icon: LuClipboardList,
      badge: '18 Pending',
    },
    {
      label: 'Course Settings',
      href: '/instructor?tab=settings',
      icon: LuSlidersHorizontal,
    },
    {
      label: 'Learner Preview',
      href: '/dashboard',
      icon: LuGraduationCap,
    },
  ],

  ADMIN: [
    {
      label: 'Admin Console',
      href: '/admin',
      icon: LuShieldAlert,
      badge: 'Super',
    },
    {
      label: 'User Directory',
      href: '/admin?tab=users',
      icon: LuUsers,
    },
    {
      label: 'Provision Faculty',
      href: '/admin?tab=provision',
      icon: LuUserPlus,
      badge: 'Invite',
    },
    {
      label: 'System Metrics',
      href: '/admin?tab=metrics',
      icon: LuActivity,
    },
    {
      label: 'Instructor View',
      href: '/instructor',
      icon: LuGraduationCap,
    },
    {
      label: 'Learner View',
      href: '/dashboard',
      icon: LuBookOpen,
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
  RESEARCHER: {
    color: 'var(--color-secondary)',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-500',
    badgeBorder: 'border-cyan-500/20',
    name: 'Researcher',
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
