import { forwardRef, useMemo } from "react";

import { AnimateIcon } from "../../animate-ui/icons/icon";
import { LoaderCircle } from "../../animate-ui/icons/loader-circle";

interface BloomPercentageProps {
  percentage?: number | null;
  size?: number;
  petalCount?: number;
  showLabel?: boolean;
  className?: string;
  loading?: boolean;
}

const TRACK_COLOR = "rgba(234, 88, 12, 0.2)";
const ACCENT_COLOR = "#f97316";

const BloomPercentage = forwardRef<
  HTMLButtonElement,
  BloomPercentageProps & React.ComponentPropsWithoutRef<"button">
>(
  (
    {
      percentage,
      size = 32,
      petalCount = 20,
      className = "",
      loading = false,
      ...rest
    },
    ref,
  ) => {
    const safePercentage = percentage ?? 0;
    const clamped = Math.max(0, Math.min(100, safePercentage));
    const filled = Math.round((clamped / 100) * petalCount);
    const round = (n: number) => Number(n.toFixed(2));

    const petals = useMemo(() => {
      const radius = size * 0.38;
      const center = size / 2;
      const petalRadius = size * 0.075;

      return Array.from({ length: petalCount }, (_, i) => {
        const angle = (i / petalCount) * 2 * Math.PI - Math.PI / 2;
        const cx = center + Math.cos(angle) * radius;
        const cy = center + Math.sin(angle) * radius;

        return { cx, cy, r: petalRadius, filled: i < filled, delay: i * 30 };
      });
    }, [size, petalCount, filled]);

    return (
      <button
        ref={ref}
        type="button"
        className={`relative inline-flex items-center justify-center p-1 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 shadow-xs ${className}`}
        style={{ width: size + 6, height: size + 6 }}
        aria-busy={loading}
        aria-label={loading ? "Calculating bloom percentage" : `${Math.round(clamped)} percent`}
        {...rest}
      >
        {loading ? (
          <AnimateIcon animate loop>
            <LoaderCircle
              size={size * 0.8}
              className="text-orange-500"
              aria-hidden="true"
            />
          </AnimateIcon>
        ) : (
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="pointer-events-none drop-shadow-[0_0_6px_rgba(249,115,22,0.4)]"
          >
            {petals.map((p, i) => (
              <circle
                key={i}
                cx={round(p.cx)}
                cy={round(p.cy)}
                r={round(p.r)}
                fill={p.filled ? ACCENT_COLOR : TRACK_COLOR}
                style={{
                  transition: "fill 400ms ease-out, transform 400ms ease-out",
                  transitionDelay: `${p.delay}ms`,
                  transformOrigin: `${round(p.cx)}px ${round(p.cy)}px`,
                  transform: p.filled ? "scale(1)" : "scale(0.85)",
                }}
              />
            ))}
          </svg>
        )}
      </button>
    );
  },
);

BloomPercentage.displayName = "BloomPercentage";

export default BloomPercentage;
