import React from "react";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";

export interface CountyItem {
  number: number;
  name: string;
  count: string;
}

interface CountyCardProps {
  county: CountyItem;
}

export function CountyCard({ county }: CountyCardProps) {
  return (
    <Link
      href={`#county-${county.name.toLowerCase()}`}
      className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:border-secondary hover:bg-accent/40 transition-all group shadow-2xs"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          <MapPin className="w-3.5 h-3.5 text-secondary" />
          <span>{county.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
          {county.count}
        </span>
        <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-secondary transition-colors" />
      </div>
    </Link>
  );
}

export default CountyCard;
