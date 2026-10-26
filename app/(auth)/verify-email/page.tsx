"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, RefreshCw, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  const [email, setEmail] = useState<string>(() => searchParams.get("email") ?? "");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(OTP_LENGTH).fill(null));
  const hasSentInitialOtp = useRef(false);

  // Sync email from search params or active session (essential for Google OAuth users)
  useEffect(() => {
    const queryEmail = searchParams.get("email");
    if (queryEmail && queryEmail !== email) {
      setEmail(queryEmail);
    } else if (!email && session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [searchParams, session?.user?.email, email]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Auto-send OTP once email is resolved
  useEffect(() => {
    if (!email || hasSentInitialOtp.current) return;
    hasSentInitialOtp.current = true;

    console.log("[VerifyEmail] Requesting verification OTP for:", email);
    setInfoMessage("Sending verification code to your email...");

    authClient.emailOtp
      .sendVerificationOtp({
        email,
        type: "email-verification",
      })
      .then((res) => {
        if (res.error) {
          console.error("[VerifyEmail] sendVerificationOtp error:", res.error);
          setError(res.error.message || "Failed to send code. Click Resend.");
          setInfoMessage(null);
        } else {
          setInfoMessage(`A 6-digit code has been sent to ${email}`);
          setCooldown(RESEND_COOLDOWN);
        }
      })
      .catch((err) => {
        console.error("[VerifyEmail] sendVerificationOtp exception:", err);
        setError("Network error while requesting code. Please click Resend.");
        setInfoMessage(null);
      });
  }, [email]);

  // OTP digit input handling
  const focusNext = (idx: number) => inputRefs.current[idx + 1]?.focus();
  const focusPrev = (idx: number) => inputRefs.current[idx - 1]?.focus();

  const handleChange = (idx: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    setError(null);
    if (char) focusNext(idx);
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx]) focusPrev(idx);
    if (e.key === "ArrowLeft") focusPrev(idx);
    if (e.key === "ArrowRight") focusNext(idx);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const otp = digits.join("");

  // Verify action
  const handleVerify = useCallback(async () => {
    if (!email) {
      setError("Email address missing. Please try logging in again.");
      return;
    }

    if (otp.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const res = await authClient.emailOtp.verifyEmail({ email, otp });

      if (res.error) {
        setError(res.error.message ?? "Invalid or expired code. Please try again.");
        setIsVerifying(false);
        return;
      }

      // Mark otpVerified: true in our database
      await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(console.error);

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      setError(msg);
      setIsVerifying(false);
    }
  }, [email, otp, router]);

  // Auto-verify when all digits are entered
  useEffect(() => {
    if (otp.length === OTP_LENGTH && digits.every(Boolean) && !isVerifying && !success) {
      handleVerify();
    }
  }, [otp, digits, isVerifying, success, handleVerify]);

  // Resend action
  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    setIsResending(true);
    setError(null);
    setInfoMessage("Sending a new code...");
    setDigits(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();

    try {
      const res = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (res.error) {
        setError(res.error.message || "Failed to resend code. Try again later.");
        setInfoMessage(null);
      } else {
        setInfoMessage(`New code sent to ${email}`);
        setCooldown(RESEND_COOLDOWN);
      }
    } catch {
      setError("Network error while resending. Please try again.");
      setInfoMessage(null);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-border/60 overflow-hidden">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-[#003f88] to-[#00aeef] p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-3">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Verify Your Email</h1>
            <p className="text-blue-100 text-sm mt-1">Check your inbox for a 6-digit code</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Email badge */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-border/60">
              <Mail className="w-4 h-4 text-[#003f88] shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">
                {email || (isSessionLoading ? "Checking account..." : "No email detected")}
              </span>
            </div>

            {/* Info Message (code sent) */}
            {infoMessage && !error && !success && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Success state */}
            {success ? (
              <div className="text-center space-y-3 py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-base font-semibold text-foreground">Email verified!</p>
                <p className="text-sm text-muted-foreground">Redirecting you to onboarding…</p>
              </div>
            ) : (
              <>
                {/* OTP Input Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Enter your 6-digit code
                  </label>
                  <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                    {digits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className={cn(
                          "w-11 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all",
                          "focus:border-[#003f88] focus:ring-2 focus:ring-[#003f88]/20",
                          digit ? "border-[#003f88] bg-[#003f88]/5" : "border-border bg-white",
                          error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""
                        )}
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="text-xs text-destructive flex items-center gap-1 justify-center mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{error}</span>
                    </p>
                  )}
                </div>

                {/* Verify button */}
                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || otp.length < OTP_LENGTH || !email}
                  className="w-full h-11 bg-[#003f88] hover:bg-[#002f66] text-white font-semibold text-sm"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Verify Email <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                {/* Resend */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || isResending || !email}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-semibold transition-colors",
                      cooldown > 0 || !email
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-[#003f88] hover:text-[#00aeef]"
                    )}
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", isResending && "animate-spin")} />
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Back link */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Wrong account?{" "}
          <Link href="/signup" className="font-semibold text-[#003f88] hover:underline">
            Start over
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-3 border-[#003f88] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
