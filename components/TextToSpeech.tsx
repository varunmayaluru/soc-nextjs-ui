"use client"

import { useEffect, useState } from "react"
import { useSpeech } from "./SpeechProvider"
import { Play, Pause, RotateCcw, Loader2 } from "lucide-react"
import { secureApi } from "@/lib/secure-api-client"
import { ELEVENLABS_CONFIG } from "@/lib/config"

interface Props {
  id: string
  message: string
  voice?: string // ElevenLabs voice ID
  contentType?: "educational" | "conversational" | "formal"
}

export default function TextToSpeech({
  id,
  message,
  voice = ELEVENLABS_CONFIG.DEFAULT_VOICE,
  contentType = "educational",
}: Props) {
  const { currentId, isPaused, isLoading, speak, pause, resume, reset } = useSpeech()

  const [processedMessage, setProcessedMessage] = useState(message)
  const [error, setError] = useState<string | null>(null)

  const isCurrent = currentId === id
  const isPlaying = isCurrent && !isPaused && !isLoading
  const isPausedCurrent = isCurrent && isPaused
  const isLoadingCurrent = isCurrent && isLoading

  const voiceInfo = Object.values(ELEVENLABS_CONFIG.ALL_VOICES).find((v) => v.id === voice)
  const voiceLabel = voiceInfo?.name ?? "Default"

  useEffect(() => {
    const convertLatexToSpeech = async () => {
      const latexRegex = /\$.*?\$|\$\$.*?\$\$/ // Matches inline and block LaTeX

      if (!latexRegex.test(message)) {
        setProcessedMessage(message)
        return
      }

      try {
        const { data, ok } = await secureApi.post<any>("/genai/latex-to-speech/convert", {
          input_statement: message,
          model: "gpt-4o",
        })

        setProcessedMessage(ok && data?.spoken_string ? data.spoken_string : message)
      } catch (err) {
        console.error("LaTeX conversion error:", err)
        setProcessedMessage(message)
      }
    }

    convertLatexToSpeech()
  }, [message])

  const handlePlayPause = async () => {
    try {
      setError(null)

      if (isPlaying) {
        pause()
      } else if (isPausedCurrent) {
        resume()
      } else {
        await speak(id, processedMessage, voice)
      }
    } catch (err) {
      console.error("TTS playback error:", err)
      setError("Failed to play audio. Please try again.")
    }
  }

  const handleReset = () => {
    if (isCurrent) {
      setError(null)
      reset()
    }
  }

  return (
    <div className="flex gap-1 items-center">
      <button
        onClick={handlePlayPause}
        disabled={isLoadingCurrent}
        className={`p-1.5 rounded-full transition-colors ${
          isCurrent ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        } ${isLoadingCurrent ? "opacity-50 cursor-not-allowed" : ""}`}
        title={`${isLoadingCurrent ? "Loading..." : isPlaying ? "Pause" : isPausedCurrent ? "Resume" : "Play"} (${voiceLabel})`}
        aria-label="Play or pause TTS"
      >
        {isLoadingCurrent ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={14} />
        ) : (
          <Play size={14} />
        )}
      </button>

      <button
        onClick={handleReset}
        disabled={!isCurrent}
        className={`p-1.5 rounded-full transition-colors ${
          isCurrent ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500"
        }`}
        title="Reset"
        aria-label="Reset TTS"
      >
        <RotateCcw size={14} />
      </button>

      {error && (
        <span className="text-xs text-red-500 ml-2" title={error}>
          ⚠️
        </span>
      )}
    </div>
  )
}
