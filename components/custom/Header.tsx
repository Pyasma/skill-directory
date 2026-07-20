"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Renders the Skills.dev header with an optional signed link for unauthenticated users.
 *
 * @param signed - The label used for the link and to derive its URL path
 */
export default function Header({ signed }: { signed: string }) {
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-6 lg:px-12 z-10">
      {!user ? (
        <>
          <span className="font-heading text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent select-none">
            Skills.dev
          </span>
          <Link
            href={"/" + String(signed).toLowerCase().replace(/\s+/g, "-")}
            className="text-xs font-semibold uppercase tracking-wider text-[#ea580c] hover:text-[#c2410c] border border-[#ffedd5] hover:border-[#ea580c] px-4 py-1.5 rounded-full bg-white hover:bg-[#fff7ed] transition-all duration-300 shadow-xs hover:-translate-y-0.5 active:scale-95"
          >
            {signed}
          </Link>
        </>
      ) : (
        <span className="font-heading text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent select-none">
          Skills.dev
        </span> 
      )}
    </header>
  );
}
