import { motion, useInView, UseInViewOptions } from "framer-motion";
import { useRef, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  fullWidth?: boolean;
  once?: boolean;
  amount?: UseInViewOptions["amount"];
}

export default function FadeIn({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.5,
  fullWidth = false,
  once = true,
  amount = 0.3,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  const getVariants = () => {
    const distance = 40;

    const hidden: any = { opacity: 0 };
    if (direction === "up") hidden.y = distance;
    if (direction === "down") hidden.y = -distance;
    if (direction === "left") hidden.x = distance;
    if (direction === "right") hidden.x = -distance;

    const visible: any = {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    };

    return { hidden, visible };
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getVariants()}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
