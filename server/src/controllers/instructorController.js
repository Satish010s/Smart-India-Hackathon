import { generateDummyInstructorData } from '../utils/dummyData.js';

/**
 * GET /api/instructor/portal
 * Returns instructor portal overview.
 */
export const getInstructorPortal = (req, res) => {
  const { id, name, email, role } = req.user;
  const data = generateDummyInstructorData(name);

  return res.status(200).json({
    success: true,
    message: 'Instructor portal data fetched successfully.',
    data: {
      user: { id, name, email, role },
      ...data.overview,
    },
  });
};

/**
 * GET /api/instructor/courses
 * Returns assigned courses with analytics.
 */
export const getInstructorCourses = (req, res) => {
  const data = generateDummyInstructorData(req.user.name);
  return res.status(200).json({
    success: true,
    data: { courses: data.courses },
  });
};

/**
 * GET /api/instructor/students
 * Returns enrolled students with progress.
 */
export const getInstructorStudents = (req, res) => {
  const data = generateDummyInstructorData(req.user.name);
  return res.status(200).json({
    success: true,
    data: { students: data.students, total: data.students.length },
  });
};

/**
 * GET /api/instructor/grading
 * Returns pending submissions for grading.
 */
export const getGradingQueue = (req, res) => {
  const data = generateDummyInstructorData(req.user.name);
  return res.status(200).json({
    success: true,
    data: { submissions: data.grading, pendingCount: data.grading.filter(s => s.status === 'PENDING').length },
  });
};

/**
 * PATCH /api/instructor/grading/:submissionId
 * Grade a submission.
 */
export const gradeSubmission = (req, res) => {
  const { submissionId } = req.params;
  const { score, feedback } = req.body;

  if (score === undefined || score < 0 || score > 100) {
    return res.status(400).json({ success: false, error: 'Score must be between 0 and 100.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Submission graded successfully.',
    data: { submissionId, score, feedback, gradedAt: new Date().toISOString() },
  });
};

/**
 * GET /api/instructor/analytics
 * Returns course performance analytics.
 */
export const getInstructorAnalytics = (req, res) => {
  const data = generateDummyInstructorData(req.user.name);
  return res.status(200).json({
    success: true,
    data: data.analytics,
  });
};
