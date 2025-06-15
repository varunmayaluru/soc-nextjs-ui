"use client";
import { createContext, useContext, useState, useRef } from "react";

const SpeechContext = createContext<any>(null);

export const SpeechProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (id: string, text: string) => {
    // Stop any previous speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setCurrentId(null);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    speechSynthesis.speak(utterance);
    utteranceRef.current = utterance;
    setCurrentId(id);
    setIsPaused(false);
  };

  const pause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const reset = () => {
    speechSynthesis.cancel();
    setCurrentId(null);
    setIsPaused(false);
    utteranceRef.current = null;
  };

  return (
    <SpeechContext.Provider
      value={{
        currentId,
        isPaused,
        speak,
        pause,
        resume,
        reset,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
