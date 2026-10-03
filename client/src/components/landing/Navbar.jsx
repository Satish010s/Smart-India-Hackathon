"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import QubitMindLogo from "../common/QubitMindLogo";
import {
  LuMenu, LuX, LuMoon, LuSun, LuLogOut,
  LuLayoutDashboard, LuGraduationCap, LuChevronDown, LuArrowRight,
} from "react-icons/lu";
import { useAuthStore } from "../../store/useAuthStore";
import { useAuthModalStore } from "../../store/useAuthModalStore";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Backends", href: "#backends" },
  { name: "For instructors", href: "#instructors" },
  { name: "FAQ", href: "#faq" },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  const isDark = mounted && resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  useEffect(() => {
    setMounted(true);
    checkAuth();

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

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

    document.addEventListener("mousedown", onClickOut);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClickOut);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
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
    user?.role === "ADMIN" ? "Admin console" : user?.role === "INSTRUCTOR" ? "Faculty portal" : "My dashboard";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-background)]/85 backdrop-blur-xl border-b border-[var(--color-border)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <QubitMindLogo iconSize={34} />

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = activeId === link.href.slice(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  aria-current={active ? "true" : undefined}
                  className={`relative px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-colors ${focusRing} ${
                    active
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer ${focusRing}`}
            >
              {mounted ? isDark ? <LuSun size={16} /> : <LuMoon size={16} /> : <span className="w-4 h-4" />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer ${focusRing}`}
                    aria-label="User menu"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold uppercase bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <span className="hidden xl:block text-[13px] font-medium max-w-[120px] truncate text-[var(--color-text)]">
                      {user.name}
                    </span>
                    <LuChevronDown
                      size={14}
                      className={`text-[var(--color-muted)] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {profileOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2.5 w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 space-y-0.5 z-50 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
                    >
                      <div className="px-3 py-2.5 mb-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]">
                        <div className="text-[13px] font-semibold truncate text-[var(--color-text)]">{user.name}</div>
                        <div className="text-[11px] font-mono truncate text-[var(--color-muted)]">{user.email}</div>
                        <span className="inline-block mt-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)]">
                          {user.role}
                        </span>
                      </div>

                      <Link
                        href={getDashboardHref()}
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
                      >
                        <LuLayoutDashboard size={15} className="text-[var(--color-primary)]" />
                        {portalLabel}
                      </Link>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/dashboard"
                          role="menuitem"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
                        >
                          <LuGraduationCap size={15} /> Learner preview
                        </Link>
                      )}

                      <div className="pt-1 mt-1 border-t border-[var(--color-border)]">
                        <button
                          role="menuitem"
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <LuLogOut size={14} /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal("login")}
                    className={`px-4 py-2 text-[13.5px] font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer rounded-lg ${focusRing}`}
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => openAuthModal("signup")}
                    id="nav-cta"
                    className={`group inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13.5px] font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer ${focusRing}`}
                  >
                    Get started
                    <LuArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer ${focusRing}`}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <LuX size={18} /> : <LuMenu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 mx-4 mt-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 space-y-3 max-h-[calc(100svh-6rem)] overflow-y-auto shadow-[0_30px_70px_-25px_rgba(0,0,0,0.4)]">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const active = activeId === link.href.slice(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                    active
                      ? "bg-[var(--color-primary)]/8 text-[var(--color-text)]"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-background)]"
                  }`}
                >
                  {link.name}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
                </a>
              );
            })}
          </nav>

          <div className="md:hidden pt-3 border-t border-[var(--color-border)] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold truncate text-[var(--color-text)]">{user.name}</div>
                    <div className="text-[11px] font-mono truncate text-[var(--color-muted)]">{user.email}</div>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)] shrink-0">
                    {user.role}
                  </span>
                </div>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-[13.5px] font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                >
                  {portalLabel}
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-[13.5px] font-semibold border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal("login");
                  }}
                  className="text-center px-4 py-2.5 rounded-lg border border-[var(--color-border)] text-[13.5px] font-semibold text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal("signup");
                  }}
                  className="text-center px-4 py-2.5 rounded-lg text-[13.5px] font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] active:scale-[0.98] transition-transform cursor-pointer"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
