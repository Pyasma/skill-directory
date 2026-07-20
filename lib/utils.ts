import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class values into a normalized class string, resolving conflicting Tailwind classes.
 *
 * @param inputs - Class values to combine
 * @returns The normalized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
