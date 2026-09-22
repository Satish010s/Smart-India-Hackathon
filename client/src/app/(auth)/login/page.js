"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { LuCircleCheck, LuCircleAlert, LuLoaderCircle } from 'react-icons/lu';
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
    <div className="min-h-screen flex w-full items-center justify-center relative bg-black">
      {/* Full Page Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/quantum-warm-bg.jpg')" }}
      />
      
      {/* Subtle Dark Overlay to guarantee text readability without hiding the image */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered Login Form - No outer card, perfectly blended */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-10 flex flex-col justify-center">
        <div className="w-full space-y-8">
          
          {/* Header */}
          <div className="space-y-2 text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-[15px] text-white/70">
              Log in to your account
            </p>
          </div>

          {/* Notices */}
          {verifiedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-100 text-sm flex items-center gap-2">
              <LuCircleCheck size={16} />
              <span>Email verified successfully!</span>
            </div>
          )}

          {resetNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-100 text-sm flex items-center gap-2">
              <LuCircleCheck size={16} />
              <span>Password reset successfully.</span>
            </div>
          )}

          {/* Error Alert */}
          {(error || localError) && (
            <div className="p-3 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-rose-100 text-sm flex items-center gap-2 animate-shake">
              <LuCircleAlert size={16} />
              <span>{error || localError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 text-white">
              <label className="block text-sm font-medium">
                Email
              </label>
              {/* Glassmorphism Input perfectly blended into image */}
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@institution.edu"
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-[15px] focus:outline-none focus:border-[#e7b46a] focus:ring-1 focus:ring-[#e7b46a] focus:bg-white/15 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5 text-white">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-medium text-[#e7b46a] hover:text-[#f1a17e] hover:underline transition-colors"
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
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-[15px] focus:outline-none focus:border-[#e7b46a] focus:ring-1 focus:ring-[#e7b46a] focus:bg-white/15 transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 rounded-xl font-bold text-[15px] text-white shadow-[0_0_20px_rgba(214,74,23,0.3)] hover:shadow-[0_0_30px_rgba(231,180,106,0.5)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #d64a17, #e7b46a)" }}
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
            <p className="text-[14px] text-white/70">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-white hover:text-[#e7b46a] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="pt-6 mt-6 border-t border-white/20">
            <div className="text-[12px] font-semibold text-white/50 mb-3 text-center uppercase tracking-wider">Demo Access</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ email: 'learner@quantum.platform', password: 'Learner@2025!' })}
                className="py-2 px-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/30 transition-all text-[12px] font-semibold text-white shadow-inner"
              >
                Learner
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'instructor@quantum.platform', password: 'Instructor@2025!' })}
                className="py-2 px-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/30 transition-all text-[12px] font-semibold text-white shadow-inner"
              >
                Instructor
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@quantum.platform', password: 'AdminQuantum@2025!' })}
                className="py-2 px-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/30 transition-all text-[12px] font-semibold text-white shadow-inner"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating System Status */}
      <div className="absolute bottom-8 left-8 hidden sm:block z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80 shadow-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Quantum Engine Online
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LuLoaderCircle className="animate-spin text-[#d64a17]" size={32} /></div>}>
      <LoginForm />
    </Suspense>
  );
}
