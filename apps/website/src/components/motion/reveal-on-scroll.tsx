"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  amount = 0.15,
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.68,
        delay: Math.min(delay, 0.18),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
