"use client";

import React, { useState, useEffect } from 'react';
import {
  LuUsers, LuSearch, LuFilter, LuUserPlus, LuCircleCheckBig, LuCircleAlert,
  LuCircleX, LuTrash2, LuShield, LuUserCheck, LuLock, LuLockOpen, LuEye,
  LuRefreshCcw, LuX, LuTriangleAlert,
} from 'react-icons/lu';
import { apiFetch } from '../../services/api';
import { TableBodySkeleton } from './AdminSkeletons';

export default function AdminUserManager({ currentUserId, onOpenProvisionModal }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToSuspend, setUserToSuspend] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter !== 'ALL') params.append('role', roleFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await apiFetch(`/admin/users?${params.toString()}`);
      if (res?.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.warn('Error fetching users, using fallback:', err.message);
      // Fallback
      setUsers([
        { id: 'u1', name: 'Kai Chen', email: 'learner@quantum.platform', role: 'LEARNER', isEmailVerified: true, isSuspended: false, createdAt: new Date(Date.now() - 86400000 * 12).toISOString(), _count: { simulationRuns: 18, experiments: 4, savedCircuits: 7, aiChats: 32 } },
        { id: 'u2', name: 'Dr. Eleanor Vance', email: 'instructor@quantum.platform', role: 'INSTRUCTOR', isEmailVerified: true, isSuspended: false, createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), _count: { simulationRuns: 45, experiments: 12, savedCircuits: 15, aiChats: 88 } },
        { id: 'u3', name: 'Super Admin', email: 'admin@quantum.platform', role: 'ADMIN', isEmailVerified: true, isSuspended: false, createdAt: new Date(Date.now() - 86400000 * 90).toISOString(), _count: { simulationRuns: 10, experiments: 2, savedCircuits: 3, aiChats: 14 } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, roleFilter, statusFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoading(true);
      const res = await apiFetch(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      if (res?.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Failed to update role.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSuspend = async () => {
    if (!userToSuspend) return;
    try {
      setActionLoading(true);
      const res = await apiFetch(`/admin/users/${userToSuspend.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          isSuspended: !userToSuspend.isSuspended,
          reason: suspendReason || 'Administrative decision',
        }),
      });
      if (res?.success) {
        setUserToSuspend(null);
        setSuspendReason('');
        fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setActionLoading(true);
      const res = await apiFetch(`/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      if (res?.success) {
        setUserToDelete(null);
        fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuUsers className="text-rose-700 dark:text-rose-500" />
            User Management Directory
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Manage registered accounts, enforce role assignment policy, activate/suspend access, and review individual activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            title="Refresh user list"
          >
            <LuRefreshCcw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={onOpenProvisionModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 transition-all cursor-pointer"
          >
            <LuUserPlus size={15} />
            <span>Invite Faculty Member</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <LuSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <LuFilter size={13} />
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="LEARNER">Learners Only</option>
              <option value="INSTRUCTOR">Instructors Only</option>
              <option value="ADMIN">Admins Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Accounts</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]/50 text-[var(--color-muted)] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Email Status</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-center">Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {loading ? (
                <tr className="w-full">
                  <td colSpan={7} className="p-0 w-full">
                    <TableBodySkeleton rows={6} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--color-muted)]">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCurrent = u.id === currentUserId;

                  return (
                    <tr key={u.id} className="hover:bg-[var(--color-background)]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[var(--color-text)]">{u.name}</div>
                        <div className="text-[11px] text-[var(--color-muted)] font-mono">{u.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] border ${
                            u.role === 'ADMIN'
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
                              : u.role === 'INSTRUCTOR'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {u.isEmailVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                            <LuCircleCheckBig size={13} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                            <LuCircleAlert size={13} /> Pending
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {u.isSuspended ? (
                          <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                            <LuCircleX size={13} /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[var(--color-muted)] font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[var(--color-muted)]">
                          <span title="Simulations run">{u._count?.simulationRuns || 0} Sims</span>
                          <span>&middot;</span>
                          <span title="AI Chats">{u._count?.aiChats || 0} Chats</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/40 transition-colors cursor-pointer"
                            title="View Profile & Activity"
                          >
                            <LuEye size={14} />
                          </button>

                          {/* Role selector */}
                          {!isCurrent ? (
                            <select
                              value={u.role}
                              disabled={actionLoading}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="px-2 py-1 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[11px] font-mono text-[var(--color-text)] cursor-pointer"
                              title="Change Role"
                            >
                              <option value="LEARNER">Learner</option>
                              <option value="INSTRUCTOR">Instructor</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          ) : (
                            <span className="text-[10px] text-[var(--color-muted)] font-mono italic px-2">Self</span>
                          )}

                          {/* Suspend / Activate button */}
                          {!isCurrent && (
                            <button
                              onClick={() => {
                                setUserToSuspend(u);
                                setSuspendReason('');
                              }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                u.isSuspended
                                  ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
                                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-500/10'
                              }`}
                              title={u.isSuspended ? 'Activate Account' : 'Suspend Account'}
                            >
                              {u.isSuspended ? <LuLockOpen size={14} /> : <LuLock size={14} />}
                            </button>
                          )}

                          {/* Delete button */}
                          {!isCurrent && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <LuTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile & Activity Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-base">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-text)]">{selectedUser.name}</h3>
                  <p className="text-xs text-[var(--color-muted)] font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/40"
              >
                <LuX size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <span className="text-[var(--color-muted)] block mb-1">Role</span>
                <span className="font-bold text-[var(--color-text)]">{selectedUser.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <span className="text-[var(--color-muted)] block mb-1">Account Status</span>
                <span className={selectedUser.isSuspended ? 'text-rose-700 dark:text-rose-400 font-bold' : 'text-emerald-700 dark:text-emerald-400 font-bold'}>
                  {selectedUser.isSuspended ? 'Suspended' : 'Active'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <span className="text-[var(--color-muted)] block mb-1">Registered</span>
                <span className="font-mono text-[var(--color-text)]">{new Date(selectedUser.createdAt).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <span className="text-[var(--color-muted)] block mb-1">Email Verified</span>
                <span className={selectedUser.isEmailVerified ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-amber-700 dark:text-amber-400 font-bold'}>
                  {selectedUser.isEmailVerified ? 'Verified' : 'Pending OTP'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-2">
              <div className="text-xs font-semibold text-[var(--color-text)]">Activity Summary</div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]/50">
                  <div className="text-sm font-bold text-[var(--color-text)]">{selectedUser._count?.simulationRuns || 0}</div>
                  <div className="text-[10px] text-[var(--color-muted)]">Sims</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]/50">
                  <div className="text-sm font-bold text-[var(--color-text)]">{selectedUser._count?.experiments || 0}</div>
                  <div className="text-[10px] text-[var(--color-muted)]">Experiments</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]/50">
                  <div className="text-sm font-bold text-[var(--color-text)]">{selectedUser._count?.savedCircuits || 0}</div>
                  <div className="text-[10px] text-[var(--color-muted)]">Circuits</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]/50">
                  <div className="text-sm font-bold text-[var(--color-text)]">{selectedUser._count?.aiChats || 0}</div>
                  <div className="text-[10px] text-[var(--color-muted)]">AI Chats</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend / Activate Modal */}
      {userToSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
              <LuTriangleAlert size={24} />
              <h3 className="text-base font-bold text-[var(--color-text)]">
                {userToSuspend.isSuspended ? 'Activate User Account' : 'Suspend User Account'}
              </h3>
            </div>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              {userToSuspend.isSuspended
                ? `Restoring access will allow ${userToSuspend.name} (${userToSuspend.email}) to log in and interact with quantum simulators.`
                : `Suspending access will immediately terminate any active sessions and prevent ${userToSuspend.name} from accessing the platform.`}
            </p>

            {!userToSuspend.isSuspended && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-text)]">Suspension Reason (Audited)</label>
                <input
                  type="text"
                  placeholder="e.g. Terms violation, account audit..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUserToSuspend(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleSuspend}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
                  userToSuspend.isSuspended ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                {actionLoading ? 'Processing...' : userToSuspend.isSuspended ? 'Confirm Activation' : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[var(--color-surface)] border border-rose-500/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-700 dark:text-rose-500">
              <LuTrash2 size={24} />
              <h3 className="text-base font-bold text-[var(--color-text)]">Permanently Delete User</h3>
            </div>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[var(--color-text)]">{userToDelete.name}</strong> ({userToDelete.email})? This action cannot be undone and will delete all associated simulation runs, circuits, and chat history.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer"
              >
                {actionLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
