"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface VoiceNavigationOptions {
  onNavigate: (section: string) => void;
  onError?: (error: string) => void;
  onStatusChange?: (isListening: boolean) => void;
  onShowHelp?: () => void;
}

interface VoiceCommand {
  command: string;
  action: string;
  keywords: string[];
}

const VOICE_COMMANDS: VoiceCommand[] = [
  {
    command: 'next page',
    action: 'next',
    keywords: ['next', 'next page', 'go next', 'move next', 'next section', 'scroll down', 'down', 'forward', 'continue', 'proceed', 'next one', 'go forward', 'move forward']
  },
  {
    command: 'previous page',
    action: 'previous',
    keywords: ['previous', 'previous page', 'go back', 'move back', 'back', 'last page', 'scroll up', 'up', 'before', 'return', 'previous one']
  },
  {
    command: 'intro',
    action: 'hero',
    keywords: ['intro', 'home', 'start', 'beginning', 'top', 'first page', 'main page', 'landing', 'welcome', 'go home', 'home page', 'main', 'first']
  },
  {
    command: 'showcase',
    action: 'showcase',
    keywords: ['showcase', 'show case', 'portfolio', 'gallery', 'display', 'demo', 'examples', 'show me', 'showcase section', 'portfolio section']
  },
  {
    command: 'skills',
    action: 'skills',
    keywords: ['skills', 'abilities', 'technologies', 'expertise', 'capabilities', 'talents', 'tech', 'go to skills', 'skills section', 'my skills', 'technical skills']
  },
  {
    command: 'projects',
    action: 'projects',
    keywords: ['projects', 'project', 'applications', 'apps', 'code', 'development', 'programming', 'go to projects', 'projects section', 'my projects', 'show projects']
  },
  {
    command: 'timeline',
    action: 'timeline',
    keywords: ['timeline', 'experience', 'history', 'career', 'journey', 'background', 'resume', 'cv', 'go to timeline', 'timeline section', 'my experience', 'work history']
  },
  {
    command: 'contact',
    action: 'contact',
    keywords: ['contact', 'reach out', 'get in touch', 'connect', 'message', 'email', 'hire', 'collaborate', 'talk', 'go to contact', 'contact section', 'contact me']
  },
  {
    command: 'download cv',
    action: 'download-cv',
    keywords: ['download cv', 'download resume', 'get cv', 'get resume', 'download', 'cv', 'resume', 'download my cv', 'get my resume', 'download my resume', 'cv download', 'resume download']
  },
  {
    command: 'dark mode',
    action: 'dark-mode',
    keywords: ['dark mode', 'dark theme', 'night mode', 'switch to dark', 'enable dark', 'dark mode on', 'turn on dark', 'dark theme on', 'go dark', 'make it dark']
  },
  {
    command: 'light mode',
    action: 'light-mode',
    keywords: ['light mode', 'light theme', 'day mode', 'switch to light', 'enable light', 'light mode on', 'turn on light', 'light theme on', 'go light', 'make it light']
  },
  {
    command: 'toggle theme',
    action: 'toggle-theme',
    keywords: ['toggle theme', 'switch theme', 'change theme', 'toggle mode', 'switch mode', 'change mode', 'theme toggle', 'mode toggle']
  }
];

const SECTIONS = ['hero', 'showcase', 'skills', 'projects', 'timeline', 'contact'];

function getCurrentSectionId(): string {
  const nodes = Array.from(document.querySelectorAll('[data-hs]')) as HTMLElement[];
  if (nodes.length === 0) return 'hero';

  const viewportCenterY = window.innerHeight / 2;
  let closestId = 'hero';
  let closestDist = Infinity;

  for (const el of nodes) {
    const id = el.getAttribute('data-hs') || '';
    if (!SECTIONS.includes(id)) continue;
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

export function useVoiceNavigation({ onNavigate, onError, onStatusChange, onShowHelp }: VoiceNavigationOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userStoppedRef = useRef(true);
  const isListeningRef = useRef(false);
  const lastProcessedRef = useRef('');
  const lastCommandAtRef = useRef(0);

  const onNavigateRef = useRef(onNavigate);
  const onErrorRef = useRef(onError);
  const onStatusChangeRef = useRef(onStatusChange);
  const onShowHelpRef = useRef(onShowHelp);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
    onErrorRef.current = onError;
    onStatusChangeRef.current = onStatusChange;
    onShowHelpRef.current = onShowHelp;
  });

  const COMMAND_CONFIDENCE_THRESHOLD = 40;
  const COMMAND_COOLDOWN_MS = 500;
  const RESTART_DELAY_MS = 200;

  const clearRestartTimeout = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  const processVoiceCommand = useCallback((transcript: string) => {
    const cleanTranscript = transcript.toLowerCase().trim();
    if (!cleanTranscript) return;

    console.log('[VoiceNav] Processing command:', cleanTranscript);

    let bestMatch: VoiceCommand | null = null;
    let bestScore = 0;

    for (const cmd of VOICE_COMMANDS) {
      for (const keyword of cmd.keywords) {
        const keywordLower = keyword.toLowerCase();

        // Exact match
        if (cleanTranscript === keywordLower) {
          bestMatch = cmd;
          bestScore = 100;
          console.log('[VoiceNav] Exact match:', keywordLower, 'Score:', bestScore);
          break;
        }

        // Contains match
        if (cleanTranscript.includes(keywordLower)) {
          const score = Math.min(95, (keywordLower.length / cleanTranscript.length) * 100);
          if (score > bestScore) {
            bestMatch = cmd;
            bestScore = score;
            console.log('[VoiceNav] Contains match:', keywordLower, 'Score:', bestScore);
          }
        }

        // Word matching
        const transcriptWords = cleanTranscript.split(/\s+/);
        const keywordWords = keywordLower.split(/\s+/);
        let wordMatches = 0;

        for (const transcriptWord of transcriptWords) {
          for (const keywordWord of keywordWords) {
            if (
              transcriptWord === keywordWord ||
              (transcriptWord.length > 2 && keywordWord.includes(transcriptWord)) ||
              (keywordWord.length > 2 && transcriptWord.includes(keywordWord))
            ) {
              wordMatches++;
              break;
            }
          }
        }

        if (wordMatches > 0) {
          const wordScore = (wordMatches / Math.max(transcriptWords.length, keywordWords.length)) * 90;
          if (wordScore > bestScore) {
            bestMatch = cmd;
            bestScore = wordScore;
            console.log('[VoiceNav] Word match:', keywordLower, 'Score:', bestScore);
          }
        }
      }

      if (bestScore >= 95) break;
    }

    console.log('[VoiceNav] Best match:', bestMatch?.command, 'Score:', bestScore, 'Threshold:', COMMAND_CONFIDENCE_THRESHOLD);

    if (bestMatch && bestScore >= COMMAND_CONFIDENCE_THRESHOLD) {
      const now = Date.now();
      if (now - lastCommandAtRef.current < COMMAND_COOLDOWN_MS) {
        console.log('[VoiceNav] Command blocked by cooldown');
        return;
      }
      lastCommandAtRef.current = now;

      console.log('[VoiceNav] Executing action:', bestMatch.action);

      if (bestMatch.action === 'next') {
        const currentId = getCurrentSectionId();
        const currentIdx = Math.max(0, SECTIONS.indexOf(currentId));
        const nextIndex = (currentIdx + 1) % SECTIONS.length;
        setCurrentSection(nextIndex);
        onNavigateRef.current(SECTIONS[nextIndex]);
      } else if (bestMatch.action === 'previous') {
        const currentId = getCurrentSectionId();
        const currentIdx = Math.max(0, SECTIONS.indexOf(currentId));
        const prevIndex = currentIdx === 0 ? SECTIONS.length - 1 : currentIdx - 1;
        setCurrentSection(prevIndex);
        onNavigateRef.current(SECTIONS[prevIndex]);
      } else if (bestMatch.action === 'download-cv') {
        const existing = document.querySelector('a[href*="ParvinRaj_SDE"]') as HTMLAnchorElement | null;
        if (existing) {
          existing.click();
        } else {
          const a = document.createElement('a');
          a.href = '/ParvinRaj_SDE.pdf';
          a.download = 'ParvinRaj_SDE.pdf';
          a.target = '_blank';
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else if (bestMatch.action === 'dark-mode') {
        const htmlElement = document.documentElement;
        if (!htmlElement.classList.contains('dark')) {
          document.querySelector<HTMLElement>('[data-theme-toggle]')?.click();
        }
      } else if (bestMatch.action === 'light-mode') {
        const htmlElement = document.documentElement;
        if (htmlElement.classList.contains('dark')) {
          document.querySelector<HTMLElement>('[data-theme-toggle]')?.click();
        }
      } else if (bestMatch.action === 'toggle-theme') {
        document.querySelector<HTMLElement>('[data-theme-toggle]')?.click();
      } else {
        const sectionIndex = SECTIONS.indexOf(bestMatch.action);
        console.log('[VoiceNav] Section navigation - action:', bestMatch.action, 'index:', sectionIndex, 'SECTIONS:', SECTIONS);
        if (sectionIndex !== -1) {
          setCurrentSection(sectionIndex);
          console.log('[VoiceNav] Calling onNavigate with:', bestMatch.action);
          onNavigateRef.current(bestMatch.action);
        } else {
          console.log('[VoiceNav] Section not found in SECTIONS array');
        }
      }
    } else {
      console.log('[VoiceNav] No match found, showing help');
      onShowHelpRef.current?.();
    }
  }, [COMMAND_CONFIDENCE_THRESHOLD, COMMAND_COOLDOWN_MS]);

  const startRecognition = useCallback(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    console.log('[VoiceNav] Starting recognition. Supported:', !!SpeechRecognitionCtor, 'User stopped:', userStoppedRef.current);
    
    if (!SpeechRecognitionCtor) {
      onErrorRef.current?.('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    
    if (userStoppedRef.current) {
      console.log('[VoiceNav] User stopped, not starting');
      return;
    }
    
    if (recognitionRef.current) {
      console.log('[VoiceNav] Recognition already exists, not starting');
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      console.log('[VoiceNav] Recognition started successfully');
      isListeningRef.current = true;
      setIsListening(true);
      onStatusChangeRef.current?.(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('[VoiceNav] Got speech result, results length:', event.results.length);
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        console.log('[VoiceNav] Result isFinal:', result.isFinal, 'length:', result.length);
        if (!result.isFinal || !result[0]) continue;

        const transcript = result[0].transcript.toLowerCase().trim();
        console.log('[VoiceNav] Transcript:', transcript, 'Last processed:', lastProcessedRef.current);
        if (!transcript || transcript === lastProcessedRef.current) continue;

        lastProcessedRef.current = transcript;
        processVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[VoiceNav] Recognition error:', event.error, event);
      if (event.error === 'aborted' || event.error === 'no-speech') {
        console.log('[VoiceNav] Ignoring error:', event.error);
        return;
      }

      isListeningRef.current = false;
      setIsListening(false);
      onStatusChangeRef.current?.(false);

      let errorMessage = 'Speech recognition error';
      switch (event.error) {
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone.';
          userStoppedRef.current = true;
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access in your browser settings.';
          userStoppedRef.current = true;
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      onErrorRef.current?.(errorMessage);
    };

    recognition.onend = () => {
      console.log('[VoiceNav] Recognition ended. User stopped:', userStoppedRef.current);
      recognitionRef.current = null;
      isListeningRef.current = false;

      if (userStoppedRef.current) {
        console.log('[VoiceNav] User stopped, not restarting');
        setIsListening(false);
        onStatusChangeRef.current?.(false);
        return;
      }

      console.log('[VoiceNav] Auto-restarting recognition');
      setIsListening(true);
      onStatusChangeRef.current?.(true);
      clearRestartTimeout();
      restartTimeoutRef.current = setTimeout(() => {
        if (!userStoppedRef.current) {
          console.log('[VoiceNav] Executing restart');
          startRecognition();
        }
      }, RESTART_DELAY_MS);
    };

    recognitionRef.current = recognition;

    try {
      console.log('[VoiceNav] Calling recognition.start()');
      recognition.start();
    } catch (err) {
      console.error('[VoiceNav] Failed to start recognition:', err);
      recognitionRef.current = null;
      isListeningRef.current = false;
      setIsListening(false);
      onStatusChangeRef.current?.(false);
      onErrorRef.current?.('Failed to start voice recognition');
    }
  }, [clearRestartTimeout, processVoiceCommand, RESTART_DELAY_MS]);

  useEffect(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionCtor);

    return () => {
      userStoppedRef.current = true;
      clearRestartTimeout();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // already stopped
        }
        recognitionRef.current = null;
      }
    };
  }, [clearRestartTimeout]);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      onErrorRef.current?.('Speech recognition not supported');
      return;
    }

    if (isListeningRef.current && recognitionRef.current) return;

    userStoppedRef.current = false;
    lastProcessedRef.current = '';
    clearRestartTimeout();
    startRecognition();
  }, [clearRestartTimeout, startRecognition]);

  const stopListening = useCallback(() => {
    userStoppedRef.current = true;
    clearRestartTimeout();
    lastProcessedRef.current = '';

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // already stopped
      }
      recognitionRef.current = null;
    }

    isListeningRef.current = false;
    setIsListening(false);
    onStatusChangeRef.current?.(false);
  }, [clearRestartTimeout]);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current || isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    currentSection,
    setCurrentSection
  };
}
