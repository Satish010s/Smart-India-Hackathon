import argon2 from 'argon2';
import prisma from '../config/db.js';
import { getCookieOptions, getClearCookieOptions } from '../config/jwt.js';
import {
  generateTokenPair,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllUserSessions,
} from '../services/tokenService.js';
import { createOtp, verifyOtp } from '../services/otpService.js';
import {
  sendVerificationOtpEmail,
  sendPasswordResetOtpEmail,
} from '../services/emailService.js';
import {
  validateSignupInput,
  validateEmail,
  validatePassword,
  validateOtpCode,
} from '../validators/authValidators.js';

/**
 * Argon2id hashing options adhering to OWASP recommendations
 */
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MB
  timeCost: 3,
  parallelism: 4,
};

/**
 * Public Signup: Only LEARNER or RESEARCHER accounts can be created publicly
 */
export const signup = async (req, res) => {
  try {
    const { isValid, errors, data } = validateSignupInput(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, error: errors[0], errors });
    }

    const { name, email, password, role } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
        code: 'EMAIL_ALREADY_EXISTS',
      });
    }

    // Hash password with Argon2id
    const passwordHash = await argon2.hash(password, ARGON2_OPTIONS);

    // Create user in unverified state
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        isEmailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
      },
    });

    // Generate and send 6-digit OTP
    const otp = await createOtp(user.id, 'EMAIL_VERIFICATION');
    await sendVerificationOtpEmail(user.email, user.name, otp);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Please verify your email with the 6-digit code sent to your inbox.',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: false,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Signup failed. Please try again.',
    });
  }
};

/**
 * Verify Email with 6-digit OTP and issue HttpOnly session cookies
 */
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email is required.' });
    }
    if (!validateOtpCode(otp)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 6-digit code.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified. Please log in directly.',
      });
    }

    // Verify OTP
    await verifyOtp(user.id, otp, 'EMAIL_VERIFICATION');

    // Mark email as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
      },
    });

    // Issue tokens
    const { accessToken, refreshToken } = await generateTokenPair(updatedUser);

    // Set HttpOnly cookies
    res.cookie('accessToken', accessToken, getCookieOptions('access'));
    res.cookie('refreshToken', refreshToken, getCookieOptions('refresh'));

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! You are now authenticated.',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(error.statusCode || 400).json({
      success: false,
      error: error.message || 'Verification failed.',
    });
  }
};

/**
 * Resend OTP with cooldown and rate limiting
 */
export const resendOtp = async (req, res) => {
  try {
    const { email, type = 'EMAIL_VERIFICATION' } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email is required.' });
    }

    const validTypes = ['EMAIL_VERIFICATION', 'PASSWORD_RESET'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid OTP type.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      // Return ok to prevent user scanning
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a verification code has been dispatched.',
      });
    }

    if (type === 'EMAIL_VERIFICATION' && user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified.',
      });
    }

    // Create OTP (will enforce 60s cooldown)
    const otp = await createOtp(user.id, type);

    if (type === 'EMAIL_VERIFICATION') {
      await sendVerificationOtpEmail(user.email, user.name, otp);
    } else {
      await sendPasswordResetOtpEmail(user.email, user.name, otp);
    }

    return res.status(200).json({
      success: true,
      message: 'A fresh 6-digit verification code has been sent.',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to resend code.',
      cooldownRemaining: error.cooldownRemaining,
    });
  }
};

/**
 * Login: Verify credentials with Argon2id and set HttpOnly cookies
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email) || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email and password.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Verify Argon2id hash
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Check email verification status
    if (!user.isEmailVerified) {
      // Dispatch a fresh OTP if possible
      try {
        const otp = await createOtp(user.id, 'EMAIL_VERIFICATION');
        await sendVerificationOtpEmail(user.email, user.name, otp);
      } catch (otpErr) {
        // Cooldown or existing OTP in progress, continue informing user
      }

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        error: 'Your email is not yet verified. A 6-digit verification code has been sent to your email.',
        code: 'EMAIL_UNVERIFIED',
      });
    }

    // Generate JWT access + refresh token pair
    const { accessToken, refreshToken } = await generateTokenPair(user);

    // Set HttpOnly cookies
    res.cookie('accessToken', accessToken, getCookieOptions('access'));
    res.cookie('refreshToken', refreshToken, getCookieOptions('refresh'));

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during login.',
    });
  }
};

/**
 * Refresh Access Token with Token Rotation & Reuse Detection
 */
export const refreshToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token cookie missing. Please log in.',
        code: 'NO_REFRESH_TOKEN',
      });
    }

    const { accessToken, refreshToken: newRefreshToken, user } = await rotateRefreshToken(oldRefreshToken);

    // Set updated HttpOnly cookies
    res.cookie('accessToken', accessToken, getCookieOptions('access'));
    res.cookie('refreshToken', newRefreshToken, getCookieOptions('refresh'));

    return res.status(200).json({
      success: true,
      message: 'Token rotated and session refreshed successfully.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    // If token reuse detected or token invalid, clear cookies
    res.clearCookie('accessToken', getClearCookieOptions());
    res.clearCookie('refreshToken', getClearCookieOptions());

    return res.status(error.statusCode || 401).json({
      success: false,
      error: error.message || 'Session expired. Please log in again.',
      code: error.statusCode === 403 ? 'TOKEN_REUSE_DETECTED' : 'INVALID_REFRESH_TOKEN',
    });
  }
};

/**
 * Logout: Revoke current refresh token and clear cookies
 */
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await revokeRefreshToken(token);
    }

    res.clearCookie('accessToken', getClearCookieOptions());
    res.clearCookie('refreshToken', getClearCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.clearCookie('accessToken', getClearCookieOptions());
    res.clearCookie('refreshToken', getClearCookieOptions());
    return res.status(200).json({ success: true, message: 'Logged out.' });
  }
};

/**
 * Forgot Password: Send 6-digit reset OTP
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      // Don't leak user existence
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a 6-digit password reset code has been dispatched.',
      });
    }

    const otp = await createOtp(user.id, 'PASSWORD_RESET');
    await sendPasswordResetOtpEmail(user.email, user.name, otp);

    return res.status(200).json({
      success: true,
      message: 'A 6-digit password reset code has been sent to your email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to process password reset request.',
      cooldownRemaining: error.cooldownRemaining,
    });
  }
};

/**
 * Reset Password: Verify OTP, update password with Argon2id, and invalidate all existing sessions
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email is required.' });
    }
    if (!validateOtpCode(otp)) {
      return res.status(400).json({ success: false, error: 'Valid 6-digit code is required.' });
    }
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long and contain both letters and numbers.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    // Verify OTP
    await verifyOtp(user.id, otp, 'PASSWORD_RESET');

    // Hash new password
    const newPasswordHash = await argon2.hash(newPassword, ARGON2_OPTIONS);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        isEmailVerified: true, // Resetting password via verified email confirms ownership
      },
    });

    // SECURITY: Invalidate ALL active refresh tokens across all devices for this user
    await revokeAllUserSessions(user.id);

    // Clear any local cookies
    res.clearCookie('accessToken', getClearCookieOptions());
    res.clearCookie('refreshToken', getClearCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. All active sessions have been terminated. Please log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(error.statusCode || 400).json({
      success: false,
      error: error.message || 'Password reset failed.',
    });
  }
};

/**
 * Get Current Authenticated User (from req.user set by authenticateUser middleware)
 */
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};
