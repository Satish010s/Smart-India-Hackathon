/**
 * Input validators for authentication and RBAC operations
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  // Min 8 chars, at least one letter and one number
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
};

export const validateOtpCode = (code) => {
  if (!code) return false;
  const codeStr = code.toString().trim();
  return /^\d{6}$/.test(codeStr);
};

/**
 * Public signup validator - only allows LEARNER
 */
export const validateSignupInput = ({ name, email, password, role }) => {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  if (!validateEmail(email)) {
    errors.push('Please provide a valid email address.');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 8 characters long and contain at least one letter and one number.');
  }

  const normalizedRole = (role || 'LEARNER').toUpperCase();
  const allowedPublicRoles = ['LEARNER'];

  if (!allowedPublicRoles.includes(normalizedRole)) {
    errors.push('Public signups are only allowed for Learner accounts. Instructor accounts are provisioned by administrators.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      name: name ? name.trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      password,
      role: normalizedRole,
    },
  };
};

/**
 * Instructor creation validator (for Admin only)
 */
export const validateInstructorCreationInput = ({ name, email, password }) => {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Instructor name must be at least 2 characters long.');
  }

  if (!validateEmail(email)) {
    errors.push('Please provide a valid email address.');
  }

  if (password && !validatePassword(password)) {
    errors.push('Password must be at least 8 characters long and contain both letters and numbers.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      name: name ? name.trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      password,
    },
  };
};
