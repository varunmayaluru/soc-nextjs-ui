"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useCallback } from "react"
import { ELEVENLABS_CONFIG } from "@/lib/config"

interface SpeechContextType {
  currentId: string | null
  isPaused: boolean
  isLoading: boolean
  speak: (id: string, text: string, voice?: string, contentType?: string) => Promise<void>
  pause: () => void
  resume: () => void
  reset: () => void
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined)

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeEventListener("ended", handleAudioEnd)
      audioRef.current.removeEventListener("error", handleAudioError)
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }, [])

  const handleAudioEnd = useCallback(() => {
    setCurrentId(null)
    setIsPaused(false)
    cleanup()
  }, [cleanup])

  const handleAudioError = useCallback(
    (error: Event) => {
      console.error("Audio playback error:", error)
      setCurrentId(null)
      setIsPaused(false)
      setIsLoading(false)
      cleanup()
    },
    [cleanup],
  )

  const speak = useCallback(
    async (id: string, text: string, voice: string = ELEVENLABS_CONFIG.DEFAULT_VOICE, contentType = "educational") => {
      try {
        setIsLoading(true)
        cleanup() // Clean up any existing audio

        // Get voice settings based on content type
        const voiceSettings =
          ELEVENLABS_CONFIG.CONTENT_VOICE_SETTINGS[
            contentType.toUpperCase() as keyof typeof ELEVENLABS_CONFIG.CONTENT_VOICE_SETTINGS
          ] || ELEVENLABS_CONFIG.VOICE_SETTINGS

        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voice,
            model: ELEVENLABS_CONFIG.DEFAULT_MODEL,
            voiceSettings,
          }),
        })

        if (!response.ok) {
          throw new Error(`TTS API error: ${response.status}`)
        }

        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        audioUrlRef.current = audioUrl

        const audio = new Audio(audioUrl)
        audioRef.current = audio

        audio.addEventListener("ended", handleAudioEnd)
        audio.addEventListener("error", handleAudioError)

        await audio.play()

        setCurrentId(id)
        setIsPaused(false)
        setIsLoading(false)
      } catch (error) {
        console.error("Speech synthesis error:", error)
        setIsLoading(false)
        cleanup()
        throw error
      }
    },
    [cleanup, handleAudioEnd, handleAudioError],
  )

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setIsPaused(true)
    }
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play()
      setIsPaused(false)
    }
  }, [])

  const reset = useCallback(() => {
    setCurrentId(null)
    setIsPaused(false)
    setIsLoading(false)
    cleanup()
  }, [cleanup])

  return (
    <SpeechContext.Provider
      value={{
        currentId,
        isPaused,
        isLoading,
        speak,
        pause,
        resume,
        reset,
      }}
    >
      {children}
    </SpeechContext.Provider>
  )
}

export function useSpeech() {
  const context = useContext(SpeechContext)
  if (context === undefined) {
    throw new Error("useSpeech must be used within a SpeechProvider")
  }
  return context
}
