"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/services/eventService";
import type {
  Event,
  EventRegistration,
  CreateEventRequest,
  UpdateEventRequest,
  DashboardStats,
} from "@/types/events";

export function useEvents(page = 1) {
  return useQuery({
    queryKey: ["events", page],
    queryFn: () => eventService.getAll(page),
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: () => eventService.getOne(slug),
  });
}

export function useEventStats() {
  return useQuery({
    queryKey: ["eventStats"],
    queryFn: () => eventService.getStats(),
  });
}

export function useEventRegistrations(eventId: string) {
  return useQuery({
    queryKey: ["registrations", eventId],
    queryFn: () => eventService.getRegistrations(eventId),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; data: UpdateEventRequest }) =>
      eventService.update(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}
