"use client";

import * as React from "react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#faf9f6] dark:bg-[#09090b] text-[#1c1917] dark:text-[#f4f4f5] transition-colors duration-500 overflow-hidden">
      {/* Background Glowing Ambient Orbs for Frosted Glass Effect */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-transparent blur-3xl animate-pulse-slow" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[30rem] rounded-full bg-gradient-to-bl from-orange-600/15 via-rose-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: "-4s" }} />

      <div className="relative z-10 min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}
