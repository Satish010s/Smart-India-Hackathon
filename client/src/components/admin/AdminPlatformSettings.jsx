"use client";

import React, { useState, useEffect } from 'react';
import {
  LuSettings, LuSave, LuRefreshCcw, LuCheck, LuShield, LuBookOpen,
  LuBell, LuLock, LuGlobe,
} from 'react-icons/lu';
import { apiFetch } from '../../services/api';

export default function AdminPlatformSettings() {
  const [settings, setSettings] = useState({
    general: {
      platformName: 'QubitMind Quantum',
      tagline: 'Interactive Quantum Computing Learning Platform',
      supportEmail: 'support@quantum.platform',
      contactUrl: 'https://quantum.platform/support',
      maintenanceMode: false,
    },
    learning: {
      defaultLessonXp: 50,
      challengePassXp: 150,
      quizPassingThresholdPct: 75,
      enableAutoCertificates: true,
    },
    security: {
      enforceEmailVerification: true,
      sessionDurationHours: 72,
      passwordMinLength: 8,
      enableGoogleAuth: false,
    },
    notifications: {
      globalAnnouncement: 'Welcome to the updated QubitMind Quantum Learning Platform! Explore our new multi-backend simulation tools.',
      showAnnouncementBanner: true,
      defaultAppearance: 'dark',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admin/settings');
      if (res?.success && res.data?.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.warn('Using default platform settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      if (res?.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update platform settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuSettings className="text-rose-500" />
            Global Platform Configuration &amp; Policies
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Configure learning defaults, security standards, global announcement banners, and platform-wide branding.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          {saving ? <LuRefreshCcw size={14} className="animate-spin" /> : savedSuccess ? <LuCheck size={14} /> : <LuSave size={14} />}
          <span>{savedSuccess ? 'Settings Saved!' : 'Save All Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. General & Branding */}
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuGlobe size={16} className="text-indigo-400" />
            General Branding &amp; Contact
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[var(--color-text)]">Platform Title</label>
              <input
                type="text"
                value={settings.general?.platformName || ''}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, platformName: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[var(--color-text)]">Platform Tagline</label>
              <input
                type="text"
                value={settings.general?.tagline || ''}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, tagline: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[var(--color-text)]">Support Inquiries Email</label>
              <input
                type="email"
                value={settings.general?.supportEmail || ''}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, supportEmail: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[var(--color-text)]">Maintenance Mode</div>
                <div className="text-[10px] text-[var(--color-muted)]">Restricts non-admin access during maintenance</div>
              </div>
              <input
                type="checkbox"
                checked={settings.general?.maintenanceMode || false}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, maintenanceMode: e.target.checked } })}
                className="w-4 h-4 accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 2. Learning & Gamification Defaults */}
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuBookOpen size={16} className="text-emerald-400" />
            Learning Defaults &amp; Gamification
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-[var(--color-text)]">Base Lesson XP</label>
                <input
                  type="number"
                  value={settings.learning?.defaultLessonXp || 50}
                  onChange={(e) => setSettings({ ...settings, learning: { ...settings.learning, defaultLessonXp: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[var(--color-text)]">Challenge Pass XP</label>
                <input
                  type="number"
                  value={settings.learning?.challengePassXp || 150}
                  onChange={(e) => setSettings({ ...settings, learning: { ...settings.learning, challengePassXp: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-semibold text-[var(--color-text)]">Quiz Passing Threshold</label>
                <span className="font-mono text-emerald-400">{settings.learning?.quizPassingThresholdPct || 75}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={settings.learning?.quizPassingThresholdPct || 75}
                onChange={(e) => setSettings({ ...settings, learning: { ...settings.learning, quizPassingThresholdPct: parseInt(e.target.value) } })}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[var(--color-text)]">Automatic Certificates</div>
                <div className="text-[10px] text-[var(--color-muted)]">Issue verifiable credentials upon track completion</div>
              </div>
              <input
                type="checkbox"
                checked={settings.learning?.enableAutoCertificates ?? true}
                onChange={(e) => setSettings({ ...settings, learning: { ...settings.learning, enableAutoCertificates: e.target.checked } })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Authentication & Security Policy */}
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuLock size={16} className="text-rose-400" />
            Authentication &amp; Password Policies
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[var(--color-text)]">Minimum Password Length</label>
              <input
                type="number"
                min="8"
                max="32"
                value={settings.security?.passwordMinLength || 8}
                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, passwordMinLength: parseInt(e.target.value) || 8 } })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[var(--color-text)]">Session Lifetime (Hours)</label>
              <input
                type="number"
                min="1"
                max="720"
                value={settings.security?.sessionDurationHours || 72}
                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionDurationHours: parseInt(e.target.value) || 72 } })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[var(--color-text)]">Enforce OTP Verification</div>
                <div className="text-[10px] text-[var(--color-muted)]">Requires 6-digit email activation before dashboard access</div>
              </div>
              <input
                type="checkbox"
                checked={settings.security?.enforceEmailVerification ?? true}
                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, enforceEmailVerification: e.target.checked } })}
                className="w-4 h-4 accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 4. Global Announcements & Notifications */}
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuBell size={16} className="text-cyan-400" />
            Global Announcements &amp; Notifications
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[var(--color-text)]">Broadcast Banner Message</label>
              <textarea
                rows={3}
                value={settings.notifications?.globalAnnouncement || ''}
                onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, globalAnnouncement: e.target.value } })}
                className="w-full p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
              />
            </div>

            <div className="pt-1 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[var(--color-text)]">Show Banner to All Users</div>
                <div className="text-[10px] text-[var(--color-muted)]">Renders notice on dashboard header</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications?.showAnnouncementBanner ?? true}
                onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, showAnnouncementBanner: e.target.checked } })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
