import { create } from 'zustand';

/**
 * Global Auth Modal Store (Zustand)
 *
 * Controls the popup authentication modal used across the platform:
 * sign in, sign up, email verification and password recovery — all inline.
 */
export const useAuthModalStore = create((set) => ({
  isOpen: false,
  mode: 'login', // 'login' | 'signup' | 'forgot'

  /**
   * Open the auth modal in a given mode.
   * @param {'login'|'signup'|'forgot'} mode
   */
  openAuthModal: (mode = 'login') => set({ isOpen: true, mode }),

  /**
   * Close the auth modal.
   */
  closeAuthModal: () => set({ isOpen: false }),
}));
