"use client";

import React from "react";
import Link from "next/link";
import { X, PlusCircle, LogIn, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ label: string; href: string }>;
}

export function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-2xl flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 text-2xl font-bold text-primary tracking-tight"
          >
            <span>List<span className="text-secondary">up</span></span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 py-6 border-b border-border">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 py-6">
          <Link href="/login" onClick={onClose} className="w-full">
            <Button
              variant="outline"
              className="w-full justify-center gap-2 border-border text-foreground hover:text-primary hover:border-primary"
            >
              <LogIn className="w-4 h-4 text-primary" />
              Log In / Sign Up
            </Button>
          </Link>
          <Link href="/signup" onClick={onClose} className="w-full">
            <Button className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="w-4 h-4" />
              + Add New Listing
            </Button>
          </Link>
        </div>

        {/* Contact Info in Mobile Menu */}
        <div className="mt-auto pt-6 border-t border-border text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-secondary" />
            <span>Nairobi, Kenya</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-secondary" />
            <span>+254 700 000 000</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-secondary" />
            <span>info@listup.co.ke</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
