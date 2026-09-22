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
    <div className="min-h-screen flex w-full items-center justify-center relative bg-black">
      {/* Full Page Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/quantum-warm-bg.jpg')" }}
      />
      
      {/* Subtle Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered Form */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-10 flex flex-col justify-center">
        <div className="w-full space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight">
              Reset password
            </h1>
            <p className="text-[15px] text-white/70">
              Enter your email to receive a recovery code
            </p>
          </div>

          {(error || localError) && (
            <div className="p-3 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-rose-100 text-sm flex items-center gap-2 animate-shake">
              <LuCircleAlert size={16} />
              <span>{error || localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 text-white">
              <label className="block text-sm font-medium">
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
              className="inline-flex items-center gap-1.5 text-[14px] font-bold text-white hover:text-[#e7b46a] transition-colors"
            >
              <LuArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Floating System Status */}
      <div className="absolute bottom-8 left-8 hidden sm:block z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80 shadow-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Secure Authentication
        </div>
      </div>
    </div>
  );
}
