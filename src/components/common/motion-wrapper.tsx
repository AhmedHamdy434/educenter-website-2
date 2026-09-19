"use client";

import { motion, HTMLMotionProps, Variants } from "motion/react";

export const MotionDiv = motion.div;

export const MotionButton = motion.button;

export const MotionSection = motion.section;

export const MotionH1 = motion.h1;

export const MotionH2 = motion.h2;

export const MotionH3 = motion.h3;

export const MotionP = motion.p;

export const MotionSpan = motion.span;

export const MotionUl = motion.ul;

export const MotionLi = motion.li;

// --- REUSABLE ANIMATION WRAPPERS ---

interface FadeInProps extends HTMLMotionProps<"div"> {
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  viewportOnce?: boolean;
  threshold?: number;
}

/**
 * FadeIn component triggers a smooth fade-in animation, optionally moving from a direction,
 * when the element enters the viewport.
 */
export const FadeIn = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 30,
  viewportOnce = true,
  threshold = 0.1,
  ...props
}: FadeInProps) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <MotionDiv
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: viewportOnce, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.21, 1.02, 0.43, 1.01], // smooth spring-like ease curve
      }}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

interface StaggerProps extends HTMLMotionProps<"div"> {
  staggerDelay?: number;
  delayChildren?: number;
  viewportOnce?: boolean;
}

/**
 * StaggerContainer coordinates child StaggerItem animations to cascade one after another.
 */
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  viewportOnce = true,
  ...props
}: StaggerProps) => {
  const variants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren,
      },
    },
  };

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: viewportOnce }}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

/**
 * StaggerItem must be a child of StaggerContainer to stagger correctly.
 */
export const StaggerItem = ({
  children,
  direction = "up",
  distance = 20,
  duration = 0.4,
  ...props
}: Omit<FadeInProps, "delay" | "viewportOnce">) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: "easeOut",
      },
    },
  };

  return (
    <MotionDiv variants={variants} {...props}>
      {children}
    </MotionDiv>
  );
};

interface ScaleInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  initialScale?: number;
  viewportOnce?: boolean;
}

/**
 * ScaleIn scales elements from a starting size (e.g. 0.9) to full size when in view.
 */
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.4,
  initialScale = 0.9,
  viewportOnce = true,
  ...props
}: ScaleInProps) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: viewportOnce }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

interface HoverCardProps extends HTMLMotionProps<"div"> {
  scale?: number;
  yOffset?: number;
}

/**
 * HoverCard applies a subtle lift and scale effect to cards or hoverable items.
 */
export const HoverCard = ({
  children,
  scale = 1.02,
  yOffset = -5,
  ...props
}: HoverCardProps) => {
  return (
    <MotionDiv
      whileHover={{
        scale,
        y: yOffset,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

/**
 * TapBounce provides a springy shrink effect on tap/click (ideal for buttons and links).
 */
export const TapBounce = ({
  children,
  style,
  ...props
}: HTMLMotionProps<"button">) => {
  return (
    <MotionButton
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      style={style}
      {...props}
    >
      {children}
    </MotionButton>
  );
};
