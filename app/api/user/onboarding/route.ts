import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleHome } from "@/proxy";

const ALLOWED_ROLES = [
  "customer",
  "business_owner",
  "professional",
  "employer",
  "job_seeker",
  "user",
] as const;

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role, answers } = body;

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role selected." },
        { status: 400 }
      );
    }

    // Update user role and mark onboarding completed
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role,
        onboardingDone: true,
      },
    });

    const redirectUrl = roleHome(updatedUser.role);

    return NextResponse.json({
      success: true,
      role: updatedUser.role,
      redirectUrl,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding. Please try again." },
      { status: 500 }
    );
  }
}
