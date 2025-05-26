"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

interface SpeechRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  isProcessing: boolean;
  error: string | null;
  transcript: string;
  interimTranscript: string;
  confidence: number;
}

export function useSpeechRecognition({
  onResult,
  continuous = false,
  interimResults = true,
}: UseSpeechRecognitionProps) {
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isSupported: false,
    isProcessing: false,
    error: null,
    transcript: "",
    interimTranscript: "",
    confidence: 0,
  });

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Check if speech recognition is supported
  const getSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;
    return (
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      null
    );
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (isInitializedRef.current) return;

    const SpeechRecognitionClass = getSpeechRecognition();

    if (SpeechRecognitionClass) {
      setState((prev) => ({ ...prev, isSupported: true }));

      try {
        recognitionRef.current = new SpeechRecognitionClass();
        const recognition = recognitionRef.current;

        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          console.log("Speech recognition started");
          setState((prev) => ({
            ...prev,
            isListening: true,
            isProcessing: false,
            error: null,
          }));
        };

        recognition.onresult = (event: any) => {
          console.log("Speech recognition result:", event);
          let finalTranscript = "";
          let interimTranscript = "";
          let maxConfidence = 0;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence || 0;

            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              maxConfidence = Math.max(maxConfidence, confidence);
            } else {
              interimTranscript += transcript;
            }
          }

          const fullTranscript = finalTranscript || interimTranscript;
          setState((prev) => ({
            ...prev,
            transcript: fullTranscript,
            interimTranscript,
            confidence: maxConfidence,
          }));

          if (finalTranscript) {
            console.log("Final transcript:", finalTranscript);
            onResult(finalTranscript);
          }
        };

        recognition.onend = () => {
          console.log("Speech recognition ended");
          setState((prev) => ({
            ...prev,
            isListening: false,
            isProcessing: false,
            transcript: "",
            interimTranscript: "",
            confidence: 0,
          }));

          // Clear any pending timeouts
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);

          let errorMessage = "Speech recognition failed";
          switch (event.error) {
            case "no-speech":
              errorMessage = "No speech detected. Please try again.";
              break;
            case "audio-capture":
              errorMessage =
                "Microphone not accessible. Please check permissions.";
              break;
            case "not-allowed":
              errorMessage = "Microphone permission denied.";
              break;
            case "network":
              errorMessage = "Network error. Please check your connection.";
              break;
            case "aborted":
              errorMessage = "Speech recognition was aborted.";
              break;
            case "service-not-allowed":
              errorMessage = "Speech recognition service not allowed.";
              break;
            case "bad-grammar":
              errorMessage = "Speech recognition grammar error.";
              break;
            case "language-not-supported":
              errorMessage = "Language not supported.";
              break;
            default:
              errorMessage = `Speech recognition error: ${event.error}`;
          }

          setState((prev) => ({
            ...prev,
            isListening: false,
            isProcessing: false,
            error: errorMessage,
            transcript: "",
            interimTranscript: "",
            confidence: 0,
          }));

          // Auto-clear error after 5 seconds
          timeoutRef.current = setTimeout(() => {
            setState((prev) => ({ ...prev, error: null }));
          }, 5000);
        };

        isInitializedRef.current = true;
      } catch (error) {
        console.error("Error initializing speech recognition:", error);
        setState((prev) => ({
          ...prev,
          isSupported: false,
          error: "Failed to initialize speech recognition",
        }));
      }
    } else {
      console.warn("Speech recognition not supported");
      setState((prev) => ({
        ...prev,
        isSupported: false,
        error: "Speech recognition not supported in this browser",
      }));
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.warn("Error stopping speech recognition:", error);
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onResult, continuous, interimResults, getSpeechRecognition]);

  const startListening = useCallback(async () => {
    if (!state.isSupported || state.isListening || !recognitionRef.current) {
      console.log("Cannot start listening:", {
        isSupported: state.isSupported,
        isListening: state.isListening,
        hasRecognition: !!recognitionRef.current,
      });
      return;
    }

    try {
      console.log("Requesting microphone permission...");
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");

      setState((prev) => ({ ...prev, isProcessing: true, error: null }));

      // Small delay to ensure proper state transition
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            console.log("Starting speech recognition...");
            recognitionRef.current.start();
          } catch (error) {
            console.error("Error starting speech recognition:", error);
            setState((prev) => ({
              ...prev,
              isProcessing: false,
              error: "Failed to start speech recognition",
            }));
          }
        }
      }, 100);
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: "Microphone permission required",
      }));
    }
  }, [state.isSupported, state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      try {
        console.log("Stopping speech recognition...");
        recognitionRef.current.stop();
      } catch (error) {
        console.warn("Error stopping speech recognition:", error);
        setState((prev) => ({
          ...prev,
          isListening: false,
          isProcessing: false,
        }));
      }
    }
  }, [state.isListening]);

  const toggleListening = useCallback(() => {
    console.log("Toggle listening:", { isListening: state.isListening });
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    toggleListening,
    startListening,
    stopListening,
    clearError,
  };
}
