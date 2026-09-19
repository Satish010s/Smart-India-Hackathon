"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LuLogOut, LuX, LuChevronDown } from "react-icons/lu";
import QubitMindLogo from "../common/QubitMindLogo";
import { useAuthStore } from "../../store/useAuthStore";
import { ROLE_NAV_ITEMS, ROLE_THEMES } from "./navConfig";

/* Graphite + one teal accent. Follows next-themes (.dark / data-theme). */
const SIDE_CSS = `
.qm-side{
  --s-bg:#fafaf9;
  --s-surface:#ffffff;
  --s-surface2:#f4f4f5;
  --s-border:#e4e4e7;
  --s-border-strong:#d4d4d8;
  --s-text:#111418;
  --s-muted:#5b6572;
  --s-accent:#0f766e;
  --s-accent-soft:rgba(15,118,110,0.09);
  --s-danger:#be123c;
  --s-danger-soft:rgba(190,18,60,0.08);
  --s-shadow:0 20px 50px -20px rgba(15,23,42,0.25);
}
.dark .qm-side,
[data-theme="dark"] .qm-side{
  --s-bg:#0a0c0f;
  --s-surface:#0f1318;
  --s-surface2:#141a21;
  --s-border:#1f2730;
  --s-border-strong:#2b3540;
  --s-text:#e8ecf1;
  --s-muted:#8a95a3;
  --s-accent:#5eead4;
  --s-accent-soft:rgba(94,234,212,0.1);
  --s-danger:#fb7185;
  --s-danger-soft:rgba(251,113,133,0.1);
  --s-shadow:0 24px 60px -20px rgba(0,0,0,0.75);
}
`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--s-accent)]";

function SidebarInner({
  role: overrideRole,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get("tab") : null;
  const { user, role: userRole, logout } = useAuthStore();

  const [internalCollapsed] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [flyout, setFlyout] = useState(null); // { item, top }
  const closeTimer = useRef(null);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  /* The mobile drawer is always full width */
  const compact = isCollapsed && !isMobileOpen;

  const activeRole = (overrideRole || user?.role || userRole || "LEARNER").toUpperCase();
  const navItems = ROLE_NAV_ITEMS[activeRole] || ROLE_NAV_ITEMS.LEARNER;
  const theme = ROLE_THEMES[activeRole] || ROLE_THEMES.LEARNER;

  const closeMobile = () => onMobileClose && onMobileClose();
  const toggleSub = (label) => setExpanded((p) => ({ ...p, [label]: p[label] === false ? true : false }));

  /* Flyout (collapsed mode) helpers */
  const openFlyout = (item, top) => {
    if (!compact) return;
    clearTimeout(closeTimer.current);
    setFlyout({ item, top });
  };
  const closeFlyoutSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setFlyout(null), 120);
  };
  const cancelClose = () => clearTimeout(closeTimer.current);

  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => {
    if (!compact) setFlyout(null);
  }, [compact]);
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e) => e.key === "Escape" && closeMobile();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileOpen]);

  const isItemActive = (item) => {
    if (item.subItems) return item.subItems.some((sub) => isItemActive(sub));

    const [rawPath, rawQuery] = item.href.split("?");
    const [itemPath, itemHash] = rawPath.split("#");
    const itemParams = rawQuery ? new URLSearchParams(rawQuery) : null;
    const itemTab = itemParams ? itemParams.get("tab") : null;

    if (pathname !== itemPath) {
      if (
        itemPath !== "/" &&
        itemPath !== "/dashboard" &&
        itemPath !== "/playground" &&
        pathname.startsWith(itemPath)
      ) {
        return true;
      }
      return false;
    }

    // 1. Query tab (?tab=circuit, ?tab=bloch)
    if (itemTab) {
      if (!currentTab && itemTab === "circuit" && pathname === "/playground") return true;
      return currentTab === itemTab;
    }

    // 2. Hash (#users)
    if (itemHash) {
      if (typeof window !== "undefined") {
        return window.location.hash.replace("#", "") === itemHash;
      }
      return false;
    }

    // 3. No tab or hash
    return !currentTab || currentTab === "overview";
  };

  return (
    <div className="qm-side">
      <style>{SIDE_CSS}</style>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-[width,transform] duration-300 ease-out motion-reduce:transition-none ${
          compact ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          background: "var(--s-bg)",
          borderColor: "var(--s-border)",
          boxShadow: isMobileOpen ? "var(--s-shadow)" : "none",
        }}
      >
        {/* Header */}
        <div
          className={`h-16 shrink-0 border-b flex items-center ${
            compact ? "justify-center px-0" : "justify-between px-4"
          }`}
          style={{ borderColor: "var(--s-border)" }}
        >
          <QubitMindLogo isCollapsed={compact} iconSize={36} badgeText={theme?.name} />

          {!compact && (
            <button
              onClick={closeMobile}
              className={`lg:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg text-[color:var(--s-muted)] hover:text-[color:var(--s-text)] hover:bg-[var(--s-surface2)] cursor-pointer transition-colors ${focusRing}`}
              aria-label="Close sidebar"
            >
              <LuX size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            const hasSub = Boolean(item.subItems && item.subItems.length);
            const isExpanded = expanded[item.label] !== false;

            return (
              <div
                key={item.label}
                onMouseEnter={(e) => openFlyout(item, e.currentTarget.getBoundingClientRect().top)}
                onMouseLeave={closeFlyoutSoon}
                onFocus={(e) => openFlyout(item, e.currentTarget.getBoundingClientRect().top)}
                onBlur={closeFlyoutSoon}
              >
                <div className="flex items-center gap-1">
                  <Link
                    href={item.href}
                    aria-current={isActive && !hasSub ? "page" : undefined}
                    onClick={(e) => {
                      if (hasSub && !compact) {
                        e.preventDefault();
                        toggleSub(item.label);
                        return;
                      }
                      closeMobile();
                    }}
                    className={`relative flex-1 min-w-0 flex items-center gap-3 h-10 rounded-lg text-[13px] font-medium transition-colors ${
                      compact ? "justify-center px-0" : "px-3"
                    } ${isActive ? "" : "hover:bg-[var(--s-surface2)] hover:text-[color:var(--s-text)]"} ${focusRing}`}
                    style={{
                      color: isActive ? "var(--s-text)" : "var(--s-muted)",
                      background: isActive ? "var(--s-surface2)" : undefined,
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                        style={{ background: "var(--s-accent)" }}
                        aria-hidden="true"
                      />
                    )}
                    <Icon
                      size={18}
                      className="shrink-0"
                      style={{ color: isActive ? "var(--s-accent)" : undefined }}
                    />
                    {!compact && <span className="truncate">{item.label}</span>}
                  </Link>

                  {hasSub && !compact && (
                    <button
                      type="button"
                      onClick={() => toggleSub(item.label)}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                      aria-expanded={isExpanded}
                      className={`w-8 h-10 shrink-0 inline-flex items-center justify-center rounded-lg text-[color:var(--s-muted)] hover:text-[color:var(--s-text)] hover:bg-[var(--s-surface2)] transition-colors cursor-pointer ${focusRing}`}
                    >
                      <LuChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`}
                      />
                    </button>
                  )}
                </div>

                {/* Sub-items */}
                {hasSub && !compact && isExpanded && (
                  <div
                    className="ml-[22px] mt-0.5 mb-1 pl-3 border-l space-y-0.5"
                    style={{ borderColor: "var(--s-border)" }}
                  >
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const subActive = isItemActive(sub);
                      return (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={closeMobile}
                          aria-current={subActive ? "page" : undefined}
                          className={`flex items-center gap-2.5 h-9 px-3 rounded-lg text-xs font-medium transition-colors ${
                            subActive ? "" : "hover:bg-[var(--s-surface2)] hover:text-[color:var(--s-text)]"
                          } ${focusRing}`}
                          style={{
                            color: subActive ? "var(--s-accent)" : "var(--s-muted)",
                            background: subActive ? "var(--s-accent-soft)" : undefined,
                          }}
                        >
                          {SubIcon && <SubIcon size={15} className="shrink-0" />}
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapsed-mode flyout (rendered outside the scroll area so it never clips) */}
        {compact && flyout && (
          <div
            className="absolute left-full z-50 pl-2"
            style={{ top: flyout.top }}
            onMouseEnter={cancelClose}
            onMouseLeave={closeFlyoutSoon}
          >
            <div
              className="min-w-[168px] rounded-lg border p-1.5"
              style={{
                background: "var(--s-surface)",
                borderColor: "var(--s-border)",
                boxShadow: "var(--s-shadow)",
              }}
            >
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--s-muted)]">
                {flyout.item.label}
              </div>
              {flyout.item.subItems &&
                flyout.item.subItems.map((sub) => {
                  const subActive = isItemActive(sub);
                  return (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => {
                        setFlyout(null);
                        closeMobile();
                      }}
                      className={`flex items-center px-2.5 py-2 rounded-md text-xs font-medium transition-colors hover:bg-[var(--s-surface2)] ${focusRing}`}
                      style={{ color: subActive ? "var(--s-accent)" : "var(--s-text)" }}
                    >
                      {sub.label}
                    </Link>
                  );
                })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0 p-3 border-t" style={{ borderColor: "var(--s-border)" }}>
          <div className={`flex items-center gap-3 ${compact ? "flex-col" : "justify-between"}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold uppercase border"
                style={{
                  background: "var(--s-accent-soft)",
                  color: "var(--s-accent)",
                  borderColor: "var(--s-accent)",
                }}
                title={compact ? user?.name || "Quantum Learner" : undefined}
              >
                {user?.name?.charAt(0) || "U"}
              </div>
              {!compact && (
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate text-[color:var(--s-text)]">
                    {user?.name || "Quantum Learner"}
                  </div>
                  <div className="text-[10px] font-mono truncate text-[color:var(--s-muted)]">
                    {user?.email || "authenticated"}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => logout()}
              className={`w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-lg border border-[color:var(--s-border)] text-[color:var(--s-muted)] hover:text-[color:var(--s-danger)] hover:bg-[var(--s-danger-soft)] hover:border-[color:var(--s-danger)] transition-colors cursor-pointer ${focusRing}`}
              title="Sign out"
              aria-label="Sign out"
            >
              <LuLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function Sidebar(props) {
  return (
    <Suspense fallback={null}>
      <SidebarInner {...props} />
    </Suspense>
  );
}