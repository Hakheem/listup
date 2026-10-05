import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { StatsCounter } from "@/components/general/StatsCounter";
import { CategoryBar } from "@/components/general/CategoryBar";
import { HowItWorksSteps } from "@/components/general/HowItWorksStep";
import { BusinessCard, BusinessItem } from "@/components/general/BusinessCard";
import { CountyCard, CountyItem } from "@/components/general/CountyCard";
import {
  OwnBusinessBanner,
  DatabaseBanner,
} from "@/components/general/CtaBanners";
import { PricingSection } from "@/components/general/PricingSection";
import { ArrowRight, Sparkles, MapPin, Building } from "lucide-react";

// Featured Businesses Data
const featuredBusinesses: BusinessItem[] = [
  {
    id: "1",
    initials: "CS",
    name: "Reliquef Eye Care Clinic",
    category: "Eyewear, Optician, Health & Care",
    rating: 4.9,
    reviewsCount: 47,
    description:
      "Reliquef Eye Care is a full service optometrist clinic offering eye exams, prescription lenses, computerized testing, and personalized vision care.",
    location: "Nairobi, Kenya",
    phone: "+254 712 345 678",
    verified: true,
  },
  {
    id: "2",
    initials: "LA",
    name: "Apex Legal Associates",
    category: "Corporate Law, Tax & Commercial Litigation",
    rating: 4.8,
    reviewsCount: 89,
    description:
      "Premier legal consultancy providing strategic corporate and commercial advisory, compliance, real estate conveyancing, and dispute resolution across East Africa.",
    location: "Mombasa, Kenya",
    phone: "+254 722 987 654",
    verified: true,
  },
  {
    id: "3",
    initials: "TH",
    name: "TechHub Cloud Solutions",
    category: "Cloud Hosting, IT Support & DevOps",
    rating: 5.0,
    reviewsCount: 112,
    description:
      "Enterprise IT infrastructure, cyber security services, cloud migration and managed hosting solutions helping modern Kenyan companies operate seamlessly.",
    location: "Kisumu, Kenya",
    phone: "+254 733 456 789",
    verified: true,
  },
];

// Kenyan Counties Data
const counties: CountyItem[] = [
  { number: 1, name: "Nairobi", count: "28.4k" },
  { number: 2, name: "Mombasa", count: "16.2k" },
  { number: 3, name: "Kisumu", count: "12.8k" },
  { number: 4, name: "Nakuru", count: "11.5k" },
  { number: 5, name: "Kiambu", count: "9.2k" },
  { number: 6, name: "Uasin Gishu", count: "8.1k" },
  { number: 7, name: "Machakos", count: "6.4k" },
  { number: 8, name: "Kilifi", count: "5.3k" },
  { number: 9, name: "Nyeri", count: "4.8k" },
  { number: 10, name: "Meru", count: "4.1k" },
  { number: 11, name: "Kajiado", count: "3.9k" },
  { number: 12, name: "Kakamega", count: "3.7k" },
  { number: 13, name: "Kisii", count: "3.2k" },
  { number: 14, name: "Kericho", count: "2.9k" },
  { number: 15, name: "Garissa", count: "2.1k" },
  { number: 16, name: "Embu", count: "1.8k" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-slate-900 text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-luminosity scale-105 transform transition-transform duration-1000"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&auto=format&fit=crop&q=80")',
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/40 via-slate-900/50 to-slate-950/65" />

        <Container className="relative z-10 py-16 w-full flex flex-col justify-between space-y-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-semibold leading-[1.15] text-gray-100">
              Turn Your Presence <br />
              <span className="text-secondary">Into Opportunity</span> <br />
              with Us.
            </h1>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl font-normal drop-shadow-xs">
              Showcase what yo do, get discoveredby the right people and turn
              your visibility intoeaningful connections, clients and growth.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  className=" text-white  h-12 px-6 text-sm font-semibold backdrop-blur-xs"
                >
                  Learn More
                </Button>
              </Link>
              <Link href="/signup">
                <Button className=" text-white h-12 px-6 text-sm font-semibold shadow-md">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Business Categories Cards Spanning Full Width */}
          <div className="w-full pt-4">
            <CategoryBar />
          </div>
        </Container>
      </section>

      {/* 2. STATS COUNTER BAR */}
      <StatsCounter />

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-background">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-4 border-b border-border/60">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>Simple 4-Step Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                How it works
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
                Find out how our platform can help automate your workflow and
                make it easy for you to scale your business.
              </p>
            </div>

            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs">
                List your Business Now
              </Button>
            </Link>
          </div>

          <HowItWorksSteps />
        </Container>
      </section>

      {/* 4. FEATURED BUSINESS SECTION */}
      <section
        id="businesses"
        className="py-20 bg-muted/60 border-t border-border/80"
      >
        <Container>
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold mb-2">
                <Building className="w-3.5 h-3.5 text-secondary" />
                <span>Top Rated</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Featured Business
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                Get Listed. Expand your visibility, attract new customers, and
                grow your business. Build a strong online reputation through
                reviews.
              </p>
            </div>

            <Link
              href="#businesses"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary transition-colors shrink-0"
            >
              <span>See All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </Container>
      </section>

      {/* 5. FIND BUSINESS BY LOCATION (COUNTIES) */}
      <section
        id="counties"
        className="py-20 bg-background border-t border-border/80"
      >
        <Container>
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold mb-2">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span>Regional Coverage</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Find Business by Location
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Quickly access business listings in any of the 47 counties.
              </p>
            </div>

            <Link
              href="#counties"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary transition-colors shrink-0"
            >
              <span>See All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {counties.map((county) => (
              <CountyCard key={county.number} county={county} />
            ))}
          </div>
        </Container>
      </section>

      {/* 6. PROMO CTA BANNER 1 */}
      <section className="py-12 bg-background">
        <Container>
          <OwnBusinessBanner />
        </Container>
      </section>

      {/* 7. PRICING SECTION */}
      <PricingSection />

      {/* 8. PROMO CTA BANNER 2 */}
      <section className="py-16 bg-muted/40 border-t border-border/80">
        <Container>
          <DatabaseBanner />
        </Container>
      </section>
    </div>
  );
}
