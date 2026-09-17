import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';
/**
 * dummyData.js
 * Centralized dummy data generator for all roles.
 * All data is realistic, rich, and consistent.
 */

// ─── LEARNER ──────────────────────────────────────────────────────────────────
const generateDummyLearnerData = (name = 'Learner') => {
  const firstName = name.split(' ')[0];

  const courses = [
    {
      id: 'c1',
      title: 'Quantum Fundamentals: From Bits to Qubits',
      description: 'Master the core principles of quantum mechanics and how they form the foundation of quantum computing.',
      difficulty: 'Beginner', duration: '8 hrs', modules: 5, lessons: 24,
      instructor: 'Dr. Anjali Singh', progress: 100, enrolled: true,
      studentsEnrolled: 3420, category: 'Foundations', rating: 4.9,
    },
    {
      id: 'c2',
      title: 'Quantum Algorithms Masterclass',
      description: "Deep dive into Grover's search, Shor's factoring, and QPE with working Qiskit implementations.",
      difficulty: 'Intermediate', duration: '14 hrs', modules: 6, lessons: 38,
      instructor: 'Dr. Priya Nair', progress: 62, enrolled: true,
      studentsEnrolled: 1840, category: 'Algorithms', rating: 4.8,
    },
    {
      id: 'c3',
      title: 'Quantum Error Correction & Fault Tolerance',
      description: 'Learn stabilizer codes, surface codes, and logical qubit construction.',
      difficulty: 'Advanced', duration: '18 hrs', modules: 7, lessons: 42,
      instructor: 'Prof. Rajan Mehta', progress: 0, enrolled: false,
      studentsEnrolled: 720, category: 'Error Correction', rating: 4.7,
    },
    {
      id: 'c4',
      title: 'Quantum Machine Learning',
      description: 'Explore variational quantum circuits, quantum kernels, and hybrid QML algorithms.',
      difficulty: 'Advanced', duration: '16 hrs', modules: 8, lessons: 45,
      instructor: 'Dr. Kavya Iyer', progress: 0, enrolled: false,
      studentsEnrolled: 560, category: 'QML', rating: 4.6,
    },
    {
      id: 'c5',
      title: 'Quantum Cryptography & BB84',
      description: 'From no-cloning theorem to quantum key distribution protocols.',
      difficulty: 'Intermediate', duration: '10 hrs', modules: 4, lessons: 22,
      instructor: 'Dr. Aryan Kapoor', progress: 0, enrolled: false,
      studentsEnrolled: 980, category: 'Cryptography', rating: 4.8,
    },
    {
      id: 'c6',
      title: 'Variational Quantum Eigensolver (VQE)',
      description: 'Master the VQE hybrid algorithm for molecular simulation.',
      difficulty: 'Advanced', duration: '12 hrs', modules: 5, lessons: 28,
      instructor: 'Dr. Sruthi Varma', progress: 25, enrolled: true,
      studentsEnrolled: 340, category: 'Quantum Chemistry', rating: 4.5,
    },
  ];

  const learningPaths = [
    {
      id: 'p1', title: 'Quantum Computing Foundations',
      description: 'Complete beginner to intermediate path. Start from zero and build up to real algorithms.',
      courses: 3, totalHours: '32 hrs', difficulty: 'Beginner → Intermediate', progress: 72, enrolled: true,
    },
    {
      id: 'p2', title: 'Quantum Algorithm Specialist',
      description: 'Deep dive into canonical quantum algorithms. Implement Grover, Shor, QFT from scratch.',
      courses: 2, totalHours: '24 hrs', difficulty: 'Intermediate → Advanced', progress: 40, enrolled: true,
    },
    {
      id: 'p3', title: 'Quantum Machine Learning Track',
      description: 'Combine classical ML with quantum advantage. Build VQC, quantum kernels, quantum GANs.',
      courses: 3, totalHours: '40 hrs', difficulty: 'Advanced', progress: 0, enrolled: false,
    },
    {
      id: 'p4', title: 'Quantum Security & Cryptography',
      description: 'From BB84 to post-quantum cryptography. Master quantum-resistant algorithms.',
      courses: 2, totalHours: '18 hrs', difficulty: 'Intermediate', progress: 0, enrolled: false,
    },
  ];

  const curriculum = [
    {
      id: 'm1', title: 'Module 1: Quantum Fundamentals', completed: true, locked: false, progress: 100,
      items: [
        { id: 'l1', type: 'lesson', title: 'What is a Qubit?', duration: '12 min', completed: true },
        { id: 'l2', type: 'lesson', title: 'Superposition & Bloch Sphere', duration: '18 min', completed: true },
        { id: 'e1', type: 'experiment', title: 'Lab: Visualize a Qubit State', duration: '20 min', completed: true },
        { id: 'q1', type: 'quiz', title: 'Module 1 Quiz', duration: '8 min', completed: true },
      ],
    },
    {
      id: 'm2', title: 'Module 2: Quantum Gates & Circuits', completed: true, locked: false, progress: 100,
      items: [
        { id: 'l3', type: 'lesson', title: 'Pauli Gates: X, Y, Z', duration: '15 min', completed: true },
        { id: 'l4', type: 'lesson', title: 'Hadamard & Phase Gates', duration: '20 min', completed: true },
        { id: 'l5', type: 'lesson', title: 'CNOT & Entanglement', duration: '22 min', completed: true },
        { id: 'e2', type: 'experiment', title: 'Lab: Build a Bell State', duration: '25 min', completed: true },
        { id: 'c1', type: 'challenge', title: 'Challenge: Multi-qubit Circuit', duration: '30 min', completed: true },
      ],
    },
    {
      id: 'm3', title: "Module 3: Grover's Search Algorithm", completed: false, locked: false, progress: 40,
      items: [
        { id: 'l6', type: 'lesson', title: 'Oracle Construction', duration: '20 min', completed: true },
        { id: 'l7', type: 'lesson', title: 'Amplitude Amplification', duration: '25 min', completed: true },
        { id: 'l8', type: 'lesson', title: 'Diffusion Operator', duration: '20 min', completed: false },
        { id: 'e3', type: 'experiment', title: "Lab: Grover on 3 Qubits", duration: '35 min', completed: false },
        { id: 'q2', type: 'quiz', title: 'Module 3 Quiz', duration: '10 min', completed: false },
        { id: 'c2', type: 'challenge', title: 'Challenge: Optimize Oracle Depth', duration: '45 min', completed: false },
      ],
    },
    {
      id: 'm4', title: 'Module 4: Quantum Phase Estimation', completed: false, locked: false, progress: 0,
      items: [
        { id: 'l9', type: 'lesson', title: 'Phase Kickback Intuition', duration: '18 min', completed: false },
        { id: 'l10', type: 'lesson', title: 'Controlled Unitary Operations', duration: '22 min', completed: false },
        { id: 'e4', type: 'experiment', title: 'Lab: QPE Circuit', duration: '40 min', completed: false },
      ],
    },
    {
      id: 'm5', title: "Module 5: Shor's Algorithm", completed: false, locked: true, progress: 0,
      items: [
        { id: 'l11', type: 'lesson', title: 'Period Finding', duration: '25 min', completed: false },
        { id: 'l12', type: 'lesson', title: 'Modular Exponentiation', duration: '30 min', completed: false },
      ],
    },
  ];

  return {
    dashboard: {
      level: 7, xp: 4250, nextLevelXp: 5000, streak: 12,
      currentCourse: {
        title: 'Quantum Algorithms Masterclass',
        module: "Module 3: Grover's Search",
        lesson: 'Lesson 5: Diffusion Operator',
        progress: 62, instructor: 'Dr. Priya Nair',
      },
      todayGoals: [
        { id: 'g1', type: 'lesson', label: 'Complete Diffusion Operator lesson', done: false },
        { id: 'g2', type: 'challenge', label: 'Solve: Phase Kickback challenge', done: false },
        { id: 'g3', type: 'simulation', label: 'Run Bell State experiment', done: true },
        { id: 'g4', type: 'quiz', label: 'Module 2 knowledge quiz (5 Qs)', done: true },
      ],
      stats: {
        courses: { enrolled: 3, completed: 1 },
        lessons: { total: 87, completed: 54 },
        challenges: { attempted: 18, solved: 13 },
        quizScore: 84, learningHours: 38.5,
      },
      recentActivity: [
        { id: 'a1', type: 'lesson', label: 'Completed: Hadamard Gate & Superposition', time: '2h ago' },
        { id: 'a2', type: 'simulation', label: 'Ran simulation: 3-qubit GHZ state', time: '3h ago' },
        { id: 'a3', type: 'circuit', label: 'Saved circuit: CNOT Entanglement Demo', time: 'Yesterday' },
        { id: 'a4', type: 'ai', label: 'AI explained: Phase estimation theory', time: 'Yesterday' },
        { id: 'a5', type: 'lesson', label: 'Completed: Quantum Interference', time: '2d ago' },
      ],
      recommendation: {
        title: 'Quantum Phase Estimation',
        reason: 'Builds on your Fourier Transform knowledge. You struggled with phase concepts — this will strengthen that.',
        module: 'Module 4 · Lesson 1',
        difficulty: 'Intermediate', duration: '35 min',
      },
      quickStats: { rank: 42, badges: 7, daysActive: 24, xpThisWeek: 850 },
    },
    courses,
    learningPaths,
    curriculum,
    progress: {
      overallProgress: 62,
      coursesCompleted: 1,
      totalCourses: courses.length,
      lessonsCompleted: 54,
      totalLessons: 87,
      challengesSolved: 13,
      challengesAttempted: 18,
      quizAvgScore: 84,
      learningHours: 38.5,
      currentStreak: 12,
      longestStreak: 18,
      weeklyActivity: [2, 4, 3, 5, 4, 6, 3],
      milestones: [
        { title: 'Superposition & Qubit Measurement', status: 'Completed', date: 'Aug 2026', xp: 200 },
        { title: 'Quantum Teleportation Protocol', status: 'Completed', date: 'Aug 2026', xp: 350 },
        { title: "Grover's Oracles", status: 'In Progress', date: 'Expected Oct 2026', xp: 500 },
        { title: 'Variational Quantum Eigensolver', status: 'Upcoming', date: 'Expected Nov 2026', xp: 800 },
      ],
      circuitsBuilt: 18,
      simulationsRun: 84,
      aiInteractions: 42,
    },
    achievements: {
      xp: 4250, level: 7, rank: 42, streak: 12,
      badges: [
        { id: 'b1', title: 'Qubit Pioneer', desc: 'Completed your first quantum lesson', icon: '⚛️', earned: true, xp: 50, date: 'Aug 12', rarity: 'Common' },
        { id: 'b2', title: 'Bell State Builder', desc: 'Successfully created a Bell entangled pair', icon: '🔔', earned: true, xp: 150, date: 'Aug 18', rarity: 'Uncommon' },
        { id: 'b3', title: 'Grover Explorer', desc: "Completed Grover's search module", icon: '🔍', earned: true, xp: 250, date: 'Sep 2', rarity: 'Rare' },
        { id: 'b4', title: 'Circuit Architect', desc: 'Built 10+ unique circuits in playground', icon: '🏗️', earned: true, xp: 200, date: 'Sep 5', rarity: 'Uncommon' },
        { id: 'b5', title: '7-Day Streak', desc: 'Learned for 7 consecutive days', icon: '🔥', earned: true, xp: 100, date: 'Sep 8', rarity: 'Common' },
        { id: 'b6', title: 'Quiz Ace', desc: 'Scored 100% on 3 consecutive quizzes', icon: '🎯', earned: true, xp: 300, date: 'Sep 10', rarity: 'Rare' },
        { id: 'b7', title: 'Shor Specialist', desc: "Master Shor's factoring algorithm", icon: '🔐', earned: false, xp: 500, rarity: 'Epic' },
        { id: 'b8', title: 'QML Trailblazer', desc: 'Complete the Quantum ML track', icon: '🤖', earned: false, xp: 600, rarity: 'Epic' },
        { id: 'b9', title: 'Grand Quantum Master', desc: 'Complete all courses with 90%+ quiz avg', icon: '🏆', earned: false, xp: 2000, rarity: 'Legendary' },
      ],
      milestones: [
        { xp: 0, label: 'Novice', icon: '🌱', reached: true },
        { xp: 500, label: 'Apprentice', icon: '⚗️', reached: true },
        { xp: 1000, label: 'Explorer', icon: '🔭', reached: true },
        { xp: 2000, label: 'Practitioner', icon: '⚛️', reached: true },
        { xp: 3500, label: 'Specialist', icon: '🧬', reached: false },
        { xp: 5000, label: 'Expert', icon: '🌌', reached: false },
        { xp: 8000, label: 'Master', icon: '🏆', reached: false },
      ],
      leaderboard: [
        { rank: 1, name: 'Neha Gupta', xp: 8420, badge: '🏆' },
        { rank: 2, name: 'Rohan Verma', xp: 7890, badge: '🥈' },
        { rank: 3, name: 'Aisha Khan', xp: 7230, badge: '🥉' },
        { rank: 4, name: 'Vijay Patil', xp: 6540 },
        { rank: 5, name: 'Priya Reddy', xp: 5980 },
        { rank: 42, name: firstName, xp: 4250, isYou: true },
      ],
    },
    profile: {
      bio: 'Quantum computing enthusiast with a background in physics. Passionate about quantum algorithms and their applications in cryptography and machine learning.',
      institution: 'IIT Bombay',
      joined: 'August 2026',
      stats: { xp: 4250, lessons: 54, streak: 12, challenges: 13, hours: 38.5, rank: 42 },
      enrolledCourses: courses.filter(c => c.enrolled).map(c => ({ title: c.title, progress: c.progress, modules: c.modules })),
      certificates: [{ title: 'Quantum Fundamentals', date: 'Aug 2026', icon: '🎓' }],
    },
  };
};

// ─── INSTRUCTOR ───────────────────────────────────────────────────────────────
const generateDummyInstructorData = (name = 'Instructor') => {
  const students = [
    {
      id: 's1', name: 'Arjun Sharma', email: 'arjun@iit.ac.in', avatar: 'AS',
      enrolledCourse: 'Quantum Fundamentals', courseId: 'ic1',
      progress: 62, quizAvg: 84, challengeAvg: 78, lastActive: '2h ago', status: 'Active',
      timeSpent: '24h 30m', aiUsage: 12, lessonsCompleted: 14, totalLessons: 24,
      moduleProgress: [
        { module: 'Quantum Fundamentals', progress: 100, score: 88 },
        { module: 'Quantum Gates & Circuits', progress: 100, score: 92 },
        { module: "Grover's Search", progress: 40, score: 76 },
        { module: 'Phase Estimation', progress: 0, score: null },
      ],
      quizScores: [88, 92, 76, 85, 79],
      challengeScores: [80, 75, 90, 70],
      strongConcepts: ['Superposition', 'Entanglement', 'Hadamard Gate'],
      weakConcepts: ['Phase Kickback', 'Amplitude Amplification'],
      recentActivity: [
        { type: 'lesson', label: 'Completed: Diffusion Operator', time: '2h ago' },
        { type: 'quiz', label: 'Quiz: Grover Module — 76%', time: '1d ago' },
        { type: 'challenge', label: 'Challenge: Bell State — 80%', time: '2d ago' },
      ],
    },
    {
      id: 's2', name: 'Priya Mehta', email: 'priya@iit.ac.in', avatar: 'PM',
      enrolledCourse: 'Quantum Algorithms', courseId: 'ic2',
      progress: 91, quizAvg: 96, challengeAvg: 94, lastActive: '1d ago', status: 'Active',
      timeSpent: '41h 15m', aiUsage: 5, lessonsCompleted: 34, totalLessons: 38,
      moduleProgress: [
        { module: 'Quantum Fundamentals', progress: 100, score: 98 },
        { module: 'Quantum Gates & Circuits', progress: 100, score: 95 },
        { module: "Grover's Search", progress: 100, score: 96 },
        { module: 'Phase Estimation', progress: 80, score: 94 },
      ],
      quizScores: [98, 95, 96, 94, 97],
      challengeScores: [95, 92, 96, 93],
      strongConcepts: ['All Topics', 'Algorithm Design', 'Circuit Optimization'],
      weakConcepts: [],
      recentActivity: [
        { type: 'lesson', label: 'Completed: QPE Circuit', time: '1d ago' },
        { type: 'quiz', label: 'Quiz: Phase Estimation — 94%', time: '2d ago' },
      ],
    },
    {
      id: 's3', name: 'Rohan Kumar', email: 'rohan@iit.ac.in', avatar: 'RK',
      enrolledCourse: 'Quantum Fundamentals', courseId: 'ic1',
      progress: 34, quizAvg: 72, challengeAvg: 65, lastActive: '3d ago', status: 'At Risk',
      timeSpent: '12h 00m', aiUsage: 28, lessonsCompleted: 8, totalLessons: 24,
      moduleProgress: [
        { module: 'Quantum Fundamentals', progress: 100, score: 72 },
        { module: 'Quantum Gates & Circuits', progress: 50, score: 68 },
        { module: "Grover's Search", progress: 0, score: null },
        { module: 'Phase Estimation', progress: 0, score: null },
      ],
      quizScores: [72, 68, 70, 75, 74],
      challengeScores: [65, 60, 70],
      strongConcepts: ['Basic Qubit Concept'],
      weakConcepts: ['Gate Operations', 'Circuit Design', 'Superposition Math', 'Measurement'],
      recentActivity: [
        { type: 'lesson', label: 'Started: CNOT & Entanglement', time: '3d ago' },
        { type: 'ai', label: 'AI Help: Hadamard Gate explanation', time: '3d ago' },
      ],
    },
    {
      id: 's4', name: 'Sneha Patel', email: 'sneha@iit.ac.in', avatar: 'SP',
      enrolledCourse: 'Quantum Algorithms', courseId: 'ic2',
      progress: 78, quizAvg: 88, challengeAvg: 85, lastActive: '5h ago', status: 'Active',
      timeSpent: '32h 45m', aiUsage: 8, lessonsCompleted: 29, totalLessons: 38,
      moduleProgress: [
        { module: 'Quantum Fundamentals', progress: 100, score: 90 },
        { module: 'Quantum Gates & Circuits', progress: 100, score: 88 },
        { module: "Grover's Search", progress: 90, score: 86 },
        { module: 'Phase Estimation', progress: 30, score: 88 },
      ],
      quizScores: [90, 88, 86, 88, 88],
      challengeScores: [85, 88, 82, 85],
      strongConcepts: ['Gate Operations', 'Oracle Design', 'Entanglement'],
      weakConcepts: ['QPE Math', 'Controlled Unitaries'],
      recentActivity: [
        { type: 'lesson', label: 'Completed: Controlled Unitary Ops', time: '5h ago' },
        { type: 'challenge', label: 'Challenge: Oracle Optimization — 82%', time: '1d ago' },
      ],
    },
    {
      id: 's5', name: 'Vikram Singh', email: 'vikram@iit.ac.in', avatar: 'VS',
      enrolledCourse: 'Quantum Fundamentals', courseId: 'ic1',
      progress: 100, quizAvg: 94, challengeAvg: 96, lastActive: '2d ago', status: 'Completed',
      timeSpent: '48h 10m', aiUsage: 3, lessonsCompleted: 24, totalLessons: 24,
      moduleProgress: [
        { module: 'Quantum Fundamentals', progress: 100, score: 95 },
        { module: 'Quantum Gates & Circuits', progress: 100, score: 93 },
        { module: "Grover's Search", progress: 100, score: 96 },
        { module: 'Phase Estimation', progress: 100, score: 92 },
      ],
      quizScores: [95, 93, 96, 92, 94],
      challengeScores: [96, 95, 98, 95],
      strongConcepts: ['All Topics', 'Error Analysis', 'Optimization'],
      weakConcepts: [],
      recentActivity: [
        { type: 'lesson', label: 'Completed all modules!', time: '2d ago' },
        { type: 'challenge', label: 'Challenge: Final Project — 98%', time: '2d ago' },
      ],
    },
    {
      id: 's6', name: 'Anjali Rao', email: 'anjali@iit.ac.in', avatar: 'AR',
      enrolledCourse: 'Quantum Fundamentals', courseId: 'ic1',
      progress: 15, quizAvg: 60, challengeAvg: 55, lastActive: '7d ago', status: 'At Risk',
      timeSpent: '6h 20m', aiUsage: 35, lessonsCompleted: 4, totalLessons: 24,
      moduleProgress: [
        { module: 'Quantum Fundamentals', progress: 60, score: 60 },
        { module: 'Quantum Gates & Circuits', progress: 0, score: null },
        { module: "Grover's Search", progress: 0, score: null },
        { module: 'Phase Estimation', progress: 0, score: null },
      ],
      quizScores: [60, 62, 58],
      challengeScores: [55, 60],
      strongConcepts: ['Classical Bits Analogy'],
      weakConcepts: ['Qubit Measurement', 'Complex Amplitudes', 'Bloch Sphere', 'Gate Matrix Math'],
      recentActivity: [
        { type: 'ai', label: 'AI Help: What is superposition?', time: '7d ago' },
        { type: 'lesson', label: 'Started: What is a Qubit?', time: '7d ago' },
      ],
    },
    {
      id: 's7', name: 'Karan Malhotra', email: 'karan@iit.ac.in', avatar: 'KM',
      enrolledCourse: 'Quantum Algorithms', courseId: 'ic2',
      progress: 55, quizAvg: 80, challengeAvg: 74, lastActive: '12h ago', status: 'Active',
      timeSpent: '22h 00m', aiUsage: 18, lessonsCompleted: 21, totalLessons: 38,
      moduleProgress: [
        { module: 'Quantum Fundamentals', progress: 100, score: 82 },
        { module: 'Quantum Gates & Circuits', progress: 100, score: 79 },
        { module: "Grover's Search", progress: 60, score: 78 },
        { module: 'Phase Estimation', progress: 0, score: null },
      ],
      quizScores: [82, 79, 78, 80],
      challengeScores: [74, 70, 78],
      strongConcepts: ['Circuit Building', 'Entanglement'],
      weakConcepts: ['Oracle Complexity', 'Amplitude Analysis'],
      recentActivity: [
        { type: 'lesson', label: 'Completed: Amplitude Amplification', time: '12h ago' },
        { type: 'quiz', label: 'Quiz: Grover Module — 78%', time: '2d ago' },
      ],
    },
    {
      id: 's8', name: 'Deepa Nair', email: 'deepa@iit.ac.in', avatar: 'DN',
      enrolledCourse: 'Quantum Algorithms', courseId: 'ic2',
      progress: 88, quizAvg: 91, challengeAvg: 89, lastActive: '3h ago', status: 'Active',
      timeSpent: '38h 30m', aiUsage: 7, lessonsCompleted: 33, totalLessons: 38,
      moduleProgress: [
        { module: 'Quantum Fundamentals', progress: 100, score: 93 },
        { module: 'Quantum Gates & Circuits', progress: 100, score: 90 },
        { module: "Grover's Search", progress: 100, score: 92 },
        { module: 'Phase Estimation', progress: 60, score: 88 },
      ],
      quizScores: [93, 90, 92, 88, 92],
      challengeScores: [89, 91, 88, 88],
      strongConcepts: ['Algorithm Design', 'Gate Optimization', 'Grover Oracle'],
      weakConcepts: ['Phase Estimation Setup'],
      recentActivity: [
        { type: 'lesson', label: 'Completed: QPE Theory', time: '3h ago' },
        { type: 'challenge', label: 'Challenge: Grover 4-qubit — 91%', time: '1d ago' },
      ],
    },
  ];

  const courses = [
    {
      id: 'ic1',
      title: 'Quantum Fundamentals: From Bits to Qubits',
      description: 'A comprehensive introduction to quantum mechanics principles and their application in computing. Students learn superposition, entanglement, and quantum measurement through interactive experiments.',
      thumbnail: null,
      difficulty: 'Beginner',
      category: 'Foundations',
      duration: '8 hrs',
      status: 'Published',
      enrolledStudents: 98,
      avgProgress: 71,
      avgScore: 84.2,
      completionRate: 68,
      publishedLessons: 24,
      totalLessons: 24,
      objectives: [
        'Understand the quantum bit (qubit) and its properties',
        'Master superposition, entanglement, and measurement',
        'Build basic quantum circuits using gates',
        'Run quantum experiments in the simulator',
      ],
      prerequisites: ['Basic linear algebra', 'Complex numbers', 'Classical computing fundamentals'],
      lastUpdated: '2 days ago',
      createdAt: 'Aug 1, 2026',
      rating: 4.9,
      pendingGrades: 12,
      modules: [
        {
          id: 'mod1', title: 'Module 1: Quantum Fundamentals', status: 'Published',
          description: 'Core quantum mechanics concepts essential for computing',
          objectives: ['Understand qubits', 'Learn superposition', 'Grasp measurement basics'],
          order: 1, lessonsCount: 4, completionRule: 'All lessons + quiz',
          lessons: [
            { id: 'les1', title: 'What is a Qubit?', type: 'lesson', duration: '12 min', status: 'Published', order: 1 },
            { id: 'les2', title: 'Superposition & Bloch Sphere', type: 'lesson', duration: '18 min', status: 'Published', order: 2 },
            { id: 'les3', title: 'Lab: Visualize a Qubit State', type: 'experiment', duration: '20 min', status: 'Published', order: 3 },
            { id: 'les4', title: 'Module 1 Quiz', type: 'quiz', duration: '8 min', status: 'Published', order: 4 },
          ],
        },
        {
          id: 'mod2', title: 'Module 2: Quantum Gates & Circuits', status: 'Published',
          description: 'Building blocks of quantum computation',
          objectives: ['Understand single-qubit gates', 'Learn multi-qubit operations', 'Build basic circuits'],
          order: 2, lessonsCount: 5, completionRule: 'All lessons + challenge',
          lessons: [
            { id: 'les5', title: 'Pauli Gates: X, Y, Z', type: 'lesson', duration: '15 min', status: 'Published', order: 1 },
            { id: 'les6', title: 'Hadamard & Phase Gates', type: 'lesson', duration: '20 min', status: 'Published', order: 2 },
            { id: 'les7', title: 'CNOT & Entanglement', type: 'lesson', duration: '22 min', status: 'Published', order: 3 },
            { id: 'les8', title: 'Lab: Build a Bell State', type: 'experiment', duration: '25 min', status: 'Published', order: 4 },
            { id: 'les9', title: 'Challenge: Multi-qubit Circuit', type: 'challenge', duration: '30 min', status: 'Published', order: 5 },
          ],
        },
        {
          id: 'mod3', title: "Module 3: Grover's Search Algorithm", status: 'Published',
          description: 'Quadratic speedup in unstructured search problems',
          objectives: ["Understand oracle construction", 'Implement amplitude amplification', 'Analyze Grover complexity'],
          order: 3, lessonsCount: 6, completionRule: 'All lessons + quiz + challenge',
          lessons: [
            { id: 'les10', title: 'Oracle Construction', type: 'lesson', duration: '20 min', status: 'Published', order: 1 },
            { id: 'les11', title: 'Amplitude Amplification', type: 'lesson', duration: '25 min', status: 'Published', order: 2 },
            { id: 'les12', title: 'Diffusion Operator', type: 'lesson', duration: '20 min', status: 'Published', order: 3 },
            { id: 'les13', title: "Lab: Grover on 3 Qubits", type: 'experiment', duration: '35 min', status: 'Published', order: 4 },
            { id: 'les14', title: 'Module 3 Quiz', type: 'quiz', duration: '10 min', status: 'Published', order: 5 },
            { id: 'les15', title: 'Challenge: Optimize Oracle Depth', type: 'challenge', duration: '45 min', status: 'Published', order: 6 },
          ],
        },
        {
          id: 'mod4', title: 'Module 4: Quantum Phase Estimation', status: 'Draft',
          description: 'Core subroutine for many quantum algorithms',
          objectives: ['Understand phase kickback', 'Implement QPE circuit', 'Apply to eigenvalue problems'],
          order: 4, lessonsCount: 3, completionRule: 'All lessons',
          lessons: [
            { id: 'les16', title: 'Phase Kickback Intuition', type: 'lesson', duration: '18 min', status: 'Draft', order: 1 },
            { id: 'les17', title: 'Controlled Unitary Operations', type: 'lesson', duration: '22 min', status: 'Draft', order: 2 },
            { id: 'les18', title: 'Lab: QPE Circuit', type: 'experiment', duration: '40 min', status: 'Draft', order: 3 },
          ],
        },
      ],
    },
    {
      id: 'ic2',
      title: 'Advanced Quantum Algorithms: Shor, Grover & QPE',
      description: "Deep dive into the three canonical quantum algorithms that demonstrate quantum advantage. Includes working Qiskit implementations, complexity analysis, and real-hardware experiments on IBM Quantum.",
      thumbnail: null,
      difficulty: 'Advanced',
      category: 'Algorithms',
      duration: '14 hrs',
      status: 'Published',
      enrolledStudents: 44,
      avgProgress: 58,
      avgScore: 89.6,
      completionRate: 42,
      publishedLessons: 38,
      totalLessons: 42,
      objectives: [
        "Implement Shor's factoring algorithm",
        "Master Grover's search with quantum speedup analysis",
        'Build QPE for eigenvalue problems',
        'Run circuits on real IBM Quantum hardware',
      ],
      prerequisites: ['Quantum Fundamentals', 'Linear algebra (advanced)', 'Python programming', 'Basic Qiskit'],
      lastUpdated: '5 days ago',
      createdAt: 'Jul 15, 2026',
      rating: 4.7,
      pendingGrades: 6,
      modules: [
        {
          id: 'mod5', title: "Module 1: Shor's Algorithm", status: 'Published',
          description: 'Polynomial-time quantum factoring',
          objectives: ['Understand period finding', 'Implement QFT', 'Build full Shor circuit'],
          order: 1, lessonsCount: 5, completionRule: 'All lessons + challenge',
          lessons: [
            { id: 'les19', title: 'Period Finding & RSA', type: 'lesson', duration: '25 min', status: 'Published', order: 1 },
            { id: 'les20', title: 'Quantum Fourier Transform', type: 'lesson', duration: '30 min', status: 'Published', order: 2 },
            { id: 'les21', title: 'Modular Exponentiation', type: 'lesson', duration: '28 min', status: 'Published', order: 3 },
            { id: 'les22', title: "Lab: Shor's on 4 Qubits", type: 'experiment', duration: '50 min', status: 'Published', order: 4 },
            { id: 'les23', title: "Challenge: Factor N=15", type: 'challenge', duration: '60 min', status: 'Published', order: 5 },
          ],
        },
      ],
    },
    {
      id: 'ic3',
      title: 'Quantum Machine Learning Fundamentals',
      description: 'Explore variational quantum circuits, quantum kernels, and hybrid classical-quantum ML algorithms. Build quantum neural networks and understand quantum advantage in ML.',
      thumbnail: null,
      difficulty: 'Intermediate',
      category: 'QML',
      duration: '12 hrs',
      status: 'Draft',
      enrolledStudents: 0,
      avgProgress: 0,
      avgScore: 0,
      completionRate: 0,
      publishedLessons: 8,
      totalLessons: 32,
      objectives: [
        'Understand variational quantum circuits (VQC)',
        'Implement quantum kernel methods',
        'Build a quantum neural network',
        'Compare classical vs quantum ML performance',
      ],
      prerequisites: ['Quantum Fundamentals', 'Classical ML (scikit-learn)', 'Python', 'Calculus'],
      lastUpdated: '1 day ago',
      createdAt: 'Sep 1, 2026',
      rating: null,
      pendingGrades: 0,
      modules: [
        {
          id: 'mod6', title: 'Module 1: VQC Basics', status: 'Draft',
          description: 'Variational quantum circuit fundamentals',
          objectives: ['Parameterized circuits', 'Gradient-based optimization'],
          order: 1, lessonsCount: 4, completionRule: 'All lessons',
          lessons: [
            { id: 'les24', title: 'Parameterized Quantum Gates', type: 'lesson', duration: '20 min', status: 'Draft', order: 1 },
            { id: 'les25', title: 'Cost Functions in QML', type: 'lesson', duration: '22 min', status: 'Draft', order: 2 },
            { id: 'les26', title: 'Gradient Descent on Quantum Circuits', type: 'lesson', duration: '25 min', status: 'Draft', order: 3 },
            { id: 'les27', title: 'Lab: Train a VQC', type: 'experiment', duration: '40 min', status: 'Draft', order: 4 },
          ],
        },
      ],
    },
  ];

  const quizzes = [
    {
      id: 'qz1', title: 'Module 1 Fundamentals Quiz', courseId: 'ic1', moduleId: 'mod1',
      status: 'Published', questionCount: 5, timeLimit: 10, passScore: 70, attempts: 1,
      shuffle: true, difficulty: 'Beginner',
      questions: [
        {
          id: 'qq1', type: 'mcq', text: 'Which property allows a qubit to exist in multiple states simultaneously?',
          options: ['Entanglement', 'Superposition', 'Interference', 'Measurement'],
          correct: 1, explanation: 'Superposition allows a qubit to exist in |0⟩ and |1⟩ simultaneously until measured.',
          marks: 2, difficulty: 'Easy',
        },
        {
          id: 'qq2', type: 'mcq', text: 'What does the Hadamard gate do to a |0⟩ state?',
          options: ['Flips to |1⟩', 'Creates equal superposition of |0⟩ and |1⟩', 'Adds phase π', 'Entangles with another qubit'],
          correct: 1, explanation: 'H|0⟩ = (|0⟩ + |1⟩)/√2 — an equal superposition.',
          marks: 2, difficulty: 'Easy',
        },
        {
          id: 'qq3', type: 'mcq', text: 'What is the probability of measuring |1⟩ if a qubit is in state (3|0⟩ + 4|1⟩)/5?',
          options: ['3/5', '4/5', '9/25', '16/25'],
          correct: 3, explanation: 'Probability = |amplitude|² = (4/5)² = 16/25.',
          marks: 3, difficulty: 'Medium',
        },
      ],
    },
    {
      id: 'qz2', title: "Grover's Algorithm Assessment", courseId: 'ic1', moduleId: 'mod3',
      status: 'Published', questionCount: 6, timeLimit: 15, passScore: 75, attempts: 2,
      shuffle: false, difficulty: 'Intermediate',
      questions: [
        {
          id: 'qq4', type: 'mcq', text: "What is the optimal number of Grover iterations for N items?",
          options: ['N/2', '√N · π/4', 'log₂(N)', 'N²'],
          correct: 1, explanation: "The optimal number of iterations is approximately (π/4)√N.",
          marks: 3, difficulty: 'Medium',
        },
        {
          id: 'qq5', type: 'code', text: 'Write a 2-qubit Grover oracle that marks the state |11⟩.',
          starterCode: 'from qiskit import QuantumCircuit\n\ndef grover_oracle():\n    qc = QuantumCircuit(2)\n    # Your code here\n    return qc',
          solution: 'from qiskit import QuantumCircuit\n\ndef grover_oracle():\n    qc = QuantumCircuit(2)\n    qc.cz(0, 1)\n    return qc',
          marks: 5, difficulty: 'Hard',
        },
      ],
    },
  ];

  const challenges = [
    {
      id: 'ch1', title: 'Bell State Circuit Challenge', courseId: 'ic1', moduleId: 'mod2',
      status: 'Published', difficulty: 'Beginner', xp: 150,
      problemStatement: 'Create a quantum circuit that generates the Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2. Your circuit should start with two qubits in the |00⟩ state and produce a maximally entangled Bell state.',
      starterCode: 'from qiskit import QuantumCircuit\n\ndef bell_state_circuit():\n    qc = QuantumCircuit(2, 2)\n    # Your implementation here\n    return qc',
      expectedOutput: '{"00": 512, "11": 512}',
      circuitRequirements: 'Must use exactly 2 qubits. Circuit depth ≤ 3.',
      testCases: [
        { input: 'Initial state: |00⟩', expected: 'Statevector: [0.707, 0, 0, 0.707]', description: 'Bell state amplitudes' },
        { input: '1024 shots measurement', expected: '~50% |00⟩, ~50% |11⟩', description: 'Measurement distribution' },
      ],
      hints: [
        'Start by applying a Hadamard gate to the first qubit',
        'Use a CNOT gate with the first qubit as control',
      ],
      solution: 'from qiskit import QuantumCircuit\n\ndef bell_state_circuit():\n    qc = QuantumCircuit(2, 2)\n    qc.h(0)\n    qc.cx(0, 1)\n    qc.measure([0,1],[0,1])\n    return qc',
      autoEval: true, evalType: 'statevector', fidelityThreshold: 0.99,
      submissionCount: 78, successRate: 84,
    },
    {
      id: 'ch2', title: "Grover's Oracle Optimization", courseId: 'ic1', moduleId: 'mod3',
      status: 'Published', difficulty: 'Intermediate', xp: 350,
      problemStatement: "Implement an optimized Grover oracle for a 3-qubit system that marks the target state |101⟩. Your oracle must use minimum gate count (circuit depth ≤ 5) while maintaining correct phase kickback.",
      starterCode: 'from qiskit import QuantumCircuit\n\ndef grover_oracle_3qubit():\n    qc = QuantumCircuit(3)\n    # Mark state |101⟩\n    # Your optimized implementation here\n    return qc',
      expectedOutput: 'Phase flip on |101⟩ state only',
      circuitRequirements: '3 qubits, depth ≤ 5, uses Toffoli or equivalent',
      testCases: [
        { input: 'Apply to |000⟩', expected: 'No phase change', description: 'Non-target state' },
        { input: 'Apply to |101⟩', expected: 'Phase flip (-1 amplitude)', description: 'Target state marked' },
        { input: 'Apply to |111⟩', expected: 'No phase change', description: 'Non-target state' },
      ],
      hints: [
        'Apply X gates to flip the non-target bits before and after',
        'Use CCZ (Toffoli with Z) to mark the target',
        'Remember to uncompute the X gates',
      ],
      solution: 'from qiskit import QuantumCircuit\n\ndef grover_oracle_3qubit():\n    qc = QuantumCircuit(3)\n    qc.x(1)  # Flip qubit 1 (|101⟩ has 0 in middle)\n    qc.ccx(0,1,2) # Toffoli\n    qc.x(1)  # Uncompute\n    return qc',
      autoEval: true, evalType: 'unitary', fidelityThreshold: 0.95,
      submissionCount: 45, successRate: 62,
    },
  ];

  const grading = [
    { id: 'sub1', student: 'Arjun Sharma', studentId: 's1', assignment: "Grover's Oracle Implementation", course: 'Quantum Algorithms', submittedAt: '2h ago', status: 'PENDING', type: 'Challenge' },
    { id: 'sub2', student: 'Rohan Kumar', studentId: 's3', assignment: 'Bell State Circuit', course: 'Quantum Fundamentals', submittedAt: '5h ago', status: 'PENDING', type: 'Lab' },
    { id: 'sub3', student: 'Sneha Patel', studentId: 's4', assignment: 'Module 3 Written Quiz', course: 'Quantum Algorithms', submittedAt: '1d ago', status: 'PENDING', type: 'Quiz' },
    { id: 'sub4', student: 'Vikram Singh', studentId: 's5', assignment: 'Shor Circuit Final', course: 'Quantum Algorithms', submittedAt: '2d ago', status: 'GRADED', score: 95, type: 'Challenge' },
    { id: 'sub5', student: 'Anjali Rao', studentId: 's6', assignment: 'Superposition Lab Report', course: 'Quantum Fundamentals', submittedAt: '3d ago', status: 'GRADED', score: 68, type: 'Lab' },
  ];

  const analytics = {
    summary: {
      totalStudents: 142,
      activeStudents: 118,
      totalCourses: 3,
      publishedLessons: 62,
      avgScore: 86.2,
      completionRate: 67,
      enrollmentThisMonth: 28,
      newCoursesThisMonth: 1,
    },
    weeklyEngagement: [
      { day: 'Mon', students: 82, lessons: 145 },
      { day: 'Tue', students: 76, lessons: 132 },
      { day: 'Wed', students: 90, lessons: 168 },
      { day: 'Thu', students: 88, lessons: 159 },
      { day: 'Fri', students: 91, lessons: 172 },
      { day: 'Sat', students: 84, lessons: 148 },
      { day: 'Sun', students: 79, lessons: 128 },
    ],
    enrollmentTrend: [
      { month: 'Apr', count: 45 },
      { month: 'May', count: 62 },
      { month: 'Jun', count: 78 },
      { month: 'Jul', count: 95 },
      { month: 'Aug', count: 118 },
      { month: 'Sep', count: 142 },
    ],
    quizScoreDistribution: [
      { range: '0-50', count: 5 },
      { range: '51-65', count: 12 },
      { range: '66-75', count: 28 },
      { range: '76-85', count: 38 },
      { range: '86-100', count: 59 },
    ],
    completionByModule: [
      { module: 'Quantum Fundamentals', completion: 94 },
      { module: 'Quantum Gates & Circuits', completion: 87 },
      { module: "Grover's Search", completion: 72 },
      { module: 'Phase Estimation', completion: 48 },
      { module: "Shor's Algorithm", completion: 35 },
    ],
    lessonDropoff: [
      { lesson: 'What is a Qubit?', dropoff: 5 },
      { lesson: 'Superposition & Bloch Sphere', dropoff: 8 },
      { lesson: 'CNOT & Entanglement', dropoff: 12 },
      { lesson: 'Quantum Interference', dropoff: 23 },
      { lesson: 'Phase Estimation Theory', dropoff: 31 },
      { lesson: 'Shor Algorithm Intro', dropoff: 38 },
    ],
    challengeSuccessRate: [
      { challenge: 'Bell State Circuit', successRate: 84 },
      { challenge: 'Multi-qubit Circuit', successRate: 76 },
      { challenge: 'Oracle Optimization', successRate: 62 },
      { challenge: 'QPE Implementation', successRate: 48 },
      { challenge: "Factor N=15 (Shor)", successRate: 35 },
    ],
    conceptPerformance: [
      { concept: 'Superposition', avgScore: 91, students: 142 },
      { concept: 'Entanglement', avgScore: 87, students: 138 },
      { concept: 'Hadamard Gate', avgScore: 89, students: 142 },
      { concept: 'CNOT Gate', avgScore: 84, students: 135 },
      { concept: 'Quantum Interference', avgScore: 76, students: 120 },
      { concept: 'Oracle Design', avgScore: 71, students: 98 },
      { concept: 'Amplitude Amplification', avgScore: 68, students: 90 },
      { concept: 'Phase Kickback', avgScore: 64, students: 75 },
      { concept: 'QPE Circuit', avgScore: 61, students: 58 },
      { concept: "Shor's Algorithm", avgScore: 55, students: 40 },
    ],
    topStudents: students.filter(s => s.quizAvg >= 88).slice(0, 3),
    atRiskStudents: students.filter(s => s.status === 'At Risk'),
    completionRate: 67,
    dropoffPoints: [
      { lesson: 'Quantum Interference', dropoff: '23%' },
      { lesson: 'Phase Estimation Theory', dropoff: '18%' },
    ],
  };

  const contentManagement = [
    { id: 'cm1', type: 'Course', title: 'Quantum Fundamentals', status: 'Published', lastModified: '2 days ago', owner: name },
    { id: 'cm2', type: 'Course', title: 'Advanced Quantum Algorithms', status: 'Published', lastModified: '5 days ago', owner: name },
    { id: 'cm3', type: 'Course', title: 'Quantum Machine Learning', status: 'Draft', lastModified: '1 day ago', owner: name },
    { id: 'cm4', type: 'Module', title: 'Module 4: Quantum Phase Estimation', status: 'Draft', lastModified: '1 day ago', owner: name },
    { id: 'cm5', type: 'Lesson', title: 'Phase Kickback Intuition', status: 'Draft', lastModified: '1 day ago', owner: name },
    { id: 'cm6', type: 'Quiz', title: 'Module 1 Fundamentals Quiz', status: 'Published', lastModified: '5 days ago', owner: name },
    { id: 'cm7', type: 'Quiz', title: "Grover's Algorithm Assessment", status: 'Published', lastModified: '3 days ago', owner: name },
    { id: 'cm8', type: 'Challenge', title: 'Bell State Circuit Challenge', status: 'Published', lastModified: '4 days ago', owner: name },
    { id: 'cm9', type: 'Challenge', title: "Grover's Oracle Optimization", status: 'Published', lastModified: '3 days ago', owner: name },
    { id: 'cm10', type: 'Lesson', title: 'Variational Quantum Circuits Intro', status: 'Review', lastModified: 'Just now', owner: name },
    { id: 'cm11', type: 'Experiment', title: 'Lab: VQC Training Simulation', status: 'Draft', lastModified: '2 hours ago', owner: name },
    { id: 'cm12', type: 'Module', title: 'Module 1: VQC Basics', status: 'Draft', lastModified: '1 day ago', owner: name },
  ];

  const profile = {
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@quantum.edu`,
    bio: 'Quantum computing researcher and educator with 8+ years of experience. Specializing in quantum algorithms, error correction, and quantum ML. Former IBM Quantum team member.',
    institution: 'IIT Bombay',
    department: 'Computer Science & Engineering',
    title: 'Associate Professor',
    joined: 'January 2025',
    teachingPreferences: {
      defaultDifficulty: 'Intermediate',
      autoGrading: true,
      simulationStrictness: 'Standard',
      maxSimShots: 1024,
      lateSubmissionPolicy: 'Accepted with 10% penalty',
    },
    notifications: {
      newSubmission: true,
      atRiskStudent: true,
      courseCompletion: false,
      weeklyReport: true,
    },
    stats: {
      totalStudents: 142,
      totalCourses: 3,
      avgRating: 4.8,
      publishedLessons: 62,
    },
  };

  const recentActivity = [
    { id: 'ra1', type: 'submission', student: 'Arjun Sharma', action: "submitted Grover's Oracle challenge", time: '2h ago', courseId: 'ic1' },
    { id: 'ra2', type: 'completion', student: 'Vikram Singh', action: 'completed the course with 94% average', time: '2d ago', courseId: 'ic1' },
    { id: 'ra3', type: 'enrollment', student: 'Karan Malhotra', action: 'enrolled in Advanced Quantum Algorithms', time: '3d ago', courseId: 'ic2' },
    { id: 'ra4', type: 'atrisk', student: 'Anjali Rao', action: 'has been inactive for 7 days', time: '7d ago', courseId: 'ic1' },
    { id: 'ra5', type: 'quiz', student: 'Sneha Patel', action: 'scored 88% on Module 3 Quiz', time: '1d ago', courseId: 'ic2' },
    { id: 'ra6', type: 'submission', student: 'Deepa Nair', action: 'submitted QPE circuit challenge', time: '3h ago', courseId: 'ic2' },
  ];

  const alerts = [
    { id: 'al1', type: 'warning', title: '2 At-Risk Students', message: 'Rohan Kumar and Anjali Rao have low scores and reduced activity. Consider reaching out.', action: 'View Students' },
    { id: 'al2', type: 'info', title: '3 Pending Submissions', message: 'You have 3 submissions awaiting grading in Quantum Fundamentals.', action: 'Grade Now' },
    { id: 'al3', type: 'success', title: 'Module 4 Ready to Publish', message: 'Phase Estimation module is drafted and ready for review and publishing.', action: 'Review Module' },
    { id: 'al4', type: 'warning', title: 'High Drop-off: Phase Estimation', message: '31% of students drop off at the Phase Estimation Theory lesson. Consider adding more examples.', action: 'Edit Lesson' },
  ];

  return {
    overview: {
      assignedCourses: courses.length,
      totalCourses: courses.length,
      totalStudents: 142,
      activeStudents: 118,
      pendingSubmissions: 3,
      avgCourseCompletion: 67,
      courseRating: 4.8,
      publishedLessons: 62,
      avgScore: 86.2,
      completionRate: 67,
      recentActivity,
      alerts,
    },
    courses,
    students,
    quizzes,
    challenges,
    grading,
    analytics,
    contentManagement,
    profile,
  };
};


const prisma = new PrismaClient();

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
};

async function seed() {
  console.log('🌱 Starting Quantum Platform Database Seeding...');

  const defaultUsers = [
    {
      name: 'Quantum Administrator',
      email: 'admin@quantum.platform',
      password: 'AdminQuantum@2025!',
      role: 'ADMIN',
    },
    {
      name: 'Dr. Eleanor Vance',
      email: 'instructor@quantum.platform',
      password: 'Instructor@2025!',
      role: 'INSTRUCTOR',
    },
    {
      name: 'Kai Chen',
      email: 'learner@quantum.platform',
      password: 'Learner@2025!',
      role: 'LEARNER',
    },
  ];

  const createdUsers = {};

  for (const userDef of defaultUsers) {
    let existing = await prisma.user.findUnique({
      where: { email: userDef.email },
    });

    const passwordHash = await argon2.hash(userDef.password, ARGON2_OPTIONS);

    if (!existing) {
      existing = await prisma.user.create({
        data: {
          name: userDef.name,
          email: userDef.email,
          passwordHash,
          role: userDef.role,
          isEmailVerified: true,
        },
      });
      console.log(`✅ Created ${userDef.role}: ${userDef.email} (Password: ${userDef.password})`);
    } else {
      existing = await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          role: userDef.role,
          isEmailVerified: true,
        },
      });
      console.log(`🔄 Updated ${userDef.role}: ${userDef.email} (Password: ${userDef.password})`);
    }
    createdUsers[userDef.role] = existing;
  }

  // Seed LMS Data
  console.log('📚 Seeding LMS Data...');
  const instructor = createdUsers['INSTRUCTOR'];
  
  // Clean up existing to avoid duplicates in dev
  await prisma.course.deleteMany({ where: { instructorId: instructor.id } });

  const dummy = generateDummyInstructorData(instructor.name);
  const learner = createdUsers['LEARNER'];
  const dummyLearner = generateDummyLearnerData(learner.name);

  // Seed Learning Paths
  for (const path of dummyLearner.learningPaths) {
    await prisma.learningPath.create({
      data: {
        title: path.title,
        description: path.description,
        difficulty: path.difficulty,
        totalHours: path.totalHours,
        xp: path.progress || 0 // just mapping something
      }
    });
  }

  // Seed Badges
  for (const badge of dummyLearner.achievements.badges) {
    const createdBadge = await prisma.badge.create({
      data: {
        id: badge.id,
        title: badge.title,
        desc: badge.desc,
        icon: badge.icon,
        xp: badge.xp,
        rarity: badge.rarity
      }
    });
    if (badge.earned) {
      await prisma.userBadge.create({
        data: {
          userId: learner.id,
          badgeId: createdBadge.id
        }
      });
    }
  }

  // Learner Profile
  await prisma.learnerProfile.create({
    data: {
      userId: learner.id,
      bio: dummyLearner.profile.bio,
      institution: dummyLearner.profile.institution,
      level: dummyLearner.achievements.level,
      xp: dummyLearner.achievements.xp,
      rank: dummyLearner.achievements.rank,
      streak: dummyLearner.achievements.streak,
      longestStreak: dummyLearner.progress.longestStreak,
      learningHours: dummyLearner.progress.learningHours,
      certificates: dummyLearner.profile.certificates
    }
  });

  // Daily Goals
  for (const goal of dummyLearner.dashboard.todayGoals) {
    await prisma.dailyGoal.create({
      data: {
        userId: learner.id,
        type: goal.type,
        label: goal.label,
        done: goal.done,
        date: new Date().toISOString().slice(0, 10),
        xpEarned: goal.done ? 30 : 0
      }
    });
  }


  // 1. Create Courses, Modules, Lessons
  for (const c of dummy.courses) {
    const course = await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        difficulty: c.difficulty,
        category: c.category,
        duration: c.duration,
        status: c.status,
        enrolledStudents: c.enrolledStudents,
        avgProgress: c.avgProgress,
        avgScore: c.avgScore,
        completionRate: c.completionRate,
        publishedLessons: c.publishedLessons,
        totalLessons: c.totalLessons,
        objectives: c.objectives,
        prerequisites: c.prerequisites,
        rating: c.rating,
        instructorId: instructor.id
      }
    });

    if (c.modules) {
      for (const m of c.modules) {
        const module = await prisma.module.create({
          data: {
            title: m.title,
            description: m.description || '',
            objectives: m.objectives || [],
            completionRule: m.completionRule || 'All lessons',
            status: m.status,
            order: m.order,
            lessonsCount: m.lessonsCount,
            courseId: course.id
          }
        });

        if (m.lessons) {
          for (const l of m.lessons) {
            await prisma.lesson.create({
              data: {
                title: l.title,
                type: l.type,
                duration: l.duration,
                status: l.status,
                order: l.order,
                moduleId: module.id
              }
            });
          }
        }
      }
    }
  }

  // 2. Create Quizzes
  // For simplicity, we just attach quizzes to the first course if not specified
  const firstCourse = await prisma.course.findFirst({ where: { instructorId: instructor.id } });
  if (firstCourse) {
    for (const q of dummy.quizzes) {
      await prisma.quiz.create({
        data: {
          title: q.title,
          courseId: firstCourse.id, // using first course for seed mapping
          status: q.status,
          timeLimit: q.timeLimit,
          passScore: q.passScore,
          attempts: q.attempts,
          shuffle: q.shuffle,
          difficulty: q.difficulty,
          questionCount: q.questionCount,
          questions: q.questions
        }
      });
    }

    // 3. Create Challenges
    for (const ch of dummy.challenges) {
      await prisma.challenge.create({
        data: {
          title: ch.title,
          courseId: firstCourse.id,
          status: ch.status,
          difficulty: ch.difficulty,
          xp: ch.xp,
          problemStatement: ch.problemStatement,
          starterCode: ch.starterCode,
          expectedOutput: ch.expectedOutput,
          circuitRequirements: ch.circuitRequirements,
          testCases: ch.testCases,
          hints: ch.hints,
          solution: ch.solution,
          autoEval: ch.autoEval,
          evalType: ch.evalType,
          fidelityThreshold: ch.fidelityThreshold,
          submissionCount: ch.submissionCount,
          successRate: ch.successRate
        }
      });
    }
    
    // 4. Enroll Learner to the first course
    const learner = createdUsers['LEARNER'];
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: learner.id,
        courseId: firstCourse.id,
        progress: 62,
        status: 'Active',
        timeSpent: '24h 30m'
      }
    });
    
    // 5. Create some dummy submissions
    await prisma.submission.create({
      data: {
        userId: learner.id,
        assignmentId: 'dummy_challenge_id',
        courseId: firstCourse.id,
        type: 'Challenge',
        status: 'PENDING'
      }
    });
  }

  console.log('\n✨ Database seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
