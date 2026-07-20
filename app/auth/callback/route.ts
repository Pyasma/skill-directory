import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import prisma from "@/db/prisma";

/**
 * Validates a redirect path and provides a safe default when it is missing or invalid.
 *
 * @param nextPath - The candidate redirect path.
 * @returns `nextPath` if it starts with `/`, or `"/welcome"` otherwise.
 */
function getSafeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/welcome";
  }

  return nextPath;
}

/**
 * Builds a normalized username from an email address.
 *
 * @param email - The email address used to derive the username
 * @returns The normalized local part of the email, or a timestamp-based username when the normalized result is empty
 */
function buildUsernameFromEmail(email: string) {
  const baseUsername = email
    .split("@")[0]
    ?.toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return baseUsername || `user_${Date.now()}`;
}

/**
 * Processes an authentication callback and redirects the user based on its result.
 *
 * @returns A redirect response to the requested path after successful authentication, or to `/sign-in` when authentication fails or no user is found.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", requestUrl.origin));
    }

    await prisma.user.upsert({
      where: {
        email: user.email!,
      },
      update: {
        email: user.email!,
        img: user.user_metadata?.avatar_url,
      },
      create: {
        id: user.id,
        email: user.email!,
        username: buildUsernameFromEmail(user.email!),
        img: user.user_metadata?.avatar_url,
      },
    });

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/sign-in", requestUrl.origin));
}
