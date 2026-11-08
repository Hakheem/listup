"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  PlusCircle,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  Bookmark,
  Compass,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { roleHome } from "@/proxy";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ label: string; href: string }>;
  user?: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    role?: string;
  } | null;
  onLogoutConfirm?: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  user,
}: MobileMenuProps) {
  const router = useRouter();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const role = user?.role || "user";
  const hasDedicatedDashboard =
    role !== "user" && role !== "customer";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      setShowLogoutAlert(false);
      onClose();
      router.refresh();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return email ? email.slice(0, 2).toUpperCase() : "U";
  };

  return (
    <>
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Drawer */}
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-2xl flex flex-col p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2 text-2xl font-bold text-primary tracking-tight"
            >
              <span>
                List<span className="text-secondary">up</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card if Logged In */}
          {user ? (
            <div className="py-4 border-b border-border">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/60 border border-border/60">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-11 h-11 rounded-full object-cover border-2 border-secondary"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#003f88] to-[#00aeef] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {getInitials(user.name, user.email)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.name || "Community Member"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
                    {user.role || "user"}
                  </span>
                </div>
              </div>

              {/* User Dropdown/Quick Links */}
              <div className="mt-3 flex flex-col gap-1">
                {hasDedicatedDashboard ? (
                  <Link
                    href={roleHome(role)}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-secondary" />
                      Dashboard
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/businesses"
                      onClick={onClose}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-secondary" />
                        Explore Businesses
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/jobs"
                      onClick={onClose}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-secondary" />
                        Browse Jobs
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/onboarding"
                      onClick={onClose}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-secondary" />
                        Switch Role / List Business
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : null}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 py-4 border-b border-border">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
              Navigation
            </span>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-secondary hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 py-4">
            {user ? (
              <>
                <Link href="/onboarding" onClick={onClose} className="w-full">
                  <Button className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <PlusCircle className="w-4 h-4" />
                    Add New Listing
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => setShowLogoutAlert(true)}
                  className="w-full justify-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={onClose} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 border-border text-foreground hover:text-secondary hover:border-secondary"
                  >
                    <LogIn className="w-4 h-4 text-secondary" />
                    Sign in / Sign up
                  </Button>
                </Link>
                <Link href="/login" onClick={onClose} className="w-full">
                  <Button className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <PlusCircle className="w-4 h-4" />
                    Add New Listing
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Contact Info in Mobile Menu */}
          <div className="mt-auto pt-4 border-t border-border text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Nairobi, Kenya</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>+254 700 000 000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>info@listup.co.ke</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Alert Dialog */}
      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of Listup?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again to
              access your account preferences and saved listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default MobileMenu;
