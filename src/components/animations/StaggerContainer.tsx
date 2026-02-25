import { motion, useInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  once?: boolean;
  viewportAmount?: number;
  style?: React.CSSProperties;
  [key: string]: any;
}

export function StaggerContainer({
  children,
  className = "",
  delayChildren = 0,
  staggerChildren = 0.1,
  once = true,
  viewportAmount = 0.1,
  style,
  ...props
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: viewportAmount });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Add default export for compatibility
export default StaggerContainer;

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

export function StaggerItem({
  children,
  className = "",
  direction = "up",
  duration = 0.5,
}: StaggerItemProps) {
  const getVariants = (): Variants => {
    const distance = 30;

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
        ease: "easeOut",
      },
    };

    return { hidden, visible };
  };

  return (
    <motion.div variants={getVariants()} className={className}>
      {children}
    </motion.div>
  );
}
