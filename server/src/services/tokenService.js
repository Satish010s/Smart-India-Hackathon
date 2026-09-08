import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db.js';
import { JWT_CONFIG } from '../config/jwt.js';

/**
 * Hash refresh token using SHA-256 for secure DB storage
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Issue new access and refresh token pair
 */
export const generateTokenPair = async (user, familyId = null) => {
  const currentFamilyId = familyId || crypto.randomUUID();
  const jti = crypto.randomUUID();

  // Access token payload: user id, email, role
  const accessPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(accessPayload, JWT_CONFIG.accessSecret, {
    expiresIn: JWT_CONFIG.accessExpiresIn,
  });

  // Refresh token payload: user id, family id, unique jti
  const refreshPayload = {
    userId: user.id,
    familyId: currentFamilyId,
    jti,
  };

  const refreshToken = jwt.sign(refreshPayload, JWT_CONFIG.refreshSecret, {
    expiresIn: JWT_CONFIG.refreshExpiresIn,
  });

  const expiresAt = new Date(Date.now() + JWT_CONFIG.refreshMaxAgeMs);
  const tokenHash = hashToken(refreshToken);

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      familyId: currentFamilyId,
      userId: user.id,
      expiresAt,
      isRevoked: false,
    },
  });

  return { accessToken, refreshToken };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_CONFIG.accessSecret);
};

/**
 * Rotate refresh token with Reuse Detection
 */
export const rotateRefreshToken = async (oldRefreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, JWT_CONFIG.refreshSecret);
  } catch (err) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }

  const oldTokenHash = hashToken(oldRefreshToken);
  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash: oldTokenHash },
    include: { user: true },
  });

  if (!storedToken) {
    const error = new Error('Refresh token not found');
    error.statusCode = 401;
    throw error;
  }

  // Reuse Detection: If the token is already revoked, an adversary might be reusing it!
  if (storedToken.isRevoked) {
    console.warn(`⚠️ [SECURITY ALERT] Replay/Reuse detected for familyId: ${storedToken.familyId}, userId: ${storedToken.userId}! Revoking all tokens in family.`);
    // Invalidate entire token family immediately
    await prisma.refreshToken.updateMany({
      where: { familyId: storedToken.familyId },
      data: { isRevoked: true },
    });

    const error = new Error('Token reuse detected. All active sessions for this device family have been revoked.');
    error.statusCode = 403;
    throw error;
  }

  // Check if expired
  if (new Date() > new Date(storedToken.expiresAt)) {
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });
    const error = new Error('Refresh token has expired');
    error.statusCode = 401;
    throw error;
  }

  // Revoke current token before issuing next one
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { isRevoked: true },
  });

  // Generate new pair keeping the same familyId
  const { accessToken, refreshToken } = await generateTokenPair(storedToken.user, storedToken.familyId);

  return {
    accessToken,
    refreshToken,
    user: storedToken.user,
  };
};

/**
 * Revoke specific refresh token (used on logout)
 */
export const revokeRefreshToken = async (token) => {
  if (!token) return;
  try {
    const tokenHash = hashToken(token);
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { isRevoked: true },
    });
  } catch (err) {
    console.error('Error revoking refresh token:', err.message);
  }
};

/**
 * Revoke ALL refresh tokens for a user (used after password reset or global logout)
 */
export const revokeAllUserSessions = async (userId) => {
  if (!userId) return;
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { isRevoked: true },
  });
};
