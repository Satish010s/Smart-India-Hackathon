import express from 'express';
import {
  getInstructorPortal,
  getInstructorCourses,
  getInstructorStudents,
  getGradingQueue,
  gradeSubmission,
  getInstructorAnalytics,
} from '../controllers/instructorController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All instructor routes require authentication and INSTRUCTOR/ADMIN role
router.use(authenticateUser);
router.use(authorizeRoles('INSTRUCTOR', 'ADMIN'));

// Portal overview
router.get('/portal', getInstructorPortal);

// Courses
router.get('/courses', getInstructorCourses);

// Students
router.get('/students', getInstructorStudents);

// Grading
router.get('/grading', getGradingQueue);
router.patch('/grading/:submissionId', gradeSubmission);

// Analytics
router.get('/analytics', getInstructorAnalytics);

export default router;
