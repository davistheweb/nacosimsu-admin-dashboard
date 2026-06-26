"use client";

import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { useEvent } from "@/hooks/useEvents";
import { ROUTES } from "@/lib/constants";
import { useParams } from "next/navigation";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: event, isLoading, error } = useEvent(slug);

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load event. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.EVENTS}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <SkeletonLoader className="h-96" />
      ) : event ? (
        <div className="space-y-8">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.name}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-8">
              <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">
                {event.about}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Registrations
                    </p>
                    <p className="font-semibold">{event.registrations_count}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="rounded-lg border border-border bg-muted/10 p-4">
                  <p className="text-sm text-muted-foreground">Event Type</p>
                  <p className="font-semibold">{event.event_type}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/10 p-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold">{event.status}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/10 p-4">
                  <p className="text-sm text-muted-foreground">Presented by</p>
                  <p className="font-semibold">{event.presented_by}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/10 p-4">
                  <p className="text-sm text-muted-foreground">Hosted by</p>
                  <p className="font-semibold">{event.hosted_by}</p>
                </div>
              </div>

              <div className="mb-6 text-sm text-muted-foreground">
                <p>Host contact: {event.host_contact}</p>
                <p>Created at: {new Date(event.created_at).toLocaleString()}</p>
              </div>

              <Link href={ROUTES.EVENT_REGISTRATIONS(event.id)}>
                <Button>View Registrations</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
