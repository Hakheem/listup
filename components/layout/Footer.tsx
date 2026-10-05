import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Globe,
  Share2
} from "lucide-react";
import { FaXTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa6";

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
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#00aeef] hover:text-white flex items-center justify-center text-slate-300 transition-all border border-white/10"
                aria-label="Twitter"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#00aeef] hover:text-white flex items-center justify-center text-slate-300 transition-all border border-white/10"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#00aeef] hover:text-white flex items-center justify-center text-slate-300 transition-all border border-white/10"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#00aeef] hover:text-white flex items-center justify-center text-slate-300 transition-all border border-white/10"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: About Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
              About
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#about" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#careers" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Blog & News
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#categories" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="#counties" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  47 Counties
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-slate-300 hover:text-white hover:underline transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
              Contact Details
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#00aeef] shrink-0 mt-0.5" />
                <span>Nairobi, Kenya (HQ) & Nationwide</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-[#00aeef] shrink-0" />
                <a href="tel:+254700000000" className="hover:text-white transition-colors">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-[#00aeef] shrink-0" />
                <a href="mailto:info@listup.co.ke" className="hover:text-white transition-colors">
                  info@listup.co.ke
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00aeef] hover:underline"
                >
                  Join our verified directory <ArrowRight className="w-3.5 h-3.5" />
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
            <span className="font-semibold text-white">Mentor Space</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
