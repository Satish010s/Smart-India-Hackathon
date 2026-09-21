"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { LuCpu, LuMail, LuArrowRight, LuCircleAlert, LuLoaderCircle, LuArrowLeft, LuKeyRound } from 'react-icons/lu';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      const msg = 'Please provide your email address.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    const result = await forgotPassword(email);
    if (result.success) {
      toast.success('Password reset code sent to your email.');
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } else {
      toast.error(result.error || 'Failed to send reset code. Please try again.');
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
              Reset password
            </h1>
            <p className="text-[15px] text-[var(--color-muted)]">
              Enter your email to receive a recovery code
            </p>
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
                Email
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-2.5 rounded-lg font-medium text-[15px] bg-[var(--color-text)] text-[var(--color-background)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <LuLoaderCircle className="animate-spin" size={18} />
                  <span>Sending Code...</span>
                </>
              ) : (
                <span>Send Reset Code</span>
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
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Secure Authentication
          </div>
          <h2 className="text-3xl font-medium tracking-tight mb-2">Account Recovery</h2>
          <p className="text-zinc-400 text-sm">Security is a process, not a product. Recover your access securely.</p>
        </div>
      </div>
    </div>
  );
}
