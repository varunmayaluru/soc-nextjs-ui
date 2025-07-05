"use client"

import type React from "react"
import { useState, useEffect } from "react"
// @ts-ignore: No types for 'react-speech-recognition'
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SpeechToTextInputProps {
  onTranscriptChange: (transcript: string) => void
  placeholder?: string
  resetRef?: React.MutableRefObject<() => void>
  disabled?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
  onListeningChange?: (listening: boolean) => void
}

const SpeechToTextInput: React.FC<SpeechToTextInputProps> = ({
  onTranscriptChange,
  placeholder = "Type your message or click the mic to speak...",
  resetRef,
  disabled = false,
  variant = "outline",
  className = "",
  onListeningChange,
}) => {
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition, isMicrophoneAvailable } =
    useSpeechRecognition()

  useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript)
    }
  }, [transcript, onTranscriptChange])

  useEffect(() => {
    if (resetRef) {
      resetRef.current = resetTranscript
    }
  }, [resetRef, resetTranscript])

  useEffect(() => {
    if (onListeningChange) onListeningChange(listening)
  }, [listening, onListeningChange])

  const toggleListening = async () => {
    if (disabled) return
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.")
      return
    }

    if (!isMicrophoneAvailable) {
      alert("Microphone permission is required for speech recognition.")
      return
    }

    if (listening) {
      SpeechRecognition.stopListening()
      setIsListening(false)
    } else {
      setIsLoading(true)
      resetTranscript()
      try {
        await SpeechRecognition.startListening({ continuous: true })
        setIsListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        alert("Failed to start speech recognition. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <Button variant="outline" size="icon" disabled title="Speech recognition is not supported in your browser">
        <MicOff className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleListening}
      className={cn(listening ? "text-red-500" : "", className)}
      disabled={isLoading || disabled}
      style={disabled ? { opacity: 0.5, pointerEvents: "none" } : {}}
      title={listening ? "Stop listening" : "Start speech recognition"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : listening ? (
        <Mic className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  )
}

export default SpeechToTextInput
