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
  LuUser,
  LuMedal,
  LuSparkles,
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

  const role = (user?.role || 'LEARNER').toUpperCase();
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
    <header className="sticky top-0 z-30 h-16 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] pl-4 sm:pl-6 pr-2 sm:pr-3 flex items-center justify-between transition-all">
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

        {/* Title */}
        <h1 className="text-base sm:text-lg font-extrabold font-heading text-[var(--color-text)] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Section: Theme Toggle & User Profile (Shifted Right) */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto pr-1">
        {/* Theme Switcher */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/40 transition-colors cursor-pointer"
            title="Toggle Theme"
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <LuSun size={18} className="text-yellow-400" /> : <LuMoon size={18} className="text-[var(--color-muted)]" />}
          </button>
        )}

        {/* User Profile Trigger Button (Avatar + Name & Email, No Container Box) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[var(--color-border)]/30 transition-all cursor-pointer group select-none focus:outline-none"
            aria-label="User Profile Menu"
            title={user?.name || "User Profile"}
          >
            {/* Name & Email on Left (Right-aligned text) */}
            <div className="hidden sm:flex flex-col text-right leading-tight min-w-0 pl-1">
              <span className="text-xs font-semibold text-[var(--color-text)] max-w-[130px] truncate tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
                {user?.name || 'Account'}
              </span>
              <span className="text-[10px] text-[var(--color-muted)] font-mono max-w-[140px] truncate">
                {user?.email || 'authenticated'}
              </span>
            </div>

            {/* Profile Avatar Icon on Right */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] flex items-center justify-center text-xs font-semibold uppercase transition-all">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--color-surface)]" />
            </div>

            <LuChevronDown
              size={14}
              className={`text-[var(--color-muted)] hidden sm:block transition-transform duration-200 ${
                isProfileOpen ? 'rotate-180 text-[var(--color-primary)]' : 'group-hover:text-[var(--color-text)]'
              }`}
            />
          </button>

          {/* Glassmorphic Profile Dropdown Card */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2.5 w-64 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl p-2 space-y-1 z-50">
              
              {/* Header User Card Banner */}
              <div className="p-3 rounded-lg bg-[var(--color-background,var(--bg))] border border-[var(--color-border)] space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] flex items-center justify-center text-sm font-semibold uppercase">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--color-surface)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[var(--color-text)] truncate">{user?.name || 'Quantum Learner'}</div>
                    <div className="text-[10px] text-[var(--color-muted)] font-mono truncate">{user?.email || 'authenticated'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-[var(--color-border)] text-[10px]">
                  <span className={`font-mono font-semibold uppercase px-2 py-0.5 rounded border ${roleTheme.badgeBg} ${roleTheme.badgeText} ${roleTheme.badgeBorder}`}>
                    {roleTheme.name}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/8 px-2 py-0.5 rounded flex items-center gap-1">
                    <LuSparkles size={11} /> Active
                  </span>
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-0.5 pt-1">
                <Link
                  href={getDashboardHref()}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-primary)]/8 hover:text-[var(--color-primary)] transition-colors"
                >
                  <LuLayoutDashboard size={15} className="text-[var(--color-primary)]" />
                  <span>My Portal Dashboard</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-primary)]/8 hover:text-[var(--color-primary)] transition-colors"
                >
                  <LuUser size={15} className="text-[var(--color-muted)]" />
                  <span>User Profile &amp; Stats</span>
                </Link>

                {role === 'LEARNER' && (
                  <Link
                    href="/achievement"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-border)]/60 transition-colors"
                  >
                    <LuMedal size={15} className="text-[var(--color-muted)]" />
                    <span>Achievements &amp; Badges</span>
                  </Link>
                )}

                {role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/8 transition-colors"
                  >
                    <LuShieldAlert size={15} />
                    <span>Admin Control Center</span>
                  </Link>
                )}

                {role === 'INSTRUCTOR' && (
                  <Link
                    href="/instructor"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/8 transition-colors"
                  >
                    <LuGraduationCap size={15} />
                    <span>Faculty Center</span>
                  </Link>
                )}
              </div>

              {/* Divider & Sign Out */}
              <div className="pt-1 border-t border-[var(--color-border)]">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/8 transition-colors cursor-pointer"
                >
                  <LuLogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
