"use client";

import { useMemo } from "react";

interface Petal {
  id: number;
  left: string;
  fallDuration: string;
  swayDuration: string;
  delay: string;
  width: string;
  height: string;
  opacity: number;
}

interface SakuraPetalsProps {
  theme?: "sakura";
}

/**
 * Creates a deterministic pseudorandom number generator from an integer seed.
 *
 * @param seed - The initial value for the generator.
 * @returns A generator that produces a floating-point value from 0 inclusive to 1 exclusive on each call.
 */
function seededRandom(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Selects the deterministic seed for the selected theme.
 *
 * @returns The numeric seed used to generate petal configurations
 */
function getThemeSeed(_: SakuraPetalsProps["theme"]) {
  return 1;
}

/**
 * Generates 20 deterministic petal configurations for the selected theme.
 *
 * @param theme - The theme used to determine the generated petal values
 * @returns An array of petal configurations with randomized positions, dimensions, opacity, and animation timings
 */
function createPetals(theme: SakuraPetalsProps["theme"]): Petal[] {
  const random = seededRandom(getThemeSeed(theme));

  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${random() * 100}%`,
    fallDuration: `${8 + random() * 8}s`,
    swayDuration: `${2 + random() * 3}s`,
    delay: `${random() * 10}s`,
    width: `${8 + random() * 8}px`,
    height: `${12 + random() * 10}px`,
    opacity: 0.3 + random() * 0.7,
  }));
}

/**
 * Renders animated sakura petals across the viewport.
 *
 * @param theme - The visual theme used to generate the petals.
 */
export function SakuraPetals({ theme = "sakura" }: SakuraPetalsProps) {
  const petals = useMemo(() => createPetals(theme), [theme]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute pointer-events-none"
          style={{
            left: petal.left,
            top: "-20px",
            animation: `sakura-fall ${petal.fallDuration} linear infinite`,
            animationDelay: petal.delay,
            willChange: "transform",
          }}
        >
          <div
            className="sakura-petal sakura-petal-pink"
            style={{
              width: petal.width,
              height: petal.height,
              opacity: petal.opacity,
              animation: `sakura-sway ${petal.swayDuration} ease-in-out infinite alternate`,
              animationDelay: petal.delay,
              willChange: "transform",
            }}
          />
        </div>
      ))}
    </div>
  );
}
