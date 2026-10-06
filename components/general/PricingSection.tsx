"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Container from "../layout/Container";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description:
        "Ideal for small & growing local businesses starting online.",
      monthlyPrice: "2,499",
      annualPrice: "1,999",
      popular: false,
      buttonText: "Subscribe",
      features: [
        "1 Verified Business Listing",
        "1-3 Team Member Access",
        "Profile photo & gallery management",
        "Customer reviews management",
        "Basic analytics & visitor reports",
        "99.5% Platform uptime guarantee",
        "Daily automated backups",
        "Standard phone & email support",
      ],
    },
    {
      name: "Growth",
      description:
        "Perfect for businesses looking to dominate search and capture more leads.",
      monthlyPrice: "4,999",
      annualPrice: "3,999",
      popular: true,
      buttonText: "Subscribe",
      features: [
        "Everything in Starter, plus:",
        "Unlimited directory listings",
        "Up to 10 team management seats",
        "Automatic lead forwarding (WhatsApp & SMS)",
        "Premium SEO optimized profile ranking",
        "Official Brand Verification Blue Badge",
        "Social media directory syndication",
        "Priority 24/7 business support",
      ],
    },
    {
      name: "Pro / Scale",
      description:
        "For established firms, multi-branch franchises and agencies.",
      monthlyPrice: "8,999",
      annualPrice: "7,199",
      popular: false,
      buttonText: "Subscribe",
      features: [
        "Everything in Growth, plus:",
        "Dedicated account manager",
        "Custom API & webhook integrations",
        "Multi-county & branch management",
        "Custom branded landing page setup",
        "Quarterly performance reviews",
        "White-glove listing onboarding",
        "24/7 VIP hotline & emergency assistance",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-20 bg-muted/50">
      <Container className="space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Connect to our network. <br />
            <span className="text-primary">Expand your reach.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Get listed. Expand your visibility, attract new customers, and grow
            your business. Build a strong online reputation through reviews.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={cn(
                "text-xs sm:text-sm font-semibold cursor-pointer transition-colors",
                !isAnnual ? "text-primary" : "text-muted-foreground",
              )}
              onClick={() => setIsAnnual(false)}
            >
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors p-0.5 relative focus:outline-none focus:ring-2 focus:ring-secondary",
                isAnnual ? "bg-primary" : "bg-muted-foreground/30",
              )}
              aria-label="Toggle annual billing"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full bg-background transition-transform shadow-2xs",
                  isAnnual ? "translate-x-6" : "translate-x-0",
                )}
              />
            </button>
            <span
              className={cn(
                "text-xs sm:text-sm font-semibold cursor-pointer flex items-center gap-1.5 transition-colors",
                isAnnual ? "text-primary" : "text-muted-foreground",
              )}
              onClick={() => setIsAnnual(true)}
            >
              Annual Billing
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={cn(
                "relative rounded-xl flex flex-col justify-between transition-all duration-200 overflow-visible",
                plan.popular
                  ? "bg-gradient-to-br from-white via-secondary/5 to-secondary/10 shadow-lg"
                  : "bg-card border border-border/20 shadow-2xs hover:border-border/50",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-2xs">
                  Most Popular
                </div>
              )}

              <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price Display */}
                  <div className="my-6 flex items-baseline gap-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">
                      KES
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / month
                    </span>
                  </div>

                  <Link href="/signup" className="w-full block mb-6">
                    <Button
                      className={cn(
                        "w-full h-11 font-semibold text-sm transition-all",
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
                          : "border-border text-foreground hover:border-primary hover:text-primary",
                      )}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>

                  {/* Features List */}
                  <div className="space-y-3 pt-2 border-t border-border/40">
                    <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                      What&apos;s included:
                    </div>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2.5 text-xs text-foreground/85"
                        >
                          <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise Bottom Banner */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Enterprise & Government Associations
              </h4>
              <p className="text-xs text-muted-foreground">
                For institutions, trade associations, and multi-enterprise
                networks. Custom plan for 100+ businesses.
              </p>
            </div>
          </div>
          <Link href="#contact" className="shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-xs font-semibold border-border hover:border-primary hover:text-primary gap-1.5"
            >
              Get in Touch <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default PricingSection;
