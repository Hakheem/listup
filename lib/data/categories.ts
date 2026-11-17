export type Category = {
  slug: string;
  name: string;
  description: string;
  count: string;
  image: string;
hidden?: boolean; 
};

export const categories: Category[] = [
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
  { slug: "healthcare", name: "Healthcare", description: "Hospitals, clinics and pharmacies", count: "14.2k", image: "", hidden: true },
];