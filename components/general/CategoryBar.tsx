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
  MoreHorizontal,
  Mop,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

const categories: Category[] = [
  { id: "legal", name: "Legal", icon: Scale },
  { id: "construction", name: "Construction", icon: HardHat },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "shopping", name: "Shopping", icon: ShoppingBag },
  { id: "logistics", name: "Logistics", icon: Truck },
  { id: "data-center", name: "Data Center", icon: Server },
  { id: "cleaners", name: "Cleaners", icon: Mop },
  { id: "leadership", name: "Leadership", icon: Users },
  { id: "all", name: "See All", icon: MoreHorizontal },
];

export function CategoryBar() {
  // const [selectedId, setSelectedId] = useState<string>("construction");

  return (
    <div className="w-full space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-200 text-left">
        Business Categories
      </div>
      {/* Full width responsive grid spanning 100% of container */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 sm:gap-2.5 w-full">
        {categories.map((cat) => {
          const Icon = cat.icon;
          // const isSelected = selectedId === cat.id;
          return (
            <button
              key={cat.id}
              // onClick={() => setSelectedId(cat.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full py-3 px-2 rounded-lg transition-all border text-xs font-medium gap-2 backdrop-blur-xs",
                // isSelected
                //   ? "bg-primary/90 border-secondary text-primary-foreground shadow-md ring-1 ring-secondary"
                //   : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-white/40",
                "bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-white/40",
              )}
            >
              <div
                className={cn(
                  "p-1.5 transition-colors",
                  // isSelected ? " text-secondary-foreground" : " text-white",
                  "text-white",
                )}
              >
                <Icon className="w-5 h-5" />
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
