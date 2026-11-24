import Image from "next/image";
import Link from "next/link";
import { Clock, Globe, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/general/RatingStars";
import type { Business } from "@/lib/data/businesses";

export function BusinessContactCard({ business }: { business: Business }) {
  const address = business.address ?? business.location;
  const website = business.website.startsWith("http")
    ? business.website
    : `https://${business.website}`;
  const tel = `tel:${business.phone.replace(/\s/g, "")}`;

  return (
    <aside className="space-y-4">
      
      <div className="overflow-hidden rounded-xl border">
        <div className="bg-[#003366] p-5 text-white">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-3xl font-bold">{business.rating.toFixed(1)}</p>
              <div className="mt-1">
                <RatingStars rating={business.rating} />
              </div>
              <p className="mt-1 text-xs text-white/70">
                {business.reviewsCount} reviews · {business.category}
              </p>
            </div>
            {business.openStatus && (
              <span className="shrink-0 whitespace-nowrap rounded-full bg-[#16a34a] px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-white/40">
                Open Now
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 p-4">
          <a href={tel} className="block">
            <Button className="w-full">Contact Business</Button>
          </a>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full">
              <Navigation className="size-4" /> Get Directions
            </Button>
          </a>
          <a href={website} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full">
              <Globe className="size-4" /> Visit Website
            </Button>
          </a>
        </div>
      </div>

      {/* Details */}
      <ul className="space-y-3 rounded-xl border p-5 text-sm text-primary/80">
        <li className="flex gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" /> {address}
        </li>
        {business.email && (
          <li className="flex gap-2">
            <Mail className="mt-0.5 size-4 shrink-0 text-secondary" /> {business.email}
          </li>
        )}
        <li className="flex gap-2">
          <Phone className="mt-0.5 size-4 shrink-0 text-secondary" /> {business.phone}
        </li>
        <li className="flex gap-2">
          <Clock className="mt-0.5 size-4 shrink-0 text-secondary" />
          {business.hours?.[0]?.time ?? "Hours not listed"}
        </li>
      </ul>

      {/* Follow us */}
      {business.socials && business.socials.length > 0 && (
        <div className="rounded-xl border p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Follow us
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {business.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex size-8 items-center justify-center rounded-full border hover:border-secondary"
                >
                  <Image src={s.icon} alt="" width={16} height={16} unoptimized />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Need quick advice */}
      <div className="rounded-xl border p-5 text-sm">
        <p className="font-semibold text-primary">Need Quick Advice?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Connect instantly with {business.name}&apos;s desk assistant to secure priority
          bookings or address enquiries.
        </p>
        <div className="mt-3 space-y-2">
          <a href={tel} className="block">
            <Button variant="outline" size="sm" className="w-full">
              <Phone className="size-4" /> Call {business.phone}
            </Button>
          </a>
          {business.email && (
            <a href={`mailto:${business.email}`} className="block">
              <Button variant="outline" size="sm" className="w-full">
                <Mail className="size-4" /> Email Us
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Claim listing */}
      <div className="rounded-xl border border-dashed p-5 text-center text-sm">
        <p className="font-semibold text-primary">Is this your business?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Claim this listing to manage your profile.
        </p>
        <Link
          href="/signup"
          className="mt-2 inline-block text-xs font-semibold text-secondary hover:underline"
        >
          Claim Listing
        </Link>
      </div>
    </aside>
  );
}