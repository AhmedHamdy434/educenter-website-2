import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

// Helper function to decode JWT payload safely in Next.js Edge Runtime
function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Allow static assets, images, and metadata files without redirection
  if (
    pathname.startsWith("/images") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Helper: check if pathname is a public allowed route
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/change-password" ||
    pathname.startsWith("/p/");

  // 1. If user is NOT logged in
  if (!token) {
    if (!isPublicRoute) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Decode JWT and check expiration & role
  const payload = decodeJwt(token);
  const isExpired = !!payload?.exp && payload.exp * 1000 < Date.now();
  const role = payload?.role; // OWNER | TEACHER | STUDENT
  const isValidRole = role === "OWNER" || role === "TEACHER" || role === "STUDENT";

  // If token is invalid, expired, or has no valid role, clear token
  if (!payload || isExpired || !role || !isValidRole) {
    // If accessing protected routes, redirect to login with token cleared
    if (!isPublicRoute) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    // If accessing public pages, proceed as guest and strip stale token
    const requestHeaders = new Headers(request.headers);
    const cookieHeader = request.headers.get("cookie") || "";
    const updatedCookieHeader = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .filter((c) => !c.startsWith("token="))
      .join("; ");

    if (updatedCookieHeader) {
      requestHeaders.set("cookie", updatedCookieHeader);
    } else {
      requestHeaders.delete("cookie");
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.delete("token");
    return response;
  }

  // 3. If logged in with a valid token and trying to access login page, redirect to their dashboard
  const centerSlug =
    request.cookies.get("centerSlug")?.value ||
    ((payload as Record<string, unknown>)?.centerSlug as string | undefined) ||
    ((payload as Record<string, unknown>)?.slug as string | undefined);

  if (pathname === "/login") {
    return redirectRoleDashboard(role, request.url, centerSlug);
  }

  // 4. Handle paths protection based on roles
  const isOwnerPath = /^\/[^/]+\/owner(\/.*)?$/.test(pathname);
  const isTeacherPath = /^\/[^/]+\/teacher(\/.*)?$/.test(pathname);
  const isStudentPath = /^\/[^/]+\/student(\/.*)?$/.test(pathname);

  if (isOwnerPath && role !== "OWNER") {
    return redirectRoleDashboard(role, request.url, centerSlug);
  }

  if (isTeacherPath && role !== "TEACHER") {
    return redirectRoleDashboard(role, request.url, centerSlug);
  }

  if (isStudentPath && role !== "STUDENT") {
    return redirectRoleDashboard(role, request.url, centerSlug);
  }

  return NextResponse.next();
}

// Redirects the user to their role-specific dashboard URL
function redirectRoleDashboard(role: string, requestUrl: string, centerSlug?: string) {
  let rolePath = "owner";

  if (role === "OWNER") {
    rolePath = "owner";
  } else if (role === "TEACHER") {
    rolePath = "teacher";
  } else if (role === "STUDENT") {
    rolePath = "student";
  }

  const targetPath = centerSlug ? `/${centerSlug}/${rolePath}` : "/login";
  return NextResponse.redirect(new URL(targetPath, requestUrl));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes and server actions)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images, public files, metadata files
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
