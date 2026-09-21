"use client";

import React, { useState } from 'react';
import {
  LuUserPlus,
  LuUser,
  LuMail,
  LuKey,
  LuLoaderCircle,
  LuCircleCheckBig,
  LuCircleAlert,
} from 'react-icons/lu';
import { apiFetch } from '../../services/api';

export default function InstructorProvisionModal({ onInstructorCreated }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessData(null);
    setLoading(true);

    try {
      const res = await apiFetch('/admin/instructors', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (res?.success) {
        setSuccessData({
          message: res.message,
          email: res.data.instructor.email,
          password: res.data.initialPassword,
        });
        setForm({ name: '', email: '', password: '' });
        if (onInstructorCreated) onInstructorCreated();
      }
    } catch (err) {
      setError(err.message || 'Failed to create instructor account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
          <LuUserPlus size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">Provision Instructor Account</h2>
          <p className="text-xs text-[var(--color-muted)]">
            Create instructor faculty accounts & dispatch credentials via Resend
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-500 text-xs flex items-center gap-2">
          <LuCircleAlert size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successData && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-500 text-xs space-y-1">
          <div className="font-semibold flex items-center gap-2">
            <LuCircleCheckBig size={16} />
            {successData.message}
          </div>
          <div className="font-mono pt-1 text-[11px] text-[var(--color-text)]">
            <div>Email: <strong>{successData.email}</strong></div>
            <div>Initial Password: <strong>{successData.password}</strong></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
            Instructor Full Name
          </label>
          <div className="relative">
            <LuUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Dr. Eleanor Vance"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
            Academic Email Address
          </label>
          <div className="relative">
            <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="instructor@university.edu"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
            Initial Password (Optional - leave blank to auto-generate)
          </label>
          <div className="relative">
            <LuKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <LuLoaderCircle className="animate-spin" size={16} />
              <span>Creating & Dispatching Email...</span>
            </>
          ) : (
            <>
              <LuUserPlus size={16} />
              <span>Create Instructor Account</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
