import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import Image from "next/image";
import { Building2, MapPin, Search, Sparkles, Plus, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Category = {
  slug: string;
  name: string;
  description: string;
  count: string;
  image: string;
};

const categories: Category[] = [
  {
    slug: "shopping",
    name: "Shopping",
    description: "Retail shops, ecommerce & product outlets",
    count: "8.6k",
    image: "/images/categories/shopping.png",
  },
  {
    slug: "marketing",
    name: "Marketing",
    description: "Advertising agencies, branding & growth professionals",
    count: "6.1k",
    image: "/images/categories/marketing.png",
  },
  {
    slug: "travel",
    name: "Travel",
    description: "Tours, hotels and safaris",
    count: "540",
    image: "/images/categories/travel.png",
  },
  {
    slug: "transport",
    name: "Transport",
    description: "Logistics and cabs",
    count: "720",
    image: "/images/categories/transport.png",
  },
  {
    slug: "education",
    name: "Education",
    description: "Schools, colleges and universities",
    count: "1.2k",
    image: "/images/categories/education.png",
  },
  {
    slug: "automotive",
    name: "Automotive",
    description: "Car dealers, garages and auto parts",
    count: "430",
    image: "/images/categories/automotive.png",
  },
  {
    slug: "construction",
    name: "Construction",
    description: "Building companies and contractors",
    count: "1.8k",
    image: "/images/categories/construction.png",
  },
  {
    slug: "home-services",
    name: "Home Services",
    description: "Plumbers, electricians and cleaners",
    count: "2.3k",
    image: "/images/categories/home-services.png",
  },
  {
    slug: "sports-fitness",
    name: "Sports & Fitness",
    description: "Gyms, trainers and sports clubs",
    count: "1.5k",
    image: "/images/categories/sports-fitness.png",
  },
  {
    slug: "consulting",
    name: "Consulting",
    description: "Business and management consultants",
    count: "1.1k",
    image: "/images/categories/consulting.png",
  },
  {
    slug: "business-services",
    name: "Business Services",
    description: "Accounting, legal and IT services",
    count: "2.0k",
    image: "/images/categories/business-services.png",
  },
  {
    slug: "legal",
    name: "Legal",
    description: "Law firms and legal advisors",
    count: "900",
    image: "/images/categories/legal.png",
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    description: "Factories and production companies",
    count: "1.4k",
    image: "/images/categories/manufacturing.png",
  },
  {
    slug: "wholesale",
    name: "Wholesale",
    description: "B2B suppliers and distributors",
    count: "1.7k",
    image: "/images/categories/wholesale.png",
  },
  {
    slug: "agriculture",
    name: "Agriculture",
    description: "Farms and agricultural services",
    count: "1.1k",
    image: "/images/categories/agriculture.png",
  },
  {
    slug: "energy",
    name: "Energy",
    description: "Power generation and utilities",
    count: "1.6k",
    image: "/images/categories/energy.png",
  },
  {
    slug: "entertainment",
    name: "Entertainment",
    description: "Movies, music and gaming",
    count: "1.3k",
    image: "/images/categories/entertainment.png",
  },
  {
    slug: "service-providers",
    name: "Service Providers",
    description: "Software, hardware and IT services",
    count: "2.1k",
    image: "/images/categories/service-providers.png",
  },
  {
    slug: "public-figures",
    name: "Public Figures",
    description: "Celebrities, influencers and public personalities",
    count: "1.0k",
    image: "/images/categories/public-figures.png",
  },
  {
    slug: "miscellaneous",
    name: "Miscellaneous",
    description: "Other businesses and services",
    count: "1.9k",
    image: "/images/categories/miscellaneous.png",
  },
];

function CategoryGrid({ items }: { items: Category[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((cat) => (
        <Link key={cat.slug} href={`/businesses/${cat.slug}`}>
          <div className="relative h-[170px] overflow-hidden rounded-xl">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="mt-3 font-semibold">{cat.name}</h3>
          <p className="text-sm text-muted-foreground">{cat.description}</p>
          <p className="text-xs text-secondary">{cat.count} businesses</p>
        </Link>
      ))}
    </div>
  );
}

function OwnBusinessStrip() {
  return (
    <div className="my-10 flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100">
          <Sparkles className="size-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold">Own a business in this category?</p>
          <p className="text-xs text-muted-foreground">
            Get listed and reach customers searching for your services.
          </p>
        </div>
      </div>
      <Link href="/signup">
        <Button size="sm">List Your Business</Button>
      </Link>
    </div>
  );
}

const bannerCards = [
  {
    src: "/images/banner/banner-1.png",
    name: "A&B Consultant Agency",
    style:
      "left-0 top-0 z-30 w-[190px] sm:w-[173px]",
  },
  {
    src: "/images/banner/banner-2.png",
    name: "B Consultant Agency",
    style:
      "left-[135px] top-5 z-20 w-[160px] sm:left-[165px] sm:w-[153px]",
  },
  {
    src: "/images/banner/banner-3.png",
    name: "Consultant Agency",
    style:
      "left-[245px] top-10 z-10 w-[140px] sm:left-[310px] sm:w-[165px]",
  },
];

function ListedTodayBanner() {
  return (
    <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-accent to-sky-50 p-6 sm:p-10">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Free listing available
          </span>
          <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">
            Own a Business in Kenya? <br />
            <span className="text-secondary">Get it Listed Today</span>
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Join thousands of businesses reaching new customers across all 47 counties.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup">
              <Button className="bg-primary/90 text-primary-foreground font-semibold shadow-xs">
                <Plus className="w-4 h-4 mr-1" />{"List Your Business - It's Free"}</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline">Learn More<ArrowRight className="w-4 h-4" /></Button>
              
              
            </Link>
          </div>
        </div>

       <div>
 <div className="min-w-0">
  {/* Business cards */}
  <div className="relative mx-auto h-[260px] w-full max-w-[500px]">
    {bannerCards.map((card) => (
      <div
        key={card.src}
        className={`absolute overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 ${card.style}`}
      >
        <div className="relative h-[135px]">
          <Image
            src={card.src}
            alt={card.name}
            fill
            sizes="(max-width: 640px) 65vw, 225px"
            className="object-cover"
          />
        </div>

        <p className="truncate p-2 text-xs font-semibold">
          {card.name}
        </p>

        <div className="space-y-1 px-2 pb-3">
          <div className="h-1.5 rounded-full bg-gray-200" />
          <div className="h-1.5 w-4/5 rounded-full bg-gray-200" />
          <div className="h-1.5 w-3/5 rounded-full bg-gray-200" />
        </div>
      </div>
    ))}
  </div>

  <p className="mt-1 text-center text-sm font-medium text-primary sm:text-base">
    Listed Business Get Visibility
  </p>
</div>
    </div>
  </div>
  </div>
  );
}
  

const BusinessesPage = () => {
  return (
    <section className="py-16">
      <Container>
        
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Find Business <span className="text-secondary">by Category</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Explore every industry in Kenya, from restaurants and hospitals to tech firms and law offices.
          </p>
        </div>

        
        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-xl border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-secondary/40 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="size-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses, services or keywords..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-1 items-center gap-2 border-t px-3 sm:border-l sm:border-t-0">
            <MapPin className="size-4 text-muted-foreground" />
            <Input
              placeholder="Location (optional)"
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button>Search Now</Button>
        </div>

        
        <div className="mt-12">
          <CategoryGrid items={categories.slice(0, 8)} />
          <OwnBusinessStrip />
          <CategoryGrid items={categories.slice(8)} />
<ListedTodayBanner />
        </div>
      </Container>
    </section>
  );
};

export default BusinessesPage;
