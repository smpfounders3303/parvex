import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Cheap, edge-safe gate for /admin. This only checks that a session cookie
// exists — it is NOT the source of truth for authorization. The real check
// (valid session + role + disabled flag) happens server-side in
// `src/app/admin/layout.tsx` via requireAdmin(). Do not rely on this
// proxy alone; it exists to bounce obviously-unauthenticated requests
// before they render anything.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  if (pathname.startsWith("/admin")) {
    // Every Admin route is private — never let it enter the public sitemap
    // or search index.
    response.headers.set("X-Robots-Tag", "noindex, nofollow");

    if (pathname === "/admin/login") {
      return response;
    }

    const sessionCookie = getSessionCookie(request, {
      cookiePrefix: "parvex_admin",
    });

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
