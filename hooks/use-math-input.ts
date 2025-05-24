"use client"

import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

interface UseMathInputProps {
  onResult: (latex: string) => void
}

export function useMathInput({ onResult }: UseMathInputProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const processImage = useCallback(
    async (file: File) => {
      setIsProcessing(true)

      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/mathpix", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to process math image")
        }

        if (data.latex) {
          onResult(data.latex)
          toast({
            title: "Math expression processed!",
            description: "The mathematical content has been added to your message.",
          })
        } else {
          toast({
            title: "No math detected",
            description: "No mathematical content was found in the image.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error processing math image:", error)
        toast({
          title: "Processing failed",
          description: error instanceof Error ? error.message : "Failed to process the math image. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [onResult],
  )

  return {
    isProcessing,
    processImage,
  }
}
