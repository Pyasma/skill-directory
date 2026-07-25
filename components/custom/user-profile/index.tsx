"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const FALLBACK_AVATAR = "/white-magnolia.jpg";

type ProfileState = {
  avatarUrl: string;
  displayName: string;
};

export default function UserProfile({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const supabase = createSupabaseBrowserClient();
  const [profile, setProfile] = useState<ProfileState>({
    avatarUrl: FALLBACK_AVATAR,
    displayName: "Guest",
  });

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!isMounted || !user) {
        return;
      }

      const metadata = user.user_metadata;
      const displayName =
        metadata?.display_name ||
        metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Guest";
      const avatarUrl =
        typeof metadata?.avatar_url === "string" && metadata.avatar_url.length > 0
          ? metadata.avatar_url
          : FALLBACK_AVATAR;

      setProfile({ avatarUrl, displayName });
    });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative size-8 shrink-0 overflow-hidden rounded-full border ${isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-slate-50"}`}>
        <Image
          src={profile.avatarUrl}
          alt={`${profile.displayName} profile`}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
      <span className={`text-sm font-medium ${isDarkMode ? "text-zinc-200" : "text-slate-700"}`}>
        {profile.displayName}
      </span>
    </div>
  );
}
