import { create } from 'zustand';
import { apiFetch } from '../services/api';

/**
 * Global Authentication Store (Zustand)
 *
 * NOTE ON SECURITY:
 * Adheres strictly to security best practices:
 * - NEVER stores JWT access or refresh tokens.
 * - NEVER stores user passwords.
 * - Tokens are kept exclusively inside HttpOnly Secure SameSite cookies managed by the browser.
 * - Store manages only: user profile, role, authentication status, loading flag, and error feedback.
 */
let checkAuthPromise = null;

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isCheckingAuth: true, // Initial loading true while verifying session on bootstrap
  isLoading: false,     // True only during active form submissions (login/signup/reset)
  error: null,
  cooldownRemaining: 0,

  /**
   * Clear error state
   */
  clearError: () => set({ error: null }),

  /**
   * Set cooldown timer for OTP resend
   */
  setCooldown: (seconds) => set({ cooldownRemaining: seconds }),

  /**
   * Decrement cooldown timer
   */
  tickCooldown: () => {
    const current = get().cooldownRemaining;
    if (current > 0) {
      set({ cooldownRemaining: current - 1 });
    }
  },

  /**
   * Verify session on app mount by querying /api/auth/me (deduplicated)
   */
  checkAuth: async (force = false) => {
    // Skip if already authenticated and not forcing a refresh
    if (!force && get().isAuthenticated && get().user) {
      set({ isCheckingAuth: false });
      return get().user;
    }

    if (checkAuthPromise) {
      return checkAuthPromise;
    }

    checkAuthPromise = (async () => {
      try {
        set({ isCheckingAuth: true, error: null });
        const res = await apiFetch('/auth/me');
        if (res?.success && res.data?.user) {
          set({
            user: res.data.user,
            role: res.data.user.role,
            isAuthenticated: true,
            isCheckingAuth: false,
            isLoading: false,
          });
          return res.data.user;
        }
        set({ user: null, role: null, isAuthenticated: false, isCheckingAuth: false, isLoading: false });
        return null;
      } catch (err) {
        // 401 simply means no active session cookie
        set({ user: null, role: null, isAuthenticated: false, isCheckingAuth: false, isLoading: false });
        return null;
      } finally {
        checkAuthPromise = null;
      }
    })();

    return checkAuthPromise;
  },

  /**
   * Sign In with email and password
   */
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res?.success && res.data?.user) {
        set({
          user: res.data.user,
          role: res.data.user.role,
          isAuthenticated: true,
          isCheckingAuth: false,
          isLoading: false,
          error: null,
        });
        return { success: true, user: res.data.user };
      }

      throw new Error(res?.error || 'Login failed');
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Login failed' });
      // Return special flag if account requires email verification
      if (err.code === 'EMAIL_UNVERIFIED' || err.data?.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          email: err.data?.email || email,
          error: err.message,
        };
      }
      return { success: false, error: err.message };
    }
  },

  /**
   * Public Signup (Learner only)
   */
  signup: async ({ name, email, password, role }) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });

      set({ isLoading: false, error: null });
      return { success: true, data: res.data, message: res.message };
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Registration failed' });
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify Email with 6-digit OTP
   */
  verifyEmail: async (email, otp) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiFetch('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });

      if (res?.success && res.data?.user) {
        set({
          user: res.data.user,
          role: res.data.user.role,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, user: res.data.user };
      }

      throw new Error(res?.error || 'Email verification failed');
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Verification failed' });
      return { success: false, error: err.message };
    }
  },

  /**
   * Resend 6-digit OTP code
   */
  resendOtp: async (email, type = 'EMAIL_VERIFICATION') => {
    try {
      set({ error: null });
      const res = await apiFetch('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email, type }),
      });

      // Start 60-second cooldown on frontend
      set({ cooldownRemaining: 60 });
      return { success: true, message: res.message };
    } catch (err) {
      if (err.data?.cooldownRemaining) {
        set({ cooldownRemaining: err.data.cooldownRemaining });
      }
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Forgot Password - Request 6-digit reset OTP
   */
  forgotPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      set({ isLoading: false, cooldownRemaining: 60 });
      return { success: true, message: res.message };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Reset Password - Submit 6-digit OTP and new password
   */
  resetPassword: async (email, otp, newPassword) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      });

      // Reset local state since server invalidated all sessions
      set({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      return { success: true, message: res.message };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Logout - Revoke session on server & clear local state
   */
  logout: async () => {
    try {
      set({ isLoading: true });
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout request warning:', err.message);
    } finally {
      set({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));
