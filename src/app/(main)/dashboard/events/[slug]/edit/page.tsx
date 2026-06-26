"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/events/event-form";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { useEvent } from "@/hooks/useEvents";
import { ROUTES } from "@/lib/constants";
import { useParams } from "next/navigation";

export default function EditEventPage() {
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
        <h1 className="text-3xl font-bold">Edit Event</h1>
      </div>

      {isLoading ? (
        <SkeletonLoader className="h-96" />
      ) : event ? (
        <div className="rounded-lg border border-border bg-card p-8">
          <EventForm event={event} isEdit />
        </div>
      ) : null}
    </div>
  );
}
