import crypto from 'crypto';
import prisma from '../config/db.js';

const OTP_COOLDOWN_SECONDS = 60;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;

/**
 * Hash OTP using SHA-256
 */
export const hashOtp = (code) => {
  return crypto.createHash('sha256').update(code.toString()).digest('hex');
};

/**
 * Generate a cryptographically random 6-digit string
 */
export const generate6DigitCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Generate and store a new OTP for a user
 */
export const createOtp = async (userId, type) => {
  // Check if there is an active OTP with cooldown
  const existingOtp = await prisma.otp.findFirst({
    where: {
      userId,
      type,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (existingOtp) {
    const elapsedSeconds = Math.floor((Date.now() - new Date(existingOtp.lastSentAt).getTime()) / 1000);
    if (elapsedSeconds < OTP_COOLDOWN_SECONDS) {
      const waitTime = OTP_COOLDOWN_SECONDS - elapsedSeconds;
      const error = new Error(`Please wait ${waitTime} seconds before requesting a new code.`);
      error.statusCode = 429;
      error.cooldownRemaining = waitTime;
      throw error;
    }
  }

  // Invalidate any older unused OTPs for this user & type
  await prisma.otp.updateMany({
    where: {
      userId,
      type,
      isUsed: false,
    },
    data: {
      isUsed: true,
    },
  });

  const code = generate6DigitCode();
  const codeHash = hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otp.create({
    data: {
      userId,
      type,
      codeHash,
      expiresAt,
      lastSentAt: new Date(),
      attempts: 0,
      isUsed: false,
    },
  });

  return code;
};

/**
 * Verify provided OTP
 */
export const verifyOtp = async (userId, code, type) => {
  const otpRecord = await prisma.otp.findFirst({
    where: {
      userId,
      type,
      isUsed: false,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    const error = new Error('No valid verification code found. Please request a new one.');
    error.statusCode = 400;
    throw error;
  }

  // Check expiration
  if (new Date() > new Date(otpRecord.expiresAt)) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });
    const error = new Error('Verification code has expired. Please request a new one.');
    error.statusCode = 400;
    throw error;
  }

  // Check attempts
  if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });
    const error = new Error('Maximum verification attempts exceeded. Please request a new code.');
    error.statusCode = 429;
    throw error;
  }

  // Check code match
  const codeHash = hashOtp(code);
  if (codeHash !== otpRecord.codeHash) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });
    const remainingAttempts = OTP_MAX_ATTEMPTS - (otpRecord.attempts + 1);
    const error = new Error(`Invalid verification code. ${remainingAttempts} attempts remaining.`);
    error.statusCode = 400;
    throw error;
  }

  // Mark used
  await prisma.otp.update({
    where: { id: otpRecord.id },
    data: { isUsed: true },
  });

  return true;
};
