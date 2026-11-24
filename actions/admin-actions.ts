"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma/client";
import { UserRole } from "@/lib/generated/prisma/enums";
import { hashPassword } from "better-auth/crypto";

export type { UserRole };

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

// ---------------------------------------------------------------------------
// Security: Require Admin Session
// ---------------------------------------------------------------------------
export async function requireAdmin() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in to access admin actions.");
  }

  if (session.user.role !== "admin") {
    throw new Error("Forbidden: You do not have administrator permissions.");
  }

  return session.user;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string | null;
  emailVerified: boolean;
  otpVerified: boolean;
  onboardingDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  accounts: { providerId: string; createdAt: Date }[];
  sessionCount: number;
}

// ---------------------------------------------------------------------------
// 1. Overview & Statistics Action
// ---------------------------------------------------------------------------
export interface AdminOverviewStats {
  totalUsers: number;
  activeSessions: number;
  totalVerifications: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  emailVerifiedUsers: number;
  onboardedUsers: number;
  pendingOnboarding: number;
  newUsersThisWeek: number;
  newUsersPrevWeek: number;
  growthPercentage: number;
  roleCounts: Record<UserRole, number>;
  recentUsers: AdminUserListItem[];
  recentSessions: {
    id: string;
    createdAt: Date;
    expiresAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      image: string | null;
    };
  }[];
}

export async function getAdminOverviewStats(): Promise<{
  success: boolean;
  data?: AdminOverviewStats;
  error?: string;
}> {
  try {
    await requireAdmin();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Parallel aggregate queries
    const [
      totalUsers,
      activeSessions,
      totalVerifications,
      verifiedUsers,
      unverifiedUsers,
      emailVerifiedUsers,
      onboardedUsers,
      pendingOnboarding,
      newUsersThisWeek,
      newUsersPrevWeek,
      roleGrouped,
      recentUsersRaw,
      recentSessionsRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.session.count({
        where: { expiresAt: { gt: now } },
      }),
      prisma.verification.count(),
      prisma.user.count({ where: { otpVerified: true } }),
      prisma.user.count({ where: { otpVerified: false } }),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { onboardingDone: true } }),
      prisma.user.count({ where: { onboardingDone: false } }),
      prisma.user.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: fourteenDaysAgo,
            lt: sevenDaysAgo,
          },
        },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { id: true },
      }),
      prisma.user.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          emailVerified: true,
          otpVerified: true,
          onboardingDone: true,
          createdAt: true,
          updatedAt: true,
          accounts: { select: { providerId: true, createdAt: true } },
          _count: { select: { sessions: true } },
        },
      }),
      prisma.session.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          expiresAt: true,
          ipAddress: true,
          userAgent: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            },
          },
        },
      }),
    ]);

    // Calculate role counts map with defaults
    const roleCounts: Record<UserRole, number> = {
      admin: 0,
      business_owner: 0,
      professional: 0,
      employer: 0,
      job_seeker: 0,
      customer: 0,
      user: 0,
    };

    for (const group of roleGrouped) {
      if (group.role in roleCounts) {
        roleCounts[group.role as UserRole] = group._count.id;
      }
    }

    // Calculate growth percentage
    let growthPercentage = 0;
    if (newUsersPrevWeek > 0) {
      growthPercentage = Math.round(
        ((newUsersThisWeek - newUsersPrevWeek) / newUsersPrevWeek) * 100
      );
    } else if (newUsersThisWeek > 0) {
      growthPercentage = 100;
    }

    const recentUsers: AdminUserListItem[] = recentUsersRaw.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as UserRole,
      image: u.image,
      emailVerified: u.emailVerified,
      otpVerified: u.otpVerified,
      onboardingDone: u.onboardingDone,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      accounts: u.accounts,
      sessionCount: u._count.sessions,
    }));

    const recentSessions = recentSessionsRaw.map((s) => ({
      ...s,
      user: {
        ...s.user,
        role: s.user.role as UserRole,
      },
    }));

    return {
      success: true,
      data: {
        totalUsers,
        activeSessions,
        totalVerifications,
        verifiedUsers,
        unverifiedUsers,
        emailVerifiedUsers,
        onboardedUsers,
        pendingOnboarding,
        newUsersThisWeek,
        newUsersPrevWeek,
        growthPercentage,
        roleCounts,
        recentUsers,
        recentSessions,
      },
    };
  } catch (error: unknown) {
    console.error("[getAdminOverviewStats Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load admin overview statistics."),
    };
  }
}

// ---------------------------------------------------------------------------
// 2. User Management Actions
// ---------------------------------------------------------------------------

export interface GetUsersParams {
  search?: string;
  role?: string;
  otpVerified?: "all" | "true" | "false";
  onboardingDone?: "all" | "true" | "false";
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "name" | "email" | "role";
  sortOrder?: "asc" | "desc";
}


export async function getAdminUsersAction(params: GetUsersParams = {}): Promise<{
  success: boolean;
  users?: AdminUserListItem[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  error?: string;
}> {
  try {
    await requireAdmin();

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    // Search query across name and email
    if (params.search && params.search.trim().length > 0) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    // Role filter
    if (params.role && params.role !== "all") {
      where.role = params.role as UserRole;
    }

    // OTP Verified filter
    if (params.otpVerified && params.otpVerified !== "all") {
      where.otpVerified = params.otpVerified === "true";
    }

    // Onboarding filter
    if (params.onboardingDone && params.onboardingDone !== "all") {
      where.onboardingDone = params.onboardingDone === "true";
    }

    // Sorting
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder || "desc";
    const orderBy = { [sortBy]: sortOrder };

    const [total, usersRaw] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          emailVerified: true,
          otpVerified: true,
          onboardingDone: true,
          createdAt: true,
          updatedAt: true,
          accounts: {
            select: {
              providerId: true,
              createdAt: true,
            },
          },
          _count: {
            select: { sessions: true },
          },
        },
      }),
    ]);

    const users: AdminUserListItem[] = usersRaw.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as UserRole,
      image: u.image,
      emailVerified: u.emailVerified,
      otpVerified: u.otpVerified,
      onboardingDone: u.onboardingDone,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      accounts: u.accounts,
      sessionCount: u._count.sessions,
    }));

    return {
      success: true,
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  } catch (error: unknown) {
    console.error("[getAdminUsersAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to retrieve users list."),
    };
  }
}

export async function getAdminUserByIdAction(userId: string) {
  try {
    await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          select: {
            id: true,
            providerId: true,
            accountId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        sessions: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            token: true,
            createdAt: true,
            expiresAt: true,
            ipAddress: true,
            userAgent: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    // Also find any active verifications associated with this email
    const verifications = await prisma.verification.findMany({
      where: { identifier: user.email },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      user: {
        ...user,
        role: user.role as UserRole,
        verifications,
      },
    };
  } catch (error: unknown) {
    console.error("[getAdminUserByIdAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to retrieve user details."),
    };
  }
}

export async function createAdminUserAction(data: {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  emailVerified?: boolean;
  otpVerified?: boolean;
  onboardingDone?: boolean;
}) {
  try {
    await requireAdmin();

    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();

    if (!name || !email) {
      return { success: false, error: "Name and email are required." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return {
        success: false,
        error: "A user with this email address already exists.",
      };
    }

    // Create user record
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: data.role || "user",
        emailVerified: data.emailVerified ?? true,
        otpVerified: data.otpVerified ?? true,
        onboardingDone: data.onboardingDone ?? false,
      },
    });

    // If password provided, hash and link credential account
    if (data.password && data.password.trim().length >= 8) {
      const hashedPassword = await hashPassword(data.password.trim());
      await prisma.account.create({
        data: {
          userId: newUser.id,
          accountId: email,
          providerId: "credential",
          password: hashedPassword,
        },
      });
    }

    revalidatePath("/admin");

    return {
      success: true,
      user: newUser,
    };
  } catch (error: unknown) {
    console.error("[createAdminUserAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to create new user."),
    };
  }
}

export async function updateAdminUserAction(
  userId: string,
  data: {
    name?: string;
    email?: string;
    role?: UserRole;
    emailVerified?: boolean;
    otpVerified?: boolean;
    onboardingDone?: boolean;
  }
) {
  try {
    const currentAdmin = await requireAdmin();

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "User not found." };
    }

    // Prevent current admin from demoting themselves
    if (currentAdmin.id === userId && data.role && data.role !== "admin") {
      return {
        success: false,
        error: "You cannot remove admin privileges from your own account.",
      };
    }

    // If changing email, check for duplicate
    if (data.email && data.email.trim().toLowerCase() !== targetUser.email) {
      const email = data.email.trim().toLowerCase();
      const duplicate = await prisma.user.findUnique({ where: { email } });
      if (duplicate) {
        return {
          success: false,
          error: "Another user is already registered with this email address.",
        };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.email ? { email: data.email.trim().toLowerCase() } : {}),
        ...(data.role ? { role: data.role } : {}),
        ...(typeof data.emailVerified === "boolean"
          ? { emailVerified: data.emailVerified }
          : {}),
        ...(typeof data.otpVerified === "boolean"
          ? { otpVerified: data.otpVerified }
          : {}),
        ...(typeof data.onboardingDone === "boolean"
          ? { onboardingDone: data.onboardingDone }
          : {}),
      },
    });

    revalidatePath("/admin");

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error: unknown) {
    console.error("[updateAdminUserAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update user."),
    };
  }
}

export async function updateUserRoleAction(userId: string, newRole: UserRole) {
  try {
    const currentAdmin = await requireAdmin();

    if (currentAdmin.id === userId && newRole !== "admin") {
      return {
        success: false,
        error: "You cannot demote your own admin account.",
      };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/admin");

    return {
      success: true,
      user: updated,
    };
  } catch (error: unknown) {
    console.error("[updateUserRoleAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update user role."),
    };
  }
}

export async function toggleUserVerificationAction(
  userId: string,
  otpVerified: boolean,
  emailVerified?: boolean
) {
  try {
    await requireAdmin();

    const data: Prisma.UserUpdateInput = { otpVerified };
    if (typeof emailVerified === "boolean") {
      data.emailVerified = emailVerified;
    } else if (otpVerified) {
      // If verifying OTP, email is implicitly verified
      data.emailVerified = true;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    revalidatePath("/admin");

    return {
      success: true,
      user: updated,
    };
  } catch (error: unknown) {
    console.error("[toggleUserVerificationAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to toggle user verification."),
    };
  }
}

export async function toggleUserOnboardingAction(
  userId: string,
  onboardingDone: boolean
) {
  try {
    await requireAdmin();

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { onboardingDone },
    });

    revalidatePath("/admin");

    return {
      success: true,
      user: updated,
    };
  } catch (error: unknown) {
    console.error("[toggleUserOnboardingAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to toggle user onboarding status."),
    };
  }
}

export async function resetUserPasswordAction(
  userId: string,
  newPassword: string
) {
  try {
    await requireAdmin();

    if (!newPassword || newPassword.trim().length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    const hashedPassword = await hashPassword(newPassword.trim());

    // Look for existing credential account
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId,
        providerId: "credential",
      },
    });

    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { password: hashedPassword },
      });
    } else {
      await prisma.account.create({
        data: {
          userId,
          accountId: user.email,
          providerId: "credential",
          password: hashedPassword,
        },
      });
    }

    // Revoke all existing sessions for this user so they re-authenticate
    await prisma.session.deleteMany({
      where: { userId },
    });

    revalidatePath("/admin");

    return {
      success: true,
      message: "Password updated successfully and all active sessions revoked.",
    };
  } catch (error: unknown) {
    console.error("[resetUserPasswordAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to reset user password."),
    };
  }
}

export async function deleteAdminUserAction(userId: string) {
  try {
    const currentAdmin = await requireAdmin();

    if (currentAdmin.id === userId) {
      return {
        success: false,
        error: "You cannot delete your own admin account.",
      };
    }

    // Prisma cascades deletion to Sessions and Accounts
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin");

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error: unknown) {
    console.error("[deleteAdminUserAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to delete user."),
    };
  }
}

export async function bulkUpdateUsersRoleAction(
  userIds: string[],
  role: UserRole
) {
  try {
    const currentAdmin = await requireAdmin();

    // Prevent demoting current admin in bulk
    const safeUserIds = userIds.filter((id) => {
      if (id === currentAdmin.id && role !== "admin") {
        return false;
      }
      return true;
    });

    if (safeUserIds.length === 0) {
      return {
        success: false,
        error: "No eligible users selected for role update.",
      };
    }

    const result = await prisma.user.updateMany({
      where: { id: { in: safeUserIds } },
      data: { role },
    });

    revalidatePath("/admin");

    return {
      success: true,
      count: result.count,
    };
  } catch (error: unknown) {
    console.error("[bulkUpdateUsersRoleAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to perform bulk role update."),
    };
  }
}

export async function bulkDeleteUsersAction(userIds: string[]) {
  try {
    const currentAdmin = await requireAdmin();

    // Exclude current admin from bulk deletion
    const safeUserIds = userIds.filter((id) => id !== currentAdmin.id);

    if (safeUserIds.length === 0) {
      return {
        success: false,
        error: "Cannot delete selected users (you cannot delete your own account).",
      };
    }

    const result = await prisma.user.deleteMany({
      where: { id: { in: safeUserIds } },
    });

    revalidatePath("/admin");

    return {
      success: true,
      count: result.count,
    };
  } catch (error: unknown) {
    console.error("[bulkDeleteUsersAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to perform bulk user deletion."),
    };
  }
}

// ---------------------------------------------------------------------------
// 3. Session & Security Management Actions
// ---------------------------------------------------------------------------

export interface AdminSessionListItem {
  id: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  isExpired: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image: string | null;
  };
}

export async function getAdminSessionsAction(params: {
  page?: number;
  limit?: number;
  userId?: string;
  search?: string;
  activeOnly?: boolean;
} = {}): Promise<{
  success: boolean;
  sessions?: AdminSessionListItem[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  error?: string;
}> {
  try {
    await requireAdmin();

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 15));
    const skip = (page - 1) * limit;

    const where: Prisma.SessionWhereInput = {};

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.activeOnly) {
      where.expiresAt = { gt: new Date() };
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { ipAddress: { contains: q, mode: "insensitive" } },
        { userAgent: { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, sessionsRaw] = await Promise.all([
      prisma.session.count({ where }),
      prisma.session.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          token: true,
          createdAt: true,
          expiresAt: true,
          ipAddress: true,
          userAgent: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            },
          },
        },
      }),
    ]);

    const now = new Date();
    const sessions: AdminSessionListItem[] = sessionsRaw.map((s) => ({
      id: s.id,
      token: s.token,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      isExpired: s.expiresAt < now,
      user: {
        ...s.user,
        role: s.user.role as UserRole,
      },
    }));

    return {
      success: true,
      sessions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  } catch (error: unknown) {
    console.error("[getAdminSessionsAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to retrieve sessions."),
    };
  }
}

export async function revokeSessionAction(sessionId: string) {
  try {
    await requireAdmin();

    await prisma.session.delete({
      where: { id: sessionId },
    });

    revalidatePath("/admin");

    return {
      success: true,
      message: "Session successfully revoked.",
    };
  } catch (error: unknown) {
    console.error("[revokeSessionAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to revoke session."),
    };
  }
}

export async function revokeAllUserSessionsAction(userId: string) {
  try {
    await requireAdmin();

    const result = await prisma.session.deleteMany({
      where: { userId },
    });

    revalidatePath("/admin");

    return {
      success: true,
      count: result.count,
      message: `Revoked ${result.count} active session(s) for user.`,
    };
  } catch (error: unknown) {
    console.error("[revokeAllUserSessionsAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to revoke user sessions."),
    };
  }
}

// ---------------------------------------------------------------------------
// 4. Verification Tokens Management Actions
// ---------------------------------------------------------------------------

export interface AdminVerificationListItem {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
  isExpired: boolean;
}

export async function getAdminVerificationsAction(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<{
  success: boolean;
  verifications?: AdminVerificationListItem[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  error?: string;
}> {
  try {
    await requireAdmin();

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 15));
    const skip = (page - 1) * limit;

    const where: Prisma.VerificationWhereInput = {};
    if (params.search && params.search.trim()) {
      where.identifier = {
        contains: params.search.trim(),
        mode: "insensitive",
      };
    }

    const [total, verificationsRaw] = await Promise.all([
      prisma.verification.count({ where }),
      prisma.verification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const now = new Date();
    const verifications: AdminVerificationListItem[] = verificationsRaw.map(
      (v) => ({
        id: v.id,
        identifier: v.identifier,
        value: v.value,
        expiresAt: v.expiresAt,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        isExpired: v.expiresAt < now,
      })
    );

    return {
      success: true,
      verifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  } catch (error: unknown) {
    console.error("[getAdminVerificationsAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to retrieve verifications."),
    };
  }
}

export async function deleteVerificationAction(verificationId: string) {
  try {
    await requireAdmin();

    await prisma.verification.delete({
      where: { id: verificationId },
    });

    revalidatePath("/admin");

    return {
      success: true,
      message: "Verification record deleted.",
    };
  } catch (error: unknown) {
    console.error("[deleteVerificationAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to delete verification record."),
    };
  }
}

export async function cleanupExpiredTokensAction() {
  try {
    await requireAdmin();

    const now = new Date();

    const [deletedSessions, deletedVerifications] = await Promise.all([
      prisma.session.deleteMany({
        where: { expiresAt: { lt: now } },
      }),
      prisma.verification.deleteMany({
        where: { expiresAt: { lt: now } },
      }),
    ]);

    revalidatePath("/admin");

    return {
      success: true,
      deletedSessions: deletedSessions.count,
      deletedVerifications: deletedVerifications.count,
      message: `Cleaned up ${deletedSessions.count} expired session(s) and ${deletedVerifications.count} expired verification token(s).`,
    };
  } catch (error: unknown) {
    console.error("[cleanupExpiredTokensAction Error]:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to clean up expired tokens."),
    };
  }
}
