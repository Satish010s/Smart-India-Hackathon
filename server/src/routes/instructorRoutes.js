import express from 'express';
import {
  getInstructorPortal,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  duplicateCourse,
  updateCourseStatus,
  createModule,
  updateModule,
  createLesson,
  updateLesson,
  getQuizzes,
  createQuiz,
  updateQuiz,
  getChallenges,
  createChallenge,
  updateChallenge,
  getInstructorStudents,
  getStudentDetails,
  getGradingQueue,
  gradeSubmission,
  getInstructorAnalytics,
  getContentManagement,
  updateContentStatus,
  getInstructorProfile,
  updateInstructorProfile,
} from '../controllers/instructorController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All instructor routes require authentication and INSTRUCTOR/ADMIN role
router.use(authenticateUser);
router.use(authorizeRoles('INSTRUCTOR', 'ADMIN'));

// Portal overview
router.get('/portal', getInstructorPortal);

// Courses CRUD
router.get('/courses', getInstructorCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.post('/courses/:id/duplicate', duplicateCourse);
router.patch('/courses/:id/status', updateCourseStatus);

// Modules
router.post('/courses/:courseId/modules', createModule);
router.put('/modules/:moduleId', updateModule);

// Lessons
router.post('/modules/:moduleId/lessons', createLesson);
router.put('/lessons/:lessonId', updateLesson);

// Quizzes
router.get('/quizzes', getQuizzes);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);

// Challenges
router.get('/challenges', getChallenges);
router.post('/challenges', createChallenge);
router.put('/challenges/:id', updateChallenge);

// Students
router.get('/students', getInstructorStudents);
router.get('/students/:id', getStudentDetails);

// Grading
router.get('/grading', getGradingQueue);
router.patch('/grading/:submissionId', gradeSubmission);

// Analytics
router.get('/analytics', getInstructorAnalytics);

// Content Management
router.get('/content', getContentManagement);
router.patch('/content/:type/:id/status', updateContentStatus);

// Profile
router.get('/profile', getInstructorProfile);
router.put('/profile', updateInstructorProfile);

export default router;
