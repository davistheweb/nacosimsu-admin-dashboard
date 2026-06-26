"use client";

import { Users, Calendar, BarChart3, Zap } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { useEventStats } from "@/hooks/useEvents";

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useEventStats();

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load dashboard. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <SkeletonLoader count={6} className="h-24" />
          </>
        ) : stats ? (
          <>
            <StatsCard
              label="Total Events"
              value={stats.total_events}
              icon={<Calendar className="h-8 w-8" />}
              description="All events created"
            />
            <StatsCard
              label="Published Events"
              value={stats.published_events}
              icon={<Zap className="h-8 w-8" />}
              description="Currently active events"
            />
            <StatsCard
              label="Draft Events"
              value={stats.draft_events}
              icon={<BarChart3 className="h-8 w-8" />}
              description="Events still in draft"
            />
            <StatsCard
              label="Cancelled Events"
              value={stats.cancelled_events}
              icon={<Users className="h-8 w-8" />}
              description="Events that were cancelled"
            />
            <StatsCard
              label="Completed Events"
              value={stats.completed_events}
              icon={<Calendar className="h-8 w-8" />}
              description="Events that have finished"
            />
            <StatsCard
              label="Total Registrations"
              value={stats.total_registrations}
              icon={<BarChart3 className="h-8 w-8" />}
              description="Total registrations across all events"
            />
          </>
        ) : null}
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <p className="text-sm text-muted-foreground">
          Activity log will be displayed here.
        </p>
      </div>
    </div>
  );
}
