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

function seededRandom(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getThemeSeed(_: SakuraPetalsProps["theme"]) {
  return 1;
}

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
