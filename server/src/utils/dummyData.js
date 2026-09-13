/**
 * dummyData.js
 * Centralized dummy data generator for all roles.
 * All data is realistic, rich, and consistent.
 */

// ─── LEARNER ──────────────────────────────────────────────────────────────────
export const generateDummyLearnerData = (name = 'Learner') => {
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
      xp: 4250, level: 7, rank: 42, streak: 12, badges: 7,
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
export const generateDummyInstructorData = (name = 'Instructor') => {
  const students = [
    { id: 's1', name: 'Arjun Sharma', email: 'arjun@iit.ac.in', progress: 62, quizAvg: 84, lastActive: '2h ago', status: 'Active' },
    { id: 's2', name: 'Priya Mehta', email: 'priya@iit.ac.in', progress: 91, quizAvg: 96, lastActive: '1d ago', status: 'Active' },
    { id: 's3', name: 'Rohan Kumar', email: 'rohan@iit.ac.in', progress: 34, quizAvg: 72, lastActive: '3d ago', status: 'At Risk' },
    { id: 's4', name: 'Sneha Patel', email: 'sneha@iit.ac.in', progress: 78, quizAvg: 88, lastActive: '5h ago', status: 'Active' },
    { id: 's5', name: 'Vikram Singh', email: 'vikram@iit.ac.in', progress: 100, quizAvg: 94, lastActive: '2d ago', status: 'Completed' },
    { id: 's6', name: 'Anjali Rao', email: 'anjali@iit.ac.in', progress: 15, quizAvg: 60, lastActive: '7d ago', status: 'At Risk' },
  ];

  const grading = [
    { id: 'sub1', student: 'Arjun Sharma', assignment: "Grover's Oracle Implementation", course: 'Quantum Algorithms', submittedAt: '2h ago', status: 'PENDING', type: 'Challenge' },
    { id: 'sub2', student: 'Rohan Kumar', assignment: 'Bell State Circuit', course: 'Quantum Fundamentals', submittedAt: '5h ago', status: 'PENDING', type: 'Lab' },
    { id: 'sub3', student: 'Sneha Patel', assignment: 'Module 3 Written Quiz', course: 'Quantum Algorithms', submittedAt: '1d ago', status: 'PENDING', type: 'Quiz' },
    { id: 'sub4', student: 'Vikram Singh', assignment: 'Shor Circuit Final', course: 'Quantum Algorithms', submittedAt: '2d ago', status: 'GRADED', score: 95, type: 'Challenge' },
    { id: 'sub5', student: 'Anjali Rao', assignment: 'Superposition Lab Report', course: 'Quantum Fundamentals', submittedAt: '3d ago', status: 'GRADED', score: 68, type: 'Lab' },
  ];

  return {
    overview: {
      assignedCourses: 2,
      totalStudents: 142,
      pendingSubmissions: 18,
      avgCourseCompletion: 67,
      courseRating: 4.8,
    },
    courses: [
      {
        id: 'ic1', title: 'PHYS-401: Quantum Mechanics & Computing', students: 98, avgProgress: 71,
        lessons: 38, pendingGrades: 12, rating: 4.9, lastUpdated: '2 days ago',
      },
      {
        id: 'ic2', title: 'CS-550: Advanced Quantum Algorithms', students: 44, avgProgress: 58,
        lessons: 42, pendingGrades: 6, rating: 4.7, lastUpdated: '5 days ago',
      },
    ],
    students,
    grading,
    analytics: {
      weeklyEngagement: [82, 76, 90, 88, 91, 84, 79],
      quizScoreDistribution: [5, 12, 28, 38, 17],
      completionRate: 67,
      dropoffPoints: [
        { lesson: 'Quantum Interference', dropoff: '23%' },
        { lesson: 'Phase Estimation Theory', dropoff: '18%' },
      ],
      topStudents: students.filter(s => s.quizAvg >= 88).slice(0, 3),
      atRiskStudents: students.filter(s => s.status === 'At Risk'),
    },
  };
};

// ─── RESEARCHER ───────────────────────────────────────────────────────────────
export const generateDummyResearcherData = (name = 'Researcher') => {
  return {
    overview: {
      activeSimulations: 3,
      allocatedQubits: 64,
      hardwareTarget: 'IBM Quantum Eagle (127 qubits)',
      paperCount: 4,
      collaborators: 8,
      computeHoursUsed: 142,
      computeHoursTotal: 500,
    },
    simulations: [
      { id: 'sim1', name: 'VQE H2 Molecule Ground State', qubits: 4, backend: 'statevector_simulator', algorithm: 'VQE', status: 'RUNNING', progress: 73, runtime: '14m 32s', energy: '-1.136 Ha' },
      { id: 'sim2', name: 'Quantum Phase Estimation Test', qubits: 8, backend: 'ibm_eagle', algorithm: 'QPE', status: 'QUEUED', progress: 0, eta: '~25 min' },
      { id: 'sim3', name: 'Grover 6-Qubit Search', qubits: 6, backend: 'aer_simulator', algorithm: 'Grover', status: 'COMPLETED', progress: 100, runtime: '2m 15s', successProb: '94.8%' },
      { id: 'sim4', name: 'QAOA MaxCut Problem', qubits: 12, backend: 'aer_simulator', algorithm: 'QAOA', status: 'FAILED', progress: 45, error: 'Convergence not reached after 500 iterations' },
    ],
    hardware: {
      quota: { total: 500, used: 142, reserved: 80, available: 278, unit: 'QPU hours' },
      backends: [
        { name: 'IBM Quantum Eagle', qubits: 127, status: 'Available', queue: '~15 min', fidelity: '99.1%' },
        { name: 'IBM Quantum Falcon', qubits: 27, status: 'Available', queue: '~5 min', fidelity: '99.5%' },
        { name: 'IonQ Forte', qubits: 36, status: 'Maintenance', queue: null, fidelity: '99.9%' },
        { name: 'Aer Simulator (Local)', qubits: 32, status: 'Available', queue: 'Instant', fidelity: '100%' },
      ],
    },
    papers: [
      { id: 'p1', title: 'Variational Quantum Eigensolver for Molecular Binding Energies', authors: [name, 'Dr. A. Singh'], status: 'PUBLISHED', journal: 'Physical Review Quantum', date: 'Aug 2026', citations: 12 },
      { id: 'p2', title: 'Error Mitigation in 127-Qubit Superconducting Systems', authors: [name, 'Prof. R. Mehta', 'Dr. K. Iyer'], status: 'UNDER_REVIEW', journal: 'Nature Quantum Information', date: 'Sep 2026', citations: 0 },
      { id: 'p3', title: 'Quantum Advantage in Optimization Problems: A Comparative Study', authors: [name], status: 'PREPRINT', journal: 'arXiv:2026.12345', date: 'Sep 2026', citations: 3 },
      { id: 'p4', title: 'Noise-Resilient VQE with Clifford Data Regression', authors: [name, 'Dr. S. Varma'], status: 'DRAFT', journal: null, date: null, citations: 0 },
    ],
  };
};
