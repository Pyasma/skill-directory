"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  className,
  href = "/welcome",
  size = "md",
}: LogoProps) {
  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link href={href} className={cn("inline-block select-none", className)}>
      <span
        className={cn(
          "font-heading font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent select-none transition-opacity duration-200 hover:opacity-90",
          textSizes[size]
        )}
      >
        Skills.dev
      </span>
    </Link>
  );
}

export default Logo;
