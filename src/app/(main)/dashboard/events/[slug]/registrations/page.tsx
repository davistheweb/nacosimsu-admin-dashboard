"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { EmptyState } from "@/components/common/empty-state";
import { useEvent, useEventRegistrations } from "@/hooks/useEvents";
import { ROUTES } from "@/lib/constants";
import { useParams } from "next/navigation";

export default function RegistrationsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: event, isLoading: eventLoading } = useEvent(slug);
  const {
    data: registrations,
    isLoading: registrationsLoading,
    error,
  } = useEventRegistrations(event ? `${event.id}` : "");

  const isLoading = eventLoading || registrationsLoading;

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load registrations. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.EVENT_DETAIL(slug)}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Event Registrations</h1>
          {event && <p className="text-muted-foreground">{event.name}</p>}
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader count={3} className="h-12 mb-4" />
      ) : !registrations || registrations.length === 0 ? (
        <EmptyState
          title="No registrations yet"
          description="Registrations for this event will appear here"
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="px-6 py-3 text-sm">
                      {registration.full_name}
                    </td>
                    <td className="px-6 py-3 text-sm">{registration.email}</td>
                    <td className="px-6 py-3 text-sm">{registration.phone}</td>
                    <td className="px-6 py-3 text-sm">
                      {registration.department}
                    </td>
                    <td className="px-6 py-3 text-sm">{registration.level}</td>
                    <td className="px-6 py-3 text-sm">
                      {new Date(registration.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
