"use client";

import Container from "@/components/layout/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Briefcase,
  Search,
  Sparkles,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type CategoryId = "Businesses" | "Customers" | "Professionals" | "Employers";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: CategoryId;
  popular?: boolean;
}

const CATEGORIES: {
  id: CategoryId;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "Businesses",
    badge: "BUSINESSES",
    title: "Build your business presence",
    description:
      "Improve how customers discover and connect with your business.",
    icon: Briefcase,
  },
  {
    id: "Customers",
    badge: "CUSTOMERS",
    title: "Find businesses and services",
    description: "Search and connect with businesses and professionals.",
    icon: User,
  },
  {
    id: "Professionals",
    badge: "PROFESSIONALS",
    title: "Build your professional presence",
    description: "Showcase your skills and discover opportunities.",
    icon: UserCheck,
  },
  {
    id: "Employers",
    badge: "EMPLOYERS",
    title: "Find talent and opportunities",
    description: "Post jobs, review applicants and connect with professionals.",
    icon: Users,
  },
];

const FAQ_DATA: FaqItem[] = [
  // Popular Questions
  {
    id: "pop-1",
    question: "How do I find a business or professional?",
    answer:
      "Use the search bar on the homepage or navigate to the Business or Professionals directory to filter by category, county, and rating.",
    category: "Customers",
    popular: true,
  },
  {
    id: "pop-2",
    question: "How do I create a professional profile?",
    answer:
      "Sign in or register an account, navigate to the Professionals section, and complete your profile with your skills, experience, and portfolio.",
    category: "Professionals",
    popular: true,
  },
  {
    id: "pop-3",
    question: "How do I post a job?",
    answer:
      "Log into your employer or business account, go to the Jobs section, and select Post a Job to fill in the role requirements and application details.",
    category: "Employers",
    popular: true,
  },
  {
    id: "pop-4",
    question: "What is the Data Hub?",
    answer:
      "The Data Hub provides verified market insights, business directory statistics, and industry trends across Kenya.",
    category: "Businesses",
    popular: true,
  },

  // Businesses Category
  {
    id: "biz-1",
    question: "How do I list my business?",
    answer:
      "Select List Your Business and provide the requested business information to create your business profile.",
    category: "Businesses",
  },
  {
    id: "biz-2",
    question: "What information can I include in my listing?",
    answer:
      "You can include your business name, description, category, county/location, contact details, operating hours, photos, and website or social links.",
    category: "Businesses",
  },
  {
    id: "biz-3",
    question: "Can I update my business information?",
    answer:
      "Yes, sign in to your dashboard at any time to edit your business details, contact info, or media.",
    category: "Businesses",
  },
  {
    id: "biz-4",
    question: "What does verification mean?",
    answer:
      "Verification confirms that your business registration and contact details have been reviewed by Listup, increasing customer trust.",
    category: "Businesses",
  },
  {
    id: "biz-5",
    question: "Can customers review my business?",
    answer:
      "Yes, registered users can leave ratings and reviews on your public listing to help other customers make informed decisions.",
    category: "Businesses",
  },

  // Customers Category
  {
    id: "cus-1",
    question: "Is searching for businesses free?",
    answer:
      "Yes, browsing and contacting listed businesses and professionals on Listup is completely free for customers.",
    category: "Customers",
  },
  {
    id: "cus-2",
    question: "How do I contact a listed business?",
    answer:
      "Open the business profile page to view their direct phone number, email address, location, or send an enquiry directly.",
    category: "Customers",
  },

  // Professionals Category
  {
    id: "pro-1",
    question: "Who can create a professional profile?",
    answer:
      "Freelancers, consultants, artisans, and skilled specialists across any industry in Kenya can create a professional profile.",
    category: "Professionals",
  },
  {
    id: "pro-2",
    question: "How can employers find my profile?",
    answer:
      "Your profile appears in the Professionals directory and search results based on your skills, category, and county.",
    category: "Professionals",
  },

  // Employers Category
  {
    id: "emp-1",
    question: "How do I manage job applications?",
    answer:
      "All applications submitted to your job listings appear in your employer dashboard where you can review profiles and shortlist candidates.",
    category: "Employers",
  },
  {
    id: "emp-2",
    question: "Can I edit or close a job listing?",
    answer:
      "Yes, you can update job details, pause applications, or close a listing anytime from your dashboard.",
    category: "Employers",
  },
];

const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId>("Businesses");

  const popularQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter(
      (item) =>
        item.popular &&
        (!q ||
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  const categoryQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter(
      (item) =>
        !item.popular &&
        item.category === selectedCategory &&
        (!q ||
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)),
    );
  }, [selectedCategory, searchQuery]);

  return (
    <div>
      {/* Hero Search Section */}
      <div className="bg-primary/5 to-transparent py-16 text-center">
        <Container>
          <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <h4 className="text-2xl font-semibold text-foreground">
              What can we help you with?
            </h4>

            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Listup help..."
                className="w-full h-auto rounded-xl border-input bg-white pl-11 pr-4 py-3.5 text-sm shadow-sm focus-visible:border-primary text-secondary"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Category Cards Section */}
      <Container className="py-16 space-y-16">
        <div className="space-y-8">
          <div className="flex flex-col items-center text-center gap-2">
            <h5 className="text-lg font-semibold text-foreground">
              What do you need help with?
            </h5>
            <p className="text-muted-foreground">
              Choose the option that best describes what you&apos;re trying to
              do.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-start text-left p-6 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                    isSelected
                      ? "bg-secondary/10 border-secondary shadow-sm"
                      : "bg-card border-border hover:border-secondary/50"
                  }`}
                >
                  <div className="bg-primary/10 p-2.5 rounded-lg mb-4">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <p className="uppercase text-xs font-semibold text-primary mb-2">
                    {category.badge}
                  </p>
                  <h6 className="mb-2 font-medium text-foreground">
                    {category.title}
                  </h6>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Questions */}
        {popularQuestions.length > 0 && (
          <div className="space-y-6">
            <h5 className="text-lg font-semibold text-foreground">
              Popular questions
            </h5>

            <Accordion
              multiple
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 items-start"
            >
              {popularQuestions.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-border py-1 transition-colors"
                >
                  <AccordionTrigger className="py-4 text-left font-medium hover:no-underline [&[data-state=open]]:text-primary transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Frequently Asked Questions by Category */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h5 className="text-lg font-semibold text-foreground">
              Frequently asked questions
            </h5>

            <div className="flex items-center gap-3 border border-border rounded-lg px-3 py-2 bg-card">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                FAQ category:
              </span>
              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  setSelectedCategory(value as CategoryId)
                }
              >
                <SelectTrigger className="w-[150px] border-0 bg-transparent px-2 py-1.5 text-sm font-medium shadow-none focus:ring-0">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="p-1.5">
                  <SelectItem value="businesses" className="px-3 py-2 my-0.5">
                    Businesses
                  </SelectItem>
                  <SelectItem value="customers" className="px-3 py-2 my-0.5">
                    Customers
                  </SelectItem>
                  <SelectItem
                    value="professionals"
                    className="px-3 py-2 my-0.5"
                  >
                    Professionals
                  </SelectItem>
                  <SelectItem value="employers" className="px-3 py-2 my-0.5">
                    Employers
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {categoryQuestions.length > 0 ? (
            <Accordion
              key={selectedCategory}
              multiple
              defaultValue={["biz-1"]}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 items-start"
            >
              {categoryQuestions.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-border py-1 transition-colors"
                >
                  <AccordionTrigger className="py-4 text-left font-medium hover:no-underline [&[data-state=open]]:text-primary transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground py-4">
              No matching questions found in this category.
            </p>
          )}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-emerald-500/10">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 text-white p-3 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h6 className="font-semibold">Can&apos;t find what you need?</h6>
              <p className="text-sm text-muted-foreground">
                Send us an enquiry and we&apos;ll help point you in the right
                direction.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 shrink-0 transition-all hover:gap-2.5"
          >
            <span>Contact Us</span>
            <ArrowRight className="size-4 transition-transform" />
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default FaqPage;
