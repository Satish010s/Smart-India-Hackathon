"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { LuCpu, LuMail, LuLock, LuArrowRight, LuCircleAlert, LuLoaderCircle } from 'react-icons/lu';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifiedNotice = searchParams.get('verified');
  const resetNotice = searchParams.get('reset');

  const { user, isAuthenticated, isLoading: authLoading, checkAuth, login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  // Auto-redirect to respective role dashboard if user is already authenticated
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role) {
      const role = (user.role || '').toUpperCase();
      if (role === 'ADMIN') router.replace('/admin');
      else if (role === 'INSTRUCTOR') router.replace('/instructor');
      else router.replace('/dashboard');
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleChange = (e) => {
    if (error) clearError();
    if (localError) setLocalError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      const msg = 'Please enter both your email address and password.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.requiresVerification) {
      toast.error('Please verify your email to access your account.');
      router.push(`/verify-email?email=${encodeURIComponent(result.email)}&unverified=true`);
      return;
    }

    if (result.success) {
      toast.success(`Welcome back, ${result.user?.name || 'Explorer'}!`);
      // Direct redirect to each role-specific dashboard
      const role = (result.user?.role || '').toUpperCase();
      if (role === 'ADMIN') {
        router.replace('/admin');
      } else if (role === 'INSTRUCTOR') {
        router.replace('/instructor');
      } else {
        router.replace('/dashboard');
      }
    } else {
      toast.error(result.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[var(--color-background)]">
      {/* Left Panel - Minimalist Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative py-12">
        <div className="w-full max-w-sm mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[var(--color-text)] tracking-tight">
              Welcome back
            </h1>
            <p className="text-[15px] text-[var(--color-muted)]">
              Log in to your account
            </p>
          </div>

          {/* Notices */}
          {verifiedNotice && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2">
              <LuCircleCheck size={16} />
              <span>Email verified successfully!</span>
            </div>
          )}

          {resetNotice && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2">
              <LuCircleCheck size={16} />
              <span>Password reset successfully.</span>
            </div>
          )}

          {/* Error Alert */}
          {(error || localError) && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm flex items-center gap-2 animate-shake">
              <LuCircleAlert size={16} />
              <span>{error || localError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@institution.edu"
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] text-[15px] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-[var(--color-text)]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] text-[15px] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-2.5 rounded-lg font-medium text-[15px] bg-[var(--color-text)] text-[var(--color-background)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <LuLoaderCircle className="animate-spin" size={18} />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[14px] text-[var(--color-muted)]">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-[var(--color-text)] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="pt-6 mt-6 border-t border-[var(--color-border)]">
            <div className="text-[12px] font-medium text-[var(--color-muted)] mb-3 text-center uppercase tracking-wider">Demo Access</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ email: 'learner@quantum.platform', password: 'Learner@2025!' })}
                className="py-1.5 px-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-text)] transition-colors text-[12px] font-medium text-[var(--color-text)]"
              >
                Learner
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'instructor@quantum.platform', password: 'Instructor@2025!' })}
                className="py-1.5 px-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-text)] transition-colors text-[12px] font-medium text-[var(--color-text)]"
              >
                Instructor
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@quantum.platform', password: 'AdminQuantum@2025!' })}
                className="py-1.5 px-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-text)] transition-colors text-[12px] font-medium text-[var(--color-text)]"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Quantum Image Background */}
      <div className="hidden lg:block w-1/2 relative bg-zinc-950">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: "url('/images/quantum-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            System Online
          </div>
          <h2 className="text-3xl font-medium tracking-tight mb-2">QubitMind Platform</h2>
          <p className="text-zinc-400 text-sm">Advanced quantum computing simulations and algorithms.</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LuLoaderCircle className="animate-spin text-[var(--color-primary)]" size={32} /></div>}>
      <LoginForm />
    </Suspense>
  );
}
