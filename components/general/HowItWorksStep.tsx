import React from "react";
import { UserCheck, FileText, CheckCircle2, TrendingUp } from "lucide-react";

interface StepItem {
  number: string;
  stepNumber: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: StepItem[] = [
  {
    number: "01",
    stepNumber: "Step 1",
    title: "Create Account",
    description:
      "Sign up using your credentials and enter relevant details to customize your business profile.",
    icon: UserCheck,
  },
  {
    number: "02",
    stepNumber: "Step 2",
    title: "List your Business",
    description:
      "Fill in your profile information, services provided, location, and social handles.",
    icon: FileText,
  },
  {
    number: "03",
    stepNumber: "Step 3",
    title: "Submit for Review",
    description:
      "Submit your business profile. Our team will review your listing for quality, accuracy and approval.",
    icon: CheckCircle2,
  },
  {
    number: "04",
    stepNumber: "Step 4",
    title: "Get Discovered",
    description:
      "Your business will go live. You are now discoverable by clients worldwide.",
    icon: TrendingUp,
  },
];

export function HowItWorksSteps() {
  return (
    <div className="relative rounded-b-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center relative group"
            >
              {/* Wavy dotted arrow to next step (hidden on the last item) */}
              {!isLast && (
                <div className="hidden lg:block absolute top-9 left-1/2 w-full pointer-events-none">
                  <svg
                    className="w-full h-4 text-secondary/50"
                    viewBox="0 0 100 16"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    {/* Wavy dotted line — two smooth humps */}
                    <path
                      d="M14 8 C 26 0, 38 0, 50 8 S 74 16, 86 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Arrowhead — base sits exactly at the curve's end (86, 8) */}
                    <path
                      d="M86 8 L82 5 M86 8 L82 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}

              {/* Step Circle with Step Number Pill */}
              <div className="relative mb-5">
                <div className="w-18 h-18 rounded-full border-2 border-secondary/40 bg-accent/60 flex flex-col items-center justify-center transition-all shadow-2xs">
                  <span className="text-xs font-bold text-primary tracking-wider mb-0.5">
                    {step.number}
                  </span>
                  <Icon className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                </div>
              </div>

              {/* Step Title & Badge */}
              <span className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                {step.stepNumber}
              </span>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HowItWorksSteps;
