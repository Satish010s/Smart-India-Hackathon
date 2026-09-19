"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LuCpu,
  LuLogOut,
  LuX,
  LuSparkles,
  LuChevronDown,
  LuChevronRight,
} from 'react-icons/lu';
import QubitMindLogo from '../common/QubitMindLogo';
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
  const [expandedSubItems, setExpandedSubItems] = useState({ Playground: true });

  const toggleSubItemExpand = (label) => {
    setExpandedSubItems(prev => ({
      ...prev,
      [label]: prev[label] === false ? true : false,
    }));
  };

  // Controlled or uncontrolled collapse state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const activeRole = (overrideRole || user?.role || userRole || 'LEARNER').toUpperCase();
  const navItems = ROLE_NAV_ITEMS[activeRole] || ROLE_NAV_ITEMS.LEARNER;
  const theme = ROLE_THEMES[activeRole] || ROLE_THEMES.LEARNER;

  const isItemActive = (item) => {
    if (item.subItems) {
      return item.subItems.some(sub => isItemActive(sub));
    }

    const [rawPath, rawQuery] = item.href.split('?');
    const [itemPath, itemHash] = rawPath.split('#');
    const itemParams = rawQuery ? new URLSearchParams(rawQuery) : null;
    const itemTab = itemParams ? itemParams.get('tab') : null;

    if (pathname !== itemPath) {
      if (itemPath !== '/' && itemPath !== '/dashboard' && itemPath !== '/playground' && pathname.startsWith(itemPath)) {
        return true;
      }
      return false;
    }

    // 1. If item has a query tab (e.g. ?tab=circuit, ?tab=bloch)
    if (itemTab) {
      if (!currentTab && itemTab === 'circuit' && pathname === '/playground') return true;
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

    // 3. If item has NO query tab or hash:
    return !currentTab || currentTab === 'overview';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] shadow-xl transition-all duration-300 ease-in-out ${
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
          <QubitMindLogo
            isCollapsed={isCollapsed}
            iconSize={38}
            badgeText={theme.name}
          />

          {/* Mobile Close Button */}
          {!isCollapsed && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/40 cursor-pointer transition-colors"
              aria-label="Close Mobile Sidebar"
            >
              <LuX size={20} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-[var(--color-border)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            const isExpanded = expandedSubItems[item.label] !== false;

            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center relative">
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.subItems) {
                        e.preventDefault();
                        if (!isCollapsed) {
                          toggleSubItemExpand(item.label);
                        }
                        return;
                      }
                      onMobileClose();
                    }}
                    className={`group relative flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 font-semibold ring-1 ring-white/20'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/40 hover:translate-x-0.5'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && !isCollapsed && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white shadow-sm" />
                    )}

                    <Icon
                      size={20}
                      className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white drop-shadow-sm' : 'text-[var(--color-muted)] group-hover:text-[var(--color-text)]'
                      }`}
                    />

                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between overflow-hidden">
                        <span className="truncate tracking-tight">{item.label}</span>
                        {item.subItems && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSubItemExpand(item.label);
                            }}
                            className="p-1 rounded-lg hover:bg-white/20 text-current opacity-80 hover:opacity-100 transition-all cursor-pointer ml-auto"
                            title={isExpanded ? "Collapse sub-menu" : "Expand sub-menu"}
                          >
                            <LuChevronDown
                              size={15}
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                            />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Floating Tooltip / Sub-items Popup in Collapsed Mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 shadow-2xl space-y-1.5 min-w-[140px]">
                        <div className="font-bold text-[10px] font-mono uppercase tracking-wider text-cyan-400 border-b border-slate-700/60 pb-1">
                          {item.label}
                        </div>
                        {item.subItems ? (
                          item.subItems.map(sub => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="flex items-center justify-between gap-2 px-2 py-1 rounded-lg hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 font-mono text-[11px] transition-colors"
                            >
                              <span>{sub.label}</span>
                            </Link>
                          ))
                        ) : (
                          <div className="text-slate-300 font-sans text-xs">{item.label}</div>
                        )}
                      </div>
                    )}
                  </Link>
                </div>

                {/* Expanded Sub-items (Collapsible Nested Menu) */}
                {item.subItems && !isCollapsed && isExpanded && (
                  <div className="pl-3 space-y-1.5 border-l-2 border-cyan-500/30 ml-5 py-1 transition-all">
                    {item.subItems.map(sub => {
                      const SubIcon = sub.icon;
                      const isSubActive = isItemActive(sub);
                      return (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={onMobileClose}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                            isSubActive
                              ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-400 font-bold border border-cyan-500/40 shadow-sm shadow-cyan-500/10 translate-x-1'
                              : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/30 hover:translate-x-0.5'
                          }`}
                        >
                          <SubIcon size={15} className={isSubActive ? 'text-cyan-400 animate-pulse' : 'text-[var(--color-muted)]'} />
                          <span className="truncate tracking-tight flex-1">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer: User Card & Logout */}
        <div className="p-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex-shrink-0 flex items-center justify-center text-xs font-black uppercase shadow-md shadow-cyan-500/20 ring-1 ring-white/20">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--color-surface)]" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[var(--color-text)] truncate">
                    {user?.name || 'Quantum Learner'}
                  </div>
                  <div className="text-[10px] text-[var(--color-muted)] font-mono truncate">
                    {user?.email || 'authenticated'}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-[var(--color-muted)] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
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
