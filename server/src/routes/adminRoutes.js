import express from 'express';
import {
  getAdminOverview,
  listUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  createInstructor,
  getContentGovernance,
  updateContentStatus,
  deleteContentItem,
  getPlatformAnalytics,
  getAiConfig,
  updateAiConfig,
  getQuantumBackends,
  updateQuantumBackend,
  testQuantumBackend,
  getSystemHealth,
  getAuditLogs,
  getPlatformSettings,
  updatePlatformSettings,
} from '../controllers/adminController.js';
import {
  authenticateUser,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Strict RBAC: All admin endpoints require authentication AND ADMIN role
router.use(authenticateUser);
router.use(authorizeRoles('ADMIN'));

// 1. Dashboard Overview
router.get('/overview', getAdminOverview);

// 2. User & Faculty Management
router.get('/users', listUsers);
router.patch('/users/:userId/role', updateUserRole);
router.patch('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);
router.post('/instructors', createInstructor);

// 3. Content Governance
router.get('/content', getContentGovernance);
router.patch('/content/:id/status', updateContentStatus);
router.delete('/content/:id', deleteContentItem);

// 4. Platform Analytics
router.get('/analytics', getPlatformAnalytics);

// 5. AI Engine Management
router.get('/ai/config', getAiConfig);
router.put('/ai/config', updateAiConfig);

// 6. Quantum Backend Management
router.get('/backends', getQuantumBackends);
router.put('/backends/:id', updateQuantumBackend);
router.post('/backends/:id/test', testQuantumBackend);

// 7. System Health
router.get('/health', getSystemHealth);

// 8. Audit Logs
router.get('/audit-logs', getAuditLogs);

// 9. Platform Settings
router.get('/settings', getPlatformSettings);
router.put('/settings', updatePlatformSettings);

export default router;
