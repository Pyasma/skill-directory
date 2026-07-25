"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import prisma from "@/db/prisma";

type ResponseResult<T = unknown> = {
  success: boolean;
  message: string;
  error?: string;
  data?: T;
};

type OAuthProvider = "google" | "github";

// Only allow internal redirect targets after auth completes.
function getSafeNextPath(nextPath: string) {
  return nextPath.startsWith("/") ? nextPath : "/welcome";
}

function buildUsernameFromEmail(email: string) {
  const baseUsername = email
    .split("@")[0]
    ?.toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return baseUsername || `user_${Date.now()}`;
}

async function syncUserToDatabase(user: {
  id: string;
  email?: string | null;
  user_metadata?: {
    avatar_url?: string;
  };
}) {
  if (!user.email) {
    return;
  }

  await prisma.user.upsert({
    where: {
      email: user.email,
    },
    update: {
      email: user.email,
      img: user.user_metadata?.avatar_url,
    },
    create: {
      id: user.id,
      email: user.email,
      username: buildUsernameFromEmail(user.email),
      img: user.user_metadata?.avatar_url,
    },
  });
}

// Build absolute URLs so Supabase callbacks work in server actions and previews.
async function buildAbsoluteUrl(pathname: string) {
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  return new URL(pathname, origin).toString();
}

// Preserve the post-auth destination on the callback URL.
async function buildAuthCallbackUrl(nextPath = "/welcome") {
  const callbackUrl = new URL(await buildAbsoluteUrl("/auth/callback"));
  callbackUrl.searchParams.set("next", getSafeNextPath(nextPath));
  return callbackUrl.toString();
}

async function signInWithOAuthProvider(
  provider: OAuthProvider,
  nextPath = "/welcome",
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: await buildAuthCallbackUrl(nextPath),
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    redirect("/sign-in");
  }

  redirect(data.url);
}

export async function signInWithGoogleAction() {
  await signInWithOAuthProvider("google");
}

export async function signInWithGithubAction() {
  await signInWithOAuthProvider("github");
}

// Parse and validate form state before handing off to the shared sign-up flow.
export async function signUpUserAction(
  _prevState: ResponseResult,
  formData: FormData,
): Promise<ResponseResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      success: false,
      message: "Invalid email or password",
      error: "Invalid email or password",
    };
  }

  return signUpNewUser(email, password);
}

export async function signUpNewUser(
  email: string,
  password: string,
): Promise<ResponseResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: await buildAuthCallbackUrl("/welcome"),
    },
  });

  if (error) {
    return { success: false, message: error.message, error: error.message };
  }

  return {
    success: true,
    message: "User signed up successfully",
  };
}

export async function signInUserAction(
  _prevState: ResponseResult,
  formData: FormData,
): Promise<ResponseResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      success: false,
      message: "Invalid email or password",
      error: "Invalid email or password",
    };
  }

  return signInUser(email, password);
}

export async function signInUser(
  email: string,
  password: string,
): Promise<ResponseResult> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message, error: error.message };
  }

  if (!data.user) {
    return {
      success: false,
      message: "User not found",
      error: "User not found",
    };
  }

  // Repair missing Prisma rows for valid Supabase accounts during sign-in.
  await syncUserToDatabase(data.user);

  return {
    success: true,
    message: "User signed in successfully",
  };
}

export async function signOutUser(): Promise<ResponseResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: error.message, error: error.message };
  }

  return {
    success: true,
    message: "User signed out successfully",
  };
}

export async function getCurrentUser(): Promise<ResponseResult> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      success: false,
      message: "User not found",
      error: error?.message ?? "User not found",
    };
  }

  return {
    success: true,
    message: "User retrieved successfully",
    data: data.user,
  };
}
