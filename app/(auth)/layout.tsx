import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Renders authentication pages for unauthenticated users and redirects authenticated users to `/welcome`.
 *
 * @param children - The content to render when no authenticated user is present
 * @returns The provided child content
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/welcome");
  }

  return children;
}