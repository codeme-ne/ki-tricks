"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { MinimalButton } from "./MinimalButton";
import { AnimatedHeroTitle } from "./text-reveal";

export const AnimatedHeroSection = () => {
  return (
    <>
      {/* Animated Hero Title */}
      <div className="mb-6">
        <AnimatedHeroTitle
          text="Entdecke bewährte KI-Tricks"
          delay={0.2}
          className="mb-4"
        />
      </div>

      {/* Animated Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-readable"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
      >
        Praktische KI-Tipps für deinen Arbeitsalltag.
      </motion.p>

      {/* Action Buttons - Reduced to 2 primary CTAs */}
      <motion.div
        className="flex items-center justify-center gap-4 flex-col sm:flex-row"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
      >
        <Link href="/tricks" className="w-full sm:w-auto">
          <MinimalButton
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            className="w-full sm:w-auto"
          >
            Tricks entdecken
          </MinimalButton>
        </Link>
        <Link href="/tricks/einreichen" className="w-full sm:w-auto">
          <MinimalButton
            variant="secondary"
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Trick einreichen
          </MinimalButton>
        </Link>
      </motion.div>

      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link
          href="#categories"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Oder nach Kategorien stöbern →
        </Link>
      </motion.div>
    </>
  );
};
