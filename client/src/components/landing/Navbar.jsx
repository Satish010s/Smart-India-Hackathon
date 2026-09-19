"use client";

import React, { useState, useEffect, useRef } from "react";
import QubitMindLogo from "../common/QubitMindLogo";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  LuMenu, LuX, LuMoon, LuSun, LuUser, LuLogOut,
  LuLayoutDashboard, LuGraduationCap, LuChevronDown, LuArrowRight,
} from "react-icons/lu";
import { useAuthStore } from "../../store/useAuthStore";

const NAV_LINKS = [
  { name: "Features",       href: "#features" },
  { name: "How It Works",   href: "#how-it-works" },
  { name: "Backends",       href: "#backends" },
  { name: "For Instructors",href: "#instructors" },
  { name: "FAQ",            href: "#faq" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    checkAuth();
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    const onClickOut = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onClickOut);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClickOut);
    };
  }, [checkAuth]);

  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "INSTRUCTOR") return "/instructor";
    return "/dashboard";
  };

  const roleBadge = (role) => {
    if (role === "ADMIN") return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    if (role === "INSTRUCTOR") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    return "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20";
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]/60 shadow-xl shadow-[var(--color-primary)]/5"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Logo */}
          <QubitMindLogo iconSize={36} subtitle="Quantum Learning Lab" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border)]/70 rounded-full px-3 py-1.5" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/8 rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-full bg-[var(--color-surface)]/80 border border-[var(--color-border)] hover:border-[var(--color-secondary)]/40 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-all cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <LuSun size={16} className="text-amber-400" /> : <LuMoon size={16} className="text-indigo-500" />}
              </button>
            )}

            {/* Auth */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--color-border)]/30 transition-all cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
                  aria-label="User profile"
                  aria-expanded={profileOpen}
                >
                  <div className="hidden lg:flex flex-col text-right leading-tight">
                    <span className="text-xs font-bold text-[var(--color-text)] max-w-[110px] truncate group-hover:text-[var(--color-secondary)] transition-colors">{user.name}</span>
                    <span className="text-[9px] text-[var(--color-muted)] font-mono uppercase tracking-wider">{user.role}</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-black uppercase shadow-md ring-2 ring-[var(--color-primary)]/20 group-hover:ring-[var(--color-secondary)]/40 transition-all">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <LuChevronDown size={12} className={`text-[var(--color-muted)] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[var(--color-surface)]/95 backdrop-blur-xl border border-[var(--color-border)] shadow-2xl p-2 space-y-1 z-50">
                    <div className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-[var(--color-border)]/60 mb-1">
                      <div className="text-xs font-bold text-[var(--color-text)] truncate">{user.name}</div>
                      <div className="text-[10px] text-[var(--color-muted)] font-mono truncate">{user.email}</div>
                      <span className={`inline-block mt-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${roleBadge(user.role)}`}>{user.role}</span>
                    </div>
                    <Link href={getDashboardHref()} onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-secondary)]/10 hover:text-[var(--color-secondary)] transition-all">
                      <LuLayoutDashboard size={14} className="text-[var(--color-secondary)]" />
                      {user.role === "ADMIN" ? "Admin Console" : user.role === "INSTRUCTOR" ? "Faculty Portal" : "My Dashboard"}
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/30 transition-all">
                        <LuGraduationCap size={14} className="text-indigo-400" /> Learner Preview
                      </Link>
                    )}
                    <div className="pt-1 border-t border-[var(--color-border)]/60">
                      <button onClick={() => { setProfileOpen(false); logout(); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer">
                        <LuLogOut size={13} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 rounded-full border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] hover:border-[var(--color-secondary)]/50 hover:text-[var(--color-secondary)] transition-all">
                  Log In
                </Link>
                <Link href="/signup" id="nav-cta"
                  className="relative group overflow-hidden rounded-full px-5 py-2 text-xs font-extrabold text-white transition-all hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #6366f1, #e879f9)" }}
                >
                  <span className="relative z-10 flex items-center gap-1.5">Start Learning Free <LuArrowRight size={12} /></span>
                  <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer" aria-label="Toggle theme">
                {theme === "dark" ? <LuSun size={18} className="text-amber-400" /> : <LuMoon size={18} className="text-indigo-500" />}
              </button>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-border)]/30 cursor-pointer" aria-label="Toggle navigation">
              {mobileOpen ? <LuX size={22} /> : <LuMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 rounded-3xl bg-[var(--color-surface)]/95 backdrop-blur-2xl border border-[var(--color-border)] p-4 space-y-3 shadow-2xl">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/8 transition-colors">
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-[var(--color-border)]/60 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[var(--color-text)]">{user.name}</div>
                    <div className="text-[10px] text-[var(--color-muted)] font-mono">{user.email}</div>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${roleBadge(user.role)}`}>{user.role}</span>
                </div>
                <Link href={getDashboardHref()} onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-2xl text-xs font-extrabold text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, #22d3ee, #6366f1)" }}>
                  My Portal
                </Link>
                <button onClick={() => { setMobileOpen(false); logout(); }}
                  className="w-full text-center px-4 py-2 text-xs font-bold text-rose-500 border border-rose-500/30 rounded-2xl hover:bg-rose-500/10 cursor-pointer">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="text-center px-4 py-2.5 border border-[var(--color-border)] rounded-2xl font-bold text-[var(--color-text)] text-xs hover:border-[var(--color-secondary)]/50">
                  Log In
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="text-center px-4 py-2.5 rounded-2xl font-extrabold text-white text-xs shadow-md"
                  style={{ background: "linear-gradient(135deg, #6366f1, #e879f9)" }}>
                  Start Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
