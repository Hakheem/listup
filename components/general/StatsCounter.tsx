import React from "react";
import { Container } from "@/components/layout/Container";

interface StatItem {
  value: string;
  label: string;
}

const defaultStats: StatItem[] = [
  { value: "24", label: "Active Categories" },
  { value: "124,262+", label: "Verified Businesses" },
  { value: "47", label: "Kenyan Counties" },
  { value: "3,255+", label: "Daily Inquiries" },
];

export function StatsCounter({ stats = defaultStats }: { stats?: StatItem[] }) {
  return (
    <div className="bg-primary text-primary-foreground py-10 border-y border-primary/20 rounded-b-3xl shadow-inner">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/15">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center ${idx > 0 ? "pt-4 md:pt-0" : ""}`}
            >
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1.5">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium tracking-wide uppercase text-slate-200">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default StatsCounter;
