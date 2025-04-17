"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex flex-col items-center">
          <div className="mb-6 w-64 h-64 relative">
            <Image
              src="/collaborative-success.png"
              alt="Success"
              width={256}
              height={256}
              className="object-contain animate-pulse"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <div className="bg-green-500 rounded-full p-3 shadow-lg animate-bounce">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Your Exam Was Successfully Registered!
          </h2>
          <p className="text-gray-600 mb-6 text-center">We are Calculating Your Exam Results</p>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
