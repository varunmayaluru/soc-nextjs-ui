"use client"
import { Mic, MicOff, Square, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SpeechButtonProps {
    isListening: boolean
    isProcessing: boolean
    isSupported: boolean
    error: string | null
    transcript: string
    onToggle: () => void
    onClearError: () => void
    disabled?: boolean
}

export function SpeechButton({
    isListening,
    isProcessing,
    isSupported,
    error,
    transcript,
    onToggle,
    onClearError,
    disabled = false,
}: SpeechButtonProps) {
    if (!isSupported) {
        return (
            <Button variant="ghost" size="sm" disabled className="text-gray-400" title="Speech recognition not supported">
                <MicOff className="h-4 w-4" />
            </Button>
        )
    }

    const handleClick = () => {
        console.log("Speech button clicked:", { error, isListening, isProcessing })
        if (error) {
            onClearError()
        } else {
            onToggle()
        }
    }

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleClick}
                disabled={disabled || isProcessing}
                className={cn(
                    "relative transition-all duration-200 hover:bg-gray-100",
                    isListening && "text-violet-500 bg-violet-50 hover:bg-violet-100",
                    error && "text-violet-500 bg-violet-50",
                    disabled && "opacity-50 cursor-not-allowed",
                )}
                title={
                    error
                        ? "Click to retry"
                        : isListening
                            ? "Stop recording"
                            : isProcessing
                                ? "Processing..."
                                : "Start voice input"
                }
            >
                {/* Icon */}
                {isProcessing ? (
                    <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : error ? (
                    <AlertCircle className="h-4 w-4" />
                ) : isListening ? (
                    <Square className="h-3 w-3" />
                ) : (
                    <Mic className="h-4 w-4" />
                )}
            </Button>

            {/* Recording indicator dot */}
            {isListening && <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full animate-pulse" />}
        </div>
    )
}
