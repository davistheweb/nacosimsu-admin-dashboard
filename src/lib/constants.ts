export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const AUTH_ENDPOINTS = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_OTP: "/verify-otp",
  RESET_PASSWORD: "/reset-password",
  LOGOUT: "/logout",
};

export const EVENT_ENDPOINTS = {
  GET_ALL: "/admin/events",
  GET_ONE: "/admin/events/:slug",
  CREATE: "/admin/events",
  UPDATE: "/admin/events/:id",
  DELETE: "/admin/events/:id",
  GET_REGISTRATIONS: "/admin/events/:id/registrations",
  GET_STATS: "/dashboard/stats",
};

export const ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/account-recovery",
  ACCOUNT_RECOVERY: "/account-recovery",
  VERIFY_OTP: "/verify-otp",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  STAFFS: "/staffs",
  EVENTS: "/dashboard/events",
  CREATE_EVENT: "/dashboard/events/create",
  EVENT_DETAIL: (id: string | number) => `/dashboard/events/${id}`,
  EDIT_EVENT: (id: string | number) => `/dashboard/events/${id}/edit`,
  EVENT_REGISTRATIONS: (id: string | number) =>
    `/dashboard/events/${id}/registrations`,
};
