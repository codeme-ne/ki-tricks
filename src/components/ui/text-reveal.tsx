"use client";

import { FC, ReactNode, useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedHeroTitleProps {
  text: string;
  className?: string;
  delay?: number;
}

export const AnimatedHeroTitle: FC<AnimatedHeroTitleProps> = ({
  text,
  className,
  delay = 0.5
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const [hasStarted, setHasStarted] = useState(false);

  const words = text.split(" ");

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      controls.start("visible");
    }
  }, [isInView, controls, hasStarted]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: 0.12,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },
  };


  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <h1 className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-heading">
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="relative inline-block text-neutral-900"
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </motion.div>
    </div>
  );
};

// Legacy component for backwards compatibility
export const TextRevealByWord = AnimatedHeroTitle;

