import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, MapPin, Stethoscope } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessContactCard } from "@/components/general/BusinessContactCard";
import { BusinessListingCard } from "@/components/general/BusinessListingCard";
import { RatingStars } from "@/components/general/RatingStars";
import { businesses } from "@/lib/data/businesses";
import { BusinessMap } from "@/components/general/BusinessMap";

const tabStyle = "data-active:text-secondary data-active:font-semibold after:bg-secondary hover:text-secondary";
const sectionTitle = "border-l-4 border-secondary pl-3 text-base font-semibold text-primary";
const card = "rounded-xl border p-6";

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const business = businesses.find(
    (b) => b.categorySlug === category && b.slug === slug,
  );
  if (!business) notFound();

  const address = business.address ?? business.location;
  const about = business.about ?? [business.description];
  const hours = business.hours ?? [];
  const services = business.services ?? [];
  const reviews = business.reviews ?? [];
  const gallery = business.gallery ?? [];
  const similar = businesses
    .filter((b) => b.categorySlug === category && b.slug !== slug)
    .slice(0, 4);

  return (
    <section>
      {/* Banner */}
      <div className="relative h-56 w-full overflow-hidden bg-muted sm:h-72">
        {business.banner && (
          <Image
            src={business.banner}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      {/* Header */}
<Container>
  <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-start">
    <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border-4 border-background bg-emerald-900 shadow">
      {business.logo ? (
        <Image src={business.logo} alt={`${business.name} logo`} fill sizes="96px" className="object-cover" />
      ) : (
        <span className="flex h-full items-center justify-center text-3xl font-bold text-white">
          {business.initials}
        </span>
      )}
    </div>

    <div className="min-w-0 flex-1 sm:pt-14">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-primary">{business.name}</h1>
        {business.verified && (
          <Badge variant="secondary" className="gap-1">
            <BadgeCheck className="size-3.5" /> Verified
          </Badge>
        )}
      </div>
      <p className="mt-1 max-w-2xl text-sm text-primary/80">
        {business.tagline ?? business.description}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <RatingStars rating={business.rating} className="size-3.5" />
          <b className="text-foreground">{business.rating.toFixed(1)}</b>
          ({business.reviewsCount} reviews)
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" /> {business.location}
        </span>
        {business.openStatus && (
          <span className="flex items-center gap-1 font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {business.openStatus}
          </span>
        )}
      </div>
    </div>

    <div className="flex gap-2 sm:pt-14">
      <Button variant="outline" size="sm">Directions</Button>
      <Button variant="outline" size="sm">WhatsApp</Button>
      <Button size="sm">Website</Button>
    </div>
  </div>
</Container>

      {/* Body */}
      <Container>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Column 1: tabs and map in ONE wrapper */}
          <div className="min-w-0">
            <Tabs defaultValue="about">
              <TabsList variant="line">
                <TabsTrigger value="about" className={tabStyle}>
                  About
                </TabsTrigger>
                <TabsTrigger value="services" className={tabStyle}>
                  Services
                </TabsTrigger>
                <TabsTrigger value="reviews" className={tabStyle}>
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="gallery" className={tabStyle}>
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6 space-y-6">
                <div className={card}>
                  <h2 className={sectionTitle}>About {business.name}</h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                    {about.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                <div className={card}>
                  <h2 className={sectionTitle}>Opening Hours</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {hours.map((h) => (
                      <li
                        key={h.day}
                        className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background">
                          <CalendarDays className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {h.day}
                          </p>
                          <p
                            className={`text-sm ${h.closed ? "text-destructive" : "text-primary"}`}
                          >
                            {h.time}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <BusinessMap name={business.name} address={address} />
              </TabsContent>

              <TabsContent value="services" className="mt-6 space-y-6">
                <div className={card}>
                  <h2 className={sectionTitle}>Services Offered</h2>
                  <p className="mt-1 pl-4 text-xs text-muted-foreground">
                    {services.length} services available
                  </p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {services.map((s) => (
                      <li
                        key={s.title}
                        className="flex gap-3 rounded-lg border p-3"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                          <Stethoscope className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary">
                            {s.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {s.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <BusinessMap name={business.name} address={address} />
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                <div className={card}>
                  <h2 className={sectionTitle}>Customer Reviews</h2>
                  <div className="mt-5 grid gap-6 sm:grid-cols-[160px_1fr] sm:items-center">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-primary">
                        {business.rating.toFixed(1)}
                      </p>
                      <div className="mt-2 flex justify-center">
                        <RatingStars rating={business.rating} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {business.reviewsCount} reviews
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {(business.ratingBreakdown ?? []).map((pct, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs">
                          <span className="w-8 text-muted-foreground">
                            {5 - i} ★
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-amber-400"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-muted-foreground">
                            {pct}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Share your experience
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Help others by reviewing {business.name}.
                    </p>
                  </div>
                  <Button size="sm">Write a Review</Button>
                </div>

                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r.id} className="rounded-xl border p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                            {r.author.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-primary">
                              {r.author}
                            </p>
                            <RatingStars
                              rating={r.rating}
                              className="size-3.5"
                            />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {r.date}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-primary/80">
                        {r.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <div className={card}>
                  <h2 className={sectionTitle}>Photo Gallery</h2>
                  {gallery.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      No photos added yet.
                    </p>
                  ) : (
                    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {gallery.map((src, i) => (
                        <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={src}
                            alt={`${business.name} photo ${i + 1}`}
                            fill
                            sizes="(min-width: 640px) 33vw, 50vw"
                            className="object-cover"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <BusinessContactCard business={business} />
        </div>

        {/* Similar businesses */}
        {similar.length > 0 && (
          <div className="mt-12 pb-16">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                Similar Businesses
              </h2>
              <Link
                href={`/businesses/${category}`}
                className="text-sm text-secondary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((b) => (
                <BusinessListingCard
                  key={b.id}
                  business={b}
                  href={`/businesses/${category}/${b.slug}`}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
