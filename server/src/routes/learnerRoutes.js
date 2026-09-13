import express from 'express';
import {
  getLearnerDashboard,
  getLearnerCourses,
  getCourseById,
  enrollCourse,
  completeLesson,
  getLearnerProgress,
  getLearnerAchievements,
  getLearnerProfile,
  updateLearnerProfile,

  getTodayGoals,
  toggleGoal,
} from '../controllers/learnerController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All learner routes require authentication and LEARNER/INSTRUCTOR/ADMIN role
router.use(authenticateUser);
router.use(authorizeRoles('LEARNER', 'INSTRUCTOR', 'ADMIN'));

// Dashboard
router.get('/dashboard', getLearnerDashboard);

// Courses
router.get('/courses', getLearnerCourses);
router.get('/courses/:courseId', getCourseById);
router.post('/courses/:courseId/enroll', enrollCourse);

// Lessons
router.patch('/lessons/:lessonId/complete', completeLesson);

// Progress
router.get('/progress', getLearnerProgress);

// Achievements
router.get('/achievements', getLearnerAchievements);

// Profile
router.get('/profile', getLearnerProfile);
router.patch('/profile', updateLearnerProfile);



// Daily Goals
router.get('/goals/today', getTodayGoals);
router.patch('/goals/:goalId/toggle', toggleGoal);

export default router;
