"use client";

import React, { useState, useEffect, useRef } from "react";
import QubitMindLogo from "../common/QubitMindLogo";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  LuMenu, LuX, LuMoon, LuSun, LuLogOut,
  LuLayoutDashboard, LuGraduationCap, LuChevronDown, LuArrowRight,
} from "react-icons/lu";
import { useAuthStore } from "../../store/useAuthStore";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Backends", href: "#backends" },
  { name: "For Instructors", href: "#instructors" },
  { name: "FAQ", href: "#faq" },
];

const NAV_CSS = `
.qm-nav{
  --n-bg:rgba(250,250,249,0.85);
  --n-surface:#ffffff;
  --n-surface2:#f4f4f5;
  --n-border:rgba(214,74,23,0.22);
  --n-border-strong:#d64a17;
  --n-text:#09090b;
  --n-muted:#52525b;
  --n-accent:#0f766e;
  --n-accent-soft:rgba(15,118,110,0.09);
  --n-danger:#be123c;
  --n-danger-soft:rgba(190,18,60,0.08);
  --n-shadow:0 12px 30px -15px rgba(15,23,42,0.12);
}
.dark .qm-nav,
[data-theme="dark"] .qm-nav{
  --n-bg:rgba(10,12,15,0.88);
  --n-surface:#0f1318;
  --n-surface2:#141a21;
  --n-border:rgba(255,107,0,0.25);
  --n-border-strong:#ff7a00;
  --n-text:#ffffff;
  --n-muted:#a1a1aa;
  --n-accent:#5eead4;
  --n-accent-soft:rgba(94,234,212,0.12);
  --n-danger:#fb7185;
  --n-danger-soft:rgba(251,113,133,0.1);
  --n-shadow:0 20px 40px -15px rgba(0,0,0,0.75);
}
html{scroll-padding-top:6rem;}
`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--n-accent)]";

/* Navbar height: 72px mobile, 96px desktop (used by header + spacer) */
const NAV_H = "h-[72px] lg:h-24";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  useEffect(() => {
    setMounted(true);
    checkAuth();
    const onClickOut = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("mousedown", onClickOut);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onClickOut);
      document.removeEventListener("keydown", onKey);
    };
  }, [checkAuth]);

  /* Active section highlight */
  useEffect(() => {
    const els = NAV_LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "INSTRUCTOR") return "/instructor";
    return "/dashboard";
  };

  const portalLabel =
    user?.role === "ADMIN" ? "Admin Console" : user?.role === "INSTRUCTOR" ? "Faculty Portal" : "My Dashboard";

  const badgeStyle = (role) => {
    if (role === "ADMIN")
      return { color: "var(--n-danger)", background: "var(--n-danger-soft)", borderColor: "var(--n-danger)" };
    if (role === "INSTRUCTOR")
      return { color: "var(--n-accent)", background: "var(--n-accent-soft)", borderColor: "var(--n-accent)" };
    return { color: "var(--n-muted)", background: "var(--n-surface2)", borderColor: "var(--n-border-strong)" };
  };

  const primaryCta = { background: "var(--n-text)", color: "var(--n-bg)" };

  const themeButton = mounted ? (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`w-10 h-10 inline-flex items-center justify-center rounded-full border border-[color:var(--n-border)] text-[color:var(--n-muted)] hover:text-[color:var(--n-text)] hover:border-[color:var(--n-border-strong)] transition-colors cursor-pointer ${focusRing}`}
    >
      {isDark ? <LuSun size={17} /> : <LuMoon size={17} />}
    </button>
  ) : (
    <span className="inline-block w-10 h-10" aria-hidden="true" />
  );

  return (
    <>
      {/* FIXED header: unified glassmorphic navbar with bottom wave accent */}
      <header
        className="qm-nav fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b transition-colors duration-300"
        style={{ background: "var(--n-bg)", borderColor: "var(--n-border)" }}
      >
        <style>{NAV_CSS}</style>

        {/* Top vibrant orange highlight line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#ff5500] via-[#ff9500] to-[#ea580c] z-20 pointer-events-none opacity-90 shadow-[0_0_8px_rgba(255,107,0,0.5)]" />

        {/* Ambient Color Wash Fill: warm orange glow on the left, radiant olive/teal on the right, smooth warm gradient across */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Left Warm Orange/Sienna Ambient Aura */}
          <div
            className="absolute -top-10 -left-12 w-80 h-36 rounded-full blur-2xl opacity-40 dark:opacity-30 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #ff5500 0%, #d64a17 50%, transparent 80%)",
            }}
          />

          {/* Center Smooth Ambient Gradient */}
          <div
            className="absolute inset-0 opacity-25 dark:opacity-20 pointer-events-none"
            style={{
              background: isDark
                ? "linear-gradient(90deg, rgba(255,85,0,0.2) 0%, rgba(214,74,23,0.1) 40%, rgba(222,230,76,0.15) 100%)"
                : "linear-gradient(90deg, rgba(255,107,0,0.25) 0%, rgba(251,146,60,0.12) 45%, rgba(222,230,76,0.22) 100%)",
            }}
          />

          {/* Right Radiant Olive/Teal Ambient Aura */}
          <div
            className="absolute -top-10 -right-12 w-80 h-36 rounded-full blur-2xl opacity-40 dark:opacity-30 pointer-events-none"
            style={{
              background: isDark
                ? "radial-gradient(circle, #dee64c 0%, #14b8a6 50%, transparent 80%)"
                : "radial-gradient(circle, #c8d626 0%, #0f766e 50%, transparent 80%)",
            }}
          />
        </div>

        {/* Bottom edge multi-tone wave ribbon (Orange + Burnt Sienna + Olive) */}
        <div className="absolute bottom-0 inset-x-0 h-4 sm:h-5 overflow-hidden pointer-events-none z-0">
          <svg
            className="absolute bottom-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bottomWaveOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff5500" stopOpacity="0.95" />
                <stop offset="30%" stopColor="#ff7a00" stopOpacity="1" />
                <stop offset="70%" stopColor="#ff9500" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="bottomWaveSienna" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d64a17" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#ea580c" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#c2410c" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="bottomWaveOlive" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#dee64c" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#d4e320" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b5c418" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Olive lower wave */}
            <path
              fill="url(#bottomWaveOlive)"
              d="M0,45 C240,75 480,15 720,45 C960,75 1200,15 1440,40 L1440,80 L0,80 Z"
            />

            {/* Sienna middle wave */}
            <path
              fill="url(#bottomWaveSienna)"
              d="M0,30 C280,60 520,8 760,35 C1000,65 1220,10 1440,28 L1440,80 L0,80 Z"
            />

            {/* Top high-contrast electric orange wave */}
            <path
              fill="url(#bottomWaveOrange)"
              d="M0,15 C320,48 560,4 800,24 C1040,44 1260,8 1440,15 L1440,80 L0,80 Z"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`flex items-center justify-between ${NAV_H}`}>
            <QubitMindLogo iconSize={40} subtitle="Quantum Learning Lab" />

            {/* Desktop links - clean text, NO color box */}
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const active = activeId === link.href.slice(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    aria-current={active ? "true" : undefined}
                    className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:text-[color:var(--n-text)] ${focusRing}`}
                    style={{ color: active ? (isDark ? "#ff9500" : "#d64a17") : "var(--n-muted)" }}
                  >
                    {link.name}
                    <span
                      className="absolute left-4 right-4 bottom-0 h-0.5 rounded-full transition-opacity duration-200 bg-gradient-to-r from-[#ff5500] to-[#dee64c]"
                      style={{ opacity: active ? 1 : 0 }}
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {themeButton}

              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated && user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className={`flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-[var(--n-surface2)] transition-colors cursor-pointer ${focusRing}`}
                      aria-label="User menu"
                      aria-haspopup="menu"
                      aria-expanded={profileOpen}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold uppercase border"
                        style={{
                          background: "var(--n-accent-soft)",
                          color: "var(--n-accent)",
                          borderColor: "var(--n-accent)",
                        }}
                      >
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <span className="hidden xl:block text-sm font-medium max-w-[120px] truncate text-[color:var(--n-text)]">
                        {user.name}
                      </span>
                      <LuChevronDown
                        size={14}
                        className={`text-[color:var(--n-muted)] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {profileOpen && (
                      <div
                        role="menu"
                        className="absolute right-0 mt-3 w-64 rounded-xl border border-[color:var(--n-border)] p-1.5 space-y-0.5 z-50"
                        style={{ background: "var(--n-surface)", boxShadow: "var(--n-shadow)" }}
                      >
                        <div className="px-3 py-2.5 mb-1 rounded-lg border border-[color:var(--n-border)] bg-[var(--n-surface2)]">
                          <div className="text-sm font-semibold truncate text-[color:var(--n-text)]">{user.name}</div>
                          <div className="text-[11px] font-mono truncate text-[color:var(--n-muted)]">{user.email}</div>
                          <span
                            className="inline-block mt-1.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded border"
                            style={badgeStyle(user.role)}
                          >
                            {user.role}
                          </span>
                        </div>

                        <Link
                          href={getDashboardHref()}
                          role="menuitem"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[color:var(--n-text)] hover:bg-[var(--n-surface2)] transition-colors"
                        >
                          <LuLayoutDashboard size={15} style={{ color: "var(--n-accent)" }} />
                          {portalLabel}
                        </Link>

                        {user.role === "ADMIN" && (
                          <Link
                            href="/dashboard"
                            role="menuitem"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[color:var(--n-muted)] hover:text-[color:var(--n-text)] hover:bg-[var(--n-surface2)] transition-colors"
                          >
                            <LuGraduationCap size={15} /> Learner Preview
                          </Link>
                        )}

                        <div className="pt-1 mt-1 border-t border-[color:var(--n-border)]">
                          <button
                            role="menuitem"
                            onClick={() => {
                              setProfileOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[color:var(--n-danger)] hover:bg-[var(--n-danger-soft)] transition-colors cursor-pointer"
                          >
                            <LuLogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`px-5 py-2.5 rounded-full text-sm font-medium text-[color:var(--n-muted)] hover:text-[color:var(--n-text)] transition-colors ${focusRing}`}
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      id="nav-cta"
                      className={`group relative inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#ff5500] via-[#ea580c] to-[#d64a17] shadow-[0_4px_18px_rgba(255,107,0,0.38)] hover:shadow-[0_6px_24px_rgba(255,107,0,0.55)] border border-white/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden ${focusRing}`}
                    >
                      <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12 pointer-events-none" />
                      <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
                        Start Learning Free
                        <LuArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </>
                )}
              </div>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg text-[color:var(--n-text)] hover:bg-[var(--n-surface2)] transition-colors cursor-pointer ${focusRing}`}
                aria-label="Toggle navigation"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <LuX size={22} /> : <LuMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer (overlays content) */}
        {mobileOpen && (
          <div
            className="lg:hidden absolute top-full inset-x-0 mt-2 mx-4 rounded-2xl border border-[color:var(--n-border)] p-3 space-y-3 max-h-[calc(100svh-6rem)] overflow-y-auto"
            style={{ background: "var(--n-surface)", boxShadow: "var(--n-shadow)" }}
          >
            <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => {
                const active = activeId === link.href.slice(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--n-surface2)] transition-colors"
                    style={{ color: active ? "var(--n-text)" : "var(--n-muted)" }}
                  >
                    {link.name}
                    {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--n-accent)" }} />}
                  </a>
                );
              })}
            </nav>

            <div className="md:hidden pt-3 border-t border-[color:var(--n-border)] flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2.5 rounded-lg border border-[color:var(--n-border)] bg-[var(--n-surface2)] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate text-[color:var(--n-text)]">{user.name}</div>
                      <div className="text-[11px] font-mono truncate text-[color:var(--n-muted)]">{user.email}</div>
                    </div>
                    <span
                      className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border shrink-0"
                      style={badgeStyle(user.role)}
                    >
                      {user.role}
                    </span>
                  </div>
                  <Link
                    href={getDashboardHref()}
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-3 rounded-lg text-sm font-semibold"
                    style={primaryCta}
                  >
                    {portalLabel}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full text-center px-4 py-3 rounded-lg text-sm font-semibold border cursor-pointer hover:bg-[var(--n-danger-soft)] transition-colors"
                    style={{ color: "var(--n-danger)", borderColor: "var(--n-danger)" }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center px-4 py-3 rounded-lg border border-[color:var(--n-border-strong)] text-sm font-semibold text-[color:var(--n-text)] hover:bg-[var(--n-surface2)] transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="text-center px-4 py-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#ff5500] via-[#ea580c] to-[#d64a17] shadow-md shadow-orange-500/30 border border-white/20 active:scale-[0.98] transition-transform"
                  >
                    Start Learning Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

    </>
  );
}