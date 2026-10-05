"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { Menu, PlusCircle, LogIn, Plus } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Business", href: "#businesses" },
    { label: "Jobs", href: "/jobs" },
    { label: "Professionals", href: "/professionals" },
    { label: "Data Hub", href: "/data-hub" },
    { label: "Contact Us", href: "/contact" },
  ];

  const isActive = (href: string) => {
    // Hash links are never "active"
    if (href.startsWith("#")) return false;
    // Exact match for root, prefix match for nested routes
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/80 shadow-2xs">
      <Container>
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-18 w-full gap-4">
          {/* Left Column: Brand Logo (Left-aligned) */}
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold bg-gradient-to-b from-secondary to-gray-900 bg-clip-text text-transparent">
                Listup
              </span>
            </Link>
          </div>

          {/* Center Column: Navigation Links (Centered) */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`p-2 text-sm transition-colors ${
                    active
                      ? "text-cyan-400"
                      : "text-muted-foreground hover:text-cyan-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Column: Buttons (Right-aligned) */}
          <div className="flex items-center justify-end gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-sm text-foreground hover:text-primary hover:bg-muted px-3.5"
                >
                  Sign in/Sign up
                </Button>
              </Link>

              <Link href="#">
                <Button className="text-primary-foreground shadow-xs font-semibold px-3 transition-all hover:shadow-md">
                  <Plus className="w-4 h-4 mr-1" />
                  Add New Listing
                </Button>
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link href="/login" className="md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium border-border px-2.5 h-8"
                >
                  Log In
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </header>
  );
}

export default Header;
