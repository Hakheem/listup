import nodemailer from "nodemailer";

/**
 * Creates a Nodemailer transporter configured for serverless resilience.
 * - Auto-detects SSL on port 465 vs STARTTLS on port 587.
 * - Sets explicit timeouts so serverless functions (e.g. Vercel) don't hang.
 * - Disables pooling to avoid stale socket reuse in Lambda containers.
 */
export function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  // Auto-detect secure: true for 465, false for 587/25 unless SMTP_SECURE is explicitly set
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true"
      : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Serverless-friendly connection timeouts (Vercel kills after 10-15s)
    connectionTimeout: 10000, // 10s
    greetingTimeout: 7000,    // 7s
    socketTimeout: 15000,     // 15s
    pool: false,              // don't maintain persistent pools across cold/warm lambdas
  });
}

export const transporter = getTransporter();

interface SendOTPOptions {
  to: string;
  otp: string;
  type: "email-verification" | "sign-in" | "forget-password" | "change-email";
}

const subjectMap: Record<SendOTPOptions["type"], string> = {
  "email-verification": "Verify your Listup account",
  "sign-in": "Your Listup sign-in code",
  "forget-password": "Reset your Listup password",
  "change-email": "Confirm your new email address",
};

const headingMap: Record<SendOTPOptions["type"], string> = {
  "email-verification": "Confirm your email address",
  "sign-in": "Your one-time sign-in code",
  "forget-password": "Password reset code",
  "change-email": "Confirm your new email",
};

const bodyMap: Record<SendOTPOptions["type"], string> = {
  "email-verification":
    "Use the code below to verify your email and activate your Listup account.",
  "sign-in":
    "Use the code below to complete your sign-in. It expires in 10 minutes.",
  "forget-password":
    "Use the code below to reset your password. It expires in 10 minutes.",
  "change-email":
    "Use the code below to confirm your new email address. It expires in 10 minutes.",
};

/**
 * Send an email using Resend's REST API over HTTPS.
 * Highly recommended for serverless environments (Vercel) because HTTPS (port 443)
 * is never blocked by cloud firewalls or data center IP restrictions.
 */
async function sendViaResend({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const fromAddress =
    process.env.RESEND_FROM ??
    process.env.SMTP_FROM ??
    "Listup <onboarding@resend.dev>";

  console.log(`[Email] Attempting delivery via Resend HTTP API to ${to} (from ${fromAddress})...`);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend HTTP API failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  console.log(`[Email] Successfully delivered via Resend. ID: ${data.id}`);
  return data;
}

/**
 * Send an email using standard Nodemailer SMTP.
 */
async function sendViaSMTP({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.SMTP_HOST) {
    throw new Error(
      "[Email Error] SMTP_HOST is not configured in environment variables."
    );
  }

  const rawFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!rawFrom) {
    throw new Error(
      "[Email Error] Missing SMTP_FROM or SMTP_USER in environment variables."
    );
  }

  // Ensure clean "Display Name <email@domain.com>" format without duplicate brackets
  const from = rawFrom.includes("<") ? rawFrom : `"Listup" <${rawFrom}>`;
  const transport = getTransporter();

  console.log(
    `[Email] Attempting delivery via SMTP (${process.env.SMTP_HOST}:${process.env.SMTP_PORT ?? 587}) to ${to} (from ${from})...`
  );

  const info = await transport.sendMail({
    from,
    to,
    subject,
    html,
  });

  console.log(`[Email] Successfully delivered via SMTP to ${to}. MessageId: ${info.messageId}`);
  return info;
}

export async function sendOTPEmail({ to, otp, type }: SendOTPOptions) {
  const subject = subjectMap[type];
  const heading = headingMap[type];
  const body = bodyMap[type];

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#003f88 0%,#00aeef 100%);padding:32px 40px;text-align:center;">
              <span style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                List<span style="color:#7dd3fc;">up</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">${heading}</h1>
              <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6;">${body}</p>

              <!-- OTP Block -->
              <div style="background:#f8fafc;border:2px dashed #e2e8f0;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#003f88;font-family:'Courier New',monospace;">${otp}</span>
              </div>

              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                This code expires in <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#cbd5e1;">
                &copy; ${new Date().getFullYear()} Listup &mdash; Kenya&apos;s Business Directory
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // ---------------------------------------------------------------------------
  // Case 1: SMTP_HOST is configured (PRIMARY)
  // Try Nodemailer SMTP first. Can deliver to ANY recipient without domain restriction.
  // If it fails or is blocked on live hosts, fall back to Resend HTTP API.
  // ---------------------------------------------------------------------------
  if (process.env.SMTP_HOST) {
    try {
      await sendViaSMTP({ to, subject, html });
      return;
    } catch (smtpError: unknown) {
      const smtpMsg =
        smtpError instanceof Error ? smtpError.message : String(smtpError);
      console.warn(`[Email Warning] Primary SMTP attempt failed: ${smtpMsg}`);

      // If Resend is also configured, attempt fallback
      if (process.env.RESEND_API_KEY) {
        console.log("[Email] Falling back to Resend HTTP API as backup...");
        try {
          await sendViaResend({ to, subject, html });
          console.log("[Email] Backup delivery via Resend succeeded!");
          return;
        } catch (resendError: unknown) {
          const resendMsg =
            resendError instanceof Error ? resendError.message : String(resendError);
          console.error(`[Email Error] Resend fallback also failed: ${resendMsg}`);
          throw new Error(
            `Email delivery failed via both SMTP and Resend backup. SMTP error: ${smtpMsg} | Resend error: ${resendMsg}`
          );
        }
      }

      // No Resend configured to fall back to
      throw smtpError;
    }
  }

  // ---------------------------------------------------------------------------
  // Case 2: No SMTP_HOST provided -> Use Resend HTTP API directly
  // ---------------------------------------------------------------------------
  if (process.env.RESEND_API_KEY) {
    await sendViaResend({ to, subject, html });
    return;
  }

  // ---------------------------------------------------------------------------
  // Case 3: Neither provider is configured
  // ---------------------------------------------------------------------------
  const missingMsg =
    "[Email Error] No email provider configured! Please set SMTP_HOST or RESEND_API_KEY in your environment variables.";
  console.error(missingMsg);
  throw new Error(missingMsg);
}
