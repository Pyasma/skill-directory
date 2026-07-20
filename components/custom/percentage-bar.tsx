import { useMemo, forwardRef } from "react"

interface BloomPercentageProps {
    percentage: number;
    size?: number;
    petalCount?: number;
    showLabel?: boolean;
    className?: string;
}

const TRACK_COLOR = "#ebd8de";
const ACCENT_COLOR = "#b83a60";

const BloomPercentage = forwardRef<HTMLButtonElement, BloomPercentageProps & React.ComponentPropsWithoutRef<"button">>(({
  percentage,
  size=30,
  petalCount = 10,
  className = "",
  ...rest
}, ref) => {
  const clamped = Math.max(0, Math.min(100, percentage));
  const filled = Math.round((clamped / 100) * petalCount);
  const round = (n: number) => Number(n.toFixed(2))

  const petals = useMemo(() => {
    const radius = size * 0.38;
    const center = size / 2;
    const petalRadius = size * 0.07;

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
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label={`${Math.round(clamped)} percent`}
      {...rest}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pointer-events-none">
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
              transform: p.filled ? "scale(1)" : "scale(0.90)",
            }}
          />
        ))}
      </svg>
    </button>
  );
});

BloomPercentage.displayName = "BloomPercentage";

export default BloomPercentage;
