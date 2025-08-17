"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Plus } from 'lucide-react';
import { GlowingButton } from '@/components/enhanced';
import { AnimatedHeroTitle } from './text-reveal';

export const AnimatedHeroSection = () => {
  return (
    <>
      {/* Animated Hero Title */}
      <div className="mb-8">
        <AnimatedHeroTitle 
          text="Entdecke bewährte KI-Tricks" 
          delay={0.3}
          className="mb-6"
        />
      </div>
      
      {/* Animated Subtitle */}
      <motion.p 
        className="text-lg md:text-xl text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
      >
        Eine kuratierte Sammlung praktischer KI-Tricks und Tipps, um deinen Arbeitsalltag zu optimieren.
      </motion.p>

      {/* Action Buttons with Staggered Animation */}
      <motion.div 
        className="flex items-center justify-center gap-4 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
      >
        <Link href="/tricks">
          <GlowingButton
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            className="hover:scale-105 transition-transform duration-200"
          >
            Tricks entdecken
          </GlowingButton>
        </Link>
        <Link href="/tricks/einreichen">
          <GlowingButton
            variant="success"
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            iconPosition="left"
            className="hover:scale-105 transition-transform duration-200"
          >
            Trick einreichen
          </GlowingButton>
        </Link>
        <Link href="#categories">
          <GlowingButton
            variant="secondary"
            size="lg"
            icon={<Sparkles className="w-5 h-5" />}
            iconPosition="left"
            className="hover:scale-105 transition-transform duration-200"
          >
            Nach Kategorien
          </GlowingButton>
        </Link>
      </motion.div>
      
      <motion.p 
        className="text-sm text-neutral-400 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        *Alle Tricks wurden von Experten getestet und verifiziert
      </motion.p>
    </>
  );
};