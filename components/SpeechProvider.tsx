"use client"

import type React from "react"
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react"
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
  const mediaSourceRef = useRef<MediaSource | null>(null)
  const sourceBufferRef = useRef<SourceBuffer | null>(null)

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeAttribute("src")
      audioRef.current.load()
    }

    if (mediaSourceRef.current) {
      mediaSourceRef.current.removeEventListener("sourceopen", handleSourceOpen)
      mediaSourceRef.current = null
    }

    sourceBufferRef.current = null
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

  const handleSourceOpen = useCallback(async () => {
    try {
      const mediaSource = mediaSourceRef.current
      if (!mediaSource) return

      const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg")
      sourceBufferRef.current = sourceBuffer

      const { text, voice, contentType } = mediaSourceRef.current as any

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice,
          model: ELEVENLABS_CONFIG.DEFAULT_MODEL,
          voiceSettings:
            ELEVENLABS_CONFIG.CONTENT_VOICE_SETTINGS[
              contentType.toUpperCase() as keyof typeof ELEVENLABS_CONFIG.CONTENT_VOICE_SETTINGS
            ] || ELEVENLABS_CONFIG.VOICE_SETTINGS,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error(`TTS API error: ${response.status}`)
      }

      const reader = response.body.getReader()

      const pump = async () => {
        const { done, value } = await reader.read()
        if (done) {
          if (mediaSource.readyState === "open") {
            mediaSource.endOfStream()
          }
          return
        }

        if (!sourceBuffer.updating) {
          sourceBuffer.appendBuffer(value!)
        } else {
          sourceBuffer.addEventListener("updateend", () => {
            sourceBuffer.appendBuffer(value!)
          }, { once: true })
        }

        await pump()
      }

      await pump()
    } catch (err) {
      console.error("Error in handleSourceOpen:", err)
      cleanup()
      setIsLoading(false)
    }
  }, [cleanup])

  const speak = useCallback(
    async (id: string, text: string, voice: string = ELEVENLABS_CONFIG.DEFAULT_VOICE, contentType = "educational") => {
      try {
        cleanup()
        setIsLoading(true)

        const mediaSource = new MediaSource()
        mediaSourceRef.current = mediaSource

        ;(mediaSource as any).text = text
        ;(mediaSource as any).voice = voice
        ;(mediaSource as any).contentType = contentType

        mediaSource.addEventListener("sourceopen", handleSourceOpen)

        const audio = new Audio()
        audio.src = URL.createObjectURL(mediaSource)
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
    [cleanup, handleAudioEnd, handleAudioError, handleSourceOpen],
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
