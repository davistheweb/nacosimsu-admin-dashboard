"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layouts/sidebar";
import { Topbar } from "@/components/layouts/topbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar onMobileMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <div
          className={`hidden md:block md:w-64 lg:w-72 ${sidebarOpen ? "block" : "hidden"}`}
        >
          <Sidebar />
        </div>
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 top-14 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {sidebarOpen && (
          <div className="absolute md:hidden top-14 left-0 w-64 z-50 bg-background border-r border-border">
            <Sidebar className="border-r-0" />
          </div>
        )}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
