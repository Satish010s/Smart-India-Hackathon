"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QubitMindLogo from '../../../components/common/QubitMindLogo';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  LuCpu,
  LuUser,
  LuMail,
  LuLock,
  LuArrowRight,
  LuCircleAlert,
  LuLoaderCircle,
  LuBookOpen,
  LuShieldAlert,
} from 'react-icons/lu';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const role = 'LEARNER'; // Only LEARNER accounts can be created publicly
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    if (error) clearError();
    if (localError) setLocalError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password strength checker
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    return score;
  };

  const passScore = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      const msg = 'All fields are required.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    if (formData.password.length < 8) {
      const msg = 'Password must be at least 8 characters long.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
    });

    if (result.success) {
      toast.success(result.message || 'Verification code sent to your email!');
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } else {
      toast.error(result.error || 'Registration failed. Please try again.');
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
              Create account
            </h1>
            <p className="text-[15px] text-[var(--color-muted)]">
              Begin your quantum computing journey
            </p>
          </div>

          {/* Error Alert */}
          {(error || localError) && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm flex items-center gap-2 animate-shake">
              <LuCircleAlert size={16} />
              <span>{error || localError}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Toggle */}
            <div className="p-3 rounded-lg border border-[var(--color-border)] bg-transparent flex items-center justify-between cursor-pointer hover:border-[var(--color-text)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text)]">
                  <LuBookOpen size={16} />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-text)] leading-none mb-1">Learner Account</div>
                  <div className="text-xs text-[var(--color-muted)] leading-none">Access courses & simulations</div>
                </div>
              </div>
              <div className="w-4 h-4 rounded-full border-[4px] border-[var(--color-text)] bg-[var(--color-background)]" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ada Lovelace"
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] text-[15px] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>

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
                placeholder="ada@research.edu"
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] text-[15px] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] text-[15px] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2 grid grid-cols-4 gap-1 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`rounded-full transition-all ${
                        passScore >= step
                          ? passScore <= 2
                            ? 'bg-rose-500'
                            : passScore === 3
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          : 'bg-[var(--color-border)]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[14px] text-[var(--color-muted)]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-[var(--color-text)] hover:underline"
              >
                Sign in
              </Link>
            </p>
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
            Join the Next Generation
          </div>
          <h2 className="text-3xl font-medium tracking-tight mb-2">Empowering Innovators</h2>
          <p className="text-zinc-400 text-sm">Master quantum algorithms through hands-on circuits and AI-driven tutoring.</p>
        </div>
      </div>
    </div>
  );
}
