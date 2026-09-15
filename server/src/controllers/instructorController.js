import { generateDummyInstructorData } from '../utils/dummyData.js';

// In-memory store for created content (simulates a DB for the session)
let localCourses = null;
let localQuizzes = null;
let localChallenges = null;

function getStore(name) {
  const data = generateDummyInstructorData(name);
  if (!localCourses) localCourses = [...data.courses];
  if (!localQuizzes) localQuizzes = [...data.quizzes];
  if (!localChallenges) localChallenges = [...data.challenges];
  return data;
}

// ─── PORTAL OVERVIEW ─────────────────────────────────────────────────────────
/**
 * GET /api/instructor/portal
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

// ─── COURSES ─────────────────────────────────────────────────────────────────
/**
 * GET /api/instructor/courses
 */
export const getInstructorCourses = (req, res) => {
  const data = getStore(req.user.name);
  return res.status(200).json({
    success: true,
    data: { courses: localCourses || data.courses },
  });
};

/**
 * POST /api/instructor/courses
 */
export const createCourse = (req, res) => {
  const { title, description, difficulty, category, duration, objectives, prerequisites } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, error: 'Title and description are required.' });
  }
  const newCourse = {
    id: `ic_${Date.now()}`,
    title, description, difficulty: difficulty || 'Beginner',
    category: category || 'Foundations', duration: duration || '0 hrs',
    status: 'Draft',
    enrolledStudents: 0, avgProgress: 0, avgScore: 0, completionRate: 0,
    publishedLessons: 0, totalLessons: 0,
    objectives: objectives || [],
    prerequisites: prerequisites || [],
    lastUpdated: 'Just now',
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    rating: null, pendingGrades: 0, modules: [],
    thumbnail: null,
  };
  if (!localCourses) localCourses = [];
  localCourses.unshift(newCourse);
  return res.status(201).json({
    success: true, message: 'Course created successfully.', data: { course: newCourse },
  });
};

/**
 * PUT /api/instructor/courses/:id
 */
export const updateCourse = (req, res) => {
  const { id } = req.params;
  if (!localCourses) localCourses = generateDummyInstructorData(req.user.name).courses;
  const idx = localCourses.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Course not found.' });
  localCourses[idx] = { ...localCourses[idx], ...req.body, lastUpdated: 'Just now' };
  return res.status(200).json({ success: true, message: 'Course updated.', data: { course: localCourses[idx] } });
};

/**
 * DELETE /api/instructor/courses/:id
 */
export const deleteCourse = (req, res) => {
  const { id } = req.params;
  if (!localCourses) localCourses = generateDummyInstructorData(req.user.name).courses;
  const before = localCourses.length;
  localCourses = localCourses.filter(c => c.id !== id);
  if (localCourses.length === before) return res.status(404).json({ success: false, error: 'Course not found.' });
  return res.status(200).json({ success: true, message: 'Course deleted.' });
};

/**
 * POST /api/instructor/courses/:id/duplicate
 */
export const duplicateCourse = (req, res) => {
  const { id } = req.params;
  if (!localCourses) localCourses = generateDummyInstructorData(req.user.name).courses;
  const original = localCourses.find(c => c.id === id);
  if (!original) return res.status(404).json({ success: false, error: 'Course not found.' });
  const copy = {
    ...original,
    id: `ic_copy_${Date.now()}`,
    title: `${original.title} (Copy)`,
    status: 'Draft', enrolledStudents: 0, avgProgress: 0,
    lastUpdated: 'Just now',
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
  localCourses.unshift(copy);
  return res.status(201).json({ success: true, message: 'Course duplicated.', data: { course: copy } });
};

/**
 * PATCH /api/instructor/courses/:id/status
 */
export const updateCourseStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['Draft', 'Review', 'Published', 'Archived', 'Unpublished'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: `Status must be one of: ${validStatuses.join(', ')}` });
  }
  if (!localCourses) localCourses = generateDummyInstructorData(req.user.name).courses;
  const idx = localCourses.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Course not found.' });
  localCourses[idx].status = status;
  localCourses[idx].lastUpdated = 'Just now';
  return res.status(200).json({ success: true, message: `Course ${status.toLowerCase()}.`, data: { course: localCourses[idx] } });
};

// ─── MODULES ─────────────────────────────────────────────────────────────────
/**
 * POST /api/instructor/courses/:courseId/modules
 */
export const createModule = (req, res) => {
  const { courseId } = req.params;
  const { title, description, objectives, completionRule } = req.body;
  if (!title) return res.status(400).json({ success: false, error: 'Module title is required.' });
  if (!localCourses) localCourses = generateDummyInstructorData(req.user.name).courses;
  const course = localCourses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ success: false, error: 'Course not found.' });
  const newModule = {
    id: `mod_${Date.now()}`, title, description: description || '',
    objectives: objectives || [], completionRule: completionRule || 'All lessons',
    status: 'Draft', order: (course.modules?.length || 0) + 1,
    lessonsCount: 0, lessons: [],
  };
  if (!course.modules) course.modules = [];
  course.modules.push(newModule);
  return res.status(201).json({ success: true, message: 'Module created.', data: { module: newModule } });
};

/**
 * PUT /api/instructor/modules/:moduleId
 */
export const updateModule = (req, res) => {
  const { moduleId } = req.params;
  if (!localCourses) localCourses = generateDummyInstructorData(req.user.name).courses;
  for (const course of localCourses) {
    const mIdx = course.modules?.findIndex(m => m.id === moduleId);
    if (mIdx !== undefined && mIdx !== -1) {
      course.modules[mIdx] = { ...course.modules[mIdx], ...req.body };
      return res.status(200).json({ success: true, message: 'Module updated.', data: { module: course.modules[mIdx] } });
    }
  }
  return res.status(404).json({ success: false, error: 'Module not found.' });
};

// ─── LESSONS ─────────────────────────────────────────────────────────────────
/**
 * POST /api/instructor/modules/:moduleId/lessons
 */
export const createLesson = (req, res) => {
  const { moduleId } = req.params;
  const { title, type, duration } = req.body;
  if (!title) return res.status(400).json({ success: false, error: 'Lesson title is required.' });
  if (!localCourses) localCourses = generateDummyInstructorData(req.user.name).courses;
  for (const course of localCourses) {
    const mod = course.modules?.find(m => m.id === moduleId);
    if (mod) {
      const newLesson = {
        id: `les_${Date.now()}`, title, type: type || 'lesson',
        duration: duration || '10 min', status: 'Draft',
        order: (mod.lessons?.length || 0) + 1, blocks: [],
      };
      if (!mod.lessons) mod.lessons = [];
      mod.lessons.push(newLesson);
      mod.lessonsCount = mod.lessons.length;
      return res.status(201).json({ success: true, message: 'Lesson created.', data: { lesson: newLesson } });
    }
  }
  return res.status(404).json({ success: false, error: 'Module not found.' });
};

/**
 * PUT /api/instructor/lessons/:lessonId
 */
export const updateLesson = (req, res) => {
  const { lessonId } = req.params;
  if (!localCourses) localCourses = generateDummyInstructorData(req.user.name).courses;
  for (const course of localCourses) {
    for (const mod of (course.modules || [])) {
      const lIdx = mod.lessons?.findIndex(l => l.id === lessonId);
      if (lIdx !== undefined && lIdx !== -1) {
        mod.lessons[lIdx] = { ...mod.lessons[lIdx], ...req.body };
        return res.status(200).json({ success: true, message: 'Lesson updated.', data: { lesson: mod.lessons[lIdx] } });
      }
    }
  }
  return res.status(404).json({ success: false, error: 'Lesson not found.' });
};

// ─── QUIZZES ─────────────────────────────────────────────────────────────────
/**
 * GET /api/instructor/quizzes
 */
export const getQuizzes = (req, res) => {
  const data = getStore(req.user.name);
  return res.status(200).json({ success: true, data: { quizzes: localQuizzes || data.quizzes } });
};

/**
 * POST /api/instructor/quizzes
 */
export const createQuiz = (req, res) => {
  const { title, courseId, moduleId, difficulty, timeLimit, passScore, attempts, shuffle } = req.body;
  if (!title) return res.status(400).json({ success: false, error: 'Quiz title is required.' });
  const newQuiz = {
    id: `qz_${Date.now()}`, title, courseId: courseId || null, moduleId: moduleId || null,
    status: 'Draft', questionCount: 0, questions: [],
    timeLimit: timeLimit || 10, passScore: passScore || 70,
    attempts: attempts || 1, shuffle: shuffle ?? true,
    difficulty: difficulty || 'Beginner',
  };
  if (!localQuizzes) localQuizzes = [];
  localQuizzes.unshift(newQuiz);
  return res.status(201).json({ success: true, message: 'Quiz created.', data: { quiz: newQuiz } });
};

/**
 * PUT /api/instructor/quizzes/:id
 */
export const updateQuiz = (req, res) => {
  const { id } = req.params;
  if (!localQuizzes) localQuizzes = generateDummyInstructorData(req.user.name).quizzes;
  const idx = localQuizzes.findIndex(q => q.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Quiz not found.' });
  const updated = { ...localQuizzes[idx], ...req.body };
  updated.questionCount = updated.questions?.length || 0;
  localQuizzes[idx] = updated;
  return res.status(200).json({ success: true, message: 'Quiz updated.', data: { quiz: localQuizzes[idx] } });
};

// ─── CHALLENGES ───────────────────────────────────────────────────────────────
/**
 * GET /api/instructor/challenges
 */
export const getChallenges = (req, res) => {
  const data = getStore(req.user.name);
  return res.status(200).json({ success: true, data: { challenges: localChallenges || data.challenges } });
};

/**
 * POST /api/instructor/challenges
 */
export const createChallenge = (req, res) => {
  const { title, courseId, moduleId, difficulty, xp, problemStatement, starterCode, expectedOutput, circuitRequirements, testCases, hints, solution, autoEval } = req.body;
  if (!title) return res.status(400).json({ success: false, error: 'Challenge title is required.' });
  const newChallenge = {
    id: `ch_${Date.now()}`, title, courseId: courseId || null, moduleId: moduleId || null,
    status: 'Draft', difficulty: difficulty || 'Beginner', xp: xp || 100,
    problemStatement: problemStatement || '', starterCode: starterCode || '',
    expectedOutput: expectedOutput || '', circuitRequirements: circuitRequirements || '',
    testCases: testCases || [], hints: hints || [], solution: solution || '',
    autoEval: autoEval ?? true, evalType: 'statevector', fidelityThreshold: 0.95,
    submissionCount: 0, successRate: 0,
  };
  if (!localChallenges) localChallenges = [];
  localChallenges.unshift(newChallenge);
  return res.status(201).json({ success: true, message: 'Challenge created.', data: { challenge: newChallenge } });
};

/**
 * PUT /api/instructor/challenges/:id
 */
export const updateChallenge = (req, res) => {
  const { id } = req.params;
  if (!localChallenges) localChallenges = generateDummyInstructorData(req.user.name).challenges;
  const idx = localChallenges.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Challenge not found.' });
  localChallenges[idx] = { ...localChallenges[idx], ...req.body };
  return res.status(200).json({ success: true, message: 'Challenge updated.', data: { challenge: localChallenges[idx] } });
};

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
/**
 * GET /api/instructor/students
 */
export const getInstructorStudents = (req, res) => {
  const data = generateDummyInstructorData(req.user.name);
  const { courseId, status, search } = req.query;
  let students = data.students;
  if (courseId) students = students.filter(s => s.courseId === courseId);
  if (status) students = students.filter(s => s.status === status);
  if (search) students = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
  return res.status(200).json({ success: true, data: { students, total: students.length } });
};

/**
 * GET /api/instructor/students/:id
 */
export const getStudentDetails = (req, res) => {
  const { id } = req.params;
  const data = generateDummyInstructorData(req.user.name);
  const student = data.students.find(s => s.id === id);
  if (!student) return res.status(404).json({ success: false, error: 'Student not found.' });
  return res.status(200).json({ success: true, data: { student } });
};

// ─── GRADING ─────────────────────────────────────────────────────────────────
/**
 * GET /api/instructor/grading
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

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
/**
 * GET /api/instructor/analytics
 */
export const getInstructorAnalytics = (req, res) => {
  const data = generateDummyInstructorData(req.user.name);
  return res.status(200).json({ success: true, data: data.analytics });
};

// ─── CONTENT MANAGEMENT ───────────────────────────────────────────────────────
/**
 * GET /api/instructor/content
 */
export const getContentManagement = (req, res) => {
  const data = generateDummyInstructorData(req.user.name);
  return res.status(200).json({ success: true, data: { items: data.contentManagement } });
};

/**
 * PATCH /api/instructor/content/:type/:id/status
 */
export const updateContentStatus = (req, res) => {
  const { type, id } = req.params;
  const { status } = req.body;
  const validStatuses = ['Draft', 'Review', 'Published', 'Archived'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: `Status must be: ${validStatuses.join(', ')}` });
  }
  return res.status(200).json({
    success: true, message: `${type} status updated to ${status}.`,
    data: { id, type, status, updatedAt: new Date().toISOString() },
  });
};

// ─── PROFILE ──────────────────────────────────────────────────────────────────
/**
 * GET /api/instructor/profile
 */
export const getInstructorProfile = (req, res) => {
  const data = generateDummyInstructorData(req.user.name);
  return res.status(200).json({ success: true, data: { profile: { ...data.profile, name: req.user.name, email: req.user.email } } });
};

/**
 * PUT /api/instructor/profile
 */
export const updateInstructorProfile = (req, res) => {
  const { bio, institution, department, title, teachingPreferences, notifications } = req.body;
  return res.status(200).json({
    success: true, message: 'Profile updated successfully.',
    data: { profile: { name: req.user.name, email: req.user.email, bio, institution, department, title, teachingPreferences, notifications, updatedAt: new Date().toISOString() } },
  });
};
