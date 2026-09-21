"use client";

import React, { useState, useEffect } from 'react';
import {
  LuDatabase, LuSearch, LuFilter, LuCheck, LuX, LuTrash2, LuArchive,
  LuRefreshCcw, LuBookOpen, LuCpu, LuFlaskConical, LuPencil, LuUserCheck,
  LuCircleCheckBig, LuCircleAlert, LuClock, LuTriangleAlert, LuEye, LuHistory, LuAlertOctagon,
} from 'react-icons/lu';
import { apiFetch } from '../../services/api';
import { TableBodySkeleton } from './AdminSkeletons';

const CONTENT_TYPES = ['ALL', 'COURSE', 'MODULE', 'LESSON', 'CHALLENGE', 'EXPERIMENT'];
const STATUSES = ['ALL', 'PUBLISHED', 'IN_REVIEW', 'DRAFT', 'ARCHIVED'];

export default function AdminContentGovernance() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, inReview: 0, draft: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reassignItem, setReassignItem] = useState(null);
  const [newInstructor, setNewInstructor] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') params.append('type', typeFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await apiFetch(`/admin/content?${params.toString()}`);
      if (res?.success) {
        setItems(res.data.items);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn('Error fetching content governance:', err.message);
      // Fallback
      setItems([
        { id: 'cnt-1', title: 'Introduction to Superposition & Qubits', type: 'COURSE', author: 'Dr. Eleanor Vance', status: 'PUBLISHED', enrollment: 342, rating: 4.9, updatedAt: new Date().toISOString() },
        { id: 'cnt-2', title: 'Quantum Phase Kickback & Deutsch-Jozsa', type: 'COURSE', author: 'Dr. Eleanor Vance', status: 'PUBLISHED', enrollment: 218, rating: 4.8, updatedAt: new Date().toISOString() },
        { id: 'cnt-3', title: 'Grover Search 3-Qubit Oracle Challenge', type: 'CHALLENGE', author: 'Faculty Committee', status: 'PUBLISHED', enrollment: 154, rating: 4.7, updatedAt: new Date().toISOString() },
        { id: 'cnt-4', title: 'Quantum Teleportation Lab Experiment', type: 'EXPERIMENT', author: 'Dr. Eleanor Vance', status: 'PUBLISHED', enrollment: 98, rating: 4.9, updatedAt: new Date().toISOString() },
        { id: 'cnt-5', title: 'Shor Factorization Circuit Walkthrough', type: 'LESSON', author: 'Guest Faculty', status: 'IN_REVIEW', enrollment: 0, rating: null, updatedAt: new Date().toISOString() },
        { id: 'cnt-6', title: 'Variational Quantum Eigensolver Module', type: 'MODULE', author: 'Dr. Eleanor Vance', status: 'DRAFT', enrollment: 0, rating: null, updatedAt: new Date().toISOString() },
      ]);
      setStats({ total: 6, published: 4, inReview: 1, draft: 1, archived: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContent();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, typeFilter, statusFilter]);

  const handleUpdateStatus = async (id, newStatus, extra = {}) => {
    try {
      setActionLoading(true);
      const res = await apiFetch(`/admin/content/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, ...extra }),
      });
      if (res?.success) {
        fetchContent();
      }
    } catch (err) {
      alert(err.message || 'Failed to update content status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this content item?')) return;
    try {
      setActionLoading(true);
      const res = await apiFetch(`/admin/content/${id}`, { method: 'DELETE' });
      if (res?.success) fetchContent();
    } catch (err) {
      alert(err.message || 'Failed to delete content.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalItem) return;
    await handleUpdateStatus(rejectModalItem.id, 'DRAFT', { feedbackReason: rejectReason });
    setRejectModalItem(null);
    setRejectReason('');
  };

  const handleConfirmReassign = async () => {
    if (!reassignItem || !newInstructor.trim()) return;
    await handleUpdateStatus(reassignItem.id, reassignItem.status, { instructorName: newInstructor.trim() });
    setReassignItem(null);
    setNewInstructor('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuDatabase className="text-rose-700 dark:text-rose-500" />
            Global Content Governance
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Review, approve, publish, archive or delete courses, modules, lessons, challenges, and experiments across the platform.
          </p>
        </div>

        <button
          onClick={fetchContent}
          disabled={loading}
          className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors self-start sm:self-auto"
          title="Refresh catalog"
        >
          <LuRefreshCcw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <div className="text-xl font-extrabold text-[var(--color-text)]">{stats.total}</div>
          <div className="text-[11px] text-[var(--color-muted)] font-medium">Total Items</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">{stats.published}</div>
          <div className="text-[11px] text-[var(--color-muted)] font-medium">Published</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-amber-500/30 text-center">
          <div className="text-xl font-extrabold text-amber-700 dark:text-amber-400">{stats.inReview}</div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400/80 font-medium">In Review</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <div className="text-xl font-extrabold text-blue-400">{stats.draft}</div>
          <div className="text-[11px] text-[var(--color-muted)] font-medium">Drafts</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
          <div className="text-xl font-extrabold text-slate-400">{stats.archived}</div>
          <div className="text-[11px] text-[var(--color-muted)] font-medium">Archived</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <LuSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search content by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <LuFilter size={13} />
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
            >
              {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]/50 text-[var(--color-muted)] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Content Item</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Instructor / Author</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Metrics</th>
                <th className="py-3.5 px-4 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {loading ? (
                <tr className="w-full">
                  <td colSpan={6} className="p-0 w-full">
                    <TableBodySkeleton rows={5} />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--color-muted)]">
                    No content items match the selected filter.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--color-background)]/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-[var(--color-text)] truncate">{item.title}</div>
                      <div className="text-[11px] text-[var(--color-muted)] font-mono">ID: {item.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)]">
                        {item.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[var(--color-text)] flex items-center gap-1.5">
                        <span>{item.author}</span>
                        <button
                          onClick={() => { setReassignItem(item); setNewInstructor(item.author); }}
                          className="text-[var(--color-muted)] hover:text-rose-700 dark:text-rose-400"
                          title="Reassign instructor"
                        >
                          <LuPencil size={11} />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] border ${
                          item.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : item.status === 'IN_REVIEW'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 animate-pulse'
                            : item.status === 'ARCHIVED'
                            ? 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--color-muted)]">
                      {item.enrollment ? `${item.enrollment} enrolled` : '—'}
                      {item.rating ? ` · ★ ${item.rating}` : ''}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === 'IN_REVIEW' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'PUBLISHED')}
                              className="px-2.5 py-1 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              title="Approve & Publish"
                            >
                              <LuCheck size={12} /> Approve
                            </button>
                            <button
                              onClick={() => { setRejectModalItem(item); setRejectReason(''); }}
                              className="px-2.5 py-1 rounded-lg text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              title="Reject with Feedback"
                            >
                              <LuX size={12} /> Reject
                            </button>
                          </>
                        )}

                        {item.status === 'PUBLISHED' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'ARCHIVED')}
                            className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Unpublish / Archive"
                          >
                            <LuArchive size={13} />
                          </button>
                        )}

                        {item.status === 'ARCHIVED' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'PUBLISHED')}
                            className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Republish"
                          >
                            <LuCheck size={13} />
                          </button>
                        )}

                        {item.status === 'DRAFT' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'PUBLISHED')}
                            className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Direct Publish"
                          >
                            <LuCheck size={13} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete permanently"
                        >
                          <LuTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject with Feedback Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <LuTriangleAlert size={18} />
              Reject &amp; Request Revision
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              Specify the revision reason for &ldquo;{rejectModalItem.title}&rdquo;. This will return the item to Draft status with instructor feedback.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Needs clearer explanations on phase estimation circuit, fix exercise 3..."
              rows={3}
              className="w-full p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer"
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Instructor Modal */}
      {reassignItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
              <LuUserCheck size={18} className="text-emerald-700 dark:text-emerald-400" />
              Reassign Content Author
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              Update the lead faculty author for &ldquo;{reassignItem.title}&rdquo;.
            </p>
            <input
              type="text"
              value={newInstructor}
              onChange={(e) => setNewInstructor(e.target.value)}
              placeholder="Instructor Name"
              className="w-full p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReassignItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReassign}
                disabled={actionLoading || !newInstructor.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
              >
                {actionLoading ? 'Updating...' : 'Confirm Reassignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
