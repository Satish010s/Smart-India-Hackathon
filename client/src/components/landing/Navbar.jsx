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
  --n-bg:#fafaf9;
  --n-surface:#ffffff;
  --n-surface2:#f4f4f5;
  --n-border:#e4e4e7;
  --n-border-strong:#d4d4d8;
  --n-text:#111418;
  --n-muted:#5b6572;
  --n-accent:#0f766e;
  --n-accent-soft:rgba(15,118,110,0.09);
  --n-danger:#be123c;
  --n-danger-soft:rgba(190,18,60,0.08);
  --n-shadow:0 20px 50px -20px rgba(15,23,42,0.22);
}
.dark .qm-nav,
[data-theme="dark"] .qm-nav{
  --n-bg:#0a0c0f;
  --n-surface:#0f1318;
  --n-surface2:#141a21;
  --n-border:#1f2730;
  --n-border-strong:#2b3540;
  --n-text:#e8ecf1;
  --n-muted:#8a95a3;
  --n-accent:#5eead4;
  --n-accent-soft:rgba(94,234,212,0.1);
  --n-danger:#fb7185;
  --n-danger-soft:rgba(251,113,133,0.1);
  --n-shadow:0 24px 60px -20px rgba(0,0,0,0.75);
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
      {/* FIXED header: always pinned to the viewport top, never changes on scroll */}
      <header
        className="qm-nav fixed top-0 left-0 right-0 z-[100] border-b"
        style={{ background: "var(--n-bg)", borderColor: "var(--n-border)" }}
      >
        <style>{NAV_CSS}</style>

        {/* Wavy Background Contained Inside Navbar */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0" style={{ transform: "rotate(180deg) scaleX(-1)" }}>
          <svg
            className="block w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base Background (Solid Soft Peach) */}
            <rect width="1440" height="320" fill="#f1a17e" fillOpacity={isDark ? "0.2" : "0.1"} />
            {/* Layer 1 (Soft Peach) */}
            <path
              fill="#f1a17e"
              fillOpacity={isDark ? "0.4" : "0.2"}
              d="M0,160L48,149.3C96,139,192,117,288,138.7C384,160,480,224,576,245.3C672,267,768,245,864,208C960,171,1056,117,1152,112C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            {/* Layer 2 (Soft Olive / Yellow Green) */}
            <path
              fill="#dee64c"
              fillOpacity={isDark ? "0.4" : "0.2"}
              d="M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,74.7C672,75,768,117,864,154.7C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`flex items-center justify-between ${NAV_H}`}>
            <QubitMindLogo iconSize={40} subtitle="Quantum Learning Lab" />

            {/* Desktop links */}
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const active = activeId === link.href.slice(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    aria-current={active ? "true" : undefined}
                    className={`relative px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 hover:text-[color:var(--n-text)] ${focusRing}`}
                    style={{ color: active ? "var(--n-text)" : "var(--n-muted)" }}
                  >
                    {link.name}
                    <span
                      className="absolute left-4 right-4 bottom-0 h-px transition-opacity duration-200"
                      style={{ background: "var(--n-accent)", opacity: active ? 1 : 0 }}
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
                      className={`group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] ${focusRing}`}
                      style={primaryCta}
                    >
                      Start Learning Free
                      <LuArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
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
                    className="text-center px-4 py-3 rounded-lg text-sm font-semibold"
                    style={primaryCta}
                  >
                    Start Free
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