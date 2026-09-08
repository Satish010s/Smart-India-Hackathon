import express from 'express';
import {
  authenticateUser,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Learner Dashboard Data (Accessible by LEARNER, INSTRUCTOR, ADMIN)
 */
router.get('/learner/dashboard', authenticateUser, authorizeRoles('LEARNER', 'INSTRUCTOR', 'ADMIN'), (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Learner Quantum Hub!',
    data: {
      role: req.user.role,
      modulesCompleted: 4,
      totalModules: 12,
      activeTracks: ['Qubits & Superposition', 'Quantum Gates', 'Deutsch-Jozsa Algorithm'],
      xp: 1250,
    },
  });
});

/**
 * Researcher Workspace Data (Accessible by RESEARCHER, ADMIN)
 */
router.get('/researcher/workspace', authenticateUser, authorizeRoles('RESEARCHER', 'ADMIN'), (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Advanced Quantum Researcher Workspace!',
    data: {
      role: req.user.role,
      activeSimulations: 3,
      allocatedQubits: 64,
      hardwareTarget: 'IBM Quantum Eagle / IonQ Forte',
      recentPapers: [
        'Variational Quantum Eigensolver for Molecular Binding',
        'Error Mitigation in 127-Qubit Systems',
      ],
    },
  });
});

/**
 * Instructor Portal Data (Accessible by INSTRUCTOR, ADMIN)
 */
router.get('/instructor/portal', authenticateUser, authorizeRoles('INSTRUCTOR', 'ADMIN'), (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Instructor Command Portal!',
    data: {
      role: req.user.role,
      assignedCourses: ['PHYS-401: Quantum Mechanics Computing', 'CS-550: Quantum Algorithms'],
      totalEnrolledStudents: 142,
      pendingSubmissions: 18,
    },
  });
});

/**
 * Admin Overview Data (Accessible ONLY by ADMIN)
 */
router.get('/admin/overview', authenticateUser, authorizeRoles('ADMIN'), (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Super Admin Command Center!',
    data: {
      role: req.user.role,
      systemHealth: 'OPERATIONAL',
      activeSessions: 47,
      securityStatus: 'ARGON2ID_ENFORCED_WITH_ROTATION',
      auditAlerts: 0,
    },
  });
});

export default router;
