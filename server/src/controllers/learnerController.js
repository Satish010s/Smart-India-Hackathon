import prisma from '../config/db.js';

export const getLearnerDashboard = async (req, res) => {
  try {
    const { id, name, email, role } = req.user;

    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: id }
    });

    const goals = await prisma.dailyGoal.findMany({
      where: { userId: id, date: new Date().toISOString().slice(0, 10) }
    });

    const courses = await prisma.course.findMany({
      take: 3
    });

    return res.status(200).json({
      success: true,
      message: 'Learner dashboard data fetched successfully.',
      data: {
        user: { id, name, email, role },
        level: profile?.level || 1,
        xp: profile?.xp || 0,
        streak: profile?.streak || 0,
        todayGoals: goals,
        stats: {
          courses: { enrolled: 0, completed: 0 },
          lessons: { total: 0, completed: 0 },
          challenges: { attempted: 0, solved: 0 },
          quizScore: 0,
          learningHours: profile?.learningHours || 0
        },
        recentActivity: [],
        recommendation: {
          title: courses[0]?.title || 'Course',
          reason: 'Recommended based on your activity.',
          module: 'Module 1',
          difficulty: 'Beginner',
          duration: '35 min',
        },
        quickStats: { rank: profile?.rank || 0, badges: 0, daysActive: profile?.streak || 0, xpThisWeek: 0 }
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
