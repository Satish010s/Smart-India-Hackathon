"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { LuCpu, LuMail, LuLock, LuShieldCheck, LuCircleAlert, LuLoaderCircle, LuArrowRight, LuArrowLeft } from 'react-icons/lu';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: initialEmail,
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    if (error) clearError();
    if (localError) setLocalError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    return score;
  };

  const passScore = getPasswordStrength(formData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.otp || !formData.newPassword) {
      const msg = 'All fields are required.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    if (formData.otp.trim().length !== 6) {
      const msg = 'Please enter the 6-digit verification code.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      const msg = 'Passwords do not match.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    if (formData.newPassword.length < 8) {
      const msg = 'Password must be at least 8 characters long.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    const result = await resetPassword(formData.email, formData.otp.trim(), formData.newPassword);

    if (result.success) {
      toast.success('Password updated successfully! Please sign in.');
      router.push('/login?reset=true');
    } else {
      toast.error(result.error || 'Password reset failed. Please check the code.');
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
              Create new password
            </h1>
            <p className="text-[15px] text-[var(--color-muted)]">
              Enter the 6-digit code and choose a new password
            </p>
          </div>

          {/* Security Alert regarding Session Invalidation */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm flex items-start gap-2">
            <LuShieldCheck size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              <strong>Security Note:</strong> Resetting your password will automatically log you out of all other active devices.
            </span>
          </div>

          {(error || localError) && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm flex items-center gap-2 animate-shake">
              <LuCircleAlert size={16} />
              <span>{error || localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Email Address
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
              <label className="block text-sm font-medium text-[var(--color-text)]">
                6-Digit Reset Code
              </label>
              <input
                type="text"
                name="otp"
                maxLength={6}
                required
                value={formData.otp}
                onChange={handleChange}
                placeholder="123456"
                className="w-full px-4 py-2.5 font-mono tracking-widest text-center text-lg rounded-lg bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] text-[15px] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />

              {/* Password Strength Meter */}
              {formData.newPassword && (
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
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat new password"
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
                  <span>Resetting Password...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-text)] hover:underline"
            >
              <LuArrowLeft size={16} />
              Back to Login
            </Link>
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
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Security Protocol
          </div>
          <h2 className="text-3xl font-medium tracking-tight mb-2">Secure Reset</h2>
          <p className="text-zinc-400 text-sm">Your new password is encrypted before it leaves your browser.</p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LuLoaderCircle className="animate-spin text-[var(--color-primary)]" size={32} /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
