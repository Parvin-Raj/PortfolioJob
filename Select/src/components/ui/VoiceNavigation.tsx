"use client";

import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle, Keyboard, X } from 'lucide-react';
import { useVoiceNavigation } from '@/hooks/useVoiceNavigation';

const SECTIONS = ['hero', 'showcase', 'skills', 'projects', 'timeline', 'contact'] as const;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

function getClosestSectionId(): string {
  const nodes = Array.from(document.querySelectorAll('[data-hs]')) as HTMLElement[];
  const viewportCenterY = window.innerHeight / 2;
  let closestId = 'hero';
  let closestDist = Infinity;

  for (const el of nodes) {
    const id = el.getAttribute('data-hs') || '';
    if (!SECTIONS.includes(id as (typeof SECTIONS)[number])) continue;
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const dist = Math.abs(centerY - viewportCenterY);
    if (dist < closestDist) {
      closestDist = dist;
      closestId = id;
    }
  }

  return closestId;
}

interface VoiceNavigationProps {
  onNavigate: (section: string) => void;
  onError?: (error: string) => void;
  onStatusChange?: (isListening: boolean) => void;
  onSupportedChange?: (isSupported: boolean) => void;
  className?: string;
}

export function VoiceNavigation({ onNavigate, onError, onStatusChange, onSupportedChange, className = '' }: VoiceNavigationProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [showUnrecognizedHelp, setShowUnrecognizedHelp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const {
    isListening,
    isSupported,
    toggleListening,
    startListening,
    stopListening
  } = useVoiceNavigation({
    onNavigate,
    onError: (error) => {
      setError(error);
      onError?.(error);
      setTimeout(() => setError(null), 5000);
    },
    onStatusChange: (listening) => {
      console.log('Voice recognition status:', listening ? 'listening' : 'stopped');
      onStatusChange?.(listening);
      if (!listening) {
        setLastCommand(null);
      }
    },
    onShowHelp: () => {
      setShowUnrecognizedHelp(true);
      setTimeout(() => setShowUnrecognizedHelp(false), 5000);
    }
  });

  useEffect(() => {
    onSupportedChange?.(isSupported);
  }, [isSupported, onSupportedChange]);

  // Show voice intro on every page load and refresh (until dismissed this visit)
  useEffect(() => {
    setShowOnboarding(true);
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      // Tab key to toggle voice recognition
      if (event.code === 'Tab' && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault();
        toggleListening();
      }
      
      // Arrow keys for navigation
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        const currentId = getClosestSectionId();
        const currentIndex = Math.max(0, SECTIONS.indexOf(currentId as (typeof SECTIONS)[number]));
        const nextIndex = (currentIndex + 1) % SECTIONS.length;
        onNavigate(SECTIONS[nextIndex]);
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const currentId = getClosestSectionId();
        const currentIndex = Math.max(0, SECTIONS.indexOf(currentId as (typeof SECTIONS)[number]));
        const prevIndex = currentIndex === 0 ? SECTIONS.length - 1 : currentIndex - 1;
        onNavigate(SECTIONS[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleListening, onNavigate]);

  // Auto-start listening when component mounts (optional)
  useEffect(() => {
    if (isSupported) {
      // Auto-start voice recognition for better UX
      setTimeout(() => {
        startListening();
      }, 1000);
    }
  }, [isSupported, startListening]);

  const voiceCommands = [
    "Say 'next page' or 'next' to go to the next section",
    "Say 'previous page' or 'back' to go to the previous section",
    "Say 'intro' or 'home' to go to the beginning",
    "Say 'showcase' to view the showcase",
    "Say 'skills' to view skills",
    "Say 'projects' to view projects",
    "Say 'timeline' to view timeline",
    "Say 'contact' to go to contact section",
    "Say 'download cv' or 'get resume' to download CV",
    "Say 'dark mode' or 'light mode' to change theme",
    "Say 'toggle theme' to switch between themes",
    "Try: 'go to skills', 'show me projects', 'dark mode'"
  ];

  const keyboardShortcuts = [
    "Press Tab to toggle voice recognition",
    "Press ↑/↓ or ←/→ arrows to navigate sections",
    "Click the mic button (bottom-left) to start"
  ];

  return (
    <>
      {showOnboarding && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-onboarding-title"
          aria-describedby="voice-onboarding-desc"
        >
          <div className="w-full max-w-md rounded-xl border-2 border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900 shadow-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-accent text-white shadow-md">
                  <Mic className="h-5 w-5" />
                </div>
                <h2 id="voice-onboarding-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                  Voice navigation available
                </h2>
              </div>
              <button
                type="button"
                onClick={dismissOnboarding}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Dismiss voice navigation introduction"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p id="voice-onboarding-desc" className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {isSupported ? (
                <>
                  Navigate this portfolio hands-free. Say <strong>&quot;next page&quot;</strong>,{' '}
                  <strong>&quot;skills&quot;</strong>, or <strong>&quot;contact&quot;</strong> — or use the
                  mic button at the bottom-left.
                </>
              ) : (
                <>
                  Voice navigation works best in <strong>Chrome</strong> or <strong>Edge</strong>.
                  You can still use arrow keys and the navigation bar to move between sections.
                </>
              )}
            </p>
            {isSupported && (
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 mb-4 rounded-lg bg-gray-50 dark:bg-gray-800/60 p-3 border border-gray-200 dark:border-gray-700">
                <li>• Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 font-mono text-[11px] border border-gray-200 dark:border-gray-700">Tab</kbd> to turn listening on or off</li>
                <li>• Arrow keys move between sections</li>
                <li>• Try &quot;dark mode&quot;, &quot;download cv&quot;, or section names</li>
              </ul>
            )}
            <div className="flex gap-2">
              {isSupported && (
                <button
                  type="button"
                  onClick={() => {
                    toggleListening();
                    dismissOnboarding();
                  }}
                  className="flex-1 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white text-sm font-semibold py-2.5 transition-colors shadow-md"
                >
                  Try voice now
                </button>
              )}
              <button
                type="button"
                onClick={dismissOnboarding}
                className={`rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${!isSupported ? 'flex-1' : ''}`}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    <div className={`fixed bottom-6 left-6 z-50 flex flex-col gap-3 ${className}`}>
      {!isSupported && (
        <div className="bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm max-w-sm">
          <p className="text-sm">Voice navigation not supported in this browser</p>
        </div>
      )}

      {isSupported && (
        <>
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm max-w-sm">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Unrecognized Command Help */}
      {showUnrecognizedHelp && (
        <div className="bg-gradient-to-r from-gold-deep via-gold to-gold-light text-stone-950 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm max-w-sm font-medium">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-semibold text-sm">Command not recognized</span>
          </div>
          <p className="text-sm mb-2">Try these commands:</p>
          <ul className="text-xs space-y-1">
            <li>• "next page" or "go to skills"</li>
            <li>• "dark mode" or "light mode"</li>
            <li>• "download cv" or "contact"</li>
            <li>• Click the help button for full list</li>
          </ul>
        </div>
      )}

      {/* Help Panel */}
      {showHelp && (
        <div className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-soft-elevated backdrop-blur-sm max-w-sm">
          <h3 className="font-semibold text-sm mb-2">Voice Commands:</h3>
          <ul className="text-xs space-y-1">
            {voiceCommands.map((command, index) => (
              <li key={index} className="text-slate-600 dark:text-slate-400">
                • {command}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keyboard Shortcuts Panel */}
      {showKeyboardHelp && (
        <div className="bg-slate-900/95 text-white px-4 py-3 rounded-xl border border-slate-700 shadow-soft-elevated backdrop-blur-sm max-w-sm dark:bg-slate-800/95">
          <h3 className="font-semibold text-sm mb-2">Keyboard Shortcuts:</h3>
          <ul className="text-xs space-y-1">
            {keyboardShortcuts.map((shortcut, index) => (
              <li key={index} className="text-slate-300">
                • {shortcut}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Voice Control Buttons */}
      <div className="flex gap-2 items-center">
        {/* Main Voice Toggle Button */}
        <button
          onClick={toggleListening}
          className={`
            relative inline-flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-200
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
            }
            focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2
            transform hover:scale-105 active:scale-95
          `}
          title={isListening ? 'Stop listening (Tab or click)' : 'Start listening (press Tab or click)'}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          
          {/* Listening indicator */}
          {isListening && (
            <div className="absolute -inset-0.5 rounded-full border-2 border-red-400 animate-ping" />
          )}
        </button>

        {/* Help Button */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-500/80 hover:bg-gray-600/80 text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          title="Show voice commands"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Keyboard Help Button */}
        <button
          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-600/90 hover:bg-gray-700/90 text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          title="Show keyboard shortcuts"
        >
          <Keyboard className="h-5 w-5" />
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/80 hover:bg-purple-600/80 text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-xs">
        <div className={`
          w-2 h-2 rounded-full transition-colors duration-200
          ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}
        `} />
        <span className="text-slate-600 dark:text-slate-400 font-medium">
          {isListening ? '🎤 Listening...' : '🔇 Voice navigation off'}
        </span>
      </div>

      {/* Last Command Feedback */}
      {lastCommand && (
        <div className="bg-gradient-to-r from-gold-deep via-gold to-gold-light text-stone-950 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Command: "{lastCommand}"</span>
          </div>
        </div>
      )}
        </>
      )}
    </div>
    </>
  );
}
