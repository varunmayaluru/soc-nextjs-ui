"use client"

import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"

type SuccessModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer)
            setTimeout(() => {
              onClose()
            }, 1000)
            return 100
          }
          return prevProgress + 2
        })
      }, 100)

      return () => {
        clearInterval(timer)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <div className="bg-green-500 rounded-full p-3">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center">Your Exam Was Successfully Registered!</h2>
          <p className="text-gray-600 mb-6 text-center">We are Calculating Your Exam Results</p>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
