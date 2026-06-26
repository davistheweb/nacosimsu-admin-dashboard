"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createEventSchema, type CreateEventFormData } from "@/lib/validators";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
import { ROUTES } from "@/lib/constants";
import type { Event } from "@/types/events";

interface EventFormProps {
  event?: Event;
  isEdit?: boolean;
}

export function EventForm({ event, isEdit }: EventFormProps) {
  const router = useRouter();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const isSaving = createMutation.isLoading || updateMutation.isLoading;

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    event?.image_url ?? null,
  );

  const normalizeTime = (value?: string) =>
    value ? String(value).slice(0, 5) : "";

  const normalizeDate = (value?: string) =>
    value ? String(value).slice(0, 10) : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: event
      ? {
          name: event.name,
          about: event.about,
          location: event.location,
          date: normalizeDate(event.date),
          time: normalizeTime(event.time),
          event_type: event.event_type,
          status: event.status,
          presented_by: event.presented_by,
          hosted_by: event.hosted_by,
          host_contact: event.host_contact,
          image: undefined,
        }
      : {
          name: "",
          about: "",
          location: "",
          date: "",
          time: "",
          event_type: "virtual",
          status: "draft",
          presented_by: "",
          hosted_by: "",
          host_contact: "",
          image: undefined,
        },
  });

  useEffect(() => {
    if (event?.image_url) {
      setPreviewUrl(event.image_url);
    } else {
      setPreviewUrl(null);
    }
  }, [event?.image_url]);

  useEffect(() => {
    if (!event) {
      return;
    }

    reset({
      name: event.name,
      about: event.about,
      location: event.location,
      date: normalizeDate(event.date),
      time: normalizeTime(event.time),
      event_type: event.event_type,
      presented_by: event.presented_by,
      hosted_by: event.hosted_by,
      host_contact: event.host_contact,
      image: undefined,
    });
  }, [event, reset]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const imageRegister = register("image");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setPreviewUrl(event?.image_url ?? null);
      return;
    }

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return url;
    });
  };

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      const normalized = {
        ...data,
        time: data.time ? String(data.time).slice(0, 5) : data.time,
      };

      if (isEdit && event) {
        await updateMutation.mutateAsync({
          id: `${event.id}`,
          data: normalized,
        });
        toast.success("Event updated successfully");
      } else {
        await createMutation.mutateAsync(normalized);
        toast.success("Event created successfully");
        reset();
        setPreviewUrl(null);
      }

      router.push(ROUTES.EVENTS);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to save event. Please try again.";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Event Name
        </label>
        <Input
          id="name"
          placeholder="Enter event name"
          disabled={isSaving}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="about" className="text-sm font-medium">
          About
        </label>
        <textarea
          id="about"
          placeholder="Enter event description"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          rows={5}
          disabled={isSaving}
          {...register("about")}
        />
        {errors.about && (
          <p className="text-sm text-destructive">{errors.about.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="image" className="text-sm font-medium">
          Image Upload
        </label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          disabled={isSaving}
          {...imageRegister}
          onChange={(event) => {
            imageRegister.onChange(event);
            handleImageChange(event);
          }}
        />
        {errors.image && (
          <p className="text-sm text-destructive">
            {(errors.image as any)?.message}
          </p>
        )}
        {previewUrl ? (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Image preview</p>
            <img
              src={previewUrl}
              alt="Event preview"
              className="mt-2 h-40 w-full max-w-sm overflow-hidden rounded-md object-cover ring-1 ring-border"
            />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            placeholder="Enter event location"
            disabled={isSaving}
            {...register("location")}
          />
          {errors.location && (
            <p className="text-sm text-destructive">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="event_type" className="text-sm font-medium">
            Event Type
          </label>
          <select
            id="event_type"
            disabled={isSaving}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("event_type")}
          >
            <option value="virtual">Virtual</option>
            <option value="physical">Physical</option>
          </select>
          {errors.event_type && (
            <p className="text-sm text-destructive">
              {errors.event_type.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <Input
            id="date"
            type="date"
            disabled={isSaving}
            {...register("date")}
          />
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="time" className="text-sm font-medium">
            Time
          </label>
          <Input
            id="time"
            type="time"
            disabled={isSaving}
            {...register("time")}
          />
          {errors.time && (
            <p className="text-sm text-destructive">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="presented_by" className="text-sm font-medium">
            Presented By
          </label>
          <Input
            id="presented_by"
            placeholder="Enter presenter"
            disabled={isSaving}
            {...register("presented_by")}
          />
          {errors.presented_by && (
            <p className="text-sm text-destructive">
              {errors.presented_by.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="hosted_by" className="text-sm font-medium">
            Hosted By
          </label>
          <Input
            id="hosted_by"
            placeholder="Enter host"
            disabled={isSaving}
            {...register("hosted_by")}
          />
          {errors.hosted_by && (
            <p className="text-sm text-destructive">
              {errors.hosted_by.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="status" className="text-sm font-medium">
            Event Status
          </label>
          <select
            id="status"
            disabled={isSaving}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("status")}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="host_contact" className="text-sm font-medium">
            Host Contact
          </label>
          <Input
            id="host_contact"
            placeholder="Enter host contact"
            disabled={isSaving}
            {...register("host_contact")}
          />
          {errors.host_contact && (
            <p className="text-sm text-destructive">
              {errors.host_contact.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
