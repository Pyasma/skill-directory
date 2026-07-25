"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/custom/logo";
import { useTheme } from "@/components/theme-provider";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Sun, Moon } from "lucide-react";

export default function Header({ signed }: { signed: string }) {
  const [user, setUser] = useState<unknown>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const isDark = theme === "dark";

  return (
    <header className="flex items-center justify-between px-6 py-5 lg:px-12 z-20">
      <Logo href="/welcome" size="md" />

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <AnimateIcon animateOnHover>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center justify-center size-9 rounded-xl border transition-all cursor-pointer shadow-xs bg-white/80 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 text-amber-500 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-zinc-800 backdrop-blur-md"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5 text-zinc-600 dark:text-yellow-400" />}
          </button>
        </AnimateIcon>

        {!user && (
          <Link
            href={"/" + String(signed).toLowerCase().replace(/\s+/g, "-")}
            className="text-xs font-semibold uppercase tracking-wider text-[#ea580c] dark:text-orange-400 border border-[#ffedd5] dark:border-orange-500/30 hover:border-[#ea580c] dark:hover:border-orange-400 px-4 py-2 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-[#fff7ed] dark:hover:bg-zinc-800 backdrop-blur-md transition-all duration-300 shadow-xs hover:-translate-y-0.5 active:scale-95"
          >
            {signed}
          </Link>
        )}
      </div>
    </header>
  );
}
