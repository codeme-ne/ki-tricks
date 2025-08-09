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
      {/* Subtle background glow that works with starfield */}
      <div className="absolute inset-0 -m-8 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-primary-400/5 to-primary-500/10 rounded-3xl blur-3xl" />
      </div>
      
      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <h1 className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center">
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="relative inline-block"
            >
              {/* Subtle text shadow for depth */}
              <span className="absolute inset-0 text-primary-400/20 blur-sm">
                {word}
              </span>
              {/* Main text with gradient */}
              <span className="relative bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                {word}
              </span>
            </motion.span>
          ))}
        </h1>
      </motion.div>
    </div>
  );
};

// Legacy component for backwards compatibility
export const TextRevealByWord = AnimatedHeroTitle;

