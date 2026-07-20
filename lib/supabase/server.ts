import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Retrieves the Supabase URL and publishable key from environment variables.
 *
 * @returns The configured Supabase URL and publishable key
 * @throws An error if either Supabase environment variable is missing
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
 * Creates a Supabase server client configured with the request's cookie store.
 *
 * @returns A Supabase server client configured with the application credentials and request cookies
 */
export async function createSupabaseServerClient() {
  const { url, publishableKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Cookie writes are not always available during render.
        }
      },
    },
  });
}
