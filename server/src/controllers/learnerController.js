import prisma from '../config/db.js';

export const getLearnerDashboard = async (req, res) => {
  try {
    const { id, name, email, role } = req.user;

    // ── Parallel queries ─────────────────────────────────────────────────────
    const [profile, goals, enrollments, simRuns, userBadges] = await Promise.all([
      prisma.learnerProfile.findUnique({ where: { userId: id } }),

      prisma.dailyGoal.findMany({
        where: { userId: id, date: new Date().toISOString().slice(0, 10) },
        orderBy: { createdAt: 'asc' },
      }),

      prisma.enrollment.findMany({
        where: { userId: id },
        include: {
          course: {
            select: {
              id: true, title: true, difficulty: true, totalLessons: true,
              category: true, description: true,
              modules: { select: { id: true, title: true, order: true }, orderBy: { order: 'asc' }, take: 1 }
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
      }),

      prisma.simulationRun.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, backend: true, status: true, shots: true, createdAt: true, fidelity: true }
      }),

      prisma.userBadge.findMany({
        where: { userId: id },
        include: { badge: { select: { title: true, icon: true, xp: true } } },
        orderBy: { earnedAt: 'desc' },
        take: 5,
      }),
    ]);

    // ── Compute stats ─────────────────────────────────────────────────────────
    const completedEnrollments = enrollments.filter(e => e.status === 'Completed' || e.progress >= 100);
    const activeEnrollments    = enrollments.filter(e => e.status !== 'Completed' && e.progress < 100);

    // Current course = most recently updated active enrollment
    const currentEnrollment = activeEnrollments[0] || enrollments[0];
    const currentCourse = currentEnrollment ? {
      id:       currentEnrollment.course.id,
      title:    currentEnrollment.course.title,
      module:   currentEnrollment.course.modules?.[0]?.title || 'Module 1',
      lesson:   `Lesson ${Math.ceil((currentEnrollment.progress / 100) * (currentEnrollment.course.totalLessons || 10)) + 1}`,
      progress: Math.round(currentEnrollment.progress || 0),
      difficulty: currentEnrollment.course.difficulty,
    } : { title: 'No active course', module: '—', lesson: '—', progress: 0 };

    // Total lessons (approx 10 per course)
    const totalLessons     = enrollments.reduce((s, e) => s + (e.course.totalLessons || 10), 0);
    const completedLessons = enrollments.reduce((s, e) => s + Math.floor((e.progress / 100) * (e.course.totalLessons || 10)), 0);

    // XP thresholds
    const level      = profile?.level || 1;
    const xp         = profile?.xp || 0;
    const nextLevelXp = level * 500;

    // Recent activity — merge sim runs + completed courses
    const recentActivity = [
      ...simRuns.map(r => ({
        id: r.id,
        type: 'simulation',
        label: `Ran simulation on ${r.backend} (${r.shots} shots)`,
        meta: r.fidelity ? `Fidelity: ${(r.fidelity * 100).toFixed(1)}%` : r.status,
        time: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: r.createdAt,
      })),
      ...completedEnrollments.slice(0, 3).map(e => ({
        id: e.id,
        type: 'course',
        label: `Completed: ${e.course.title}`,
        meta: '100% progress',
        time: new Date(e.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: e.updatedAt,
      })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);

    // AI recommendation — least-progressed active enrolled course
    const recEnrollment = [...activeEnrollments].sort((a, b) => a.progress - b.progress)[1] || activeEnrollments[0];
    const recommendation = recEnrollment ? {
      courseId:   recEnrollment.course.id,
      title:      recEnrollment.course.title,
      reason:     `You're ${Math.round(recEnrollment.progress)}% through this course — keep the momentum going!`,
      module:     recEnrollment.course.modules?.[0]?.title || 'Module 1',
      difficulty: recEnrollment.course.difficulty || 'Beginner',
      duration:   '20–35 min',
      category:   recEnrollment.course.category,
    } : {
      title: 'Start Your First Course',
      reason: 'Browse the course catalog and enroll to begin your quantum journey.',
      module: 'Getting Started',
      difficulty: 'Beginner',
      duration: '5 min',
    };

    // If no daily goals exist, generate smart defaults
    const todayGoals = goals.length > 0 ? goals : [
      { id: 'g1', type: 'lesson', label: 'Complete one lesson', done: false },
      { id: 'g2', type: 'simulation', label: 'Run a quantum simulation', done: simRuns.some(r => new Date(r.createdAt).toDateString() === new Date().toDateString()) },
      { id: 'g3', type: 'challenge', label: 'Attempt one challenge', done: false },
    ];

    return res.status(200).json({
      success: true,
      message: 'Learner dashboard data fetched successfully.',
      data: {
        user: { id, name, email, role },
        level,
        xp,
        nextLevelXp,
        streak: profile?.streak || 0,
        longestStreak: profile?.longestStreak || 0,
        currentCourse,
        todayGoals,
        stats: {
          courses: {
            enrolled:  enrollments.length,
            completed: completedEnrollments.length,
            active:    activeEnrollments.length,
          },
          lessons: {
            total:     totalLessons,
            completed: completedLessons,
          },
          challenges:   { attempted: 0, solved: 0 },
          simulations:  { total: simRuns.length, thisWeek: simRuns.filter(r => Date.now() - new Date(r.createdAt) < 7 * 86400000).length },
          quizScore:    0,
          learningHours: profile?.learningHours || 0,
        },
        recentActivity,
        recommendation,
        quickStats: {
          rank:       profile?.rank || 0,
          badges:     userBadges.length,
          badgeList:  userBadges.map(ub => ({ title: ub.badge.title, icon: ub.badge.icon, xp: ub.badge.xp })),
          daysActive: profile?.streak || 0,
          xpThisWeek: 0,
          simulations: simRuns.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching learner dashboard:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
  }
};


export const getLearnerCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: { select: { name: true } }
      }
    });

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id }
    });

    const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));
    
    const formattedCourses = courses.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      difficulty: c.difficulty,
      duration: c.duration,
      modules: c.totalLessons > 0 ? 5 : 0,
      lessons: c.totalLessons,
      instructor: c.instructor?.name || 'Unknown',
      progress: enrolledCourseIds.has(c.id) ? 0 : 0,
      enrolled: enrolledCourseIds.has(c.id),
      studentsEnrolled: c.enrolledStudents || 0,
      category: c.category,
      rating: c.rating || 0
    }));

    const paths = await prisma.learningPath.findMany();

    return res.status(200).json({
      success: true,
      data: {
        courses: formattedCourses,
        enrolled: formattedCourses.filter(c => c.enrolled),
        catalog: formattedCourses.filter(c => !c.enrolled),
        paths: paths.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          courses: 0,
          totalHours: p.totalHours || 0,
          difficulty: p.difficulty || 'Beginner',
          progress: 0,
          enrolled: false
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching learner courses:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { name: true } },
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const formattedCourse = {
      ...course,
      instructor: course.instructor?.name || 'Unknown',
      enrolled: true,
      progress: 0
    };

    const curriculum = course.modules.map(m => ({
      id: m.id,
      title: m.title,
      completed: false,
      locked: false,
      progress: 0,
      items: m.lessons.map(l => ({
        id: l.id,
        type: l.type,
        title: l.title,
        duration: l.duration,
        completed: false
      }))
    }));

    return res.status(200).json({
      success: true,
      data: { course: formattedCourse, curriculum },
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course' });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user.id,
        courseId,
        progress: 0,
        status: 'Active'
      }
    });

    return res.status(200).json({
      success: true,
      message: `Successfully enrolled in course ${courseId}.`,
      data: { courseId, enrolled: true, progress: 0 },
    });
  } catch (error) {
    console.error('Error enrolling course:', error);
    res.status(500).json({ success: false, error: 'Failed to enroll in course' });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    return res.status(200).json({
      success: true,
      message: `Lesson ${lessonId} marked as completed.`,
      data: { lessonId, completed: true, xpEarned: 25 },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to complete lesson' });
  }
};

export const getLearnerProgress = async (req, res) => {
  try {
    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: req.user.id }
    });
    
    return res.status(200).json({
      success: true,
      data: {
        overallProgress: 0,
        coursesCompleted: 0,
        totalCourses: 0,
        lessonsCompleted: 0,
        totalLessons: 0,
        challengesSolved: 0,
        challengesAttempted: 0,
        quizAvgScore: 0,
        learningHours: profile?.learningHours || 0,
        currentStreak: profile?.streak || 0,
        longestStreak: profile?.longestStreak || 0,
        weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
        milestones: [],
        circuitsBuilt: 0,
        simulationsRun: 0,
        aiInteractions: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
};

export const getLearnerAchievements = async (req, res) => {
  try {
    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: req.user.id }
    });

    const userBadges = await prisma.userBadge.findMany({
      where: { userId: req.user.id },
      include: { badge: true }
    });

    const allBadges = await prisma.badge.findMany();
    
    const formattedBadges = allBadges.map(b => {
      const earned = userBadges.find(ub => ub.badgeId === b.id);
      return {
        id: b.id,
        title: b.title,
        desc: b.desc,
        icon: b.icon,
        xp: b.xp,
        rarity: b.rarity,
        earned: !!earned,
        date: earned ? earned.earnedAt.toLocaleDateString() : undefined
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        xp: profile?.xp || 0,
        level: profile?.level || 1,
        rank: profile?.rank || 42,
        streak: profile?.streak || 0,
        badges: formattedBadges,
        milestones: [
          { xp: 0, label: 'Novice', icon: '🌱', reached: true },
          { xp: 500, label: 'Apprentice', icon: '⚗️', reached: (profile?.xp || 0) >= 500 }
        ],
        leaderboard: [
          { rank: 42, name: req.user.name, xp: profile?.xp || 0, isYou: true }
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch achievements' });
  }
};

export const getLearnerProfile = async (req, res) => {
  try {
    const { id, name, email, role, createdAt } = req.user;
    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: id }
    });

    return res.status(200).json({
      success: true,
      data: {
        user: { id, name, email, role, createdAt },
        bio: profile?.bio || '',
        institution: profile?.institution || '',
        joined: new Date(createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }),
        stats: { 
          xp: profile?.xp || 0, 
          lessons: 0, 
          streak: profile?.streak || 0, 
          challenges: 0, 
          hours: profile?.learningHours || 0, 
          rank: profile?.rank || 0 
        },
        enrolledCourses: [],
        certificates: profile?.certificates || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
};

export const updateLearnerProfile = async (req, res) => {
  try {
    const { bio, institution, avatarUrl } = req.body;
    
    const profile = await prisma.learnerProfile.upsert({
      where: { userId: req.user.id },
      update: { bio, institution },
      create: { userId: req.user.id, bio, institution }
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { bio: profile.bio, institution: profile.institution, avatarUrl },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

export const getTodayGoals = async (req, res) => {
  try {
    const goals = await prisma.dailyGoal.findMany({
      where: { userId: req.user.id, date: new Date().toISOString().slice(0, 10) }
    });

    return res.status(200).json({
      success: true,
      data: {
        goals,
        date: new Date().toISOString().slice(0, 10),
        xpAvailable: 180,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch goals' });
  }
};

export const toggleGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { done } = req.body;
    
    const updated = await prisma.dailyGoal.update({
      where: { id: goalId },
      data: { done, xpEarned: done ? 30 : 0 }
    });

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to toggle goal' });
  }
};
