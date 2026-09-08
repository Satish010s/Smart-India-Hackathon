"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { useAuthStore } from '../../store/useAuthStore';
import { apiFetch } from '../../services/api';
import { AdminSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import {
  AdminOverview,
  InstructorProvisionModal,
  UserDirectoryTable,
} from '../../components/admin';
import {
  LuShieldAlert,
  LuUsers,
  LuUserPlus,
  LuActivity,
  LuLoaderCircle,
} from 'react-icons/lu';

const ADMIN_TABS = [
  { id: 'overview', label: 'Console Overview', icon: LuShieldAlert, badge: null },
  { id: 'users', label: 'User Directory', icon: LuUsers, badge: 'Directory' },
  { id: 'provision', label: 'Provision Faculty', icon: LuUserPlus, badge: 'Invite' },
  { id: 'metrics', label: 'System Metrics', icon: LuActivity, badge: 'Health' },
];

function AdminPageContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get('tab');
  const activeTab = (rawTab || 'overview').toLowerCase();

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Load user directory
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const query = roleFilter !== 'ALL' ? `?role=${roleFilter}` : '';
      const res = await apiFetch(`/admin/users${query}`);
      if (res?.success) setUsers(res.data.users);
    } catch (err) {
      console.warn('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChange = async (targetUserId, newRole) => {
    try {
      await apiFetch(`/admin/users/${targetUserId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleTabChange = (tabId) => {
    if (tabId === 'overview') {
      router.push('/admin');
    } else {
      router.push(`/admin?tab=${tabId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex">
      {/* Collapsible Role Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <DashboardNavbar
          title="Super Admin Console"
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onMobileMenuClick={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Interactive Tab Switcher Bar */}
          <div className="p-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/25'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/30'
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? 'text-white' : 'text-[var(--color-muted)]'}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-[var(--color-border)]/60 text-[var(--color-muted)]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Views */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <AdminOverview user={user} userCount={users.length} />
              <div id="provision">
                <InstructorProvisionModal onInstructorCreated={fetchUsers} />
              </div>
              <div id="users">
                <UserDirectoryTable
                  users={users}
                  currentUserId={user?.id}
                  roleFilter={roleFilter}
                  onRoleFilterChange={setRoleFilter}
                  onRoleChange={handleRoleChange}
                  loading={loadingUsers}
                />
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-fadeIn">
              <UserDirectoryTable
                users={users}
                currentUserId={user?.id}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                onRoleChange={handleRoleChange}
                loading={loadingUsers}
              />
            </div>
          )}

          {activeTab === 'provision' && (
            <div className="animate-fadeIn">
              <InstructorProvisionModal onInstructorCreated={fetchUsers} />
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="animate-fadeIn">
              <AdminOverview user={user} userCount={users.length} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['ADMIN']}>
        <Suspense fallback={null}>
          <AdminPageContent />
        </Suspense>
      </RoleGuard>
    </ProtectedRoute>
  );
}
