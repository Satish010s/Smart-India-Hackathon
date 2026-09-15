"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  LuMenu,
  LuSun,
  LuMoon,
  LuChevronDown,
  LuLogOut,
  LuLayoutDashboard,
  LuPanelLeft,
  LuPanelLeftClose,
  LuShieldAlert,
  LuGraduationCap,
} from 'react-icons/lu';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLE_THEMES } from '../sidebar/navConfig';

export default function DashboardNavbar({
  title = 'Portal Hub',
  isCollapsed = false,
  onToggleCollapse,
  onMobileMenuClick,
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role = user?.role || 'LEARNER';
  const roleTheme = ROLE_THEMES[role] || ROLE_THEMES.LEARNER;

  const getDashboardHref = () => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'INSTRUCTOR':
        return '/instructor';
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left Section: Collapse Toggle & Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/40 transition-colors cursor-pointer"
          aria-label="Open Sidebar"
        >
          <LuMenu size={20} />
        </button>

        {/* Desktop Collapse Toggle Icon on Left Side */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/40 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <LuPanelLeft size={20} /> : <LuPanelLeftClose size={20} />}
          </button>
        )}

        {/* Title Only (Simple, no extra dynamic tab text) */}
        <h1 className="text-base sm:text-lg font-bold font-heading text-[var(--color-text)] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Section: Theme Toggle & User Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/40 transition-colors cursor-pointer"
            title="Toggle Theme"
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <LuSun size={18} /> : <LuMoon size={18} />}
          </button>
        )}

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all cursor-pointer shadow-sm"
            aria-label="User Profile Menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-[var(--color-text)] max-w-[110px] truncate">
                {user?.name || 'Account'}
              </span>
              <span className="text-[10px] text-[var(--color-muted)] font-mono">{role}</span>
            </div>
            <span
              className={`hidden md:inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${roleTheme.badgeBg} ${roleTheme.badgeText} ${roleTheme.badgeBorder}`}
            >
              {roleTheme.name}
            </span>
            <LuChevronDown size={14} className="text-[var(--color-muted)] hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-[var(--color-border)]/50">
                <div className="text-xs font-bold text-[var(--color-text)] truncate">{user?.name}</div>
                <div className="text-[11px] text-[var(--color-muted)] font-mono truncate">{user?.email}</div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${roleTheme.badgeBg} ${roleTheme.badgeText} ${roleTheme.badgeBorder}`}>
                    {role} Role
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              </div>

              <Link
                href={getDashboardHref()}
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors"
              >
                <LuLayoutDashboard size={15} />
                <span>My Portal Dashboard</span>
              </Link>

              {role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <LuShieldAlert size={15} />
                  <span>Admin Console</span>
                </Link>
              )}

              {role === 'INSTRUCTOR' && (
                <Link
                  href="/instructor"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                >
                  <LuGraduationCap size={15} />
                  <span>Faculty Center</span>
                </Link>
              )}


              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LuLogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
