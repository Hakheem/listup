import React from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Database, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OwnBusinessBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent via-sky-50/70 to-accent/60 p-8 sm:p-12 border border-secondary/30 shadow-2xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Check className="w-3.5 h-3.5 text-secondary" />
            <span>For All Businesses</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight leading-tight">
            Own a Business in Kenya? <br />
            <span className="text-secondary">Get it Listed Today</span>
          </h2>
          <p className="text-sm sm:text-base text-foreground/80 max-w-lg leading-relaxed">
            Join 124,262+ businesses reaching millions of ready buyers across all 47 counties in Kenya. Boost your SEO, generate verified customer reviews, and receive inquiries.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs px-6 h-11">
                List My Business — For Free
              </Button>
            </Link>
            <Link href="#pricing">
              <Button
                variant="outline"
                className="bg-background/80 border-border text-foreground hover:bg-background hover:text-primary px-5 h-11"
              >
                Learn More <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side stacked illustration cards */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-sm space-y-3">
            <div className="bg-card p-4 rounded-2xl shadow-md border border-border flex items-center gap-3 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-foreground">Verified Local Enterprise</div>
                <div className="text-[11px] text-muted-foreground">SEO Indexing • Direct WhatsApp Leads</div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="bg-card p-4 rounded-2xl shadow-lg border border-secondary/40 flex items-center gap-3 transform translate-x-2">
              <div className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-foreground">Listed Business Get Visibility</div>
                <div className="text-[11px] text-muted-foreground">Top Ranking in Google & Local Search</div>
              </div>
              <span className="text-xs font-bold text-primary bg-accent px-2 py-0.5 rounded-full">
                +350% Reach
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DatabaseBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent via-sky-50 to-accent/80 p-8 sm:p-12 border border-secondary/30 shadow-2xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-secondary" />
            <span>National Business Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight leading-tight">
            Access Kenya&apos;s Most Complete <br />
            <span className="text-secondary">Business Database</span>
          </h2>
          <p className="text-sm sm:text-base text-foreground/80 max-w-lg leading-relaxed">
            Access 124,262+ verified businesses, contacts, and services across all 47 counties. Filter by industry sector, geographical location, ratings, and verified credentials.
          </p>
          <div className="pt-2">
            <Link href="#businesses">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs px-6 h-11">
                Start Filtering <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side cards */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm space-y-3">
            <div className="bg-card p-4 rounded-2xl shadow-md border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent text-primary flex items-center justify-center font-bold">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">124,262+ Records</div>
                  <div className="text-[11px] text-muted-foreground">Updated daily with verified contacts</div>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Listed Business At Your Fingertips
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
