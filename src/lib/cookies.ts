"use server";
import { cookies } from "next/headers";

const COOKIE_NAME = "token";

export async function setCookie(value: string, options = {}) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60, // 24 hours
    ...options,
  });
}

export async function getCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function deleteCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
