"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bot, ImageIcon, PencilIcon, Send, Loader2, Brain } from "lucide-react"
import { MathInputHelper } from "@/components/math-input-helper"
import { ChatMessage } from "./chat-message"
import { TypingIndicator } from "./typing-indicator"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useMathInput } from "@/hooks/use-math-input"
import { DrawingCanvas } from "./drawing-canvas"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { SpeechButton } from "./speech-button"
import { SpeechProvider } from "../SpeechProvider"

interface Message {
  id: number;
  sender: "user" | "response";
  content: string;
  timestamp: string;
  type?: "feedback" | "question" | "summary" | "knowledge-gap" | "Actual-Answer";
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
  const { toast } = useToast()

  const speechRecognition = useSpeechRecognition({
    onResult: (transcript) => {
      setNewMessage(transcript)
      // Show success toast when speech is recognized
      toast({
        title: "Speech recognized",
        description: `"${transcript.substring(0, 50)}${transcript.length > 50 ? "..." : ""}"`,
        duration: 2000,
      })
    },
    continuous: true,
  })

  const { isProcessing: isProcessingMath, processImage: processMathImage } = useMathInput({
    onResult: (latex) => setNewMessage((prev) => prev + " " + latex),
  })

  // Show error toast when speech recognition fails
  useEffect(() => {
    if (speechRecognition.error) {
      toast({
        title: "Speech Recognition Error",
        description: speechRecognition.error,
        variant: "destructive",
        duration: 4000,
      })
    }
  }, [speechRecognition.error, toast])

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

    // Stop listening if currently active
    if (speechRecognition.isListening) {
      speechRecognition.stopListening()
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
      style={{ height: "calc(100vh - 224px)" }}
    >
      {/* Chat header */}
      <div className="p-3 border-b border-gray-200 bg-gray-100">
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

        {disabled && (
          <div className="text-center py-6 px-4 h-full flex items-cente">
            {/* Simplified disabled state UI */}
            <div className="max-w-sm mx-auto">
              {/* Icon and visual elements */}
              <div className="relative mb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xs">🔒</span>
                </div>
              </div>

              {/* Main message */}
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Unlock Your Learning Assistant
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                Your AI tutor is ready to help you understand concepts better!
              </p>

              {/* Simplified feature highlights */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 text-sm">💬</span>
                  <p className="text-xs text-blue-800">Ask questions & get explanations</p>
                </div>

                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <span className="text-green-600 text-sm">📝</span>
                  <p className="text-xs text-green-800">Step-by-step guidance</p>
                </div>
              </div>

              {/* Call to action */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white">
                <p className="text-xs text-blue-100 text-center">
                  Answer the quiz question to unlock your AI tutor!
                </p>
              </div>
            </div>
          </div>
        )}

        <SpeechProvider>
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="animate-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ChatMessage message={message} index={index} />
            </div>
          ))}
        </SpeechProvider>

        {/* Typing indicator */}
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

      {/* Enhanced chat input with real-time transcription */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

        {/* Real-time transcription display */}
        {speechRecognition.isListening && speechRecognition.interimTranscript && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">Listening...</span>
            </div>
            <p className="text-sm text-blue-600 italic">"{speechRecognition.interimTranscript}"</p>
            {speechRecognition.confidence > 0 && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-blue-500">Confidence:</span>
                <div className="flex-1 bg-blue-200 rounded-full h-1">
                  <div
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${speechRecognition.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-blue-500">{Math.round(speechRecognition.confidence * 100)}%</span>
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex items-center bg-white rounded-full border border-gray-300 transition-all duration-200",
            disabled && "opacity-50",
            speechRecognition.isListening && "ring-2 ring-violet-200 border-violet-300 shadow-lg",
          )}
        >
          <button
            className="p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingMath || disabled}
            title="Upload math image"
          >
            {isProcessingMath ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon size={20} />}
          </button>

          <button
            className="p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
            onClick={() => setShowDrawingCanvas(true)}
            disabled={disabled}
            title="Draw math expression"
          >
            <PencilIcon size={20} />
          </button>

          <div className="p-1">
            <SpeechButton
              isListening={speechRecognition.isListening}
              isProcessing={speechRecognition.isProcessing}
              isSupported={speechRecognition.isSupported}
              error={speechRecognition.error}
              transcript={speechRecognition.transcript}
              onToggle={speechRecognition.toggleListening}
              onClearError={speechRecognition.clearError}
              disabled={disabled}
            />
          </div>

          <MathInputHelper onInsert={insertMathSymbol} disabled={disabled} />

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              disabled
                ? "Answer the question to start chatting..."
                : speechRecognition.isListening
                  ? "Listening... Speak clearly"
                  : speechRecognition.transcript
                    ? "Speech recognized! Press Enter to send..."
                    : "Type your question or use voice input..."
            }
            className={cn(
              "flex-1 border-none focus:ring-0 py-3 px-3 text-sm bg-transparent transition-all duration-200",
              speechRecognition.isListening && "bg-violet-50 text-violet-700 placeholder-violet-400",
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={disabled}
          />

          <button
            className={cn(
              "p-3 transition-all duration-200 disabled:opacity-50",
              newMessage.trim() && !disabled ? "text-[#3373b5] hover:text-[#2a5d92] hover:scale-105" : "text-gray-400",
            )}
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || disabled}
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Enhanced status text */}
        <div className="mt-2 text-center">
          {speechRecognition.error ? (
            <p className="text-xs text-violet-500 animate-pulse">
              ❌ {speechRecognition.error} - Click microphone to retry
            </p>
          ) : speechRecognition.isListening ? (
            <p className="text-xs text-violet-500 animate-pulse">
              🎤 Listening... Speak clearly or click microphone to stop
            </p>
          ) : disabled ? (
            <p className="text-xs text-gray-500">Complete the quiz question to unlock the chat</p>
          ) : (
            <p className="text-xs text-gray-500">Upload, draw, dictate math expressions, or type your question</p>
          )}
        </div>
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
