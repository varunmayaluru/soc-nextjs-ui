"use client"

import { useState, useCallback } from "react"
import { secureApi } from "@/lib/secure-api-client"

interface UseMathInputProps {
  onResult: (latex: string) => void
}

interface MathpixResponse {
  latex: string
  text: string
  confidence: number
}

export function useSecureMathInput({ onResult }: UseMathInputProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processImage = useCallback(
    async (file: File) => {
      if (!file) return

      setIsProcessing(true)
      setError(null)

      try {
        // Create FormData for the image
        const formData = new FormData()
        formData.append("file", file)

        // Use secure API for math processing
        const response = await secureApi.post<MathpixResponse>(
          "/mathpix",
          formData,
          {
            headers: {
              // Remove Content-Type to let browser set it with boundary
            },
          },
          true, // Enable encryption
        )

        if (response.ok && response.data.latex) {
          onResult(response.data.latex)
        } else {
          throw new Error("No mathematical content detected")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to process math image"
        setError(errorMessage)
        console.error("Math processing error:", err)
      } finally {
        setIsProcessing(false)
      }
    },
    [onResult],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    processImage,
    isProcessing,
    error,
    clearError,
  }
}
