"use client";

import React, { useState } from "react";
import {
  HardHat,
  Sparkles,
  ShoppingBag,
  Scale,
  Server,
  GraduationCap,
  Users,
  Truck,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

const categories: Category[] = [
  { id: "construction", name: "Construction", icon: HardHat },
  { id: "cleaners", name: "Cleaners", icon: Sparkles },
  { id: "shopping", name: "Shopping", icon: ShoppingBag },
  { id: "legal", name: "Legal", icon: Scale },
  { id: "data-center", name: "Data Center", icon: Server },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "leadership", name: "Leadership", icon: Users },
  { id: "logistics", name: "Logistics", icon: Truck },
  { id: "all", name: "See All", icon: MoreHorizontal },
];

export function CategoryBar() {
  const [selectedId, setSelectedId] = useState<string>("construction");

  return (
    <div className="w-full space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-200 text-left">
        Business Categories
      </div>
      {/* Full width responsive grid spanning 100% of container */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 sm:gap-2.5 w-full">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedId(cat.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full py-3 px-2 rounded-xl transition-all border text-xs font-medium gap-2 backdrop-blur-xs",
                isSelected
                  ? "bg-primary/90 border-secondary text-primary-foreground shadow-lg ring-1 ring-secondary"
                  : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-white/40"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isSelected ? "bg-secondary text-secondary-foreground" : "bg-white/10 text-white"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate w-full text-center text-[11px] sm:text-xs">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryBar;
