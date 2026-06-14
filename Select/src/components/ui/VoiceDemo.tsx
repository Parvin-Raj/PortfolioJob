"use client";

import { motion } from 'framer-motion';
import { Mic, ArrowRight, Keyboard } from 'lucide-react';

interface VoiceDemoProps {
  onStartDemo: () => void;
  className?: string;
}

export function VoiceDemo({ onStartDemo, className = '' }: VoiceDemoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg p-6 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Mic className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Voice Navigation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Navigate your portfolio with voice commands
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <ArrowRight className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Say <strong>"next page"</strong> to navigate forward
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ArrowRight className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Say <strong>"previous page"</strong> to go back
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ArrowRight className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Say section names like <strong>"skills"</strong> or <strong>"projects"</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Keyboard className="h-4 w-4 text-blue-600" />
          <span className="text-gray-700 dark:text-gray-300">
            Press <strong>Tab</strong> to toggle listening, or use <strong>arrow keys</strong> to navigate
          </span>
        </div>
      </div>

      <motion.button
        onClick={onStartDemo}
        className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Start Voice Navigation
      </motion.button>
    </motion.div>
  );
}
