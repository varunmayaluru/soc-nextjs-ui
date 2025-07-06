"use client"
import { createContext, useContext, useState, useRef, useCallback } from "react"
import type React from "react"

interface SpeechContextType {
  currentId: string | null
  isPaused: boolean
  isLoading: boolean
  speak: (id: string, text: string, voice?: string) => Promise<void>
  pause: () => void
  resume: () => void
  reset: () => void
}

const SpeechContext = createContext<SpeechContextType | null>(null)

export const SpeechProvider = ({ children }: { children: React.ReactNode }) => {
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
      audioRef.current.removeEventListener("loadstart", handleLoadStart)
      audioRef.current.removeEventListener("canplay", handleCanPlay)
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    audioRef.current = null
  }, [])

  const handleAudioEnd = useCallback(() => {
    setCurrentId(null)
    setIsPaused(false)
    setIsLoading(false)
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

  const handleLoadStart = useCallback(() => {
    setIsLoading(true)
  }, [])

  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
  }, [])

  const speak = async (id: string, text: string, voice = "JBFqnCBsd6RMkjVDRZzb") => {
    try {
      // Stop any current playback
      cleanup()
      setIsLoading(true)
      setCurrentId(id)

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate speech: ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      audioUrlRef.current = audioUrl

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      // Add event listeners
      audio.addEventListener("ended", handleAudioEnd)
      audio.addEventListener("error", handleAudioError)
      audio.addEventListener("loadstart", handleLoadStart)
      audio.addEventListener("canplay", handleCanPlay)

      // Start playing
      await audio.play()
      setIsPaused(false)
      setIsLoading(false)
    } catch (error) {
      console.error("Speech generation error:", error)
      setCurrentId(null)
      setIsPaused(false)
      setIsLoading(false)
      cleanup()
      throw error // Re-throw to handle in component
    }
  }

  const pause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setIsPaused(true)
    }
  }

  const resume = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(console.error)
      setIsPaused(false)
    }
  }

  const reset = () => {
    setCurrentId(null)
    setIsPaused(false)
    setIsLoading(false)
    cleanup()
  }

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

export const useSpeech = () => {
  const context = useContext(SpeechContext)
  if (!context) {
    throw new Error("useSpeech must be used within a SpeechProvider")
  }
  return context
}
