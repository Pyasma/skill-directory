"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Renders the current user's profile avatar.
 */
export default function UserProfile() {
  const supabase = createSupabaseBrowserClient();
  const [avatarUrl, setAvatarUrl] = useState("/favicon.ico");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    });
  }, [supabase]);

  return (
    <div className="relative size-8 overflow-hidden rounded-full">
      <Image
        src={avatarUrl}
        alt="Profile"
        fill
        unoptimized
        className="object-cover"
      />
    </div>
  );
}