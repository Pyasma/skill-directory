import { createBrowserClient } from "@supabase/ssr";

/**
 * Reads the configured Supabase URL and publishable key.
 *
 * @returns An object containing the Supabase `url` and `publishableKey`
 * @throws If either Supabase environment variable is missing
 */
function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return { url, publishableKey };
}

/**
 * Creates a Supabase client for browser-side use.
 *
 * @returns A configured Supabase browser client.
 */
export function createSupabaseBrowserClient() {
  const { url, publishableKey } = getSupabaseEnv();

  return createBrowserClient(url, publishableKey);
}
