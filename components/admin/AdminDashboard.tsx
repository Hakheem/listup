"use client";

import React, { useState } from "react";
import {
  AdminOverviewStats,
  AdminUserListItem,
  AdminSessionListItem,
  AdminVerificationListItem,
  UserRole,
  getAdminUsersAction,
  getAdminSessionsAction,
  getAdminVerificationsAction,
  createAdminUserAction,
  updateAdminUserAction,
  updateUserRoleAction,
  toggleUserVerificationAction,
  toggleUserOnboardingAction,
  resetUserPasswordAction,
  deleteAdminUserAction,
  bulkUpdateUsersRoleAction,
  bulkDeleteUsersAction,
  revokeSessionAction,
  revokeAllUserSessionsAction,
  deleteVerificationAction,
  cleanupExpiredTokensAction,
  getAdminOverviewStats,
} from "@/actions/admin-actions";
import { toast } from "@/components/ui/toast";
import {
  Users,
  ShieldCheck,
  Activity,
  CheckCircle2,
  XCircle,
  KeyRound,
  Trash2,
  RefreshCw,
  Plus,
  Search,
  Edit,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Laptop,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  UserPlus,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ALL_ROLES: UserRole[] = [
  "admin",
  "business_owner",
  "professional",
  "employer",
  "job_seeker",
  "customer",
  "user",
];

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  business_owner: "Business Owner",
  professional: "Professional",
  employer: "Employer",
  job_seeker: "Job Seeker",
  customer: "Customer",
  user: "Standard User",
};

export function getRoleBadgeStyle(role: UserRole) {
  switch (role) {
    case "admin":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "business_owner":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "professional":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "employer":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "job_seeker":
      return "bg-teal-50 text-teal-700 border-teal-200";
    case "customer":
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  return `${d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
}

function formatRelativeTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return formatDate(d);
}

interface AdminDashboardProps {
  initialStats: AdminOverviewStats;
  initialUsers: AdminUserListItem[];
  initialTotalUsers: number;
  initialSessions: AdminSessionListItem[];
  initialTotalSessions: number;
  initialVerifications: AdminVerificationListItem[];
  initialTotalVerifications: number;
  currentUserId: string;
}

export function AdminDashboard({
  initialStats,
  initialUsers,
  initialTotalUsers,
  initialSessions,
  initialTotalSessions,
  initialVerifications,
  initialTotalVerifications,
  currentUserId,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "sessions" | "verifications"
  >("overview");

  // Overview stats state
  const [stats, setStats] = useState<AdminOverviewStats>(initialStats);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);

  // Users tab state
  const [users, setUsers] = useState<AdminUserListItem[]>(initialUsers);
  const [totalUsers, setTotalUsers] = useState(initialTotalUsers);
  const [usersPage, setUsersPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [otpFilter, setOtpFilter] = useState<string>("all");
  const [onboardingFilter, setOnboardingFilter] = useState<string>("all");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Sessions tab state
  const [sessions, setSessions] = useState<AdminSessionListItem[]>(initialSessions);
  const [totalSessions, setTotalSessions] = useState(initialTotalSessions);
  const [sessionsPage, setSessionsPage] = useState(1);
  const [sessionSearch, setSessionSearch] = useState("");
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Verifications tab state
  const [verifications, setVerifications] = useState<
    AdminVerificationListItem[]
  >(initialVerifications);
  const [totalVerifications, setTotalVerifications] = useState(
    initialTotalVerifications
  );
  const [verificationsPage, setVerificationsPage] = useState(1);
  const [verificationSearch, setVerificationSearch] = useState("");
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    role: "user" as UserRole,
    password: "",
    otpVerified: true,
    emailVerified: true,
    onboardingDone: false,
  });

  const [editingUser, setEditingUser] = useState<AdminUserListItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "user" as UserRole,
    otpVerified: true,
    emailVerified: true,
    onboardingDone: false,
  });

  const [resetPasswordUser, setResetPasswordUser] =
    useState<AdminUserListItem | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const [deletingUser, setDeletingUser] = useState<AdminUserListItem | null>(
    null
  );

  const [isPurgingTokens, setIsPurgingTokens] = useState(false);

  // -------------------------------------------------------------------------
  // Fetchers & Handlers
  // -------------------------------------------------------------------------

  async function refreshStats() {
    setIsRefreshingStats(true);
    const res = await getAdminOverviewStats();
    if (res.success && res.data) {
      setStats(res.data);
    }
    setIsRefreshingStats(false);
  }

  async function fetchUsers(page = usersPage, search = userSearch, role = roleFilter, otp = otpFilter, ob = onboardingFilter) {
    setIsLoadingUsers(true);
    const res = await getAdminUsersAction({
      page,
      limit: 10,
      search,
      role,
      otpVerified: otp as "all" | "true" | "false",
      onboardingDone: ob as "all" | "true" | "false",
    });
    if (res.success && res.users) {
      setUsers(res.users);
      setTotalUsers(res.total || 0);
      setUsersPage(page);
    } else if (res.error) {
      toast.add({
        title: "Error fetching users",
        description: res.error,
        type: "error",
      });
    }
    setIsLoadingUsers(false);
  }

  async function fetchSessions(page = sessionsPage, search = sessionSearch) {
    setIsLoadingSessions(true);
    const res = await getAdminSessionsAction({
      page,
      limit: 15,
      search,
    });
    if (res.success && res.sessions) {
      setSessions(res.sessions);
      setTotalSessions(res.total || 0);
      setSessionsPage(page);
    } else if (res.error) {
      toast.add({
        title: "Error fetching sessions",
        description: res.error,
        type: "error",
      });
    }
    setIsLoadingSessions(false);
  }

  async function fetchVerifications(page = verificationsPage, search = verificationSearch) {
    setIsLoadingVerifications(true);
    const res = await getAdminVerificationsAction({
      page,
      limit: 15,
      search,
    });
    if (res.success && res.verifications) {
      setVerifications(res.verifications);
      setTotalVerifications(res.total || 0);
      setVerificationsPage(page);
    } else if (res.error) {
      toast.add({
        title: "Error fetching verifications",
        description: res.error,
        type: "error",
      });
    }
    setIsLoadingVerifications(false);
  }

  // -------------------------------------------------------------------------
  // User Actions Handlers
  // -------------------------------------------------------------------------

  async function handleQuickRoleChange(userId: string, newRole: UserRole) {
    const res = await updateUserRoleAction(userId, newRole);
    if (res.success) {
      toast.add({
        title: "Role Updated",
        description: `User role has been changed to ${ROLE_LABELS[newRole]}.`,
        type: "success",
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      refreshStats();
    } else {
      toast.add({
        title: "Failed to update role",
        description: res.error || "An error occurred.",
        type: "error",
      });
    }
  }

  async function handleToggleVerify(userId: string, currentStatus: boolean) {
    const nextStatus = !currentStatus;
    const res = await toggleUserVerificationAction(userId, nextStatus, nextStatus);
    if (res.success) {
      toast.add({
        title: nextStatus ? "User Verified" : "Verification Revoked",
        description: `OTP verification marked as ${nextStatus ? "verified" : "unverified"}.`,
        type: "success",
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, otpVerified: nextStatus, emailVerified: nextStatus }
            : u
        )
      );
      refreshStats();
    } else {
      toast.add({
        title: "Update failed",
        description: res.error || "An error occurred.",
        type: "error",
      });
    }
  }

  async function handleToggleOnboarding(userId: string, currentStatus: boolean) {
    const nextStatus = !currentStatus;
    const res = await toggleUserOnboardingAction(userId, nextStatus);
    if (res.success) {
      toast.add({
        title: "Onboarding Status Updated",
        description: `User onboarding marked as ${nextStatus ? "completed" : "pending"}.`,
        type: "success",
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, onboardingDone: nextStatus } : u
        )
      );
      refreshStats();
    } else {
      toast.add({
        title: "Update failed",
        description: res.error || "An error occurred.",
        type: "error",
      });
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!createFormData.name || !createFormData.email) {
      toast.add({
        title: "Validation error",
        description: "Name and email are required.",
        type: "warning",
      });
      return;
    }

    const res = await createAdminUserAction(createFormData);
    if (res.success) {
      toast.add({
        title: "User Created",
        description: `Successfully created user ${createFormData.email}.`,
        type: "success",
      });
      setIsCreateModalOpen(false);
      setCreateFormData({
        name: "",
        email: "",
        role: "user",
        password: "",
        otpVerified: true,
        emailVerified: true,
        onboardingDone: false,
      });
      fetchUsers(1);
      refreshStats();
    } else {
      toast.add({
        title: "Creation Failed",
        description: res.error || "Could not create user.",
        type: "error",
      });
    }
  }

  async function handleEditUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;

    const res = await updateAdminUserAction(editingUser.id, editFormData);
    if (res.success) {
      toast.add({
        title: "User Updated",
        description: "User profile updated successfully.",
        type: "success",
      });
      setEditingUser(null);
      fetchUsers();
      refreshStats();
    } else {
      toast.add({
        title: "Update Failed",
        description: res.error || "Could not update user.",
        type: "error",
      });
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetPasswordUser) return;
    if (newPasswordInput.length < 8) {
      toast.add({
        title: "Invalid Password",
        description: "Password must be at least 8 characters.",
        type: "warning",
      });
      return;
    }

    const res = await resetUserPasswordAction(
      resetPasswordUser.id,
      newPasswordInput
    );
    if (res.success) {
      toast.add({
        title: "Password Reset",
        description: res.message || "Password updated successfully.",
        type: "success",
      });
      setResetPasswordUser(null);
      setNewPasswordInput("");
      fetchSessions();
    } else {
      toast.add({
        title: "Reset Failed",
        description: res.error || "Could not reset password.",
        type: "error",
      });
    }
  }

  async function handleDeleteUser() {
    if (!deletingUser) return;
    const res = await deleteAdminUserAction(deletingUser.id);
    if (res.success) {
      toast.add({
        title: "User Deleted",
        description: `User ${deletingUser.email} has been permanently deleted.`,
        type: "success",
      });
      setDeletingUser(null);
      fetchUsers();
      refreshStats();
    } else {
      toast.add({
        title: "Delete Failed",
        description: res.error || "Could not delete user.",
        type: "error",
      });
    }
  }

  async function handleBulkRoleChange(role: UserRole) {
    if (selectedUserIds.length === 0) return;
    const res = await bulkUpdateUsersRoleAction(selectedUserIds, role);
    if (res.success) {
      toast.add({
        title: "Bulk Role Update",
        description: `Updated role for ${res.count} user(s).`,
        type: "success",
      });
      setSelectedUserIds([]);
      fetchUsers();
      refreshStats();
    } else {
      toast.add({
        title: "Bulk Update Failed",
        description: res.error || "Error updating roles.",
        type: "error",
      });
    }
  }

  async function handleBulkDelete() {
    if (selectedUserIds.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to permanently delete ${selectedUserIds.length} user(s)?`
      )
    ) {
      return;
    }

    const res = await bulkDeleteUsersAction(selectedUserIds);
    if (res.success) {
      toast.add({
        title: "Bulk Deletion",
        description: `Deleted ${res.count} user(s).`,
        type: "success",
      });
      setSelectedUserIds([]);
      fetchUsers();
      refreshStats();
    } else {
      toast.add({
        title: "Bulk Delete Failed",
        description: res.error || "Error deleting users.",
        type: "error",
      });
    }
  }

  // -------------------------------------------------------------------------
  // Session Actions Handlers
  // -------------------------------------------------------------------------

  async function handleRevokeSession(sessionId: string) {
    const res = await revokeSessionAction(sessionId);
    if (res.success) {
      toast.add({
        title: "Session Revoked",
        description: "User session has been ended.",
        type: "success",
      });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setTotalSessions((prev) => Math.max(0, prev - 1));
      refreshStats();
    } else {
      toast.add({
        title: "Action Failed",
        description: res.error || "Could not revoke session.",
        type: "error",
      });
    }
  }

  async function handleRevokeAllUserSessions(userId: string) {
    const res = await revokeAllUserSessionsAction(userId);
    if (res.success) {
      toast.add({
        title: "User Sessions Revoked",
        description: res.message || "All user sessions ended.",
        type: "success",
      });
      fetchSessions();
      refreshStats();
    } else {
      toast.add({
        title: "Action Failed",
        description: res.error || "Could not revoke sessions.",
        type: "error",
      });
    }
  }

  // -------------------------------------------------------------------------
  // Verification Actions Handlers
  // -------------------------------------------------------------------------

  async function handleDeleteVerification(verificationId: string) {
    const res = await deleteVerificationAction(verificationId);
    if (res.success) {
      toast.add({
        title: "Token Deleted",
        description: "Verification record removed.",
        type: "success",
      });
      setVerifications((prev) => prev.filter((v) => v.id !== verificationId));
      setTotalVerifications((prev) => Math.max(0, prev - 1));
      refreshStats();
    } else {
      toast.add({
        title: "Action Failed",
        description: res.error || "Could not delete verification record.",
        type: "error",
      });
    }
  }

  async function handleCleanupExpired() {
    setIsPurgingTokens(true);
    const res = await cleanupExpiredTokensAction();
    if (res.success) {
      toast.add({
        title: "Cleanup Completed",
        description: res.message,
        type: "success",
      });
      fetchSessions();
      fetchVerifications();
      refreshStats();
    } else {
      toast.add({
        title: "Cleanup Failed",
        description: res.error || "Error cleaning expired records.",
        type: "error",
      });
    }
    setIsPurgingTokens(false);
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const totalUserPages = Math.ceil(totalUsers / 10) || 1;
  const totalSessionPages = Math.ceil(totalSessions / 15) || 1;
  const totalVerificationPages = Math.ceil(totalVerifications / 15) || 1;

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin Management Console
            </h1>
            <Badge className="bg-emerald-600 text-white font-medium text-xs">
              Live
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Full platform administration for users, permissions, sessions, and authentication security.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanupExpired}
            disabled={isPurgingTokens}
            className="text-xs h-9 border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            <Database className="size-3.5 mr-1.5 text-slate-500" />
            {isPurgingTokens ? "Cleaning..." : "Purge Expired Tokens"}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
          >
            <UserPlus className="size-3.5 mr-1.5" />
            New User
          </Button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "border-emerald-600 text-emerald-700 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Activity className="size-4" />
          <span>Overview & Stats</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("users");
            fetchUsers(1);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "users"
              ? "border-emerald-600 text-emerald-700 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Users className="size-4" />
          <span>Users Directory ({totalUsers})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("sessions");
            fetchSessions(1);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "sessions"
              ? "border-emerald-600 text-emerald-700 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Laptop className="size-4" />
          <span>Active Sessions ({stats.activeSessions})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("verifications");
            fetchVerifications(1);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "verifications"
              ? "border-emerald-600 text-emerald-700 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <KeyRound className="size-4" />
          <span>OTP & Tokens ({totalVerifications})</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: OVERVIEW & STATS */}
      {/* ===================================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-slate-200/80 shadow-2xs bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Registered Users
                  </span>
                  <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="size-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {stats.totalUsers}
                  </span>
                  {stats.growthPercentage > 0 && (
                    <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                      <TrendingUp className="size-3 mr-0.5" />
                      +{stats.growthPercentage}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  +{stats.newUsersThisWeek} new signups this week
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 shadow-2xs bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Live Active Sessions
                  </span>
                  <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Laptop className="size-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {stats.activeSessions}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Valid authentication sessions
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 shadow-2xs bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    OTP Verified Rate
                  </span>
                  <div className="size-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <ShieldCheck className="size-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {stats.totalUsers > 0
                      ? Math.round(
                          (stats.verifiedUsers / stats.totalUsers) * 100
                        )
                      : 0}
                    %
                  </span>
                  <span className="text-xs text-slate-500">
                    ({stats.verifiedUsers}/{stats.totalUsers})
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {stats.unverifiedUsers} pending email OTP verification
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 shadow-2xs bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Onboarded Rate
                  </span>
                  <div className="size-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Sparkles className="size-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {stats.totalUsers > 0
                      ? Math.round(
                          (stats.onboardedUsers / stats.totalUsers) * 100
                        )
                      : 0}
                    %
                  </span>
                  <span className="text-xs text-slate-500">
                    ({stats.onboardedUsers}/{stats.totalUsers})
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {stats.pendingOnboarding} haven&apos;t finished wizard
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Role Distribution Grid */}
          <Card className="border border-slate-200 shadow-2xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  User Role Distribution
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Breakdown of all user accounts by assigned system role in PostgreSQL
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshStats}
                disabled={isRefreshingStats}
                className="text-xs text-slate-600 hover:text-slate-900"
              >
                <RefreshCw
                  className={`size-3.5 mr-1 ${
                    isRefreshingStats ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {ALL_ROLES.map((role) => {
                  const count = stats.roleCounts[role] || 0;
                  const pct =
                    stats.totalUsers > 0
                      ? Math.round((count / stats.totalUsers) * 100)
                      : 0;
                  return (
                    <div
                      key={role}
                      onClick={() => {
                        setRoleFilter(role);
                        setActiveTab("users");
                        fetchUsers(1, "", role);
                      }}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 border ${getRoleBadgeStyle(
                            role
                          )}`}
                        >
                          {ROLE_LABELS[role]}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {count}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {pct}% of platform
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Two-column layout: Recent Signups & Active Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Signups */}
            <Card className="border border-slate-200 shadow-2xs bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Recent Signups
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Latest registered accounts in the system
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTab("users");
                    fetchUsers(1);
                  }}
                  className="text-xs h-7 px-2.5"
                >
                  View All
                  <ArrowUpRight className="size-3 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {stats.recentUsers.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No users found.
                    </div>
                  ) : (
                    stats.recentUsers.map((u) => (
                      <div
                        key={u.id}
                        className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-8 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-xs shrink-0">
                            {(u.name?.[0] || u.email[0]).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-900 truncate">
                                {u.name || "Anonymous"}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`text-[9px] px-1 py-0 border ${getRoleBadgeStyle(
                                  u.role
                                )}`}
                              >
                                {ROLE_LABELS[u.role]}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-slate-500 truncate block">
                              {u.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-400">
                            {formatRelativeTime(u.createdAt)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingUser(u);
                              setEditFormData({
                                name: u.name,
                                email: u.email,
                                role: u.role,
                                otpVerified: u.otpVerified,
                                emailVerified: u.emailVerified,
                                onboardingDone: u.onboardingDone,
                              });
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="size-3.5 text-slate-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="border border-slate-200 shadow-2xs bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Live Session Activity
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Users actively logged into the platform
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTab("sessions");
                    fetchSessions(1);
                  }}
                  className="text-xs h-7 px-2.5"
                >
                  Manage Sessions
                  <ArrowUpRight className="size-3 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {stats.recentSessions.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No active sessions recorded.
                    </div>
                  ) : (
                    stats.recentSessions.map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-8 rounded-full bg-emerald-50 text-emerald-700 font-semibold flex items-center justify-center text-xs shrink-0">
                            <Laptop className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-900 truncate">
                                {s.user.name || s.user.email}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`text-[9px] px-1 py-0 border ${getRoleBadgeStyle(
                                  s.user.role
                                )}`}
                              >
                                {ROLE_LABELS[s.user.role]}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-slate-500 truncate block">
                              IP: {s.ipAddress || "Localhost"} • {formatRelativeTime(s.createdAt)}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeSession(s.id)}
                          className="h-7 text-[11px] text-rose-600 hover:bg-rose-50 border-slate-200"
                        >
                          Revoke
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: USERS DIRECTORY */}
      {/* ===================================================================== */}
      {activeTab === "users" && (
        <Card className="border border-slate-200 shadow-2xs bg-white">
          <CardHeader className="p-5 pb-4 border-b border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  User Accounts Directory
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  View, filter, manage roles, verify emails, or reset credentials.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                {selectedUserIds.length > 0 && (
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">
                      {selectedUserIds.length} selected
                    </span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBulkRoleChange(e.target.value as UserRole);
                          e.target.value = "";
                        }
                      }}
                      defaultValue=""
                      className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700"
                    >
                      <option value="" disabled>
                        Set Role...
                      </option>
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDelete}
                      className="h-7 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 px-2"
                    >
                      <Trash2 className="size-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                >
                  <Plus className="size-3.5 mr-1" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    fetchUsers(1, e.target.value, roleFilter, otpFilter, onboardingFilter);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    fetchUsers(1, userSearch, e.target.value, otpFilter, onboardingFilter);
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                >
                  <option value="all">All Roles</option>
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={otpFilter}
                  onChange={(e) => {
                    setOtpFilter(e.target.value);
                    fetchUsers(1, userSearch, roleFilter, e.target.value, onboardingFilter);
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                >
                  <option value="all">All OTP Status</option>
                  <option value="true">OTP Verified Only</option>
                  <option value="false">Unverified Only</option>
                </select>
              </div>

              <div>
                <select
                  value={onboardingFilter}
                  onChange={(e) => {
                    setOnboardingFilter(e.target.value);
                    fetchUsers(1, userSearch, roleFilter, otpFilter, e.target.value);
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                >
                  <option value="all">All Onboarding Status</option>
                  <option value="true">Onboarding Complete</option>
                  <option value="false">Onboarding Pending</option>
                </select>
              </div>
            </div>
          </CardHeader>

          {/* Users Table */}
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={
                          users.length > 0 &&
                          selectedUserIds.length === users.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUserIds(users.map((u) => u.id));
                          } else {
                            setSelectedUserIds([]);
                          }
                        }}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status Flags</th>
                    <th className="p-3">Accounts</th>
                    <th className="p-3">Joined</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingUsers ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        <RefreshCw className="size-5 animate-spin mx-auto text-emerald-600 mb-2" />
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No users match the criteria.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const isSelf = user.id === currentUserId;
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedUserIds.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUserIds((prev) => [
                                    ...prev,
                                    user.id,
                                  ]);
                                } else {
                                  setSelectedUserIds((prev) =>
                                    prev.filter((id) => id !== user.id)
                                  );
                                }
                              }}
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="size-8 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center shrink-0">
                                {(user.name?.[0] || user.email[0]).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-slate-900 truncate">
                                    {user.name}
                                  </span>
                                  {isSelf && (
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded font-medium">
                                      You
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-500 truncate block">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3">
                            <select
                              value={user.role}
                              disabled={isSelf}
                              onChange={(e) =>
                                handleQuickRoleChange(
                                  user.id,
                                  e.target.value as UserRole
                                )
                              }
                              className={`text-[11px] font-medium rounded px-2 py-1 border transition-colors ${getRoleBadgeStyle(
                                user.role
                              )} focus:outline-none`}
                            >
                              {ALL_ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {ROLE_LABELS[r]}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  handleToggleVerify(user.id, user.otpVerified)
                                }
                                title="Click to toggle OTP verification status"
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                                  user.otpVerified
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                }`}
                              >
                                {user.otpVerified ? (
                                  <>
                                    <CheckCircle2 className="size-3" />
                                    OTP Verified
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="size-3" />
                                    Unverified
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  handleToggleOnboarding(
                                    user.id,
                                    user.onboardingDone
                                  )
                                }
                                title="Click to toggle onboarding status"
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                                  user.onboardingDone
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                              >
                                {user.onboardingDone ? "Onboarded" : "Pending Wizard"}
                              </button>
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              {user.accounts.length === 0 ? (
                                <span className="text-[11px] text-slate-400">
                                  Default
                                </span>
                              ) : (
                                user.accounts.map((acc, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-[10px] py-0 px-1.5 font-normal uppercase"
                                  >
                                    {acc.providerId}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </td>

                          <td className="p-3 text-slate-500">
                            {formatDate(user.createdAt)}
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Edit user"
                                onClick={() => {
                                  setEditingUser(user);
                                  setEditFormData({
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                                    otpVerified: user.otpVerified,
                                    emailVerified: user.emailVerified,
                                    onboardingDone: user.onboardingDone,
                                  });
                                }}
                                className="h-7 w-7 p-0"
                              >
                                <Edit className="size-3.5 text-slate-600" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                title="Reset Password"
                                onClick={() => {
                                  setResetPasswordUser(user);
                                  setNewPasswordInput("");
                                }}
                                className="h-7 w-7 p-0"
                              >
                                <Lock className="size-3.5 text-slate-600" />
                              </Button>

                              {!isSelf && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Delete User"
                                  onClick={() => setDeletingUser(user)}
                                  className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing page {usersPage} of {totalUserPages} ({totalUsers} total users)
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={usersPage <= 1 || isLoadingUsers}
                  onClick={() => fetchUsers(usersPage - 1)}
                  className="h-7 px-2"
                >
                  <ChevronLeft className="size-3.5 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={usersPage >= totalUserPages || isLoadingUsers}
                  onClick={() => fetchUsers(usersPage + 1)}
                  className="h-7 px-2"
                >
                  Next
                  <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: ACTIVE SESSIONS */}
      {/* ===================================================================== */}
      {activeTab === "sessions" && (
        <Card className="border border-slate-200 shadow-2xs bg-white">
          <CardHeader className="p-5 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Active Authentication Sessions
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Monitor live devices, IP origins, and revoke suspicious or stale user sessions.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user, IP, agent..."
                  value={sessionSearch}
                  onChange={(e) => {
                    setSessionSearch(e.target.value);
                    fetchSessions(1, e.target.value);
                  }}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchSessions(1)}
                className="h-8 text-xs"
              >
                <RefreshCw className="size-3.5 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">User Agent</th>
                    <th className="p-3">Signed In</th>
                    <th className="p-3">Expires</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingSessions ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        <RefreshCw className="size-5 animate-spin mx-auto text-emerald-600 mb-2" />
                        Loading sessions...
                      </td>
                    </tr>
                  ) : sessions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No active sessions found.
                      </td>
                    </tr>
                  ) : (
                    sessions.map((sess) => (
                      <tr
                        key={sess.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">
                            {sess.user.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {sess.user.email}
                          </div>
                        </td>

                        <td className="p-3 font-mono text-[11px]">
                          {sess.ipAddress || "127.0.0.1"}
                        </td>

                        <td className="p-3 max-w-[200px] truncate text-slate-600" title={sess.userAgent || ""}>
                          {sess.userAgent || "Unknown Device"}
                        </td>

                        <td className="p-3 text-slate-500">
                          {formatDateTime(sess.createdAt)}
                        </td>

                        <td className="p-3 text-slate-500">
                          {formatDateTime(sess.expiresAt)}
                        </td>

                        <td className="p-3">
                          {sess.isExpired ? (
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 text-slate-600 text-[10px]"
                            >
                              Expired
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                            >
                              Active
                            </Badge>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeSession(sess.id)}
                              className="h-7 text-xs text-rose-600 hover:bg-rose-50 border-slate-200"
                            >
                              Revoke
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              title="Revoke all sessions for this user"
                              onClick={() =>
                                handleRevokeAllUserSessions(sess.user.id)
                              }
                              className="h-7 px-2 text-[10px] text-slate-500 hover:text-rose-600"
                            >
                              Revoke All
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing page {sessionsPage} of {totalSessionPages} ({totalSessions} total sessions)
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={sessionsPage <= 1 || isLoadingSessions}
                  onClick={() => fetchSessions(sessionsPage - 1)}
                  className="h-7 px-2"
                >
                  <ChevronLeft className="size-3.5 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={sessionsPage >= totalSessionPages || isLoadingSessions}
                  onClick={() => fetchSessions(sessionsPage + 1)}
                  className="h-7 px-2"
                >
                  Next
                  <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: OTP & VERIFICATION TOKENS */}
      {/* ===================================================================== */}
      {activeTab === "verifications" && (
        <Card className="border border-slate-200 shadow-2xs bg-white">
          <CardHeader className="p-5 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                OTP & Security Tokens Audit
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Inspection log for better-auth email verification codes, password resets, and OTPs.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter identifier..."
                  value={verificationSearch}
                  onChange={(e) => {
                    setVerificationSearch(e.target.value);
                    fetchVerifications(1, e.target.value);
                  }}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCleanupExpired}
                disabled={isPurgingTokens}
                className="h-8 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
              >
                <Trash2 className="size-3 mr-1" />
                {isPurgingTokens ? "Purging..." : "Purge All Expired"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchVerifications(1)}
                className="h-8 text-xs"
              >
                <RefreshCw className="size-3.5 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Target Email / Identifier</th>
                    <th className="p-3">Token Value (Hashed/Code)</th>
                    <th className="p-3">Issued Date</th>
                    <th className="p-3">Expiration</th>
                    <th className="p-3">Validity</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingVerifications ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        <RefreshCw className="size-5 animate-spin mx-auto text-emerald-600 mb-2" />
                        Loading token records...
                      </td>
                    </tr>
                  ) : verifications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No active verification records found.
                      </td>
                    </tr>
                  ) : (
                    verifications.map((v) => (
                      <tr
                        key={v.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="p-3 font-semibold text-slate-900">
                          {v.identifier}
                        </td>

                        <td className="p-3 font-mono text-[11px] text-slate-600 max-w-[200px] truncate">
                          {v.value}
                        </td>

                        <td className="p-3 text-slate-500">
                          {formatDateTime(v.createdAt)}
                        </td>

                        <td className="p-3 text-slate-500">
                          {formatDateTime(v.expiresAt)}
                        </td>

                        <td className="p-3">
                          {v.isExpired ? (
                            <Badge
                              variant="secondary"
                              className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                            >
                              Expired
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                            >
                              Valid
                            </Badge>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVerification(v.id)}
                            className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing page {verificationsPage} of {totalVerificationPages} ({totalVerifications} total tokens)
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={verificationsPage <= 1 || isLoadingVerifications}
                  onClick={() => fetchVerifications(verificationsPage - 1)}
                  className="h-7 px-2"
                >
                  <ChevronLeft className="size-3.5 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={verificationsPage >= totalVerificationPages || isLoadingVerifications}
                  onClick={() => fetchVerifications(verificationsPage + 1)}
                  className="h-7 px-2"
                >
                  Next
                  <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: CREATE USER */}
      {/* ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create New User
                </h3>
                <p className="text-xs text-slate-500">
                  Provision an account directly with custom role and status.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Jane Mwangi"
                  value={createFormData.name}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      name: e.target.value,
                    })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={createFormData.email}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      email: e.target.value,
                    })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Password (Optional)
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={createFormData.password}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      password: e.target.value,
                    })
                  }
                  className="text-xs"
                />
                <span className="text-[10px] text-slate-400">
                  If set, user can immediately sign in with email and password.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  User Role
                </label>
                <select
                  value={createFormData.role}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createFormData.otpVerified}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        otpVerified: e.target.checked,
                        emailVerified: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-emerald-600"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Pre-verify OTP and Email Ownership
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createFormData.onboardingDone}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        onboardingDone: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-emerald-600"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Mark Onboarding Wizard as Completed
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: EDIT USER */}
      {/* ===================================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit User Account
                </h3>
                <p className="text-xs text-slate-500">
                  Update profile information and permission flags.
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  User Role
                </label>
                <select
                  value={editFormData.role}
                  disabled={editingUser.id === currentUserId}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
                {editingUser.id === currentUserId && (
                  <span className="text-[10px] text-amber-600 block mt-1">
                    You cannot change the role of your own admin account.
                  </span>
                )}
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.otpVerified}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        otpVerified: e.target.checked,
                        emailVerified: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-emerald-600"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    OTP & Email Verified
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.onboardingDone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        onboardingDone: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-emerald-600"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Onboarding Wizard Completed
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingUser(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: RESET PASSWORD */}
      {/* ===================================================================== */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reset Password
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  For: {resetPasswordUser.email}
                </p>
              </div>
              <button
                onClick={() => setResetPasswordUser(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="text-xs"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  This will also automatically revoke all existing sessions for this user.
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setResetPasswordUser(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ===================================================================== */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 text-center space-y-3">
              <div className="size-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="size-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Delete User Account?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-slate-800">
                  {deletingUser.name || deletingUser.email}
                </span>
                ? This will cascade-delete all linked accounts and active sessions. This action cannot be undone.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingUser(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDeleteUser}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
