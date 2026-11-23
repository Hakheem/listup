import { NextRequest, NextResponse } from "next/server";
import { getTransporter } from "@/lib/email";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const runVerify = searchParams.get("verify") === "true";
  const testTo = searchParams.get("testTo");

  // Mask sensitive strings (show only first 2 chars)
  const mask = (val?: string) =>
    val ? `${val.slice(0, 2)}***${val.slice(-1)}` : undefined;

  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      betterAuthUrl: process.env.BETTER_AUTH_URL ?? "NOT_SET (defaults to localhost:3000)",
      nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL ?? "NOT_SET",
      vercelUrl: process.env.VERCEL_URL ?? "NOT_SET",
      vercelProductionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "NOT_SET",
    },
    emailConfig: {
      strategy:
        process.env.SMTP_HOST && process.env.RESEND_API_KEY
          ? "Nodemailer SMTP (Primary) with Resend HTTP API (Backup)"
          : process.env.SMTP_HOST
          ? "Nodemailer SMTP only"
          : process.env.RESEND_API_KEY
          ? "Resend HTTP API only"
          : "None configured",
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      resendFrom: process.env.RESEND_FROM ?? "Listup <onboarding@resend.dev> (default)",
      smtpConfigured: Boolean(process.env.SMTP_HOST),
      smtpHost: process.env.SMTP_HOST ?? "NOT_SET",
      smtpPort: Number(process.env.SMTP_PORT ?? 587),
      smtpSecure:
        process.env.SMTP_SECURE !== undefined
          ? process.env.SMTP_SECURE
          : `${Number(process.env.SMTP_PORT ?? 587) === 465} (auto-detected)`,
      smtpUserConfigured: Boolean(process.env.SMTP_USER),
      smtpUser: mask(process.env.SMTP_USER),
      smtpPassConfigured: Boolean(process.env.SMTP_PASS),
      smtpFrom: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "NOT_SET",
    },
  };

  // Optional: Run transporter.verify() if ?verify=true and SMTP is configured
  if (runVerify && process.env.SMTP_HOST) {
    try {
      const transporter = getTransporter();
      await transporter.verify();
      diagnostics.smtpConnectionTest = {
        success: true,
        message: "SMTP server connection verified successfully!",
      };
    } catch (err: unknown) {
      const error = err as Error & { code?: string; command?: string };
      diagnostics.smtpConnectionTest = {
        success: false,
        code: error.code ?? "UNKNOWN",
        message: error.message,
        command: error.command,
        hint:
          error.code === "ETIMEDOUT"
            ? "Connection timed out. If using smtp.gmail.com, Google blocks cloud data center IPs (AWS/Vercel). Consider using Resend or Brevo."
            : error.code === "EAUTH"
            ? "Authentication failed. Check your SMTP_USER and SMTP_PASS (for Gmail, ensure you use a 16-character App Password, not account password)."
            : "Check your SMTP host, port, and credentials.",
      };
    }
  }

  // Optional: Test sending an email if ?testTo=email@example.com
  if (testTo) {
    try {
      const { sendOTPEmail } = await import("@/lib/email");
      await sendOTPEmail({
        to: testTo,
        otp: "123456",
        type: "email-verification",
      });
      diagnostics.testSend = {
        success: true,
        sentTo: testTo,
        message: "Test email dispatched successfully!",
      };
    } catch (err: unknown) {
      const error = err as Error;
      diagnostics.testSend = {
        success: false,
        sentTo: testTo,
        error: error.message,
      };
    }
  }

  return NextResponse.json(diagnostics);
}
