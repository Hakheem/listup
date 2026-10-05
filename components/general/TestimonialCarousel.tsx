"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  company: string;
  image: string;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    id: 1,
    quote:
      "Listing our clinic on Listup brought us over 40+ new direct patient bookings within the very first month. The verification badge gave our customers instant trust.",
    name: "Dr. Jane Mwangi",
    role: "Lead Optometrist & Founder",
    company: "Reliquef Eye Care Clinic (Nairobi)",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    quote:
      "The easiest platform to expand your legal or corporate services across Kenya. We receive high-value commercial inquiries every single week seamlessly.",
    name: "David Ochieng",
    role: "Managing Partner",
    company: "Apex Legal Associates (Mombasa)",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    quote:
      "Our inbound tech inquiries doubled after setting up our verified profile. The county-level filtering allows local clients in Kisumu and western Kenya to find us instantly.",
    name: "Sarah Kamau",
    role: "Head of Growth",
    company: "TechHub Cloud Solutions (Kisumu)",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
];

interface TestimonialCarouselProps {
  testimonials?: TestimonialItem[];
  variant?: "auth" | "landing";
}

export function TestimonialCarousel({
  testimonials = defaultTestimonials,
  variant = "auth",
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotation every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const active = testimonials[activeIndex];

  return (
    <div className="w-full">
      {/* Testimonial Card */}
      <div
        className={cn(
          "rounded-2xl p-6 transition-all duration-300",
          variant === "auth"
            ? "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl"
            : "bg-card border border-border shadow-2xs text-foreground"
        )}
      >
        <Quote
          className={cn(
            "w-7 h-7 mb-3 opacity-80",
            variant === "auth" ? "text-secondary" : "text-primary"
          )}
        />

        <p
          className={cn(
            "text-sm sm:text-base leading-relaxed mb-6 font-normal italic transition-opacity duration-300",
            variant === "auth" ? "text-slate-100" : "text-foreground/90"
          )}
        >
          &ldquo;{active.quote}&rdquo;
        </p>

        {/* User Info with Square Rounded-md Image */}
        <div className="flex items-center gap-3.5 pt-2 border-t border-white/10">
          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0 border border-white/20 shadow-2xs">
            <Image
              src={active.image}
              alt={active.name}
              fill
              sizes="48px"
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4
              className={cn(
                "text-sm font-bold truncate",
                variant === "auth" ? "text-white" : "text-foreground"
              )}
            >
              {active.name}
            </h4>
            <p
              className={cn(
                "text-xs truncate",
                variant === "auth" ? "text-secondary font-medium" : "text-muted-foreground"
              )}
            >
              {active.role} • {active.company}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Dots Navigation Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              activeIndex === index
                ? "w-6 bg-secondary"
                : variant === "auth"
                ? "w-2 bg-white/40 hover:bg-white/70"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialCarousel;
