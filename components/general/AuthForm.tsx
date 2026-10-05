"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestimonialCarousel } from "@/components/general/TestimonialCarousel";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  initialTab?: "signin" | "signup";
}

export function AuthForm({ initialTab = "signin" }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromQuery = searchParams.get("tab") as "signin" | "signup" | null;

  const [activeTab, setActiveTab] = useState<"signin" | "signup">(
    tabFromQuery || initialTab
  );

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  // Mark field as touched
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Password Rules Checklist
  const passwordRequirements = useMemo(() => {
    return [
      {
        id: "length",
        label: "At least 8 characters",
        valid: password.length >= 8,
      },
      {
        id: "uppercase",
        label: "At least 1 uppercase letter (A-Z)",
        valid: /[A-Z]/.test(password),
      },
      {
        id: "number",
        label: "At least 1 number (0-9)",
        valid: /[0-9]/.test(password),
      },
      {
        id: "special",
        label: "At least 1 special symbol (@$!%*?&)",
        valid: /[^A-Za-z0-9]/.test(password),
      },
    ];
  }, [password]);

  const isPasswordValid = passwordRequirements.every((req) => req.valid);

  // Field validation errors
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (activeTab === "signup") {
      if (!fullName.trim()) {
        errs.fullName = "Full name is required";
      } else if (fullName.trim().length < 2) {
        errs.fullName = "Name must be at least 2 characters";
      }
    }

    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (activeTab === "signup" && !isPasswordValid) {
      errs.password = "Password does not meet all security requirements";
    }

    if (activeTab === "signup") {
      if (!confirmPassword) {
        errs.confirmPassword = "Confirm password is required";
      } else if (password !== confirmPassword) {
        errs.confirmPassword = "Passwords do not match";
      }

      if (!agreeTerms) {
        errs.agreeTerms = "You must agree to the Terms and Privacy Policy";
      }
    }

    return errs;
  }, [activeTab, fullName, email, password, confirmPassword, agreeTerms, isPasswordValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all relevant fields as touched
    const allTouched: Record<string, boolean> = {
      email: true,
      password: true,
    };
    if (activeTab === "signup") {
      allTouched.fullName = true;
      allTouched.confirmPassword = true;
      allTouched.agreeTerms = true;
    }
    setTouched(allTouched);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);
    // Simulate auth action
    setTimeout(() => {
      setIsLoading(false);
      setServerSuccess(
        activeTab === "signin"
          ? "Signed in successfully! Redirecting to dashboard..."
          : "Account created successfully! Verification email sent."
      );
    }, 1200);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setServerSuccess("Redirecting to Google Authentication...");
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
      {/* ======================================================== */}
      {/* LEFT COLUMN: Gradient & Dynamic Heading & Testimonial   */}
      {/* ======================================================== */}
      <div className="lg:w-1/2 bg-gradient-to-b from-[#003f88] via-[#002f66] to-[#00aeef] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#00aeef]/20 blur-3xl pointer-events-none" />

        {/* Top: Logo & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-extrabold tracking-tight text-white">
              List<span className="text-[#00aeef] transition-colors group-hover:text-white">up</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00aeef]" />
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-xs"
          >
            ← Back to Homepage
          </Link>
        </div>

        {/* Middle: Dynamic Text Based on Active Tab */}
        <div className="relative z-10 my-10 lg:my-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00aeef]" />
            <span>
              {activeTab === "signin"
                ? "Secure Business Portal"
                : "Join 124,262+ Kenyan Businesses"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight transition-all duration-300">
            {activeTab === "signin" ? (
              <>
                Welcome Back to <br />
                <span className="text-[#00aeef]">Kenya&apos;s Top Directory</span>
              </>
            ) : (
              <>
                Turn Your Presence <br />
                <span className="text-[#00aeef]">Into Opportunity</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-md leading-relaxed font-normal">
            {activeTab === "signin"
              ? "Access your business analytics, manage incoming client inquiries, update listings, and reply to verified customer reviews."
              : "Create your free business account today. Reach millions of customers across all 47 counties and gain immediate online credibility."}
          </p>
        </div>

        {/* Bottom: Subtle Testimonial Card with 3-Dots Carousel */}
        <div className="relative z-10 pt-4">
          <TestimonialCarousel variant="auth" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: 2 Tabs (Sign In / Sign Up) & Form Inputs   */}
      {/* ======================================================== */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-7">
          {/* Tabs: Sign In / Sign Up */}
          <div className="p-1.5 bg-slate-100 rounded-xl grid grid-cols-2 gap-1 border border-border/70">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setTouched({});
                setServerSuccess(null);
              }}
              className={cn(
                "py-2.5 text-sm font-semibold rounded-lg transition-all text-center",
                activeTab === "signin"
                  ? "bg-white text-[#003f88] shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setTouched({});
                setServerSuccess(null);
              }}
              className={cn(
                "py-2.5 text-sm font-semibold rounded-lg transition-all text-center",
                activeTab === "signup"
                  ? "bg-white text-[#003f88] shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Tab Header Titles */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              {activeTab === "signin"
                ? "Sign In to Your Account"
                : "Create Your Free Account"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {activeTab === "signin"
                ? "Enter your credentials below to access your business dashboard."
                : "Fill in your details below to get started with Listup."}
            </p>
          </div>

          {/* Server Success Alert */}
          {serverSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{serverSuccess}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name (Sign Up only) */}
            {activeTab === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Full Name</span>
                  <span className="text-[11px] text-muted-foreground">Required</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <User className="w-4 h-4" />
                  </div>
                  <Input
                    type="text"
                    placeholder="e.g. Dr. Jane Mwangi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    className={cn(
                      "pl-9 h-11 text-sm rounded-lg transition-all",
                      touched.fullName && errors.fullName
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : "border-border"
                    )}
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[11px] text-muted-foreground">Required</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  type="email"
                  placeholder="name@business.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={cn(
                    "pl-9 h-11 text-sm rounded-lg transition-all",
                    touched.email && errors.email
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "border-border"
                  )}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Business Name (Optional on Sign Up) */}
            {activeTab === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Business / Organization Name</span>
                  <span className="text-[11px] text-muted-foreground">Optional</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <Input
                    type="text"
                    placeholder="e.g. Reliquef Eye Care Clinic"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-9 h-11 text-sm rounded-lg border-border"
                  />
                </div>
              </div>
            )}

            {/* Password with Show/Hide toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Password
                </label>
                {activeTab === "signin" && (
                  <Link
                    href="#forgot-password"
                    className="text-xs font-medium text-[#003f88] hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={cn(
                    "pl-9 pr-10 h-11 text-sm rounded-lg transition-all",
                    touched.password && errors.password
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "border-border"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {touched.password && errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.password}</span>
                </p>
              )}

              {/* Password Requirements Checklist (Live as user types) */}
              {activeTab === "signup" && (
                <div className="p-3 bg-slate-50 rounded-lg border border-border/80 space-y-1.5 mt-2">
                  <div className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
                    Password Security Requirements:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.id}
                        className={cn(
                          "flex items-center gap-1.5 text-[11px] transition-colors",
                          req.valid
                            ? "text-emerald-700 font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {req.valid ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Sign Up only) */}
            {activeTab === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={cn(
                      "pl-9 pr-10 h-11 text-sm rounded-lg transition-all",
                      touched.confirmPassword && errors.confirmPassword
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : "border-border"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            )}

            {/* Terms Agreement Checkbox (Sign Up only) */}
            {activeTab === "signup" && (
              <div className="space-y-1 pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-border text-[#003f88] focus:ring-[#00aeef] mt-0.5"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="#terms" className="text-[#003f88] font-semibold hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#privacy" className="text-[#003f88] font-semibold hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {touched.agreeTerms && errors.agreeTerms && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.agreeTerms}</span>
                  </p>
                )}
              </div>
            )}

            {/* Remember me (Sign In only) */}
            {activeTab === "signin" && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="rounded border-border text-[#003f88] focus:ring-[#00aeef]"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#003f88] hover:bg-[#002f66] text-white font-semibold text-sm shadow-md transition-all mt-3"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : activeTab === "signin" ? (
                "Sign In to Your Account"
              ) : (
                "Create Free Account"
              )}
            </Button>
          </form>

          {/* "Or sign in with Google" Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted-foreground font-semibold">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full h-11 border-border bg-white text-foreground hover:bg-slate-50 font-semibold text-sm flex items-center justify-center gap-3 transition-all"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </Button>

          {/* Footer toggle prompt */}
          <div className="text-center text-xs text-muted-foreground pt-2">
            {activeTab === "signin" ? (
              <span>
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="font-bold text-[#003f88] hover:text-[#00aeef] hover:underline"
                >
                  Sign Up for Free
                </button>
              </span>
            ) : (
              <span>
                Already have a business account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className="font-bold text-[#003f88] hover:text-[#00aeef] hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
