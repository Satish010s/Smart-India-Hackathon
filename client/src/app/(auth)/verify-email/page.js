"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { LuCpu, LuMail, LuCircleCheck, LuCircleAlert, LuLoaderCircle, LuRefreshCw, LuArrowRight } from 'react-icons/lu';
import toast from 'react-hot-toast';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const isUnverifiedAttempt = searchParams.get('unverified');

  const {
    verifyEmail,
    resendOtp,
    isLoading,
    error,
    clearError,
    cooldownRemaining,
    tickCooldown,
  } = useAuthStore();

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const inputRefs = useRef([]);

  // Cooldown countdown timer
  useEffect(() => {
    let interval = null;
    if (cooldownRemaining > 0) {
      interval = setInterval(() => {
        tickCooldown();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownRemaining, tickCooldown]);

  // Handle single digit input
  const handleDigitChange = (index, value) => {
    if (error) clearError();
    if (localError) setLocalError('');
    if (resendSuccess) setResendSuccess('');

    // Handle single digit
    const cleaned = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleaned ? cleaned.slice(-1) : '';
    setOtp(newOtp);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste of full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pasteData.length > 0) {
      const digits = pasteData.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, idx) => {
        if (idx < 6) newOtp[idx] = d;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(digits.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (!email) {
      const msg = 'Please provide your registered email address.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    if (fullOtp.length !== 6) {
      const msg = 'Please enter all 6 digits of the verification code.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    const result = await verifyEmail(email, fullOtp);

    if (result.success) {
      toast.success('Email verified successfully! Welcome to QubitMind.');
      const role = (result.user?.role || '').toUpperCase();
      if (role === 'ADMIN') router.replace('/admin');
      else if (role === 'INSTRUCTOR') router.replace('/instructor');
      else router.replace('/dashboard');
    } else {
      toast.error(result.error || 'Verification failed. Please check the code.');
    }
  };

  const handleResend = async () => {
    if (cooldownRemaining > 0 || isLoading) return;
    setLocalError('');
    clearError();

    const result = await resendOtp(email, 'EMAIL_VERIFICATION');
    if (result.success) {
      toast.success('A new 6-digit verification code has been dispatched.');
      setResendSuccess('A new 6-digit code has been dispatched to your email.');
    } else {
      toast.error(result.error || 'Failed to resend code. Please try again.');
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
              Verify your email
            </h1>
            <p className="text-[15px] text-[var(--color-muted)]">
              We sent a 6-digit code to your email
            </p>
          </div>

          {/* Notices */}
          {isUnverifiedAttempt && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm flex items-center gap-2">
              <LuCircleAlert size={16} />
              <span>You must verify your email before logging in.</span>
            </div>
          )}

          {resendSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2">
              <LuCircleCheck size={16} />
              <span>{resendSuccess}</span>
            </div>
          )}

          {(error || localError) && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm flex items-center gap-2 animate-shake">
              <LuCircleAlert size={16} />
              <span>{error || localError}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  if (error) clearError();
                  if (localError) setLocalError('');
                  setEmail(e.target.value);
                }}
                placeholder="name@institution.edu"
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] text-[15px] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Verification Code
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-xl font-bold rounded-lg bg-transparent border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-2.5 rounded-lg font-medium text-[15px] bg-[var(--color-text)] text-[var(--color-background)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <LuLoaderCircle className="animate-spin" size={18} />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Verify Email</span>
              )}
            </button>
          </form>

          {/* Resend Code Section */}
          <div className="pt-6 mt-6 border-t border-[var(--color-border)] text-center">
            <p className="text-[14px] text-[var(--color-muted)] mb-3">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldownRemaining > 0 || isLoading}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-text)] hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cooldownRemaining > 0 ? (
                <span>Resend available in {cooldownRemaining}s</span>
              ) : (
                <>
                  <LuRefreshCw size={16} />
                  <span>Resend Code</span>
                </>
              )}
            </button>
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
            Verification Required
          </div>
          <h2 className="text-3xl font-medium tracking-tight mb-2">Secure Workspace</h2>
          <p className="text-zinc-400 text-sm">Verify your identity to unlock the full potential of your quantum workspace.</p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LuLoaderCircle className="animate-spin text-[var(--color-primary)]" size={32} /></div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
