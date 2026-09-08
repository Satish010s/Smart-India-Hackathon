import dotenv from 'dotenv';
dotenv.config();

export const JWT_CONFIG = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'quantum_access_jwt_super_secret_key_development_only_2025!',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'quantum_refresh_jwt_super_secret_key_development_only_2025!',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  refreshMaxAgeMs: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  accessMaxAgeMs: 15 * 60 * 1000, // 15 mins in ms
};

/**
 * Generates secure cookie options compliant with HttpOnly, Secure, and SameSite policies.
 */
export const getCookieOptions = (type = 'access') => {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = type === 'refresh' ? JWT_CONFIG.refreshMaxAgeMs : JWT_CONFIG.accessMaxAgeMs;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge,
  };
};

export const getClearCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
};
