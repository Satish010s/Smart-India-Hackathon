"use client";

import React from 'react';
import {
  LuUsers,
  LuFilter,
  LuCircleCheckBig,
  LuCircleAlert,
  LuLoaderCircle,
} from 'react-icons/lu';

export default function UserDirectoryTable({
  users,
  currentUserId,
  roleFilter,
  onRoleFilterChange,
  onRoleChange,
  loading,
}) {
  return (
    <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuUsers size={22} className="text-[var(--color-primary)]" />
            Platform Users Directory
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Manage registered accounts, verification status, and role authorizations
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <LuFilter size={16} className="text-[var(--color-muted)]" />
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="LEARNER">Learner</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center text-[var(--color-muted)]">
          <LuLoaderCircle className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Email Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[var(--color-text)]">{u.name}</td>
                  <td className="py-3 px-4 text-[var(--color-muted)] font-mono text-xs">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                        u.role === 'ADMIN'
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : u.role === 'INSTRUCTOR'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                        <LuCircleCheckBig size={14} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium">
                        <LuCircleAlert size={14} /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-[var(--color-muted)]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.id !== currentUserId ? (
                      <select
                        value={u.role}
                        onChange={(e) => onRoleChange(u.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] font-mono text-[var(--color-text)] cursor-pointer"
                      >
                        <option value="LEARNER">Set Learner</option>
                        <option value="INSTRUCTOR">Set Instructor</option>
                        <option value="ADMIN">Set Admin</option>
                      </select>
                    ) : (
                      <span className="text-xs text-[var(--color-muted)] font-mono italic">Current User</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
