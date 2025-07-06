"use client"

import { useEffect, useState } from "react"
import { useSpeech } from "./SpeechProvider"
import { Play, Pause, RotateCcw, Loader2 } from "lucide-react"
import { secureApi } from "@/lib/secure-api-client"

interface Props {
  id: string
  message: string
  voice?: string // ElevenLabs voice ID
}

export default function TextToSpeech({ id, message, voice = "JBFqnCBsd6RMkjVDRZzb" }: Props) {
  const { currentId, isPaused, isLoading, speak, pause, resume, reset } = useSpeech()
  const [processedMessage, setProcessedMessage] = useState(message)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processMessage = async () => {
      if (/\$.*?\$|\$\$.*?\$\$/.test(message)) {
        // Contains LaTeX
        try {
          const payload = {
            input_statement: message,
            model: "gpt-4o",
          }

          const response = await secureApi.post<any>("/genai/latex-to-speech/convert", payload)

          if (response.ok && response.data) {
            setProcessedMessage(response.data.spoken_string || message)
          } else {
            setProcessedMessage(message) // fallback
          }
        } catch (error) {
          console.error("Error converting LaTeX to speech:", error)
          setProcessedMessage(message) // fallback
        }
      } else {
        setProcessedMessage(message)
      }
    }

    processMessage()
  }, [message])

  const isCurrent = currentId === id
  const isPlaying = isCurrent && !isPaused && !isLoading
  const isPausedCurrent = isCurrent && isPaused
  const isLoadingCurrent = isCurrent && isLoading

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
    } catch (error) {
      console.error("TTS error:", error)
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
        title={isLoadingCurrent ? "Loading..." : isPlaying ? "Pause" : isPausedCurrent ? "Resume" : "Play"}
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
        className={`p-1.5 rounded-full transition-colors ${
          isCurrent ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500"
        }`}
        disabled={!isCurrent}
        title="Reset"
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
