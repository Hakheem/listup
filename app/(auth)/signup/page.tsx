import React, { Suspense } from "react";
import AuthForm from "@/components/general/AuthForm";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-3 border-[#003f88] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthForm initialTab="signup" />
    </Suspense>
  );
}
