import Link from "next/link";
import { BadgeCheck, Globe, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Business } from "@/lib/data/businesses";

export function BusinessListingCard({ business, href }: { business: Business; href: string }) {
  const website = business.website.startsWith("http")
    ? business.website
    : `https://${business.website}`;

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border-[0.5px] bg-card p-4 shadow-2xs transition-all hover:border-secondary/60 hover:shadow-lg">
      {/* Logo + tag, name, tagline, rating */}
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary text-sm font-bold text-primary-foreground">
          {business.initials}
        </div>

        <div className="min-w-0 flex-1">
          {business.tag && (
            <span className="inline-block max-w-full truncate rounded bg-accent px-1.5 py-0.5 align-top text-[9px] font-semibold uppercase leading-3 tracking-wide text-primary">
              {business.tag}
            </span>
          )}
          <h3 className="mt-1 flex min-w-0 items-center gap-1 text-[12px] font-bold">
            <span className="truncate">{business.name}</span>
            {business.verified && <BadgeCheck className="size-3.5 shrink-0 text-secondary" />}
          </h3>
          <p className="truncate text-[9px] text-muted-foreground">
            {business.tagline ?? business.category}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px]">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="font-bold">{business.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({business.reviewsCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="line-clamp-2 min-h-[39px] text-xs leading-relaxed text-foreground/80">
        {business.description}
      </p>

      {/*details, buttons */}
      
        <div className="mb-4 grid grid-cols-2 gap-4 text-[11px]">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-muted-foreground">Location</p>
            <p className="mt-0.5 font-semibold flex items-center gap-1">
              <MapPin className="size-3 shrink-0 text-secondary" />
              <span className="truncate">{business.location}</span>
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-muted-foreground">Website</p>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-1 font-semibold text-secondary hover:underline"
            >
              <Globe className="size-3 shrink-0" />
              <span className="truncate">{business.website.replace(/^https?:\/\//, "")}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(business.location)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="w-full text-xs">Get Direction</Button>
          </a>
          <Link href={href}>
            <Button size="sm" className="w-full text-xs font-semibold">View Profile</Button>
          </Link>
        </div>
      </div>
    
  );
}