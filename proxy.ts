import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/customers",
  "/bookings",
  "/packages",
  "/ratings",
  "/settings",
  "/staffs",
];
const authRoutes = [
  "/login",
  "/account-recovery",
  "/auth",
  "/auth/login",
  "/auth/account-recovery",
];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/bookings/:path*",
    "/packages/:path*",
    "/ratings/:path*",
    "/settings/:path*",
    "/staffs/:path*",
    "/login",
    "/account-recovery",
    "/auth/:path*",
  ],
};
