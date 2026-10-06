import React from "react";
import Link from "next/link";
import { Star, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BusinessItem {
  id: string;
  initials: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  description: string;
  location: string;
  phone: string;
  website: string;
  verified?: boolean;
}

interface BusinessCardProps {
  business: BusinessItem;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col justify-between shadow-2xs hover:shadow-lg hover:border-secondary/60 transition-all group">
      <div>
        {/* Header: Initials Avatar only */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-lg flex items-center justify-center shrink-0 shadow-2xs">
            {business.initials}
          </div>
        </div>

        {/* Category badge above the name */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-primary text-xs font-semibold border border-primary/10 mb-2">
          <span>{business.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
          {business.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 my-2.5 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="font-bold text-foreground">
            {business.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({business.reviewsCount} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2 mt-2 mb-4">
          {business.description}
        </p>
      </div>

      {/* Meta details and Actions */}
      <div className="pt-3 border-t border-border/60">
        {/* Location & Website */}
        <div className="flex flex-row items-start gap-4 text-xs mb-4">
          {/* Location */}
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="text-[10px] tracking-wide font-semibold text-muted-foreground">
              Location
            </span>
            <div className="flex items-center gap-1.5">
              {/* <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" /> */}
              <span className="truncate text-foreground/80">
                {business.location}
              </span>
            </div>
          </div>

          {/* Website */}
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="text-[10px] tracking-wide font-semibold text-muted-foreground">
              Website
            </span>
            <div className="flex items-center gap-1.5">
              {/* <Globe className="w-3.5 h-3.5 text-secondary shrink-0" /> */}
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-foreground/80 hover:text-primary transition-colors"
              >
                {business.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(business.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-medium border-border hover:border-primary hover:text-primary"
            >
              Get Direction
            </Button>
          </a>
          <Link href={`#business-${business.id}`} className="w-full">
            <Button
              size="sm"
              className="w-full text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BusinessCard;
