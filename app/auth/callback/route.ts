import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import prisma from "@/db/prisma";

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/welcome";
  }

  return nextPath;
}

function buildUsernameFromEmail(email: string) {
  const baseUsername = email
    .split("@")[0]
    ?.toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return baseUsername || `user_${Date.now()}`;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/sign-in", requestUrl.origin));
    }
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
