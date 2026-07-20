interface AuthVisualProps {
  imageSrc?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

/**
 * Renders a decorative background image with a gradient transition for authentication pages.
 *
 * @param imageSrc - The background image URL or path.
 */
export function AuthVisual({
  imageSrc = "/white-magnolia.jpg"
}: AuthVisualProps) {
  return (
    <div className="relative hidden overflow-hidden lg:block h-full w-full bg-white">
      <div
        className="absolute inset-0 bg-cover bg-[center_30%]"
        style={{ backgroundImage: `url('${imageSrc}')` }}
      />
      {/* Seamless gradient edge blending into the form background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-80 bg-gradient-to-r from-white via-white/80 via-white/35 to-transparent z-10" />
    </div>
  );
}


