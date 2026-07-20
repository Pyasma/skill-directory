import { NextRequest, NextResponse } from "next/server";

/**
 * Protects the request by requiring an `sb-access-token` cookie.
 *
 * @returns A redirect response to `/login` when the cookie is missing; otherwise, a response that continues processing the request.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get("sb-access-token");
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/about/:path*"],
};
