import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const socialLinks: { label: string; href: string; icon: IconType }[] = [
  { label: "Twitter", href: "https://twitter.com", icon: FaXTwitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
];

const aboutLinks: { label: string; href: string }[] = [
  { label: "About Us", href: "#about" },
  { label: "Careers", href: "#careers" },
  { label: "Contact Us", href: "#contact" },
  { label: "Blog & News", href: "#blog" },
  { label: "FAQs", href: "#faq" },
];

const quickLinks: { label: string; href: string }[] = [
  { label: "Categories", href: "#categories" },
  { label: "47 Counties", href: "#counties" },
  { label: "List Your Business", href: "/signup" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
];

const contactDetails = [
  {
    icon: MapPin,
    value: "Nairobi, Kenya (HQ) ",
    href: null,
  },
  {
    icon: Phone,
    value: "+254 700 000 000",
    href: "tel:+254700000000",
  },
  {
    icon: Mail,
    value: "info@listup.co.ke",
    href: "mailto:info@listup.co.ke",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#002855] text-slate-200 pt-16 pb-8 border-t border-[#003f88]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                List<span className="text-[#00aeef]">up</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00aeef]" />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              The leading digital business directory for Kenyan enterprises.
              Connecting verified service providers, local shops, and corporate
              leaders with customers across all 47 counties.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#00aeef] hover:text-white flex items-center justify-center text-slate-300 transition-all border border-white/10"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: About Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
              About
            </h4>
            <ul className="space-y-2.5 text-sm">
              {aboutLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
              Contact Details
            </h4>
            <ul className="space-y-3 text-sm">
              {contactDetails.map(({ icon: Icon, value, href }) => (
                <li
                  key={value}
                  className="flex items-center gap-2.5 text-slate-300"
                >
                  <Icon className="w-4 h-4 text-[#00aeef] shrink-0" />
                  {href ? (
                    <a
                      href={href}
                      className="hover:text-white transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00aeef] hover:underline"
                >
                  Join our verified directory{" "}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Listup. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="font-semibold text-white">
              System Craft Studio
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
