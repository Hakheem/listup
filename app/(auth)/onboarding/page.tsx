"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building,
  GraduationCap,
  ShoppingBag,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type RoleOption =
  | "business_owner"
  | "professional"
  | "employer"
  | "job_seeker"
  | "customer"
  | "user";

interface RoleCard {
  id: RoleOption;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const ROLES: RoleCard[] = [
  {
    id: "business_owner",
    title: "Business Owner",
    badge: "Growth & Listings",
    description: "List my business, manage reviews, and get discovered by thousands of local customers.",
    icon: Building,
    accentColor: "border-[#003f88] hover:border-[#003f88] hover:bg-blue-50/50",
  },
  {
    id: "professional",
    title: "Professional",
    badge: "Service Expert",
    description: "Showcase my credentials, build trust with verified clients, and offer consulting or services.",
    icon: GraduationCap,
    accentColor: "border-emerald-600 hover:border-emerald-600 hover:bg-emerald-50/50",
  },
  {
    id: "employer",
    title: "Employer / Recruiter",
    badge: "Hiring Talent",
    description: "Post job openings, discover vetted professionals, and recruit top Kenyan talent.",
    icon: Briefcase,
    accentColor: "border-indigo-600 hover:border-indigo-600 hover:bg-indigo-50/50",
  },
  {
    id: "job_seeker",
    title: "Job Seeker",
    badge: "Careers & Jobs",
    description: "Browse verified vacancies, apply to companies, and connect with recruiting managers.",
    icon: Search,
    accentColor: "border-amber-600 hover:border-amber-600 hover:bg-amber-50/50",
  },
  {
    id: "customer",
    title: "Customer",
    badge: "Find Services",
    description: "Find trusted local businesses, compare prices, read genuine reviews, and request quotes.",
    icon: ShoppingBag,
    accentColor: "border-sky-600 hover:border-sky-600 hover:bg-sky-50/50",
  },
  {
    id: "user",
    title: "Community Member",
    badge: "General Explorer",
    description: "Explore directories across all 47 counties, bookmark favorites, and stay informed.",
    icon: Compass,
    accentColor: "border-slate-500 hover:border-slate-500 hover:bg-slate-50/80",
  },
];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [branchField1, setBranchField1] = useState("");
  const [branchField2, setBranchField2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = (role: RoleOption) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleNext = () => {
    if (!selectedRole) {
      setError("Please select the role that best describes your goal.");
      return;
    }
    setStep(2);
  };

  const handleComplete = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          answers: {
            detail1: branchField1.trim(),
            detail2: branchField2.trim(),
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete onboarding.");
      }

      window.location.href = data.redirectUrl || "/";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  const currentRoleConfig = ROLES.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#003f88] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step {step} of 2 &bull; Personalize Your Experience</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {step === 1 ? "What brings you to Listup?" : "Tell us a bit more about yourself"}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          {step === 1
            ? "Choose the primary reason you are joining today. You can always adjust your preferences or add services later."
            : `Tailoring your workspace for ${currentRoleConfig?.title}. This will help us deliver relevant recommendations.`}
        </p>
      </div>

      {/* Main Card Container */}
      <div className="max-w-4xl mx-auto w-full my-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Conversational Role Picker */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className={cn(
                    "cursor-pointer rounded-2xl p-6 transition-all border-2 bg-white flex flex-col justify-between relative shadow-xs hover:shadow-md",
                    isSelected
                      ? "border-[#003f88] ring-2 ring-[#003f88]/20 bg-blue-50/20"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-[#003f88] text-white"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {role.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{role.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{role.description}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? "text-[#003f88]" : "text-slate-400"}>
                      {isSelected ? "Selected" : "Select Role"}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#003f88]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 2: Branching Questions */}
        {step === 2 && currentRoleConfig && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#003f88] text-white flex items-center justify-center">
                <currentRoleConfig.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{currentRoleConfig.title} Setup</h3>
                <p className="text-xs text-slate-500">Quick details to prepare your dashboard</p>
              </div>
            </div>

            {selectedRole === "business_owner" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Business or Company Name</label>
                  <Input
                    placeholder="e.g. Apex Logistics Ltd"
                    value={branchField1}
                    onChange={(e) => setBranchField1(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Primary County / Location</label>
                  <Input
                    placeholder="e.g. Nairobi, Mombasa, Kisumu"
                    value={branchField2}
                    onChange={(e) => setBranchField2(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedRole === "professional" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Specialization / Profession</label>
                  <Input
                    placeholder="e.g. Certified Accountant, Legal Consultant, Software Engineer"
                    value={branchField1}
                    onChange={(e) => setBranchField1(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Years of Experience</label>
                  <Input
                    placeholder="e.g. 5+ years"
                    value={branchField2}
                    onChange={(e) => setBranchField2(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedRole === "employer" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Organization or Company</label>
                  <Input
                    placeholder="e.g. Safari Ventures Ltd"
                    value={branchField1}
                    onChange={(e) => setBranchField1(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Primary Roles You Hire For</label>
                  <Input
                    placeholder="e.g. Sales, Engineering, Healthcare"
                    value={branchField2}
                    onChange={(e) => setBranchField2(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedRole === "job_seeker" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Desired Job Title or Field</label>
                  <Input
                    placeholder="e.g. Marketing Specialist, Project Manager"
                    value={branchField1}
                    onChange={(e) => setBranchField1(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Current Career Level</label>
                  <Input
                    placeholder="e.g. Entry level, Mid-level, Senior"
                    value={branchField2}
                    onChange={(e) => setBranchField2(e.target.value)}
                  />
                </div>
              </div>
            )}

            {(selectedRole === "customer" || selectedRole === "user") && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Main Industry / Sector of Interest</label>
                  <Input
                    placeholder="e.g. Tech, Real Estate, Health, Legal"
                    value={branchField1}
                    onChange={(e) => setBranchField1(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Your County / City</label>
                  <Input
                    placeholder="e.g. Nairobi, Nakuru, Eldoret"
                    value={branchField2}
                    onChange={(e) => setBranchField2(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons Footer */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pt-6 border-t border-slate-200">
        {step === 2 ? (
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        ) : (
          <div />
        )}

        {step === 1 ? (
          <Button
            onClick={handleNext}
            disabled={!selectedRole}
            className="bg-[#003f88] hover:bg-[#002f66] text-white flex items-center gap-2 px-6"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="bg-[#003f88] hover:bg-[#002f66] text-white flex items-center gap-2 px-8"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up your dashboard...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Complete Onboarding <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
