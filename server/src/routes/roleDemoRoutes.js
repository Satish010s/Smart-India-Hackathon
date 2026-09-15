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


// Note: /instructor/portal is handled by instructorRoutes.js


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
