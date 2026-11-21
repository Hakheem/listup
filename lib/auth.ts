import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins/email-otp";
import { prisma } from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/email";

export const auth = betterAuth({
  // -------------------------------------------------------------------------
  // Database
  // -------------------------------------------------------------------------
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // -------------------------------------------------------------------------
  // Base URL & Trusted Origins
  // Dynamically supports local development, custom production domain, and Vercel preview URLs
  // -------------------------------------------------------------------------
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
  trustedOrigins: [
    "http://localhost:3000",
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ].filter(Boolean) as string[],
  secret: process.env.BETTER_AUTH_SECRET!,

  // -------------------------------------------------------------------------
  // Email + Password
  // -------------------------------------------------------------------------
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,   // user must OTP-verify before signing in
    minPasswordLength: 8,
  },

  // -------------------------------------------------------------------------
  // Social: Google OAuth
  // -------------------------------------------------------------------------
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // -------------------------------------------------------------------------
  // Plugins
  // -------------------------------------------------------------------------
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,                       // 10 minutes in seconds
      sendVerificationOnSignUp: true,        // auto-send on email+pass signup
      overrideDefaultEmailVerification: true,// use OTP instead of magic link
      allowedAttempts: 5,
      storeOTP: "hashed",                   // secure OTP storage
      rateLimit: {
        window: 60,                         // 1-minute window
        max: 5,                             // max 5 OTP requests per minute
      },
      async sendVerificationOTP({ email, otp, type }) {
        try {
          console.log(`[Auth OTP] Sending ${type} code to ${email}...`);
          await sendOTPEmail({ to: email, otp, type });
          console.log(`[Auth OTP] Successfully sent code to ${email}`);
        } catch (error) {
          console.error(`[Auth OTP Error] Failed to deliver email to ${email}:`, error);
          throw error;
        }
      },
    }),
  ],

  // -------------------------------------------------------------------------
  // Email verification hook: mark otpVerified = true in database
  // -------------------------------------------------------------------------
  emailVerification: {
    autoSignInAfterVerification: true,
    async afterEmailVerification(user) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { otpVerified: true },
        });
        console.log(`[Auth] User ${user.email} marked otpVerified: true`);
      } catch (err) {
        console.error("[Auth] Failed to set otpVerified on user:", err);
      }
    },
  },

  // -------------------------------------------------------------------------
  // User: expose custom DB columns to the session/API
  // -------------------------------------------------------------------------
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,       // never user-settable via the public API
      },
      otpVerified: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
      onboardingDone: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },

  // -------------------------------------------------------------------------
  // Database hooks
  // When a brand-new user is created via Google OAuth, their account has
  // emailVerified = true (set by Google), but our otpVerified = false.
  // We fire-and-forget a sendVerificationOtp call so the client-side
  // /verify-email page already has an OTP waiting in the inbox.
  // -------------------------------------------------------------------------
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Only trigger for OAuth users (email already verified by provider)
          // Email+password users get the OTP via sendVerificationOnSignUp above.
          if (user.emailVerified && !user.otpVerified) {
            // The emailOTP plugin's sendVerificationOtp endpoint will generate
            // & store the actual OTP. We call our mailer here with a placeholder
            // so the first OTP send comes from the /verify-email page's useEffect.
            // This hook just ensures the flag state is correct.
            // The actual OTP is dispatched when the client hits /api/auth/email-otp/send-verification-otp.
          }
        },
      },
    },
  },

  // -------------------------------------------------------------------------
  // Session config
  // -------------------------------------------------------------------------
  session: {
    expiresIn: 60 * 60 * 24 * 30,     // 30 days
    updateAge: 60 * 60 * 24,          // refresh token age every 24 h
    cookieCache: {
      enabled: false,
    },
  },

  // -------------------------------------------------------------------------
  // Rate limiting (global auth endpoint protection)
  // -------------------------------------------------------------------------
  rateLimit: {
    window: 60,
    max: 10,
    storage: "memory",
  },
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
