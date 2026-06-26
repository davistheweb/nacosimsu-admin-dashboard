"use client";

import { Calendar, Edit2, MapPin, Trash2, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { useEvents, useDeleteEvent } from "@/hooks/useEvents";
import { ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import type { Event } from "@/types/events";

export function EventList() {
  const [page, setPage] = useState(1);
  const { data: eventsPage, isLoading, error } = useEvents(page);
  const deleteEvent = useDeleteEvent();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteEvent, setPendingDeleteEvent] = useState<Event | null>(
    null,
  );
  const events = eventsPage?.data ?? [];

  const handleDelete = (event: Event) => {
    setPendingDeleteEvent(event);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteEvent) return;

    setDeletingId(`${pendingDeleteEvent.id}`);

    try {
      await deleteEvent.mutateAsync(`${pendingDeleteEvent.id}`);
      toast.success("Event deleted successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete event";
      toast.error(message);
    } finally {
      setDeletingId(null);
      setPendingDeleteEvent(null);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteEvent(null);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load events. Please refresh the page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <SkeletonLoader count={3} className="h-16 mb-4" />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-12 w-12" />}
        title="No events yet"
        description="Create your first event to get started"
        action={{
          label: "Create Event",
          onClick: () => (window.location.href = ROUTES.CREATE_EVENT),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event: Event) => {
        const isDeletingCurrent = deletingId === `${event.id}`;
        return (
          <div
            key={event.id}
            className="rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{event.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.about}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.registrations_count} registrations
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={ROUTES.EVENT_DETAIL(event.id)}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Link href={ROUTES.EDIT_EVENT(event.id)}>
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(event)}
                  disabled={Boolean(deletingId)}
                  aria-busy={isDeletingCurrent}
                >
                  {isDeletingCurrent ? (
                    "Deleting..."
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Page {eventsPage?.current_page ?? page} of{" "}
          {eventsPage?.last_page ?? page}
          {eventsPage?.total !== undefined &&
            ` • ${eventsPage.total} total events`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!eventsPage?.prev_page_url}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!eventsPage?.next_page_url}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {pendingDeleteEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Delete event</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong>{pendingDeleteEvent.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
              >
                {deletingId === `${pendingDeleteEvent.id}`
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
