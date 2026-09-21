"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { useAuthStore } from '../../store/useAuthStore';
import { apiFetch } from '../../services/api';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '@/components/navbar/DashboardNavbar';
import LearnerOverview from '@/components/learner/dashboard/LearnerOverview';
import { DashboardSkeleton } from '@/components/learner/dashboard/DashboardSkeleton';
import {
  ExperimentsView,
  BackendCompareView,
  SimulationHistoryView,
  SavedCircuitsView,
} from '../../components/learner';

const TAB_CONFIG = {
  overview: { title: 'Dashboard', component: null }, // uses LearnerOverview with hubData
  experiments: { title: 'Experiments', component: ExperimentsView },
  'backend-compare': { title: 'Backend Comparison', component: BackendCompareView },
  'sim-history': { title: 'Simulation History', component: SimulationHistoryView },
  'saved-circuits': { title: 'Saved Circuits', component: SavedCircuitsView },
};

function LearnerDashboardInner() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') || 'overview';

  const [hubData, setHubData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-redirect Instructors and Admins to their designated portals if they land on /dashboard
  useEffect(() => {
    if (!user) return;
    const role = (user.role || '').toUpperCase();
    const isPreview = searchParams?.get('preview') === 'true';
    if (!isPreview) {
      if (role === 'ADMIN') {
        router.replace('/admin');
      } else if (role === 'INSTRUCTOR') {
        router.replace('/instructor');
      }
    }
  }, [user, router, searchParams]);

  const tabConfig = TAB_CONFIG[tab] || TAB_CONFIG.overview;
  const isOverview = tab === 'overview' || !TAB_CONFIG[tab];

  useEffect(() => {
    if (!isOverview) return;
    setLoading(true);
    async function fetchHubData() {
      try {
        const res = await apiFetch('/learner/dashboard');
        if (res?.success) setHubData(res.data);
      } catch (err) {
        console.warn('Could not fetch learner hub data, using mock data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHubData();
  }, [isOverview]);

  const TabComponent = tabConfig.component;

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['LEARNER', 'INSTRUCTOR', 'ADMIN']}>
        <div className="h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-text)] flex">
          <LearnerSidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            isMobileOpen={isMobileOpen}
            onMobileClose={() => setIsMobileOpen(false)}
          />

          <div
            className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ${
              isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
            }`}
          >
            <DashboardNavbar
              title={tabConfig.title}
              isCollapsed={isCollapsed}
              onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
              onMobileMenuClick={() => setIsMobileOpen(true)}
            />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {isOverview ? (
                loading ? (
                  <DashboardSkeleton />
                ) : (
                  <LearnerOverview user={user} hubData={hubData} />
                )
              ) : (
                TabComponent ? <TabComponent /> : <LearnerOverview user={user} hubData={hubData} />
              )}
            </main>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}

export default function LearnerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-background)] flex">
        <LearnerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <DashboardSkeleton />
          </main>
        </div>
      </div>
    }>
      <LearnerDashboardInner />
    </Suspense>
  );
}
