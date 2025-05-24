"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bot, ImageIcon, PencilIcon, Mic, MicOff, Send, Loader2 } from "lucide-react"
import { MathInputHelper } from "@/components/math-input-helper"
import { ChatMessage } from "./chat-message"
import { TypingIndicator } from "./typing-indicator"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useMathInput } from "@/hooks/use-math-input"
import { DrawingCanvas } from "./drawing-canvas"

interface Message {
  id: number
  sender: "user" | "response"
  content: string
  timestamp: string
  type?: "feedback" | "question" | "summary"
}

interface ChatPanelProps {
  messages: Message[]
  isTyping: boolean
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatPanel({ messages, isTyping, onSendMessage, disabled = false }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false)
  const [isUserNearBottom, setIsUserNearBottom] = useState(true)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const {
    isListening,
    isSupported: speechSupported,
    toggleListening,
  } = useSpeechRecognition({
    onResult: (transcript) => setNewMessage(transcript),
    continuous: true,
  })

  const { isProcessing: isProcessingMath, processImage: processMathImage } = useMathInput({
    onResult: (latex) => setNewMessage((prev) => prev + " " + latex),
  })

  // Auto-scroll functionality
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      })
    }
  }

  // Check if user is near bottom of chat
  const checkIfNearBottom = () => {
    if (!messagesContainerRef.current) return true

    const container = messagesContainerRef.current
    const threshold = 100 // pixels from bottom
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold

    setIsUserNearBottom(isNearBottom)
    return isNearBottom
  }

  // Handle scroll events to detect user position
  const handleScroll = () => {
    checkIfNearBottom()
  }

  // Auto-scroll when messages change
  useEffect(() => {
    if (shouldAutoScroll && isUserNearBottom) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        scrollToBottom(true)
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [messages, isTyping, shouldAutoScroll, isUserNearBottom])

  // Auto-scroll when new message is sent by user
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender === "user") {
        // Always scroll when user sends a message
        setShouldAutoScroll(true)
        scrollToBottom(true)
      }
    }
  }, [messages])

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom(false)
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim() || disabled) return

    if (isListening) {
      toggleListening()
    }

    // Ensure we scroll when user sends message
    setShouldAutoScroll(true)
    onSendMessage(newMessage)
    setNewMessage("")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processMathImage(file)
    }
  }

  const insertMathSymbol = (symbol: string) => {
    setNewMessage((prev) => prev + symbol)
  }

  return (
    <div
      className="bg-white border-l border-gray-200 flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 250px)" }}
    >
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800">Learning Assistant</h3>
        <p className="text-sm text-gray-600">
          {disabled ? "Answer the question to start learning" : "Ask questions to understand the concept better"}
        </p>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        onScroll={handleScroll}
      >
        {messages.length === 0 && !disabled && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>I'm here to help you understand the concepts better.</p>
            <p className="text-sm mt-2">Answer the question incorrectly to start our conversation!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className="animate-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ChatMessage message={message} />
          </div>
        ))}

        {isTyping && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <TypingIndicator />
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Scroll to bottom button (appears when user scrolls up) */}
      {!isUserNearBottom && messages.length > 0 && (
        <div className="absolute bottom-20 right-8 z-10">
          <button
            onClick={() => {
              setShouldAutoScroll(true)
              scrollToBottom(true)
            }}
            className="bg-[#3373b5] hover:bg-[#2a5d92] text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
            title="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

        <div
          className={`flex items-center bg-white rounded-full border border-gray-300 transition-opacity ${disabled ? "opacity-50" : ""
            }`}
        >
          <button
            className="p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingMath || disabled}
            title="Upload math image"
          >
            {isProcessingMath ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon size={20} />}
          </button>

          <button
            className="p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            onClick={() => setShowDrawingCanvas(true)}
            disabled={disabled}
            title="Draw math expression"
          >
            <PencilIcon size={20} />
          </button>

          {speechSupported && (
            <button
              className={`p-3 transition-colors disabled:opacity-50 ${isListening ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"
                }`}
              onClick={toggleListening}
              disabled={disabled}
              title={isListening ? "Stop recording" : "Start recording"}
            >
              {isListening ? (
                <div className="relative">
                  <MicOff size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </div>
              ) : (
                <Mic size={20} />
              )}
            </button>
          )}

          <MathInputHelper onInsert={insertMathSymbol} disabled={disabled} />

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              disabled
                ? "Answer the question to start chatting..."
                : isListening
                  ? "Listening..."
                  : "Type your question or use math symbols..."
            }
            className={`flex-1 border-none focus:ring-0 py-3 px-3 text-sm bg-transparent ${isListening ? "bg-red-50" : ""
              }`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={disabled}
          />

          <button
            className={`p-3 transition-colors disabled:opacity-50 ${newMessage.trim() && !disabled ? "text-[#3373b5] hover:text-[#2a5d92]" : "text-gray-400"
              }`}
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || disabled}
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          {disabled
            ? "Complete the quiz question to unlock the chat"
            : isListening
              ? "Speak clearly... Click the microphone again to stop."
              : "Upload, draw, or dictate math expressions"}
        </p>
      </div>

      {showDrawingCanvas && (
        <DrawingCanvas
          onClose={() => setShowDrawingCanvas(false)}
          onSave={(imageData) => {
            // Convert canvas data to blob and process with Mathpix
            fetch(imageData)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], "drawing.png", { type: "image/png" })
                processMathImage(file)
              })
            setShowDrawingCanvas(false)
          }}
        />
      )}
    </div>
  )
}
