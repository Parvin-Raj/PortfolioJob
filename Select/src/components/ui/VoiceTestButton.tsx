"use client";

import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

export function VoiceTestButton() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    console.log('Toggle listening called, current state:', isListening);
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    console.log('Starting listening...');
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition not supported');
      return;
    }

    // If we already have a recognition instance, use it
    if (recognitionRef.current) {
      console.log('Reusing existing recognition instance');
      try {
        recognitionRef.current.start();
        console.log('Test: Recognition restarted successfully');
        setIsListening(true);
        setError('');
        setTranscript('');
        return;
      } catch (err) {
        console.error('Test: Failed to restart recognition, creating new instance:', err);
        // Fall through to create new instance
      }
    }

    // Create new recognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Test: Voice recognition started');
      setIsListening(true);
      setError('');
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      console.log('Test: Speech result received');
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      console.log('Test: Transcript:', transcript);
      setTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Test: Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Test: Voice recognition ended');
      setIsListening(false);
      // Don't clear the recognition ref - keep it for potential restart
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      console.log('Test: Recognition started successfully');
    } catch (err) {
      console.error('Test: Failed to start recognition:', err);
      setError('Failed to start recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    console.log('Stopping listening...');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('Test: Recognition stop() called');
        setIsListening(false); // Update state immediately for better UX
      } catch (err) {
        console.error('Test: Failed to stop recognition:', err);
        setIsListening(false); // Still update state even if stop fails
      }
    } else {
      console.log('Test: No recognition to stop');
      setIsListening(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 max-w-xs">
      <h3 className="text-sm font-semibold mb-2">Voice Test</h3>
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full text-white transition-colors ${
          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={!!error && !isListening}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      <div className="mt-3 space-y-2">
        {isListening && (
          <div className="text-xs text-yellow-500 font-medium">🎤 Listening...</div>
        )}
        {transcript && (
          <div className="text-xs">
            <strong>Heard:</strong> {transcript}
          </div>
        )}
        {error && (
          <div className="text-xs text-red-500 break-words">
            <strong>Error:</strong> {error}
          </div>
        )}
        <div className="text-xs text-gray-500">
          <strong>Status:</strong> {isListening ? 'Active' : 'Inactive'}
        </div>
      </div>
    </div>
  );
}
