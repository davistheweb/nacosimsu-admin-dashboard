"use client";

import {
  Calendar,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Users2,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { deleteAccessBearerToken } from "@/services/server";
import { toast } from "sonner";
import Cookies from "js-cookie";

const navigationItems = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Events",
    href: ROUTES.EVENTS,
    icon: Calendar,
  },
  {
    label: "Staffs",
    href: ROUTES.STAFFS,
    icon: Users2,
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Admin User");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("nacosimsu.user_name");
    if (stored) {
      setUserName(stored);
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      authService
        .logout()
        .then(() => {
          deleteAccessBearerToken().then(() => {
            Cookies.remove("cached_bearer_token", { path: "/" });
            window.location.reload();
          });
        })
        .catch((error) => {
          toast.error("Error during logout:", error);
        });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-background",
        className,
      )}
    >
      <div className="px-4 py-4">
        <div className="rounded-2xl border border-border bg-muted p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div>
              {/* <p className="text-sm font-medium">Signed in as</p> */}
              <p className="text-sm font-semibold">{userName}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </aside>
  );
}
