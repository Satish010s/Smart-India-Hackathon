import express from 'express';
import {
  signup,
  verifyEmail,
  resendOtp,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from '../controllers/authController.js';
import {
  authenticateUser,
  authLimiter,
  otpLimiter,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/resend-otp', otpLimiter, resendOtp);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Authenticated session check
router.get('/me', authenticateUser, getCurrentUser);

export default router;
