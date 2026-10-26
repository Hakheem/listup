import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

interface SessionUser {
  id: string;
  name?: string;
  email: string;
  role: string;
  otpVerified: boolean;
  onboardingDone: boolean;
}

interface SessionData {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
}

// ---------------------------------------------------------------------------
// Route → role access map
// Prefix-matched: "/admin" covers "/admin", "/admin/users", etc.
// ---------------------------------------------------------------------------
const ROLE_ROUTES: Record<string, string[]> = {
  "/admin":        ["admin"],
  "/professional": ["professional", "admin"],
  "/employer":     ["employer", "admin"],
  "/customer":     ["customer", "admin"],
  "/business":     ["business_owner", "admin"],
  "/jobs":         ["job_seeker", "employer", "admin"],
};

// Routes that are completely public (no auth needed)
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/verify-email",
  "/contact",
  "/professionals",
  "/businesses",
  "/jobs",          // public listing page (GET), portal is /jobs/* with auth
];

// Routes only accessible when NOT logged in
const GUEST_ONLY_PATHS = ["/login", "/signup"];

// -------------------------------------------------------------------------
// Role → home redirect
// -------------------------------------------------------------------------
export function roleHome(role: string): string {
  const map: Record<string, string> = {
    admin:          "/admin",
    professional:   "/professional",
    employer:       "/employer",
    customer:       "/customer",
    business_owner: "/business",
    job_seeker:     "/jobs",
    user:           "/",
  };
  return map[role] ?? "/";
}

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isGuestOnly(pathname: string): boolean {
  return GUEST_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function matchedRoles(pathname: string): string[] | null {
  for (const [prefix, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return roles;
    }
  }
  return null;
}

// -------------------------------------------------------------------------
// Proxy
// -------------------------------------------------------------------------
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next.js internals, static files, and all API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||        // all API routes handle their own auth & return JSON
    pathname.startsWith("/favicon") ||
    pathname.match(/\.\w+$/)              // static assets
  ) {
    return NextResponse.next();
  }

  // Retrieve session by querying the auth endpoint with forwarded cookies
  const { data: session } = await betterFetch<SessionData>("/api/auth/get-session?disableCookieCache=true", {
    baseURL: req.nextUrl.origin,
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  }).catch(() => ({ data: null }));

  const user = session?.user;

  // ------------------------------------------------------------------
  // 1. Guest-only pages: redirect logged-in users to their dashboard / onboarding
  // ------------------------------------------------------------------
  if (user && isGuestOnly(pathname)) {
    if (!user.otpVerified) {
      return NextResponse.redirect(new URL("/verify-email", req.url));
    }
    if (!user.onboardingDone) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.redirect(new URL(roleHome(user.role), req.url));
  }

  // ------------------------------------------------------------------
  // 2. OTP gate: if authenticated but OTP not verified → /verify-email
  // ------------------------------------------------------------------
  if (user && !user.otpVerified && pathname !== "/verify-email") {
    return NextResponse.redirect(new URL("/verify-email", req.url));
  }

  // ------------------------------------------------------------------
  // 3. Already verified visiting /verify-email: don't let them stay on /verify-email
  // ------------------------------------------------------------------
  if (user && user.otpVerified && pathname === "/verify-email") {
    if (!user.onboardingDone) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.redirect(new URL(roleHome(user.role), req.url));
  }

  // ------------------------------------------------------------------
  // 4. Onboarding gate: verified but hasn't completed onboarding → /onboarding
  // ------------------------------------------------------------------
  if (
    user &&
    user.otpVerified &&
    !user.onboardingDone &&
    !pathname.startsWith("/onboarding")
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // ------------------------------------------------------------------
  // 5. Already onboarded visiting /onboarding: send to dashboard
  // ------------------------------------------------------------------
  if (user && user.onboardingDone && pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL(roleHome(user.role), req.url));
  }

  // ------------------------------------------------------------------
  // 6. Public routes: allow everyone through
  // ------------------------------------------------------------------
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // ------------------------------------------------------------------
  // 7. Unauthenticated: redirect to login
  // ------------------------------------------------------------------
  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ------------------------------------------------------------------
  // 8. Role-based access control
  // ------------------------------------------------------------------
  const allowedRoles = matchedRoles(pathname);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but wrong role → send to their own dashboard
    return NextResponse.redirect(new URL(roleHome(user.role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match everything except Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
