"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar({
  onMobileMenuClick,
}: {
  onMobileMenuClick?: () => void;
}) {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>
      </div>
    </header>
  );
}
