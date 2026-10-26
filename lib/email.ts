import nodemailer from "nodemailer";

/**
 * Nodemailer transporter.
 * Fill in the SMTP_ env vars in .env — works with Gmail App Passwords,
 * Mailtrap, Brevo, Resend's SMTP bridge, etc.
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587/25
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

export async function sendOTPEmail({ to, otp, type }: SendOTPOptions) {
  const subject = subjectMap[type];
  const heading = headingMap[type];
  const body = bodyMap[type];

  await transporter.sendMail({
    from: `"Listup" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to,
    subject,
    html: `
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
    `.trim(),
  });
}
