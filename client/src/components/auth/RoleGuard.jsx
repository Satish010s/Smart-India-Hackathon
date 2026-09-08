"use client";

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore';
import { LuShieldAlert, LuArrowLeft, LuLock } from 'react-icons/lu';

/**
 * Role-Based Access Control Guard
 * Verifies that the authenticated user's role is in the permitted allowedRoles array.
 */
export default function RoleGuard({ allowedRoles = [], children }) {
  const { user, role } = useAuthStore();

  const userRole = (role || user?.role || '').toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());

  const hasPermission = normalizedAllowedRoles.includes(userRole);

  if (!hasPermission) {
    const getTargetDashboard = () => {
      switch (userRole) {
        case 'ADMIN':
          return '/admin';
        case 'INSTRUCTOR':
          return '/instructor';
        case 'RESEARCHER':
          return '/dashboard/researcher';
        default:
          return '/dashboard';
      }
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <LuLock size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Restricted Portal
            </h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Your account has the role <span className="font-semibold text-[var(--color-text)] font-mono uppercase bg-[var(--color-border)]/30 px-2 py-0.5 rounded">{userRole || 'UNKNOWN'}</span>.
              This area requires one of the following clearance levels:
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {allowedRoles.map((r) => (
              <span
                key={r}
                className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 uppercase"
              >
                {r}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href={getTargetDashboard()}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold bg-[var(--color-text)] text-[var(--color-background)] hover:opacity-90 transition-opacity"
            >
              <LuArrowLeft size={16} />
              Return to My {userRole ? userRole.charAt(0) + userRole.slice(1).toLowerCase() : ''} Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
