import type { BusinessItem } from "@/components/general/BusinessCard";

export type Hours = { day: string; time: string; closed?: boolean };
export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type Business = BusinessItem & {
  categorySlug: string;
  slug: string;
  tag?: string;
  tagline?: string;
  about?: string[];
  hours?: Hours[];
  logo?: string;
  banner?: string;
  openStatus?: string;
  address?: string;
  email?: string;
  services?: { title: string; description: string }[];
  ratingBreakdown?: number[];
  reviews?: Review[];
  gallery?: string[];
  socials?: { label: string; href: string; icon: string }[];
};

const weekHours: Hours[] = [
  { day: "Monday", time: "8:00 AM – 6:00 PM" },
  { day: "Tuesday", time: "8:00 AM – 6:00 PM" },
  { day: "Wednesday", time: "8:00 AM – 6:00 PM" },
  { day: "Thursday", time: "8:00 AM – 6:00 PM" },
  { day: "Friday", time: "8:00 AM – 6:00 PM" },
  { day: "Saturday", time: "9:00 AM – 2:00 PM" },
  { day: "Sunday", time: "Closed", closed: true },
];

export const businesses: Business[] = [
  {
    id: "h1",
    slug: "hope-ent-clinic",
    categorySlug: "healthcare",
    tag: "Hygiene Services",
    tagline: "Nairobi's leading ear, nose and throat specialist centre",
    about: [
      "Hope ENT Clinic is Nairobi's leading specialist ear, nose and throat centre, combining advanced diagnostics with compassionate patient care. Founded in 2011 by Dr. Amina Wanjiku, the clinic brings together a team of board-certified ENT surgeons and audiologists dedicated to restoring quality of life through precise, evidence-based treatment.",
      "We offer comprehensive care across the full spectrum of ENT conditions — from routine ear wax removal and hearing assessments to complex sinus surgeries and paediatric ENT procedures. Our state-of-the-art consultation suites feature the latest endoscopic and audiometric equipment, ensuring accurate diagnosis and effective treatment outcomes.",
      "Whether you are seeking relief from chronic sinusitis, assessing a hearing concern, or managing a voice disorder, Hope ENT Clinic delivers specialist-grade care in a welcoming, modern environment.",
    ],
    hours: weekHours,
    initials: "C",
    logo: "/images/businesses/hope-ent-logo.png",
    banner: "/images/businesses/hope-ent-banner.png",
    openStatus: "Open Now · Closes 6:00 PM",
    name: "Hope ENT Clinic",
    category: "ENT Specialists",
    rating: 4.8,
    reviewsCount: 89,
    description:
      "Nairobi's leading specialist ear, nose and throat centre, combining advanced diagnostics with compassionate patient care.",
    location: "Lavington, Nairobi",
    phone: "+254 700 000 000",
    website: "www.website.com",
    verified: true,
    address: "Valley Arcade, Gitanga Road, Lavington, Nairobi",
    email: "info@hopeent.co.ke",
    services: [
      {
        title: "ENT Consultations",
        description:
          "Initial and follow-up specialist consultations for all ENT concerns.",
      },
      {
        title: "Ear Wax Microsuction",
        description: "Safe, gentle ear wax removal using microsuction.",
      },
      {
        title: "Hearing Assessment & Audiometry",
        description: "Full audiometric testing and hearing loss evaluation.",
      },
      {
        title: "Voice Disorder Treatment",
        description: "Assessment and therapy for voice and speech disorders.",
      },
      {
        title: "Tonsillectomy & Adenoidectomy",
        description:
          "Surgical removal of tonsils and adenoids for recurrent infections.",
      },
      {
        title: "Sleep Apnoea Assessment",
        description:
          "Diagnosis and treatment planning for sleep-related breathing problems.",
      },
      {
        title: "Septoplasty",
        description: "Correction of deviated nasal septum to improve airflow.",
      },
      {
        title: "Paediatric ENT",
        description: "Specialist ear, nose and throat care for children.",
      },
      {
        title: "Nasal Polyp Removal",
        description:
          "Endoscopic removal of nasal polyps obstructing breathing.",
      },
      {
        title: "Allergy Testing & Treatment",
        description:
          "Identification and management of nasal and sinus allergies.",
      },
    ],
    ratingBreakdown: [78, 15, 4, 2, 1],
    reviews: [
      {
        id: "r1",
        author: "Grace Mwangi",
        rating: 5,
        date: "March 2026",
        text: "Excellent care from start to finish. The doctors explained everything clearly.",
      },
      {
        id: "r2",
        author: "Peter Otieno",
        rating: 5,
        date: "February 2026",
        text: "Professional team and a very modern clinic. Highly recommended.",
      },
      {
        id: "r3",
        author: "Amina Yusuf",
        rating: 4,
        date: "January 2026",
        text: "Great service, though the waiting time was a little long.",
      },
    ],
    gallery: [
      "/images/businesses/hope-ent/hospital-view.png",
      "/images/businesses/hope-ent/xray.png",
      "/images/businesses/hope-ent/iv-bag.png",
      "/images/businesses/hope-ent/hospital-machines.png",
      "/images/businesses/hope-ent/hospital-room.png",
      "/images/businesses/hope-ent/hospital-reception.png",
      "/images/businesses/hope-ent/hospital-seat.png",
      "/images/businesses/hope-ent/patient.png",
      "/images/businesses/hope-ent/surgery.png",
      "/images/businesses/hope-ent/physiotheraphy.png",
      "/images/businesses/hope-ent/report.png",
      "/images/businesses/hope-ent/dummy.png",
    ],
    socials: [
      {
        label: "LinkedIn",
        href: "https://linkedin.com",
        icon: "/images/social/linkedin.png",
      },
      { label: "X", href: "https://x.com", icon: "/images/social/x.png" },
      {
        label: "Facebook",
        href: "https://facebook.com",
        icon: "/images/social/facebook.png",
      },
      {
        label: "Instagram",
        href: "https://instagram.com",
        icon: "/images/social/instagram.png",
      },
      {
        label: "WhatsApp",
        href: "https://wa.me/254700000000",
        icon: "/images/social/whatsapp.png",
      },
      {
        label: "Discord",
        href: "https://discord.com",
        icon: "/images/social/discord.png",
      },
    ],
  },
  {
    id: "h2",
    slug: "onsight-eye-care-centre",
    categorySlug: "healthcare",
    tag: "Hygiene Services",
    tagline: "Precision Eye Care | Exceptional Vision",
    about: [
      "OnSight Eye Care Centre is a full-service optometry clinic offering eye exams, prescription lenses and personalised vision care.",
    ],
    hours: weekHours,
    initials: "OE",
    logo: "/images/businesses/hope-ent-logo.png",
    banner: "/images/businesses/hope-ent-banner.png",
    openStatus: "Open Now · Closes 6:00 PM",
    name: "OnSight Eye Care Centre",
    category: "Eye Care",
    rating: 4.9,
    reviewsCount: 10,
    description:
      "Leading supplier of personal protective equipment, helmets, vests, boots, gloves and safety workwear.",
    location: "Kahawa, Nairobi",
    phone: "+254 700 000 000",
    website: "www.website.com",
    verified: true,
    address: "Valley Arcade, Gitanga Road, Lavington, Nairobi",
    email: "info@hopeent.co.ke",
    services: [
      {
        title: "ENT Consultations",
        description:
          "Initial and follow-up specialist consultations for all ENT concerns.",
      },
      {
        title: "Ear Wax Microsuction",
        description: "Safe, gentle ear wax removal using microsuction.",
      },
      {
        title: "Hearing Assessment & Audiometry",
        description: "Full audiometric testing and hearing loss evaluation.",
      },
      {
        title: "Voice Disorder Treatment",
        description: "Assessment and therapy for voice and speech disorders.",
      },
      {
        title: "Tonsillectomy & Adenoidectomy",
        description:
          "Surgical removal of tonsils and adenoids for recurrent infections.",
      },
      {
        title: "Sleep Apnoea Assessment",
        description:
          "Diagnosis and treatment planning for sleep-related breathing problems.",
      },
      {
        title: "Septoplasty",
        description: "Correction of deviated nasal septum to improve airflow.",
      },
      {
        title: "Paediatric ENT",
        description: "Specialist ear, nose and throat care for children.",
      },
      {
        title: "Nasal Polyp Removal",
        description:
          "Endoscopic removal of nasal polyps obstructing breathing.",
      },
      {
        title: "Allergy Testing & Treatment",
        description:
          "Identification and management of nasal and sinus allergies.",
      },
    ],
  },
  {
    id: "h3",
    slug: "onsight-eye-care-centre",
    categorySlug: "healthcare",
    tag: "Hygiene Services",
    tagline: "Precision Eye Care | Exceptional Vision",
    about: [
      "Hope ENT Clinic is Nairobi's leading specialist ear, nose and throat centre, combining advanced diagnostics with compassionate patient care. Founded in 2011 by Dr. Amina Wanjiku, the clinic brings together a team of board-certified ENT surgeons and audiologists dedicated to restoring quality of life through precise, evidence-based treatment.",
    ],
    hours: weekHours,
    initials: "OE",
    logo: "/images/businesses/hope-ent-logo.png",
    banner: "/images/businesses/hope-ent-banner.png",
    openStatus: "Open Now · Closes 6:00 PM",
    name: "OnSight Eye Care Centre",
    category: "Eye Care",
    rating: 4.9,
    reviewsCount: 10,
    description:
      "Leading supplier of personal protective equipment, helmets, vests, boots, gloves and safety workwear.",
    location: "Kahawa, Nairobi",
    phone: "+254 700 000 000",
    website: "www.website.com",
    verified: true,
    address: "Valley Arcade, Gitanga Road, Lavington, Nairobi",
    email: "info@hopeent.co.ke",
    services: [
      {
        title: "ENT Consultations",
        description:
          "Initial and follow-up specialist consultations for all ENT concerns.",
      },
      {
        title: "Ear Wax Microsuction",
        description: "Safe, gentle ear wax removal using microsuction.",
      },
      {
        title: "Hearing Assessment & Audiometry",
        description: "Full audiometric testing and hearing loss evaluation.",
      },
      {
        title: "Voice Disorder Treatment",
        description: "Assessment and therapy for voice and speech disorders.",
      },
      {
        title: "Tonsillectomy & Adenoidectomy",
        description:
          "Surgical removal of tonsils and adenoids for recurrent infections.",
      },
      {
        title: "Sleep Apnoea Assessment",
        description:
          "Diagnosis and treatment planning for sleep-related breathing problems.",
      },
      {
        title: "Septoplasty",
        description: "Correction of deviated nasal septum to improve airflow.",
      },
      {
        title: "Paediatric ENT",
        description: "Specialist ear, nose and throat care for children.",
      },
      {
        title: "Nasal Polyp Removal",
        description:
          "Endoscopic removal of nasal polyps obstructing breathing.",
      },
      {
        title: "Allergy Testing & Treatment",
        description:
          "Identification and management of nasal and sinus allergies.",
      },
    ],
  },
  {
    id: "h4",
    slug: "onsight-eye-care-centre",
    categorySlug: "healthcare",
    tag: "Hygiene Services",
    tagline: "Precision Eye Care | Exceptional Vision",
    about: [
      "OnSight Eye Care Centre is a full-service optometry clinic offering eye exams, prescription lenses and personalised vision care.",
    ],
    hours: weekHours,
    initials: "OE",
    logo: "/images/businesses/hope-ent-logo.png",
    banner: "/images/businesses/hope-ent-banner.png",
    openStatus: "Open Now · Closes 6:00 PM",
    name: "OnSight Eye Care Centre",
    category: "Eye Care",
    rating: 4.9,
    reviewsCount: 10,
    description:
      "Leading supplier of personal protective equipment, helmets, vests, boots, gloves and safety workwear.",
    location: "Kahawa, Nairobi",
    phone: "+254 700 000 000",
    website: "www.website.com",
    verified: true,
    address: "Valley Arcade, Gitanga Road, Lavington, Nairobi",
    email: "info@hopeent.co.ke",
    services: [
      {
        title: "ENT Consultations",
        description:
          "Initial and follow-up specialist consultations for all ENT concerns.",
      },
      {
        title: "Ear Wax Microsuction",
        description: "Safe, gentle ear wax removal using microsuction.",
      },
      {
        title: "Hearing Assessment & Audiometry",
        description: "Full audiometric testing and hearing loss evaluation.",
      },
      {
        title: "Voice Disorder Treatment",
        description: "Assessment and therapy for voice and speech disorders.",
      },
      {
        title: "Tonsillectomy & Adenoidectomy",
        description:
          "Surgical removal of tonsils and adenoids for recurrent infections.",
      },
      {
        title: "Sleep Apnoea Assessment",
        description:
          "Diagnosis and treatment planning for sleep-related breathing problems.",
      },
      {
        title: "Septoplasty",
        description: "Correction of deviated nasal septum to improve airflow.",
      },
      {
        title: "Paediatric ENT",
        description: "Specialist ear, nose and throat care for children.",
      },
      {
        title: "Nasal Polyp Removal",
        description:
          "Endoscopic removal of nasal polyps obstructing breathing.",
      },
      {
        title: "Allergy Testing & Treatment",
        description:
          "Identification and management of nasal and sinus allergies.",
      },
    ],
  },
  {
    id: "h5",
    slug: "onsight-eye-care-centre",
    categorySlug: "healthcare",
    tag: "Hygiene Services",
    tagline: "Precision Eye Care | Exceptional Vision",
    about: [
      "OnSight Eye Care Centre is a full-service optometry clinic offering eye exams, prescription lenses and personalised vision care.",
    ],
    hours: weekHours,
    initials: "OE",
    logo: "/images/businesses/hope-ent-logo.png",
    banner: "/images/businesses/hope-ent-banner.png",
    openStatus: "Open Now · Closes 6:00 PM",
    name: "OnSight Eye Care Centre",
    category: "Eye Care",
    rating: 4.9,
    reviewsCount: 10,
    description:
      "Leading supplier of personal protective equipment, helmets, vests, boots, gloves and safety workwear.",
    location: "Kahawa, Nairobi",
    phone: "+254 700 000 000",
    website: "www.website.com",
    verified: true,
    address: "Valley Arcade, Gitanga Road, Lavington, Nairobi",
    email: "info@hopeent.co.ke",
    services: [
      {
        title: "ENT Consultations",
        description:
          "Initial and follow-up specialist consultations for all ENT concerns.",
      },
      {
        title: "Ear Wax Microsuction",
        description: "Safe, gentle ear wax removal using microsuction.",
      },
      {
        title: "Hearing Assessment & Audiometry",
        description: "Full audiometric testing and hearing loss evaluation.",
      },
      {
        title: "Voice Disorder Treatment",
        description: "Assessment and therapy for voice and speech disorders.",
      },
      {
        title: "Tonsillectomy & Adenoidectomy",
        description:
          "Surgical removal of tonsils and adenoids for recurrent infections.",
      },
      {
        title: "Sleep Apnoea Assessment",
        description:
          "Diagnosis and treatment planning for sleep-related breathing problems.",
      },
      {
        title: "Septoplasty",
        description: "Correction of deviated nasal septum to improve airflow.",
      },
      {
        title: "Paediatric ENT",
        description: "Specialist ear, nose and throat care for children.",
      },
      {
        title: "Nasal Polyp Removal",
        description:
          "Endoscopic removal of nasal polyps obstructing breathing.",
      },
      {
        title: "Allergy Testing & Treatment",
        description:
          "Identification and management of nasal and sinus allergies.",
      },
    ],
  },
  {
    id: "h6",
    slug: "onsight-eye-care-centre",
    categorySlug: "healthcare",
    tag: "Hygiene Services",
    tagline: "Precision Eye Care | Exceptional Vision",
    about: [
      "OnSight Eye Care Centre is a full-service optometry clinic offering eye exams, prescription lenses and personalised vision care.",
    ],
    hours: weekHours,
    initials: "OE",
    logo: "/images/businesses/hope-ent-logo.png",
    banner: "/images/businesses/hope-ent-banner.png",
    openStatus: "Open Now · Closes 6:00 PM",
    name: "OnSight Eye Care Centre",
    category: "Eye Care",
    rating: 4.9,
    reviewsCount: 10,
    description:
      "Leading supplier of personal protective equipment, helmets, vests, boots, gloves and safety workwear.",
    location: "Kahawa, Nairobi",
    phone: "+254 700 000 000",
    website: "www.website.com",
    verified: true,
    address: "Valley Arcade, Gitanga Road, Lavington, Nairobi",
    email: "info@hopeent.co.ke",
    services: [
      {
        title: "ENT Consultations",
        description:
          "Initial and follow-up specialist consultations for all ENT concerns.",
      },
      {
        title: "Ear Wax Microsuction",
        description: "Safe, gentle ear wax removal using microsuction.",
      },
      {
        title: "Hearing Assessment & Audiometry",
        description: "Full audiometric testing and hearing loss evaluation.",
      },
      {
        title: "Voice Disorder Treatment",
        description: "Assessment and therapy for voice and speech disorders.",
      },
      {
        title: "Tonsillectomy & Adenoidectomy",
        description:
          "Surgical removal of tonsils and adenoids for recurrent infections.",
      },
      {
        title: "Sleep Apnoea Assessment",
        description:
          "Diagnosis and treatment planning for sleep-related breathing problems.",
      },
      {
        title: "Septoplasty",
        description: "Correction of deviated nasal septum to improve airflow.",
      },
      {
        title: "Paediatric ENT",
        description: "Specialist ear, nose and throat care for children.",
      },
      {
        title: "Nasal Polyp Removal",
        description:
          "Endoscopic removal of nasal polyps obstructing breathing.",
      },
      {
        title: "Allergy Testing & Treatment",
        description:
          "Identification and management of nasal and sinus allergies.",
      },
    ],
  },
  {
    id: "h7",
    slug: "onsight-eye-care-centre",
    categorySlug: "healthcare",
    tag: "Hygiene Services",
    tagline: "Precision Eye Care | Exceptional Vision",
    about: [
      "OnSight Eye Care Centre is a full-service optometry clinic offering eye exams, prescription lenses and personalised vision care.",
    ],
    hours: weekHours,
    initials: "OE",
    logo: "/images/businesses/hope-ent-logo.png",
    banner: "/images/businesses/hope-ent-banner.png",
    openStatus: "Open Now · Closes 6:00 PM",
    name: "OnSight Eye Care Centre",
    category: "Eye Care",
    rating: 4.9,
    reviewsCount: 10,
    description:
      "Leading supplier of personal protective equipment, helmets, vests, boots, gloves and safety workwear.",
    location: "Kahawa, Nairobi",
    phone: "+254 700 000 000",
    website: "www.website.com",
    verified: true,
    address: "Valley Arcade, Gitanga Road, Lavington, Nairobi",
    email: "info@hopeent.co.ke",
    services: [
      {
        title: "ENT Consultations",
        description:
          "Initial and follow-up specialist consultations for all ENT concerns.",
      },
      {
        title: "Ear Wax Microsuction",
        description: "Safe, gentle ear wax removal using microsuction.",
      },
      {
        title: "Hearing Assessment & Audiometry",
        description: "Full audiometric testing and hearing loss evaluation.",
      },
      {
        title: "Voice Disorder Treatment",
        description: "Assessment and therapy for voice and speech disorders.",
      },
      {
        title: "Tonsillectomy & Adenoidectomy",
        description:
          "Surgical removal of tonsils and adenoids for recurrent infections.",
      },
      {
        title: "Sleep Apnoea Assessment",
        description:
          "Diagnosis and treatment planning for sleep-related breathing problems.",
      },
      {
        title: "Septoplasty",
        description: "Correction of deviated nasal septum to improve airflow.",
      },
      {
        title: "Paediatric ENT",
        description: "Specialist ear, nose and throat care for children.",
      },
      {
        title: "Nasal Polyp Removal",
        description:
          "Endoscopic removal of nasal polyps obstructing breathing.",
      },
      {
        title: "Allergy Testing & Treatment",
        description:
          "Identification and management of nasal and sinus allergies.",
      },
    ],
  },
  {
    id: "h8",
    slug: "onsight-eye-care-centre",
    categorySlug: "healthcare",
    tag: "Hygiene Services",
    tagline: "Precision Eye Care | Exceptional Vision",
    about: [
      "OnSight Eye Care Centre is a full-service optometry clinic offering eye exams, prescription lenses and personalised vision care.",
    ],
    hours: weekHours,
    initials: "OE",
    logo: "/images/businesses/hope-ent-logo.png",
    banner: "/images/businesses/hope-ent-banner.png",
    openStatus: "Open Now · Closes 6:00 PM",
    name: "OnSight Eye Care Centre",
    category: "Eye Care",
    rating: 4.9,
    reviewsCount: 10,
    description:
      "Leading supplier of personal protective equipment, helmets, vests, boots, gloves and safety workwear.",
    location: "Kahawa, Nairobi",
    phone: "+254 700 000 000",
    website: "www.website.com",
    verified: true,
    address: "Valley Arcade, Gitanga Road, Lavington, Nairobi",
    email: "info@hopeent.co.ke",
    services: [
      {
        title: "ENT Consultations",
        description:
          "Initial and follow-up specialist consultations for all ENT concerns.",
      },
      {
        title: "Ear Wax Microsuction",
        description: "Safe, gentle ear wax removal using microsuction.",
      },
      {
        title: "Hearing Assessment & Audiometry",
        description: "Full audiometric testing and hearing loss evaluation.",
      },
      {
        title: "Voice Disorder Treatment",
        description: "Assessment and therapy for voice and speech disorders.",
      },
      {
        title: "Tonsillectomy & Adenoidectomy",
        description:
          "Surgical removal of tonsils and adenoids for recurrent infections.",
      },
      {
        title: "Sleep Apnoea Assessment",
        description:
          "Diagnosis and treatment planning for sleep-related breathing problems.",
      },
      {
        title: "Septoplasty",
        description: "Correction of deviated nasal septum to improve airflow.",
      },
      {
        title: "Paediatric ENT",
        description: "Specialist ear, nose and throat care for children.",
      },
      {
        title: "Nasal Polyp Removal",
        description:
          "Endoscopic removal of nasal polyps obstructing breathing.",
      },
      {
        title: "Allergy Testing & Treatment",
        description:
          "Identification and management of nasal and sinus allergies.",
      },
    ],
  },
  {
    id: "h9",
    slug: "onsight-eye-care-centre",
    categorySlug: "healthcare",
    tag: "Hygiene Services",
    tagline: "Precision Eye Care | Exceptional Vision",
    about: [
      "OnSight Eye Care Centre is a full-service optometry clinic offering eye exams, prescription lenses and personalised vision care.",
    ],
    hours: weekHours,
    initials: "OE",
    logo: "/images/businesses/hope-ent-logo.png",
    banner: "/images/businesses/hope-ent-banner.png",
    openStatus: "Open Now · Closes 6:00 PM",
    name: "OnSight Eye Care Centre",
    category: "Eye Care",
    rating: 4.9,
    reviewsCount: 10,
    description:
      "Leading supplier of personal protective equipment, helmets, vests, boots, gloves and safety workwear.",
    location: "Kahawa, Nairobi",
    phone: "+254 700 000 000",
    website: "www.website.com",
    verified: true,
    address: "Valley Arcade, Gitanga Road, Lavington, Nairobi",
    email: "info@hopeent.co.ke",
    services: [
      {
        title: "ENT Consultations",
        description:
          "Initial and follow-up specialist consultations for all ENT concerns.",
      },
      {
        title: "Ear Wax Microsuction",
        description: "Safe, gentle ear wax removal using microsuction.",
      },
      {
        title: "Hearing Assessment & Audiometry",
        description: "Full audiometric testing and hearing loss evaluation.",
      },
      {
        title: "Voice Disorder Treatment",
        description: "Assessment and therapy for voice and speech disorders.",
      },
      {
        title: "Tonsillectomy & Adenoidectomy",
        description:
          "Surgical removal of tonsils and adenoids for recurrent infections.",
      },
      {
        title: "Sleep Apnoea Assessment",
        description:
          "Diagnosis and treatment planning for sleep-related breathing problems.",
      },
      {
        title: "Septoplasty",
        description: "Correction of deviated nasal septum to improve airflow.",
      },
      {
        title: "Paediatric ENT",
        description: "Specialist ear, nose and throat care for children.",
      },
      {
        title: "Nasal Polyp Removal",
        description:
          "Endoscopic removal of nasal polyps obstructing breathing.",
      },
      {
        title: "Allergy Testing & Treatment",
        description:
          "Identification and management of nasal and sinus allergies.",
      },
    ],
  },
];
