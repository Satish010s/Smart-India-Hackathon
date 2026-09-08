import rateLimit from 'express-rate-limit';
import prisma from '../config/db.js';
import { verifyAccessToken } from '../services/tokenService.js';

/**
 * Authentication Middleware:
 * Inspects HttpOnly cookies (or Authorization header fallback) for valid access token.
 */
export const authenticateUser = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    // Fallback: check Authorization: Bearer <token>
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.',
        code: 'UNAUTHORIZED',
      });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Access token has expired. Please refresh session.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication token.',
        code: 'INVALID_TOKEN',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found or deactivated.',
        code: 'USER_NOT_FOUND',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed due to internal error.',
    });
  }
};

/**
 * RBAC Authorization Middleware:
 * Verifies that the authenticated user has one of the allowed roles.
 */
export const authorizeRoles = (...allowedRoles) => {
  const normalizedRoles = allowedRoles.map((r) => r.toUpperCase());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required before checking permissions.',
        code: 'UNAUTHORIZED',
      });
    }

    const userRole = req.user.role ? req.user.role.toUpperCase() : '';

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
        code: 'FORBIDDEN',
      });
    }

    next();
  };
};

/**
 * Rate Limiter for sensitive Auth Endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP, please try again in 15 minutes.',
    code: 'RATE_LIMITED',
  },
});

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Max 10 requests per 10 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many OTP requests. Please wait a while before requesting again.',
    code: 'RATE_LIMITED',
  },
});
