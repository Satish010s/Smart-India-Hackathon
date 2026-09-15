"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LuCpu,
  LuLogOut,
  LuX,
  LuSparkles,
} from 'react-icons/lu';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLE_NAV_ITEMS, ROLE_THEMES } from './navConfig';

function SidebarInner({
  role: overrideRole,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') : null;
  const { user, role: userRole, logout } = useAuthStore();

  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Controlled or uncontrolled collapse state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const activeRole = (overrideRole || user?.role || userRole || 'LEARNER').toUpperCase();
  const navItems = ROLE_NAV_ITEMS[activeRole] || ROLE_NAV_ITEMS.LEARNER;
  const theme = ROLE_THEMES[activeRole] || ROLE_THEMES.LEARNER;

  const isItemActive = (item) => {
    const [rawPath, rawQuery] = item.href.split('?');
    const [itemPath, itemHash] = rawPath.split('#');
    const itemParams = rawQuery ? new URLSearchParams(rawQuery) : null;
    const itemTab = itemParams ? itemParams.get('tab') : null;

    if (pathname !== itemPath) {
      if (itemPath !== '/' && itemPath !== '/dashboard' && pathname.startsWith(itemPath)) {
        return true;
      }
      return false;
    }

    // 1. If item has a query tab (e.g. ?tab=users, ?tab=simulations, ?tab=hardware)
    if (itemTab) {
      return currentTab === itemTab;
    }

    // 2. If item has a hash (e.g. #users)
    if (itemHash) {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        return hash === itemHash;
      }
      return false;
    }

    // 3. If item has NO query tab or hash (root hub view like /admin, /instructor):
    // Active only when there is no query tab or when tab is 'overview'
    return !currentTab || currentTab === 'overview';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`h-16 border-b border-[var(--color-border)] flex items-center ${
            isCollapsed ? 'justify-center px-0' : 'justify-between px-4'
          }`}
        >
          <Link
            href="/"
            className={`flex items-center gap-2.5 ${
              isCollapsed ? 'justify-center' : 'overflow-hidden'
            }`}
            title="QubitMind Platform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] flex-shrink-0 flex items-center justify-center text-white shadow-md">
              <LuCpu size={22} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base tracking-tight text-[var(--color-text)]">
                  QubitMind
                </span>
                <span className="text-[10px] text-[var(--color-muted)] font-mono uppercase tracking-wider">
                  Platform Hub
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button (only shown in mobile drawer when open) */}
          {!isCollapsed && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer"
              aria-label="Close Mobile Sidebar"
            >
              <LuX size={20} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onMobileClose}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-sm shadow-[var(--color-primary)]/20 font-semibold'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/30'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-[var(--color-muted)] group-hover:text-[var(--color-text)]'
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-[var(--color-border)]/50 text-[var(--color-muted)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Floating Tooltip in Collapsed Mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[var(--color-text)] text-[var(--color-background)] text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                    {item.label}
                    {item.badge && <span className="ml-1.5 opacity-75 font-mono">({item.badge})</span>}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: User Card & Logout */}
        <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex-shrink-0 flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[var(--color-text)] truncate">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-[10px] text-[var(--color-muted)] font-mono truncate">
                    {user?.email || 'authenticated'}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-[var(--color-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Logout"
            >
              <LuLogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function Sidebar(props) {
  return (
    <Suspense fallback={null}>
      <SidebarInner {...props} />
    </Suspense>
  );
}
