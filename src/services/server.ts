"use server";

import { getCookie, deleteCookie } from "@/lib/cookies";

/**
 * Retrieves the access token from the server-side cookies
 * @returns The access token or undefined if not found
 */
export async function getAccessToken(): Promise<string | undefined> {
  try {
    const token = await getCookie();
    return token;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return undefined;
  }
}

/**
 * Deletes the access token and clears authentication state
 */
export async function deleteAccessBearerToken(): Promise<void> {
  try {
    await deleteCookie();
  } catch (error) {
    console.error("Error deleting access token:", error);
  }
}
