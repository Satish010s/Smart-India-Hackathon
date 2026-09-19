"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { LuLoaderCircle, LuShieldAlert } from 'react-icons/lu';

/**
 * Higher-Order Component / Wrapper that guards routes requiring authentication.
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    // Re-verify session on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isCheckingAuth, isAuthenticated, router, pathname]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] px-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-primary)]">
            <LuLoaderCircle className="animate-pulse" size={24} />
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-[var(--color-muted)] tracking-wide">
          Verifying secure quantum session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
