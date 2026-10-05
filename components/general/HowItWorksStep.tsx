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
      "Submit your profile for editing. Our team reviews your listing for quality and accuracy.",
    icon: CheckCircle2,
  },
  {
    number: "04",
    stepNumber: "Step 4",
    title: "Get Discovered",
    description:
      "Your profile is now live! Sit back and enjoy the credibility and reach as clients find you.",
    icon: TrendingUp,
  },
];

export function HowItWorksSteps() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center relative group">
              {/* Step Circle with Step Number Pill */}
              <div className="relative mb-5">
                <div className="w-18 h-18 rounded-full border-2 border-secondary/40 bg-accent/60 flex flex-col items-center justify-center transition-all group-hover:scale-105 group-hover:border-primary group-hover:bg-accent shadow-2xs">
                  <span className="text-xs font-bold text-primary tracking-wider mb-0.5">
                    {step.number}
                  </span>
                  <Icon className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                </div>

                {/* Connecting arrow for desktop (between steps) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-12 -translate-y-1/2 w-12 text-secondary/60 pointer-events-none">
                    <svg
                      viewBox="0 0 50 15"
                      fill="none"
                      className="w-full h-auto stroke-current"
                    >
                      <path
                        d="M2 10 Q 25 -3 46 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        fill="none"
                      />
                      <path
                        d="M42 4 L48 8 L42 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
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
