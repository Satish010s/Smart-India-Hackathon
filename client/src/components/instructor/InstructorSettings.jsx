"use client";

import React, { useState } from 'react';
import {
  LuUser, LuMail, LuLock, LuBell, LuPalette, LuShield,
  LuBookOpen, LuSave, LuCheck, LuChevronRight, LuCamera,
  LuToggleLeft, LuToggleRight, LuGraduationCap, LuBuilding,
  LuPhone, LuGlobe, LuKey, LuEye, LuEyeOff,
} from 'react-icons/lu';
import { apiFetch } from '../../services/api';

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', icon: LuUser },
  { id: 'account', label: 'Account', icon: LuMail },
  { id: 'teaching', label: 'Teaching', icon: LuBookOpen },
  { id: 'notifications', label: 'Notifications', icon: LuBell },
  { id: 'appearance', label: 'Appearance', icon: LuPalette },
  { id: 'security', label: 'Security', icon: LuShield },
];

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <div className="text-sm font-semibold text-[var(--color-text)]">{label}</div>
        {description && <div className="text-xs text-[var(--color-muted)] mt-0.5">{description}</div>}
      </div>
      <button onClick={() => onChange(!checked)} className="cursor-pointer shrink-0 mt-0.5">
        {checked
          ? <LuToggleRight size={28} className="text-[var(--color-primary)]" />
          : <LuToggleLeft size={28} className="text-[var(--color-muted)]" />}
      </button>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function InputField({ value, onChange, placeholder, type = 'text', disabled }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
      className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 placeholder:text-[var(--color-muted)] disabled:opacity-50" />
  );
}

function SaveButton({ saving, saved, onSave, label = 'Save Changes' }) {
  return (
    <button onClick={onSave} disabled={saving}
      className={`px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-[var(--color-primary)] text-white shadow-lg shadow-sm hover:opacity-90'} disabled:opacity-50`}>
      {saved ? <><LuCheck size={14} /> Saved!</> : saving ? <><div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</> : <><LuSave size={14} /> {label}</>}
    </button>
  );
}

export default function InstructorSettings({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || 'Prof. Instructor',
    title: 'Associate Professor',
    institution: 'IIT Bombay',
    department: 'Computer Science & Engineering',
    bio: 'Quantum computing researcher and educator with 8+ years of experience. Specializing in quantum algorithms, error correction, and quantum ML.',
    website: 'https://quantum.edu/instructor',
    phone: '+91 98765 43210',
  });

  const [account, setAccount] = useState({
    email: user?.email || 'instructor@quantum.edu',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);

  const [teaching, setTeaching] = useState({
    defaultDifficulty: 'Intermediate',
    autoGrading: true,
    simulationStrictness: 'Standard',
    maxSimShots: '1024',
    lateSubmissionPolicy: 'Accepted with 10% penalty',
    allowAiAssistance: true,
    showHintsAutomatically: false,
  });

  const [notifications, setNotifications] = useState({
    newSubmission: true,
    atRiskStudent: true,
    courseCompletion: false,
    weeklyReport: true,
    quizResults: true,
    contentReview: true,
    enrollmentAlert: false,
  });

  const [appearance, setAppearance] = useState({ theme: 'dark', fontSize: 'medium', compactMode: false });

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch('/instructor/profile', {
        method: 'PUT',
        body: JSON.stringify({ ...profile, teachingPreferences: teaching, notifications }),
      });
    } catch { /* optimistic */ }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <LuUser size={20} className="text-[var(--color-primary)]" /> Profile & Settings
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">Manage your profile, account preferences, teaching settings, and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-1">
          {SETTINGS_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === tab.id ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-sm' : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'}`}>
                <Icon size={15} />{tab.label}
                {activeTab !== tab.id && <LuChevronRight size={13} className="ml-auto opacity-40" />}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3">
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <h3 className="text-base font-bold text-[var(--color-text)]">Profile Information</h3>

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <button className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                    <LuCamera size={12} />
                  </button>
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--color-text)]">{profile.name}</div>
                  <div className="text-xs text-[var(--color-muted)]">{profile.title} · {profile.institution}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name">
                  <InputField value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </FormField>
                <FormField label="Title / Role">
                  <InputField value={profile.title} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Associate Professor" />
                </FormField>
                <FormField label="Institution">
                  <InputField value={profile.institution} onChange={e => setProfile(p => ({ ...p, institution: e.target.value }))} placeholder="e.g. IIT Bombay" />
                </FormField>
                <FormField label="Department">
                  <InputField value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} placeholder="e.g. Computer Science" />
                </FormField>
                <FormField label="Website">
                  <InputField value={profile.website} onChange={e => setProfile(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
                </FormField>
                <FormField label="Phone">
                  <InputField value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 ..." />
                </FormField>
              </div>
              <FormField label="Bio">
                <textarea rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell students about yourself..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none placeholder:text-[var(--color-muted)]" />
              </FormField>
              <SaveButton saving={saving} saved={saved} onSave={handleSave} />
            </div>
          )}

          {/* ACCOUNT */}
          {activeTab === 'account' && (
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <h3 className="text-base font-bold text-[var(--color-text)]">Account Settings</h3>
              <FormField label="Email Address">
                <InputField value={account.email} onChange={e => setAccount(a => ({ ...a, email: e.target.value }))} type="email" />
              </FormField>
              <div className="border-t border-[var(--color-border)] pt-6 space-y-4">
                <h4 className="text-sm font-bold text-[var(--color-text)]">Change Password</h4>
                {['currentPassword', 'newPassword', 'confirmPassword'].map(field => (
                  <FormField key={field} label={field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}>
                    <div className="relative">
                      <InputField type={showPwd ? 'text' : 'password'} value={account[field]}
                        onChange={e => setAccount(a => ({ ...a, [field]: e.target.value }))} placeholder="••••••••" />
                      <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer">
                        {showPwd ? <LuEyeOff size={15} /> : <LuEye size={15} />}
                      </button>
                    </div>
                  </FormField>
                ))}
              </div>
              <SaveButton saving={saving} saved={saved} onSave={handleSave} label="Update Account" />
            </div>
          )}

          {/* TEACHING */}
          {activeTab === 'teaching' && (
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <h3 className="text-base font-bold text-[var(--color-text)]">Teaching Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Default Course Difficulty">
                  <select value={teaching.defaultDifficulty} onChange={e => setTeaching(t => ({ ...t, defaultDifficulty: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </FormField>
                <FormField label="Simulation Strictness">
                  <select value={teaching.simulationStrictness} onChange={e => setTeaching(t => ({ ...t, simulationStrictness: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
                    <option>Strict (≥99.5% fidelity)</option>
                    <option>Standard (≥95.0% fidelity)</option>
                    <option>Relaxed (≥90.0% fidelity)</option>
                  </select>
                </FormField>
                <FormField label="Max Simulation Shots">
                  <select value={teaching.maxSimShots} onChange={e => setTeaching(t => ({ ...t, maxSimShots: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
                    <option value="1024">1,024 shots (Default)</option>
                    <option value="2048">2,048 shots</option>
                    <option value="4096">4,096 shots (High Precision)</option>
                  </select>
                </FormField>
                <FormField label="Late Submission Policy">
                  <select value={teaching.lateSubmissionPolicy} onChange={e => setTeaching(t => ({ ...t, lateSubmissionPolicy: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
                    <option>Not accepted</option>
                    <option>Accepted with 10% penalty</option>
                    <option>Accepted with 25% penalty</option>
                    <option>Accepted anytime (no penalty)</option>
                  </select>
                </FormField>
              </div>
              <div className="border-t border-[var(--color-border)] pt-4 divide-y divide-[var(--color-border)]/50">
                <Toggle checked={teaching.autoGrading} onChange={v => setTeaching(t => ({ ...t, autoGrading: v }))} label="Auto-Grading" description="Automatically evaluate circuit and code submissions using statevector fidelity." />
                <Toggle checked={teaching.allowAiAssistance} onChange={v => setTeaching(t => ({ ...t, allowAiAssistance: v }))} label="Allow AI Assistance" description="Let students use the AI tutor during lessons and challenges." />
                <Toggle checked={teaching.showHintsAutomatically} onChange={v => setTeaching(t => ({ ...t, showHintsAutomatically: v }))} label="Show Hints Automatically" description="Display the first hint after 10 minutes on a challenge without submission." />
              </div>
              <SaveButton saving={saving} saved={saved} onSave={handleSave} label="Save Preferences" />
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
              <h3 className="text-base font-bold text-[var(--color-text)]">Notification Preferences</h3>
              <div className="divide-y divide-[var(--color-border)]/50">
                {[
                  { key: 'newSubmission', label: 'New Submission', desc: 'Notified when a student submits a quiz or challenge.' },
                  { key: 'atRiskStudent', label: 'At-Risk Student Alert', desc: 'Alert when a student shows low engagement or low scores.' },
                  { key: 'courseCompletion', label: 'Course Completion', desc: 'Notify when a student completes one of your courses.' },
                  { key: 'quizResults', label: 'Quiz Results', desc: 'Summary after each quiz is auto-graded.' },
                  { key: 'contentReview', label: 'Content Review Ready', desc: 'Notify when content is submitted for review.' },
                  { key: 'enrollmentAlert', label: 'New Enrollment', desc: 'Alert when a new student joins your course.' },
                  { key: 'weeklyReport', label: 'Weekly Analytics Report', desc: 'Receive a weekly email summary of student performance.' },
                ].map(({ key, label, desc }) => (
                  <Toggle key={key} checked={notifications[key]} onChange={v => setNotifications(n => ({ ...n, [key]: v }))} label={label} description={desc} />
                ))}
              </div>
              <SaveButton saving={saving} saved={saved} onSave={handleSave} label="Save Notification Settings" />
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <h3 className="text-base font-bold text-[var(--color-text)]">Appearance</h3>
              <FormField label="Theme">
                <div className="grid grid-cols-3 gap-3">
                  {['dark', 'light', 'system'].map(t => (
                    <button key={t} onClick={() => setAppearance(a => ({ ...a, theme: t }))}
                      className={`p-4 rounded-xl border capitalize text-xs font-bold cursor-pointer transition-all ${appearance.theme === t ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary)]' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/30'}`}>
                      {t === 'dark' ? '🌙' : t === 'light' ? '☀️' : '💻'} {t}
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField label="Font Size">
                <div className="grid grid-cols-3 gap-3">
                  {['small', 'medium', 'large'].map(s => (
                    <button key={s} onClick={() => setAppearance(a => ({ ...a, fontSize: s }))}
                      className={`p-4 rounded-xl border capitalize text-xs font-bold cursor-pointer transition-all ${appearance.fontSize === s ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary)]' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/30'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </FormField>
              <div className="border-t border-[var(--color-border)] pt-4">
                <Toggle checked={appearance.compactMode} onChange={v => setAppearance(a => ({ ...a, compactMode: v }))} label="Compact Mode" description="Reduce spacing for a denser layout." />
              </div>
              <SaveButton saving={saving} saved={saved} onSave={handleSave} label="Save Appearance" />
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <h3 className="text-base font-bold text-[var(--color-text)]">Security</h3>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold"><LuShield size={14} /> Account Security Status</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400"><LuCheck size={12} /> Email verified</div>
                  <div className="flex items-center gap-2 text-amber-400"><LuKey size={12} /> 2FA not enabled</div>
                  <div className="flex items-center gap-2 text-emerald-400"><LuCheck size={12} /> Strong password</div>
                  <div className="flex items-center gap-2 text-emerald-400"><LuCheck size={12} /> 1 active session</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[var(--color-text)]">Two-Factor Authentication</h4>
                <p className="text-xs text-[var(--color-muted)]">Add an extra layer of security to your account with 2FA. Use an authenticator app like Google Authenticator.</p>
                <button className="px-5 py-2.5 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold hover:bg-[var(--color-primary)]/20 cursor-pointer transition-colors flex items-center gap-2">
                  <LuKey size={14} /> Enable 2FA (Coming Soon)
                </button>
              </div>

              <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
                <h4 className="text-sm font-bold text-[var(--color-text)]">Active Sessions</h4>
                <div className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[var(--color-text)]">Current Session — Chrome on macOS</div>
                    <div className="text-[10px] text-[var(--color-muted)] font-mono mt-0.5">IP: 103.x.x.x · Active now</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10">Current</span>
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4">
                <button className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer transition-colors font-semibold">
                  Sign out of all other sessions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
