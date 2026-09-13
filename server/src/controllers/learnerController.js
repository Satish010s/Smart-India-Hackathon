import { generateDummyLearnerData } from '../utils/dummyData.js';


/**
 * GET /api/learner/dashboard
 * Returns full dashboard data for the authenticated learner.
 */
export const getLearnerDashboard = (req, res) => {
  const { id, name, email, role } = req.user;
  const data = generateDummyLearnerData(name);

  return res.status(200).json({
    success: true,
    message: 'Learner dashboard data fetched successfully.',
    data: {
      user: { id, name, email, role },
      ...data.dashboard,
    },
  });
};

/**
 * GET /api/learner/courses
 * Returns all courses (catalog + enrolled).
 */
export const getLearnerCourses = (req, res) => {
  const data = generateDummyLearnerData(req.user.name);
  return res.status(200).json({
    success: true,
    data: {
      courses: data.courses,
      enrolled: data.courses.filter(c => c.enrolled),
      catalog: data.courses.filter(c => !c.enrolled),
      paths: data.learningPaths,
    },
  });
};

/**
 * GET /api/learner/courses/:courseId
 * Returns a single course with full curriculum.
 */
export const getCourseById = (req, res) => {
  const { courseId } = req.params;
  const data = generateDummyLearnerData(req.user.name);
  const course = data.courses.find(c => c.id === courseId) || data.courses[1];

  return res.status(200).json({
    success: true,
    data: { course, curriculum: data.curriculum },
  });
};

/**
 * POST /api/learner/courses/:courseId/enroll
 * Enroll learner into a course.
 */
export const enrollCourse = (req, res) => {
  const { courseId } = req.params;
  return res.status(200).json({
    success: true,
    message: `Successfully enrolled in course ${courseId}.`,
    data: { courseId, enrolled: true, progress: 0 },
  });
};

/**
 * PATCH /api/learner/lessons/:lessonId/complete
 * Mark a lesson as completed.
 */
export const completeLesson = (req, res) => {
  const { lessonId } = req.params;
  return res.status(200).json({
    success: true,
    message: `Lesson ${lessonId} marked as completed.`,
    data: { lessonId, completed: true, xpEarned: 25 },
  });
};

/**
 * GET /api/learner/progress
 * Returns detailed learning progress analytics.
 */
export const getLearnerProgress = (req, res) => {
  const data = generateDummyLearnerData(req.user.name);
  return res.status(200).json({
    success: true,
    data: data.progress,
  });
};

/**
 * GET /api/learner/achievements
 * Returns badges, XP milestones, streaks, leaderboard.
 */
export const getLearnerAchievements = (req, res) => {
  const data = generateDummyLearnerData(req.user.name);
  return res.status(200).json({
    success: true,
    data: data.achievements,
  });
};

/**
 * GET /api/learner/profile
 * Returns full learner profile with stats, activity, certificates.
 */
export const getLearnerProfile = (req, res) => {
  const { id, name, email, role, createdAt } = req.user;
  const data = generateDummyLearnerData(name);

  return res.status(200).json({
    success: true,
    data: {
      user: { id, name, email, role, createdAt },
      ...data.profile,
    },
  });
};

/**
 * PATCH /api/learner/profile
 * Update learner profile bio, preferences.
 */
export const updateLearnerProfile = (req, res) => {
  const { bio, institution, avatarUrl } = req.body;
  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: { bio, institution, avatarUrl },
  });
};



/**
 * GET /api/learner/goals/today
 * Returns today's learning goals.
 */
export const getTodayGoals = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      goals: [
        { id: 'g1', type: 'lesson', label: 'Complete Diffusion Operator lesson', done: false },
        { id: 'g2', type: 'challenge', label: 'Solve: Phase Kickback challenge', done: false },
        { id: 'g3', type: 'simulation', label: 'Run Bell State experiment', done: true },
        { id: 'g4', type: 'quiz', label: 'Module 2 knowledge quiz (5 Qs)', done: true },
      ],
      date: new Date().toISOString().slice(0, 10),
      xpAvailable: 180,
    },
  });
};

/**
 * PATCH /api/learner/goals/:goalId/toggle
 * Toggle a goal's completion state.
 */
export const toggleGoal = (req, res) => {
  const { goalId } = req.params;
  const { done } = req.body;
  return res.status(200).json({
    success: true,
    data: { goalId, done, xpEarned: done ? 30 : 0 },
  });
};
