import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const getRoleFromToken = (token?: string) => {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const payload = parts[1]
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(parts[1].length + (4 - (parts[1].length % 4)) % 4, "=");

  try {
    const decoded = JSON.parse(atob(payload));
    return decoded?.role ?? null;
  } catch {
    return null;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const role = getRoleFromToken(token);

  if (pathname.startsWith("/admin")) {
    if (!token || role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/login" && token && role === "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/portfolios";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
