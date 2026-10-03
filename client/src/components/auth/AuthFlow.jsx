"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { QubitMindMark } from "../common/QubitMindLogo";
import {
  LuMail, LuLock, LuUser, LuEye, LuEyeOff, LuArrowLeft, LuArrowRight,
  LuCircleAlert, LuCircleCheck, LuLoaderCircle, LuRefreshCw, LuShieldCheck,
  LuKeyRound, LuSparkles,
} from "react-icons/lu";
import toast from "react-hot-toast";

/* ── Shared field styling ─────────────────────────────────────────────── */
const LABEL = "block text-[13px] font-medium text-[var(--color-text)] mb-1.5";
const INPUT =
  "w-full h-11 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] placeholder:text-[var(--color-muted)]/60 text-[14px] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15";
const BTN_PRIMARY =
  "w-full h-11 rounded-xl font-semibold text-[14px] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const VIEW_META = {
  login: { title: "Welcome back", subtitle: "Sign in to continue your quantum journey" },
  signup: { title: "Create your account", subtitle: "Start learning quantum computing for free" },
  verify: { title: "Check your inbox", subtitle: "Enter the 6-digit code we sent to your email" },
  forgot: { title: "Reset your password", subtitle: "We'll email you a 6-digit recovery code" },
  reset: { title: "Choose a new password", subtitle: "Enter the reset code and your new password" },
};

function getPasswordStrength(pass) {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^a-zA-Z0-9]/.test(pass)) score++;
  return score;
}

function StrengthMeter({ password }) {
  if (!password) return null;
  const score = getPasswordStrength(password);
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="grid grid-cols-4 gap-1 flex-1 h-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`rounded-full transition-all ${
              score >= step
                ? score <= 2
                  ? "bg-rose-500"
                  : score === 3
                  ? "bg-amber-500"
                  : "bg-emerald-500"
                : "bg-[var(--color-border)]"
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] text-[var(--color-muted)] w-14 text-right">
        {score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong"}
      </span>
    </div>
  );
}

/* ── 6-digit OTP input ────────────────────────────────────────────────── */
function OtpInput({ otp, setOtp, onDigitChange }) {
  const refs = useRef([]);

  const handleChange = (index, value) => {
    onDigitChange?.();
    const cleaned = value.replace(/[^0-9]/g, "");
    const next = [...otp];
    next[index] = cleaned ? cleaned.slice(-1) : "";
    setOtp(next);
    if (cleaned && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    onDigitChange?.();
    const data = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    if (!data) return;
    const digits = data.slice(0, 6).split("");
    const next = ["", "", "", "", "", ""];
    digits.forEach((d, i) => (next[i] = d));
    setOtp(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-between">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (refs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={idx === 0 ? handlePaste : undefined}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-semibold rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
        />
      ))}
    </div>
  );
}

/* ── Alert ────────────────────────────────────────────────────────────── */
function Alert({ tone = "error", children }) {
  const tones = {
    error: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    info: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
  };
  const icons = {
    error: <LuCircleAlert size={15} className="shrink-0 mt-0.5" />,
    success: <LuCircleCheck size={15} className="shrink-0 mt-0.5" />,
    info: <LuCircleAlert size={15} className="shrink-0 mt-0.5" />,
  };
  return (
    <div className={`p-3 rounded-xl border text-[13px] leading-snug flex items-start gap-2 animate-shake ${tones[tone]}`}>
      {icons[tone]}
      <span>{children}</span>
    </div>
  );
}

const DEMO_ACCOUNTS = [
  { label: "Learner", email: "learner@quantum.platform", password: "Learner@2025!" },
  { label: "Instructor", email: "instructor@quantum.platform", password: "Instructor@2025!" },
  { label: "Admin", email: "admin@quantum.platform", password: "AdminQuantum@2025!" },
];

/**
 * AuthFlow — self-contained authentication experience.
 * Renders: sign in, sign up, email verification, forgot & reset password views.
 *
 * @param {'login'|'signup'|'forgot'} initialView
 * @param {string} initialEmail - prefill email (reset-password deep link)
 * @param {boolean} startAtReset - open directly on the reset step
 * @param {'modal'|'page'} variant
 * @param {Function} onComplete - called after successful login/verification (parent can close modal)
 * @param {boolean} autoRedirectIfAuthed - bounce already-authenticated visitors to their dashboard
 * @param {{verified?: string, reset?: string, unverified?: string}} notices - query-string notices from deep links
 * @param {string} returnUrl - post-login destination (from ProtectedRoute redirects)
 */
export default function AuthFlow({
  initialView = "login",
  initialEmail = "",
  startAtReset = false,
  variant = "modal",
  onComplete,
  autoRedirectIfAuthed = false,
  notices = {},
  returnUrl = "",
}) {
  const router = useRouter();
  const {
    user, isAuthenticated, isCheckingAuth, checkAuth,
    login, signup, verifyEmail, resendOtp, forgotPassword, resetPassword,
    isLoading, error, clearError, cooldownRemaining, tickCooldown,
  } = useAuthStore();

  const [view, setView] = useState(startAtReset && initialEmail ? "reset" : initialView);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState(
    notices.verified
      ? "Email verified successfully. Sign in to continue."
      : notices.reset
      ? "Password updated. Sign in with your new password."
      : ""
  );
  const [resendNotice, setResendNotice] = useState("");

  const meta = VIEW_META[view] || VIEW_META.login;

  /* Session bootstrap + optional auto-redirect for standalone pages */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const finish = useCallback(
    (u) => {
      onComplete?.(u);
      if (returnUrl && returnUrl.startsWith("/")) {
        router.replace(returnUrl);
        return;
      }
      const role = (u?.role || "").toUpperCase();
      router.replace(role === "ADMIN" ? "/admin" : role === "INSTRUCTOR" ? "/instructor" : "/dashboard");
    },
    [onComplete, returnUrl, router]
  );

  useEffect(() => {
    if (autoRedirectIfAuthed && !isCheckingAuth && isAuthenticated && user) finish(user);
  }, [autoRedirectIfAuthed, isCheckingAuth, isAuthenticated, user, finish]);

  /* OTP resend cooldown countdown */
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const t = setInterval(() => tickCooldown(), 1000);
    return () => clearInterval(t);
  }, [cooldownRemaining, tickCooldown]);

  const resetFeedback = () => {
    if (error) clearError();
    if (localError) setLocalError("");
    if (successMsg) setSuccessMsg("");
    if (resendNotice) setResendNotice("");
  };

  const goTo = (next) => {
    resetFeedback();
    setView(next);
  };

  const fullOtp = otp.join("");

  /* ── Submit handlers ────────────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Please enter both your email and password.");
      return;
    }
    const result = await login(email, password);

    if (result.requiresVerification) {
      setEmail(result.email || email);
      setOtp(["", "", "", "", "", ""]);
      setLocalError("");
      setView("verify");
      toast.error("Please verify your email to access your account.");
      return;
    }
    if (result.success) {
      toast.success(`Welcome back, ${result.user?.name || "Explorer"}!`);
      finish(result.user);
    } else {
      toast.error(result.error || "Invalid email or password.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setLocalError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }
    const result = await signup({ name, email, password, role: "LEARNER" });
    if (result.success) {
      toast.success(result.message || "Verification code sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setLocalError("");
      setView("verify");
    } else {
      toast.error(result.error || "Registration failed. Please try again.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      setLocalError("Please provide your registered email address.");
      return;
    }
    if (fullOtp.length !== 6) {
      setLocalError("Please enter all 6 digits of the verification code.");
      return;
    }
    const result = await verifyEmail(email, fullOtp);
    if (result.success) {
      toast.success("Email verified! Welcome to QubitMinds.");
      finish(result.user);
    } else {
      toast.error(result.error || "Verification failed. Please check the code.");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) {
      setLocalError("Please provide your email address.");
      return;
    }
    const result = await forgotPassword(email);
    if (result.success) {
      toast.success("Password reset code sent to your email.");
      setOtp(["", "", "", "", "", ""]);
      setLocalError("");
      setView("reset");
    } else {
      toast.error(result.error || "Failed to send reset code. Please try again.");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email || fullOtp.length !== 6 || !password) {
      setLocalError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }
    const result = await resetPassword(email, fullOtp, password);
    if (result.success) {
      toast.success("Password updated successfully! Please sign in.");
      setPassword("");
      setConfirmPassword("");
      setOtp(["", "", "", "", "", ""]);
      setLocalError("");
      setSuccessMsg("Password updated. Sign in with your new password.");
      setView("login");
    } else {
      toast.error(result.error || "Password reset failed. Please check the code.");
    }
  };

  const handleResend = async (type) => {
    if (cooldownRemaining > 0 || isLoading || !email) return;
    resetFeedback();
    const result = await resendOtp(email, type);
    if (result.success) {
      toast.success("A new 6-digit code has been dispatched.");
      setResendNotice("A new 6-digit code has been sent to your email.");
    } else {
      toast.error(result.error || "Failed to resend code. Please try again.");
    }
  };

  const switchViewLine = variant === "modal" ? "text-[13px]" : "text-[13.5px]";

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        {variant === "modal" && (
          <div className="flex justify-center mb-5">
            <QubitMindMark size={40} />
          </div>
        )}
        <div className="text-center">
          <h2 className="text-[22px] sm:text-2xl font-heading font-semibold tracking-tight text-[var(--color-text)]">
            {meta.title}
          </h2>
          <p className="mt-1.5 text-[13.5px] text-[var(--color-muted)]">
            {view === "verify" && email ? (
              <>We sent a 6-digit code to <span className="font-medium text-[var(--color-text)]">{email}</span></>
            ) : (
              meta.subtitle
            )}
          </p>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3 mb-5">
        {notices.unverified && view === "verify" && (
          <Alert tone="info">You must verify your email before signing in.</Alert>
        )}
        {successMsg && <Alert tone="success">{successMsg}</Alert>}
        {resendNotice && <Alert tone="success">{resendNotice}</Alert>}
        {(error || localError) && <Alert tone="error">{error || localError}</Alert>}
      </div>

      {/* ── Sign in ── */}
      {view === "login" && (
        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div>
            <label className={LABEL} htmlFor="auth-email">Email</label>
            <div className="relative">
              <LuMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { resetFeedback(); setEmail(e.target.value); }}
                placeholder="name@institution.edu"
                className={`${INPUT} pl-10`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`${LABEL} mb-0`} htmlFor="auth-password">Password</label>
              <button
                type="button"
                onClick={() => goTo("forgot")}
                className="text-[12.5px] font-medium text-[var(--color-primary)] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <LuLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => { resetFeedback(); setPassword(e.target.value); }}
                placeholder="••••••••"
                className={`${INPUT} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
              >
                {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={BTN_PRIMARY}>
            {isLoading ? (
              <><LuLoaderCircle className="animate-spin" size={17} /> Signing in...</>
            ) : (
              <>Sign In <LuArrowRight size={16} /></>
            )}
          </button>

          <p className={`text-center text-[var(--color-muted)] pt-1 ${switchViewLine}`}>
            New to QubitMinds?{" "}
            <button type="button" onClick={() => goTo("signup")} className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
              Create an account
            </button>
          </p>

          {/* Demo access */}
          <div className="pt-4 mt-1 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2 mb-2.5 justify-center">
              <LuSparkles size={12} className="text-[var(--color-muted)]" />
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Demo access
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => { resetFeedback(); setEmail(acc.email); setPassword(acc.password); }}
                  className="py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[12px] font-medium text-[var(--color-muted)] hover:border-[var(--color-primary)]/50 hover:text-[var(--color-text)] transition-colors cursor-pointer"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* ── Sign up ── */}
      {view === "signup" && (
        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <LuSparkles size={15} />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[var(--color-text)] leading-tight">Learner account</div>
              <div className="text-[11.5px] text-[var(--color-muted)] leading-tight mt-0.5">Courses, playground, AI tutor & challenges</div>
            </div>
          </div>

          <div>
            <label className={LABEL} htmlFor="auth-name">Full name</label>
            <div className="relative">
              <LuUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => { resetFeedback(); setName(e.target.value); }}
                placeholder="Ada Lovelace"
                className={`${INPUT} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={LABEL} htmlFor="auth-signup-email">Email</label>
            <div className="relative">
              <LuMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
              <input
                id="auth-signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { resetFeedback(); setEmail(e.target.value); }}
                placeholder="ada@research.edu"
                className={`${INPUT} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={LABEL} htmlFor="auth-signup-password">Password</label>
            <div className="relative">
              <LuLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
              <input
                id="auth-signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => { resetFeedback(); setPassword(e.target.value); }}
                placeholder="Min. 8 characters"
                className={`${INPUT} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
              >
                {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            </div>
            <StrengthMeter password={password} />
          </div>

          <div>
            <label className={LABEL} htmlFor="auth-confirm">Confirm password</label>
            <input
              id="auth-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => { resetFeedback(); setConfirmPassword(e.target.value); }}
              placeholder="Repeat password"
              className={INPUT}
            />
          </div>

          <button type="submit" disabled={isLoading} className={BTN_PRIMARY}>
            {isLoading ? (
              <><LuLoaderCircle className="animate-spin" size={17} /> Creating account...</>
            ) : (
              <>Create Account <LuArrowRight size={16} /></>
            )}
          </button>

          <p className={`text-center text-[var(--color-muted)] pt-1 ${switchViewLine}`}>
            Already have an account?{" "}
            <button type="button" onClick={() => goTo("login")} className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
              Sign in
            </button>
          </p>
        </form>
      )}

      {/* ── Verify email (OTP) ── */}
      {view === "verify" && (
        <form onSubmit={handleVerify} className="space-y-5" noValidate>
          {!initialEmail && (
            <div>
              <label className={LABEL} htmlFor="auth-verify-email">Email address</label>
              <input
                id="auth-verify-email"
                type="email"
                value={email}
                onChange={(e) => { resetFeedback(); setEmail(e.target.value); }}
                placeholder="name@institution.edu"
                className={INPUT}
              />
            </div>
          )}

          <div>
            <label className={LABEL}>Verification code</label>
            <OtpInput otp={otp} setOtp={setOtp} onDigitChange={resetFeedback} />
          </div>

          <button type="submit" disabled={isLoading || fullOtp.length !== 6} className={BTN_PRIMARY}>
            {isLoading ? (
              <><LuLoaderCircle className="animate-spin" size={17} /> Verifying...</>
            ) : (
              <>Verify Email <LuArrowRight size={16} /></>
            )}
          </button>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => goTo("login")}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
            >
              <LuArrowLeft size={14} /> Back to sign in
            </button>
            <button
              type="button"
              onClick={() => handleResend("EMAIL_VERIFICATION")}
              disabled={cooldownRemaining > 0 || isLoading}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-primary)] hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
            >
              <LuRefreshCw size={13} />
              {cooldownRemaining > 0 ? `Resend in ${cooldownRemaining}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {/* ── Forgot password ── */}
      {view === "forgot" && (
        <form onSubmit={handleForgot} className="space-y-5" noValidate>
          <div>
            <label className={LABEL} htmlFor="auth-forgot-email">Email</label>
            <div className="relative">
              <LuMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
              <input
                id="auth-forgot-email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => { resetFeedback(); setEmail(e.target.value); }}
                placeholder="name@institution.edu"
                className={`${INPUT} pl-10`}
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={BTN_PRIMARY}>
            {isLoading ? (
              <><LuLoaderCircle className="animate-spin" size={17} /> Sending code...</>
            ) : (
              <>Send Reset Code <LuArrowRight size={16} /></>
            )}
          </button>

          <button
            type="button"
            onClick={() => goTo("login")}
            className="w-full inline-flex items-center justify-center gap-1.5 text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
          >
            <LuArrowLeft size={14} /> Back to sign in
          </button>
        </form>
      )}

      {/* ── Reset password ── */}
      {view === "reset" && (
        <form onSubmit={handleReset} className="space-y-4" noValidate>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[12.5px] leading-snug flex items-start gap-2">
            <LuShieldCheck size={15} className="shrink-0 mt-0.5" />
            <span>Resetting your password signs you out of all other active devices.</span>
          </div>

          <div>
            <label className={LABEL} htmlFor="auth-reset-email">Email</label>
            <input
              id="auth-reset-email"
              type="email"
              value={email}
              onChange={(e) => { resetFeedback(); setEmail(e.target.value); }}
              placeholder="name@institution.edu"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>6-digit reset code</label>
            <OtpInput otp={otp} setOtp={setOtp} onDigitChange={resetFeedback} />
          </div>

          <div>
            <label className={LABEL} htmlFor="auth-reset-password">New password</label>
            <div className="relative">
              <LuKeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
              <input
                id="auth-reset-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => { resetFeedback(); setPassword(e.target.value); }}
                placeholder="Min. 8 characters"
                className={`${INPUT} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
              >
                {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            </div>
            <StrengthMeter password={password} />
          </div>

          <div>
            <label className={LABEL} htmlFor="auth-reset-confirm">Confirm new password</label>
            <input
              id="auth-reset-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => { resetFeedback(); setConfirmPassword(e.target.value); }}
              placeholder="Repeat new password"
              className={INPUT}
            />
          </div>

          <button type="submit" disabled={isLoading} className={BTN_PRIMARY}>
            {isLoading ? (
              <><LuLoaderCircle className="animate-spin" size={17} /> Resetting password...</>
            ) : (
              <>Reset Password <LuArrowRight size={16} /></>
            )}
          </button>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => goTo("login")}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
            >
              <LuArrowLeft size={14} /> Back to sign in
            </button>
            <button
              type="button"
              onClick={() => handleResend("PASSWORD_RESET")}
              disabled={cooldownRemaining > 0 || isLoading}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-primary)] hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
            >
              <LuRefreshCw size={13} />
              {cooldownRemaining > 0 ? `Resend in ${cooldownRemaining}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {/* Footer brand strip */}
      {variant === "modal" && (
        <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-[var(--color-muted)] tracking-wide">
            Secured with HttpOnly session cookies
          </span>
        </div>
      )}
    </div>
  );
}
