"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

interface VoiceIndicatorProps {
  isListening: boolean;
  isSupported: boolean;
  className?: string;
}

export function VoiceIndicator({ isListening, isSupported, className = '' }: VoiceIndicatorProps) {
  if (!isSupported) return null;

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 ${className}`}
        >
          <div className="bg-brand text-white px-6 py-3 rounded-full shadow-nav backdrop-blur-sm flex items-center gap-3 dark:bg-brand-accent">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Mic className="h-5 w-5" />
            </motion.div>
            <span className="font-medium text-sm">Listening for voice commands...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
