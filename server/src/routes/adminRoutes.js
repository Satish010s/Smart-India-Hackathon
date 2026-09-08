import express from 'express';
import {
  createInstructor,
  listUsers,
  updateUserRole,
} from '../controllers/adminController.js';
import {
  authenticateUser,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes strictly require authentication AND ADMIN role
router.use(authenticateUser);
router.use(authorizeRoles('ADMIN'));

// Create Instructor account
router.post('/instructors', createInstructor);

// List platform users
router.get('/users', listUsers);

// Update user role
router.patch('/users/:userId/role', updateUserRole);

export default router;
