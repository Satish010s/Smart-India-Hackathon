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
            {theme === 'dark' ? <LuSun size={18} className="text-yellow-400" /> : <LuMoon size={18} className="text-indigo-600" />}
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
              <span className="text-xs font-extrabold text-[var(--color-text)] max-w-[130px] truncate tracking-tight group-hover:text-cyan-400 transition-colors">
                {user?.name || 'Account'}
              </span>
              <span className="text-[10px] text-[var(--color-muted)] font-mono max-w-[140px] truncate">
                {user?.email || 'authenticated'}
              </span>
            </div>

            {/* Profile Avatar Icon on Right */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-black uppercase shadow-md shadow-cyan-500/20 ring-2 ring-cyan-500/30 group-hover:ring-cyan-400 group-hover:shadow-cyan-500/40 transition-all">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--color-surface)]" />
            </div>

            <LuChevronDown
              size={14}
              className={`text-[var(--color-muted)] hidden sm:block transition-transform duration-200 ${
                isProfileOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-[var(--color-text)]'
              }`}
            />
          </button>

          {/* Glassmorphic Profile Dropdown Card */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2.5 w-64 rounded-3xl bg-[var(--color-surface)]/95 backdrop-blur-xl border border-[var(--color-border)] shadow-2xl p-2.5 space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Header User Card Banner */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 border border-[var(--color-border)]/60 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center text-sm font-black uppercase shadow-md shadow-cyan-500/20 ring-2 ring-white/20">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[var(--color-surface)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text)] truncate">{user?.name || 'Quantum Learner'}</div>
                    <div className="text-[10px] text-[var(--color-muted)] font-mono truncate">{user?.email || 'authenticated'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)]/40 text-[10px]">
                  <span className={`font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${roleTheme.badgeBg} ${roleTheme.badgeText} ${roleTheme.badgeBorder}`}>
                    {roleTheme.name}
                  </span>
                  <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <LuSparkles size={11} /> Verified
                  </span>
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-0.5 pt-1">
                <Link
                  href={getDashboardHref()}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-text)] hover:bg-cyan-500/15 hover:text-cyan-400 transition-all"
                >
                  <LuLayoutDashboard size={15} className="text-cyan-400" />
                  <span>My Portal Dashboard</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-text)] hover:bg-cyan-500/15 hover:text-cyan-400 transition-all"
                >
                  <LuUser size={15} className="text-indigo-400" />
                  <span>User Profile &amp; Stats</span>
                </Link>

                {role === 'LEARNER' && (
                  <Link
                    href="/achievement"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-text)] hover:bg-amber-500/15 hover:text-amber-400 transition-all"
                  >
                    <LuMedal size={15} className="text-amber-400" />
                    <span>Achievements &amp; Badges</span>
                  </Link>
                )}

                {role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/15 transition-all"
                  >
                    <LuShieldAlert size={15} />
                    <span>Admin Control Center</span>
                  </Link>
                )}

                {role === 'INSTRUCTOR' && (
                  <Link
                    href="/instructor"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-500 hover:bg-emerald-500/15 transition-all"
                  >
                    <LuGraduationCap size={15} />
                    <span>Faculty Center</span>
                  </Link>
                )}
              </div>

              {/* Divider & Sign Out */}
              <div className="pt-1 border-t border-[var(--color-border)]/60">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <LuLogOut size={15} />
                    <span>Sign Out</span>
                  </div>
                  <span className="text-[9px] font-mono uppercase text-rose-400/80">Exit</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
