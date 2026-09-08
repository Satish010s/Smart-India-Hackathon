"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { useAuthStore } from '../../store/useAuthStore';
import { apiFetch } from '../../services/api';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import { LearnerOverview, LearnerCircuits } from '../../components/learner';

export default function LearnerDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [hubData, setHubData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'RESEARCHER') {
      router.replace('/dashboard/researcher');
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchHubData() {
      try {
        const res = await apiFetch('/learner/dashboard');
        if (res?.success) setHubData(res.data);
      } catch (err) {
        console.warn('Could not fetch learner hub data:', err);
      }
    }
    fetchHubData();
  }, []);

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['LEARNER', 'INSTRUCTOR', 'ADMIN']}>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex">
          {/* Collapsible Role Sidebar */}
          <LearnerSidebar
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
              title="Learner Hub"
              isCollapsed={isCollapsed}
              onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
              onMobileMenuClick={() => setIsMobileOpen(true)}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
              <LearnerOverview user={user} hubData={hubData} />
              <LearnerCircuits />
            </main>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
