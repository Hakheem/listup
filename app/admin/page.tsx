import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getAdminOverviewStats,
  getAdminUsersAction,
  getAdminSessionsAction,
  getAdminVerificationsAction,
} from "@/actions/admin-actions";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Console | Listup",
  description: "Administrative dashboard for users, sessions, and security verification.",
};

export default async function AdminPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  // Fetch initial datasets in parallel on the server
  const [statsRes, usersRes, sessionsRes, verificationsRes] = await Promise.all([
    getAdminOverviewStats(),
    getAdminUsersAction({ page: 1, limit: 10 }),
    getAdminSessionsAction({ page: 1, limit: 15 }),
    getAdminVerificationsAction({ page: 1, limit: 15 }),
  ]);

  const defaultStats = {
    totalUsers: 0,
    activeSessions: 0,
    totalVerifications: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    emailVerifiedUsers: 0,
    onboardedUsers: 0,
    pendingOnboarding: 0,
    newUsersThisWeek: 0,
    newUsersPrevWeek: 0,
    growthPercentage: 0,
    roleCounts: {
      admin: 0,
      business_owner: 0,
      professional: 0,
      employer: 0,
      job_seeker: 0,
      customer: 0,
      user: 0,
    },
    recentUsers: [],
    recentSessions: [],
  };

  return (
    <AdminDashboard
      initialStats={statsRes.data || defaultStats}
      initialUsers={usersRes.users || []}
      initialTotalUsers={usersRes.total || 0}
      initialSessions={sessionsRes.sessions || []}
      initialTotalSessions={sessionsRes.total || 0}
      initialVerifications={verificationsRes.verifications || []}
      initialTotalVerifications={verificationsRes.total || 0}
      currentUserId={session.user.id}
    />
  );
}
