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

/**
 * Validates an authentication redirect target.
 *
 * @param nextPath - The requested redirect path
 * @returns The requested path if it starts with `/`; otherwise, `/welcome`
 */
function getSafeNextPath(nextPath: string) {
  return nextPath.startsWith("/") ? nextPath : "/welcome";
}

/**
 * Derives a normalized username from an email address.
 *
 * @param email - The email address used to derive the username
 * @returns The sanitized local part of the email address, or a timestamp-based username when the local part is empty
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
 * Synchronizes an authenticated user's profile with the database.
 *
 * @param user - The authenticated user data, including an optional email and avatar URL.
 */
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

/**
 * Builds an absolute URL from a pathname and the current request origin.
 *
 * @param pathname - The pathname to resolve
 * @returns The resulting absolute URL string
 */
async function buildAbsoluteUrl(pathname: string) {
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  return new URL(pathname, origin).toString();
}

/**
 * Builds the authentication callback URL with a safe post-authentication destination.
 *
 * @param nextPath - The path to visit after authentication.
 * @returns The absolute callback URL containing the sanitized destination.
 */
async function buildAuthCallbackUrl(nextPath = "/welcome") {
  const callbackUrl = new URL(await buildAbsoluteUrl("/auth/callback"));
  callbackUrl.searchParams.set("next", getSafeNextPath(nextPath));
  return callbackUrl.toString();
}

/**
 * Initiates OAuth sign-in and redirects the browser to the provider's authorization URL.
 *
 * @param provider - The OAuth provider to use.
 * @param nextPath - The path to visit after authentication.
 */
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

/**
 * Initiates authentication with Google.
 */
export async function signInWithGoogleAction() {
  await signInWithOAuthProvider("google");
}

/**
 * Starts authentication with GitHub.
 */
export async function signInWithGithubAction() {
  await signInWithOAuthProvider("github");
}

/**
 * Processes sign-up form data and initiates user registration.
 *
 * @param formData - Form data containing the user's email and password
 * @returns The sign-up result, including an error when either credential is invalid
 */
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

/**
 * Registers a user with email and password.
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns A result indicating whether registration succeeded, including an error message when it fails
 */
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

/**
 * Processes form data to authenticate a user with an email address and password.
 *
 * @param formData - Form data containing the user's email and password.
 * @returns The sign-in result, including success status and any error message.
 */
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

/**
 * Signs in a user with email and password and synchronizes their database record.
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns A result indicating whether sign-in succeeded, including an error message when it fails
 */
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

/**
 * Signs out the currently authenticated user.
 *
 * @returns A success result when sign-out completes, or a failure result containing the authentication error message.
 */
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

/**
 * Retrieves the currently authenticated user.
 *
 * @returns A successful result containing the authenticated user, or a failure result when no user is available.
 */
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
