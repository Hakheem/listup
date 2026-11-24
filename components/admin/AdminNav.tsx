"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminNavProps {
  user: {
    name?: string | null;
    email: string;
    role: string;
    image?: string | null;
  };
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await signOut();
      router.push("/login");
    } catch (err) {
      console.error("Sign out failed:", err);
      setIsSigningOut(false);
    }
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden border-b bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            L
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight">Listup</span>
            <Badge variant="secondary" className="ml-2 text-[10px] py-0 px-1.5 font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
              Admin
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b px-4 py-4 space-y-4 shadow-md">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <Compass className="size-4" />
                <span>View Public Site</span>
              </div>
              <ExternalLink className="size-3.5 text-slate-400" />
            </Link>
          </nav>

          <div className="pt-3 border-t flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold truncate text-slate-900">
                {user.name || "Administrator"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="text-xs h-8 text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              <LogOut className="size-3.5 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
              L
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Listup
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Platform Management</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Control Center
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-emerald-50 text-emerald-800 font-semibold shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon className={`size-4 shrink-0 ${item.active ? "text-emerald-700" : "text-slate-500"}`} />
              {item.label}
            </Link>
          ))}

          <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Compass className="size-4 text-slate-500" />
              <span>Explore Site</span>
            </div>
            <ExternalLink className="size-3.5 text-slate-400" />
          </Link>
          <Link
            href="/businesses"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-slate-500" />
              <span>Directory</span>
            </div>
            <ExternalLink className="size-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Admin User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center text-xs shadow-2xs">
              {(user.name?.[0] || user.email[0] || "A").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user.name || "Administrator"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="w-full text-xs h-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-slate-200"
          >
            <LogOut className="size-3.5 mr-1.5" />
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </aside>
    </>
  );
}
