"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from "@/components/animate-ui/icons/icon";

type PanelLeftToggleProps = IconProps<keyof typeof animations> & {
  isCollapsed?: boolean;
};

const animations = {
  default: {
    group: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.93, 1],
        transition: { duration: 0.35, ease: "easeInOut" },
      },
    },
    arrow: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, -8, 8, 0],
        transition: { duration: 0.45, ease: "easeInOut" },
      },
    },
    rect: {},
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, isCollapsed, ...props }: PanelLeftToggleProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={controls}
      {...props}
    >
      <motion.g
        variants={variants.group}
        animate={controls}
      >
        <motion.rect
          width={18}
          height={18}
          x={3}
          y={3}
          rx={2}
          variants={variants.rect}
        />
        <motion.path
          d="M9 3v18"
          animate={{
            x: isCollapsed ? -2 : 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        />
        <motion.path
          d={isCollapsed ? "m14 9 3 3-3 3" : "m16 15-3-3 3-3"}
          variants={variants.arrow}
          animate={{
            x: isCollapsed ? [0, 1.5, 0] : [0, -1.5, 0],
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </motion.g>
    </motion.svg>
  );
}

export function PanelLeftToggle(props: PanelLeftToggleProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}
