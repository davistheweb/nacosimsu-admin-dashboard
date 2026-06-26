import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const MAX_LENGTH_255 = 255;
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const imageSchema = z
  .any()
  .optional()
  .refine((files) => {
    if (!files) return true;
    const file = files instanceof FileList ? files[0] : files;
    if (!file) return true;
    if (typeof File === "function") {
      return file instanceof File;
    }
    // In non-browser environments, skip instanceof checks and perform best-effort
    return typeof file === "object" && "type" in file && "size" in file;
  }, "Invalid image file")
  .refine((files) => {
    if (!files) return true;
    const file = files instanceof FileList ? files[0] : files;
    if (!file) return true;
    return ACCEPTED_IMAGE_TYPES.includes((file.type as string) ?? "");
  }, "Image must be a valid image file")
  .refine((files) => {
    if (!files) return true;
    const file = files instanceof FileList ? files[0] : files;
    if (!file) return true;
    return (file.size as number) <= IMAGE_MAX_SIZE;
  }, "Image must be smaller than 5 MB");

export const createEventSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(MAX_LENGTH_255, "Name must be 255 characters or less"),
  about: z.string().min(1, "About is required"),
  image: imageSchema,
  location: z
    .string()
    .min(1, "Location is required")
    .max(MAX_LENGTH_255, "Location must be 255 characters or less"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((value) => {
      const selected = new Date(value);
      selected.setHours(0, 0, 0, 0);
      return !Number.isNaN(selected.getTime()) && selected >= today;
    }, "Date must be today or later"),
  time: z
    .string()
    .min(1, "Time is required")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format"),
  event_type: z.enum(["virtual", "physical"] as const),
  status: z.enum(["published", "draft"] as const),
  presented_by: z
    .string()
    .min(1, "Presented By is required")
    .max(MAX_LENGTH_255, "Presented By must be 255 characters or less"),
  hosted_by: z
    .string()
    .min(1, "Hosted By is required")
    .max(MAX_LENGTH_255, "Hosted By must be 255 characters or less"),
  host_contact: z
    .string()
    .min(1, "Host Contact is required")
    .max(MAX_LENGTH_255, "Host Contact must be 255 characters or less"),
});

export const updateEventSchema = createEventSchema;

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventSchema>;
