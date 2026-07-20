import { cn } from "@/lib/utils"

/**
 * Renders a styled loading placeholder.
 *
 * @returns A `div` element with skeleton styling and forwarded properties.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
