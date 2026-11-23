import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-foreground">
      <header className="border-b bg-white px-6 py-4 font-semibold text-lg shadow-xs">
        Admin Portal
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
