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
    <div className="min-h-screen flex w-full items-center justify-center relative bg-black">
      {/* Full Page Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/quantum-warm-bg.jpg')" }}
      />
      
      {/* Subtle Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered Signup Form */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-10 flex flex-col justify-center">
        <div className="w-full space-y-8">
          
          {/* Header */}
          <div className="space-y-2 text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight">
              Create account
            </h1>
            <p className="text-[15px] text-white/70">
              Begin your quantum computing journey
            </p>
          </div>

          {/* Error Alert */}
          {(error || localError) && (
            <div className="p-3 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-rose-100 text-sm flex items-center gap-2 animate-shake">
              <LuCircleAlert size={16} />
              <span>{error || localError}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type Toggle */}
            <div className="p-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-between cursor-pointer hover:border-white/40 transition-colors shadow-inner">
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                  <LuBookOpen size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-none mb-1">Learner Account</div>
                  <div className="text-xs text-white/60 leading-none">Access courses & simulations</div>
                </div>
              </div>
              <div className="w-4 h-4 rounded-full border-[4px] border-[#e7b46a] bg-black" />
            </div>

            <div className="space-y-1.5 text-white">
              <label className="block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ada Lovelace"
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-[15px] focus:outline-none focus:border-[#e7b46a] focus:ring-1 focus:ring-[#e7b46a] focus:bg-white/15 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5 text-white">
              <label className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ada@research.edu"
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-[15px] focus:outline-none focus:border-[#e7b46a] focus:ring-1 focus:ring-[#e7b46a] focus:bg-white/15 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5 text-white">
              <label className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-[15px] focus:outline-none focus:border-[#e7b46a] focus:ring-1 focus:ring-[#e7b46a] focus:bg-white/15 transition-all shadow-inner"
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
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-white">
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[14px] text-white/70">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-white hover:text-[#e7b46a] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Floating System Status */}
      <div className="absolute bottom-8 left-8 hidden sm:block z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80 shadow-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Join the Next Generation
        </div>
      </div>
    </div>
  );
}
