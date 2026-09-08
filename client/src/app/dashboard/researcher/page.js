"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import RoleGuard from '../../../components/auth/RoleGuard';
import { useAuthStore } from '../../../store/useAuthStore';
import { apiFetch } from '../../../services/api';
import { ResearcherSidebar } from '../../../components/sidebar';
import DashboardNavbar from '../../../components/navbar/DashboardNavbar';
import {
  ResearcherOverview,
  ResearchExperiments,
  QpuHardwareView,
  SimulationsView,
  PapersView,
  ResearcherTabNotFound,
} from '../../../components/researcher';
import {
  LuLayoutDashboard,
  LuActivity,
  LuDatabase,
  LuFileText,
  LuLoaderCircle,
} from 'react-icons/lu';

const TABS = [
  {
    id: 'overview',
    label: 'Overview Hub',
    icon: LuLayoutDashboard,
    badge: null,
  },
  {
    id: 'simulations',
    label: 'Simulations & VQE',
    icon: LuActivity,
    badge: '64 Qubits',
  },
  {
    id: 'hardware',
    label: 'QPU Hardware Quota',
    icon: LuDatabase,
    badge: 'Eagle Online',
  },
  {
    id: 'papers',
    label: 'Research Papers',
    icon: LuFileText,
    badge: '3 Docs',
  },
];

const VALID_TAB_IDS = ['overview', 'simulations', 'hardware', 'papers'];

function ResearcherWorkspaceContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get('tab');
  const activeTab = (rawTab || 'overview').toLowerCase();

  const [workspaceData, setWorkspaceData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    async function fetchWorkspaceData() {
      try {
        const res = await apiFetch('/researcher/workspace');
        if (res?.success) setWorkspaceData(res.data);
      } catch (err) {
        console.warn('Could not fetch researcher data:', err);
      }
    }
    fetchWorkspaceData();
  }, []);

  const isValidTab = VALID_TAB_IDS.includes(activeTab);

  const handleTabChange = (tabId) => {
    if (tabId === 'overview') {
      router.push('/dashboard/researcher');
    } else {
      router.push(`/dashboard/researcher?tab=${tabId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex">
      {/* Collapsible Role Sidebar */}
      <ResearcherSidebar
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
          title="Researcher Workspace"
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onMobileMenuClick={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Interactive Tab Switcher Bar */}
          <div className="p-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-sm shadow-[var(--color-primary)]/25'
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

          {/* Tab Content or Not Found Fallback */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <ResearcherOverview user={user} workspaceData={workspaceData} />
              <ResearchExperiments workspaceData={workspaceData} />
            </div>
          )}

          {activeTab === 'simulations' && (
            <div className="animate-fadeIn">
              <SimulationsView />
            </div>
          )}

          {activeTab === 'hardware' && (
            <div className="animate-fadeIn">
              <QpuHardwareView workspaceData={workspaceData} />
            </div>
          )}

          {activeTab === 'papers' && (
            <div className="animate-fadeIn">
              <PapersView workspaceData={workspaceData} />
            </div>
          )}

          {!isValidTab && (
            <ResearcherTabNotFound
              requestedTab={rawTab}
              onSelectTab={handleTabChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function ResearcherDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
      <div className="flex items-center gap-3 text-[var(--color-muted)] font-mono text-sm">
        <LuLoaderCircle className="animate-spin text-[var(--color-primary)]" size={24} />
        <span>Loading Quantum Research Workspace...</span>
      </div>
    </div>
  );
}

export default function ResearcherWorkspacePage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['RESEARCHER', 'ADMIN']}>
        <Suspense fallback={<ResearcherDashboardSkeleton />}>
          <ResearcherWorkspaceContent />
        </Suspense>
      </RoleGuard>
    </ProtectedRoute>
  );
}
