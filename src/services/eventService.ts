import { API } from "./api";
import { EVENT_ENDPOINTS } from "@/lib/constants";
import type {
  Event,
  EventRegistration,
  CreateEventRequest,
  UpdateEventRequest,
  DashboardStats,
  PaginatedResponse,
} from "@/types/events";

const buildEventFormData = (
  data: CreateEventRequest | UpdateEventRequest,
): FormData => {
  const formData = new FormData();

  if (data.name !== undefined) formData.append("name", data.name);
  if (data.about !== undefined) formData.append("about", data.about);
  if (data.location !== undefined) formData.append("location", data.location);
  if (data.date !== undefined) formData.append("date", data.date);
  if (data.time !== undefined) formData.append("time", data.time);
  if (data.event_type !== undefined)
    formData.append("event_type", data.event_type);
  if (data.status !== undefined) formData.append("status", data.status);
  if (data.presented_by !== undefined)
    formData.append("presented_by", data.presented_by);
  if (data.hosted_by !== undefined)
    formData.append("hosted_by", data.hosted_by);
  if (data.host_contact !== undefined)
    formData.append("host_contact", data.host_contact);

  if (data.image) {
    const candidate =
      data.image instanceof FileList ? data.image[0] : data.image;
    const isBlobLike = typeof Blob !== "undefined" && candidate instanceof Blob;
    const hasFileShape =
      candidate && typeof candidate === "object" && "size" in candidate;
    const file = isBlobLike || hasFileShape ? (candidate as any) : null;

    if (file) {
      const filename = (file as any).name ?? "image";
      formData.append("image", file, filename);
    }
  }

  return formData;
};

export const eventService = {
  getAll: async (page = 1): Promise<PaginatedResponse<Event>> => {
    const response = await API.get(EVENT_ENDPOINTS.GET_ALL, {
      params: { page },
    });
    return response.data;
  },

  getOne: async (slug: string): Promise<Event> => {
    const response = await API.get(
      EVENT_ENDPOINTS.GET_ONE.replace(":slug", slug),
    );
    return response.data;
  },

  create: async (data: CreateEventRequest): Promise<Event> => {
    const response = await API.post(
      EVENT_ENDPOINTS.CREATE,
      buildEventFormData(data),
      {
        headers: {
          "Content-Type": undefined,
        },
      },
    );
    return response.data;
  },

  update: async (id: string, data: UpdateEventRequest): Promise<Event> => {
    const response = await API.put(
      EVENT_ENDPOINTS.UPDATE.replace(":id", id),
      buildEventFormData(data),
      {
        headers: {
          "Content-Type": undefined,
        },
      },
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await API.delete(EVENT_ENDPOINTS.DELETE.replace(":id", id));
  },

  getRegistrations: async (eventId: string): Promise<EventRegistration[]> => {
    const response = await API.get(
      EVENT_ENDPOINTS.GET_REGISTRATIONS.replace(":id", eventId),
    );
    return response.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await API.get(EVENT_ENDPOINTS.GET_STATS);
    return response.data;
  },
};
