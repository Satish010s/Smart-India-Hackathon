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
    // Only show Published courses to learners
    const courses = await prisma.course.findMany({
      where: { status: 'Published' },
      include: {
        instructor: { select: { name: true } },
        modules: {
          include: { lessons: { select: { id: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id }
    });

    const enrollmentMap = new Map(enrollments.map(e => [e.courseId, e]));

    const formattedCourses = courses.map(c => {
      const enrollment = enrollmentMap.get(c.id);
      const totalLessons = c.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        difficulty: c.difficulty,
        duration: c.duration,
        modules: c.modules.length,
        lessons: totalLessons || c.totalLessons,
        instructor: c.instructor?.name || 'Unknown',
        progress: enrollment ? Math.round(enrollment.progress) : 0,
        enrolled: !!enrollment,
        enrollmentStatus: enrollment?.status || null,
        studentsEnrolled: c.enrolledStudents || 0,
        category: c.category,
        rating: c.rating || 0,
        objectives: c.objectives,
        prerequisites: c.prerequisites,
        thumbnail: c.thumbnail,
      };
    });

    const paths = await prisma.learningPath.findMany({
      include: { pathCourses: { include: { course: { select: { id: true } } } } }
    });

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
          courses: p.pathCourses.length,
          totalHours: p.totalHours || '0 hrs',
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
            lessons: { orderBy: { order: 'asc' } }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Get enrollment if any
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: req.user.id, courseId }
    });

    const moduleProgress = enrollment?.moduleProgress || {};
    const completedLessonIds = new Set(
      Object.values(moduleProgress).flatMap(m => m.completedLessons || [])
    );

    const formattedCourse = {
      ...course,
      instructor: course.instructor?.name || 'Unknown',
      enrolled: !!enrollment,
      progress: enrollment ? Math.round(enrollment.progress) : 0
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
        contentType: l.contentType,
        title: l.title,
        duration: l.duration,
        completed: completedLessonIds.has(l.id),
        videoUrl: l.videoUrl || null,
        videoThumbnail: l.videoThumbnail || null,
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
    const userId = req.user.id;

    // Verify course exists and is published
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    if (course.status !== 'Published') {
      return res.status(400).json({ success: false, error: 'Course is not available for enrollment' });
    }

    // Upsert enrollment — prevents duplicate crash
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { status: 'Active' },
      create: { userId, courseId, progress: 0, status: 'Active' }
    });

    // Increment enrolledStudents counter on course (atomic)
    await prisma.course.update({
      where: { id: courseId },
      data: { enrolledStudents: { increment: 1 } }
    }).catch(() => {}); // Non-critical, ignore failure

    return res.status(200).json({
      success: true,
      message: `Successfully enrolled in course.`,
      data: { courseId, enrolled: true, progress: Math.round(enrollment.progress) },
    });
  } catch (error) {
    console.error('Error enrolling course:', error);
    res.status(500).json({ success: false, error: 'Failed to enroll in course' });
  }
};

// ─── Lesson Content Fetch ─────────────────────────────────────────────────────
export const getLessonContent = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: { course: { select: { id: true, title: true, status: true } } }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ success: false, error: 'Lesson not found' });
    }

    // Verify learner has access (course is published)
    if (lesson.module?.course?.status !== 'Published') {
      return res.status(403).json({ success: false, error: 'This lesson is not available' });
    }

    return res.status(200).json({
      success: true,
      data: {
        lesson: {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          contentType: lesson.contentType,
          duration: lesson.duration,
          status: lesson.status,
          blocks: lesson.blocks || [],
          videoUrl: lesson.videoUrl || null,
          videoThumbnail: lesson.videoThumbnail || null,
          module: lesson.module?.course?.title,
          courseId: lesson.module?.course?.id,
        }
      }
    });
  } catch (error) {
    console.error('Error fetching lesson content:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch lesson' });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    // Get lesson and its module/course
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: { include: { lessons: { select: { id: true } } } }
              }
            }
          }
        }
      }
    });

    if (!lesson) return res.status(404).json({ success: false, error: 'Lesson not found' });

    const courseId = lesson.module?.courseId;
    if (!courseId) return res.status(400).json({ success: false, error: 'Invalid lesson structure' });

    // Get or create enrollment
    let enrollment = await prisma.enrollment.findFirst({ where: { userId, courseId } });
    if (!enrollment) {
      return res.status(403).json({ success: false, error: 'You are not enrolled in this course' });
    }

    // Update moduleProgress
    const moduleProgress = enrollment.moduleProgress ? { ...enrollment.moduleProgress } : {};
    const moduleId = lesson.moduleId;
    if (!moduleProgress[moduleId]) {
      moduleProgress[moduleId] = { completedLessons: [] };
    }
    const completedLessons = moduleProgress[moduleId].completedLessons || [];
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }
    moduleProgress[moduleId].completedLessons = completedLessons;

    // Compute new overall progress
    const allLessons = lesson.module.course.modules.flatMap(m => m.lessons);
    const totalLessons = allLessons.length;
    const completedAll = Object.values(moduleProgress).reduce((sum, m) => sum + (m.completedLessons?.length || 0), 0);
    const newProgress = totalLessons > 0 ? Math.min(100, (completedAll / totalLessons) * 100) : 0;
    const newStatus = newProgress >= 100 ? 'Completed' : 'Active';

    // Update enrollment
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        moduleProgress,
        progress: newProgress,
        status: newStatus,
        lastActive: new Date()
      }
    });

    // Award XP to learner profile (25 XP per lesson)
    const XP_PER_LESSON = 25;
    await prisma.learnerProfile.upsert({
      where: { userId },
      update: { xp: { increment: XP_PER_LESSON } },
      create: { userId, xp: XP_PER_LESSON, level: 1, streak: 0 }
    });

    return res.status(200).json({
      success: true,
      message: `Lesson marked as completed.`,
      data: {
        lessonId,
        completed: true,
        xpEarned: XP_PER_LESSON,
        newProgress: Math.round(newProgress),
        courseCompleted: newStatus === 'Completed'
      },
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ success: false, error: 'Failed to complete lesson' });
  }
};

export const getLearnerProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await prisma.learnerProfile.findUnique({ where: { userId } });

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: { modules: { include: { lessons: { select: { id: true } } } } }
        }
      }
    });

    const totalCourses = enrollments.length;
    const coursesCompleted = enrollments.filter(e => e.status === 'Completed' || e.progress >= 100).length;
    const overallProgress = totalCourses > 0
      ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / totalCourses)
      : 0;

    // Count completed lessons
    let lessonsCompleted = 0;
    let totalLessons = 0;
    for (const enroll of enrollments) {
      const moduleProgress = enroll.moduleProgress ? { ...enroll.moduleProgress } : {};
      const allCourseLessons = enroll.course.modules.flatMap(m => m.lessons);
      totalLessons += allCourseLessons.length;
      lessonsCompleted += Object.values(moduleProgress).reduce(
        (sum, m) => sum + (m.completedLessons?.length || 0), 0
      );
    }

    // Simulations count
    const simulationsRun = await prisma.simulationRun.count({ where: { userId } });
    const circuitsBuilt = await prisma.savedCircuit.count({ where: { userId } });

    return res.status(200).json({
      success: true,
      data: {
        overallProgress,
        coursesCompleted,
        totalCourses,
        lessonsCompleted,
        totalLessons,
        challengesSolved: 0,
        challengesAttempted: 0,
        quizAvgScore: 0,
        learningHours: profile?.learningHours || 0,
        currentStreak: profile?.streak || 0,
        longestStreak: profile?.longestStreak || 0,
        weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
        milestones: [],
        circuitsBuilt,
        simulationsRun,
        aiInteractions: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
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
