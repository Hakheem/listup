"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "./Container";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import {
  Menu,
  Plus,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Compass,
  Bookmark,
  Building,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { roleHome } from "@/proxy";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Better-auth session hook
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Business", href: "/businesses" },
    { label: "Jobs", href: "/jobs" },
    { label: "Professionals", href: "/professionals" },
    { label: "Data Hub", href: "/data-hub" },
    { label: "Contact Us", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      setShowLogoutAlert(false);
      router.refresh();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      setIsLoggingOut(false);
    }
  };

  const userRole = (user as unknown as { role?: string })?.role || "user";
  const hasDedicatedDashboard =
    userRole !== "user" && userRole !== "customer";

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/80 shadow-2xs">
        <Container>
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-18 w-full gap-4">
            {/* Left Column: Brand Logo */}
            <div className="flex items-center justify-start">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-2xl font-bold bg-gradient-to-b from-secondary to-gray-900 bg-clip-text text-transparent">
                  Listup
                </span>
              </Link>
            </div>

            {/* Center Column: Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`p-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-secondary"
                        : "text-muted-foreground hover:text-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Column: User Auth state / Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              {/* Desktop View */}
              <div className="hidden md:flex items-center gap-3">
                {isPending ? (
                  <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
                ) : user ? (
                  /* Logged-in profile trigger & dropdown */
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border/80 bg-background hover:bg-muted/60 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-secondary/40 cursor-pointer"
                        />
                      }
                    >
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name || "User avatar"}
                          className="w-7 h-7 rounded-full object-cover border border-secondary"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#003f88] to-[#00aeef] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                          {getInitials(user.name, user.email)}
                        </div>
                      )}
                      <span className="text-xs font-semibold text-foreground max-w-[120px] truncate">
                        {user.name || user.email.split("@")[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 p-1.5">
                      <div className="px-3 py-2">
                        <p className="text-xs font-bold text-foreground truncate">
                          {user.name || "Community Member"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
                          {userRole}
                        </span>
                      </div>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        {hasDedicatedDashboard ? (
                          <DropdownMenuItem
                            onClick={() => router.push(roleHome(userRole))}
                            className="cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-secondary mr-2" />
                            <span>Dashboard</span>
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => router.push("/businesses")}
                              className="cursor-pointer"
                            >
                              <Compass className="w-4 h-4 text-secondary mr-2" />
                              <span>Explore Directory</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push("/jobs")}
                              className="cursor-pointer"
                            >
                              <Bookmark className="w-4 h-4 text-secondary mr-2" />
                              <span>Browse Jobs</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push("/onboarding")}
                              className="cursor-pointer"
                            >
                              <Building className="w-4 h-4 text-secondary mr-2" />
                              <span>Switch Role / List Business</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setShowLogoutAlert(true)}
                        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Log Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  /* Logged-out Sign in / Sign up button */
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="text-sm text-foreground hover:text-primary hover:bg-muted px-3.5"
                    >
                      Sign in/Sign up
                    </Button>
                  </Link>
                )}

                {/* Add New Listing button */}
                <Link href={user ? "/onboarding" : "/login"}>
                  <Button className="text-primary-foreground font-semibold px-3 transition-all">
                    <Plus className="w-4 h-4 mr-1" />
                    Add New Listing
                  </Button>
                </Link>
              </div>

              {/* Mobile Controls */}
              <div className="flex items-center gap-2 lg:hidden">
                {user ? (
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="flex items-center gap-1.5 p-1 rounded-full border border-border bg-background"
                  >
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#003f88] to-[#00aeef] text-white text-xs font-bold flex items-center justify-center">
                        {getInitials(user.name, user.email)}
                      </div>
                    )}
                  </button>
                ) : (
                  <Link href="/login" className="md:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-medium border-border px-2.5 h-8"
                    >
                      Log In
                    </Button>
                  </Link>
                )}

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
          user={
            user
              ? {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  image: user.image,
                  role: userRole,
                }
              : null
          }
        />
      </header>

      {/* Logout Confirmation Alert Dialog (Desktop) */}
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

export default Header;
