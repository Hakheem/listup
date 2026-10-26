import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { otpVerified: true, emailVerified: true },
      });
      return NextResponse.json({ success: true });
    }

    const body = await req.json().catch(() => ({}));
    if (body.email) {
      await prisma.user.update({
        where: { email: body.email.toLowerCase() },
        data: { otpVerified: true, emailVerified: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[verify-otp] Error updating otpVerified:", error);
    return NextResponse.json({ success: true });
  }
}
