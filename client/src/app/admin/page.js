"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import {
  AdminDashboardOverview,
  AdminUserManager,
  AdminRolesPermissions,
  AdminContentGovernance,
  AdminPlatformAnalytics,
  AdminAiManagement,
  AdminQuantumBackends,
  AdminSystemHealth,
  AdminAuditLogs,
  AdminPlatformSettings,
  InstructorProvisionModal,
} from '../../components/admin';
import {
  LuShieldAlert,
  LuUsers,
  LuKeyRound,
  LuDatabase,
  LuBrain,
  LuCpu,
  LuChartBar,
  LuActivity,
  LuHistory,
  LuSettings,
  LuX,
} from 'react-icons/lu';

const ADMIN_TABS = [
  { id: 'overview', label: 'Dashboard', icon: LuShieldAlert, badge: 'Live' },
  { id: 'users', label: 'Users', icon: LuUsers, badge: null },
  { id: 'roles', label: 'Roles & Permissions', icon: LuKeyRound, badge: '3 Roles' },
  { id: 'content', label: 'Content Governance', icon: LuDatabase, badge: null },
  { id: 'ai', label: 'AI Management', icon: LuBrain, badge: 'FastAPI' },
  { id: 'backends', label: 'Quantum Backends', icon: LuCpu, badge: '4 QPU' },
  { id: 'analytics', label: 'Platform Analytics', icon: LuChartBar, badge: null },
  { id: 'health', label: 'System Health', icon: LuActivity, badge: null },
  { id: 'audit', label: 'Audit Logs', icon: LuHistory, badge: null },
  { id: 'settings', label: 'Platform Settings', icon: LuSettings, badge: null },
];

function AdminPageContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get('tab');
  // Handle aliases
  let activeTab = (rawTab || 'overview').toLowerCase();
  if (activeTab === 'metrics') activeTab = 'health';
  if (activeTab === 'provision') activeTab = 'users';

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  const handleTabChange = (tabId) => {
    if (tabId === 'overview') {
      router.push('/admin');
    } else {
      router.push(`/admin?tab=${tabId}`);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-text)] flex">
      {/* Collapsible Admin Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <DashboardNavbar
          title="Super Admin Console"
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onMobileMenuClick={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">

          {/* Active Tab Views */}
          {activeTab === 'overview' && (
            <AdminDashboardOverview
              user={user}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'users' && (
            <AdminUserManager
              currentUserId={user?.id}
              onOpenProvisionModal={() => setIsProvisionModalOpen(true)}
            />
          )}

          {activeTab === 'roles' && (
            <AdminRolesPermissions />
          )}

          {activeTab === 'content' && (
            <AdminContentGovernance />
          )}

          {activeTab === 'ai' && (
            <AdminAiManagement />
          )}

          {activeTab === 'backends' && (
            <AdminQuantumBackends />
          )}

          {activeTab === 'analytics' && (
            <AdminPlatformAnalytics />
          )}

          {activeTab === 'health' && (
            <AdminSystemHealth />
          )}

          {activeTab === 'audit' && (
            <AdminAuditLogs />
          )}

          {activeTab === 'settings' && (
            <AdminPlatformSettings />
          )}
        </main>
      </div>

      {/* Provision Faculty Modal (accessible globally) */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setIsProvisionModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] bg-[var(--color-background)] border border-[var(--color-border)]"
            >
              <LuX size={16} />
            </button>
            <InstructorProvisionModal
              onInstructorCreated={() => {
                setIsProvisionModalOpen(false);
                // Redirect to users tab to view new faculty
                handleTabChange('users');
              }}
            />
          </div>
        </div>
      )}
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
