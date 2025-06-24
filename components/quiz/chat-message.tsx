"use client"

import { User, Bot, SquarePen, Brain, MessageCircle, Crown, GraduationCap } from "lucide-react"
import { MathRenderer } from "@/components/math-renderer"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { useAuth } from "../auth-provider"
import TextToSpeech from "../TextToSpeech"

interface Message {
  id: number;
  sender: "user" | "response";
  content: string;
  timestamp: string;
  type?: "feedback" | "question" | "summary" | "knowledge-gap" | "Actual-Answer";
}

interface ChatMessageProps {
  message: Message
  index: number
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.sender === "user"
  const isBot = message.sender === "response"
  const { userInfo, logout } = useAuth()

  // Get the user's name, fallback to "User" if not available
  const userName = userInfo?.first_name + " " + userInfo?.last_name || "User"
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Get message styling based on type
  const getMessageStyling = () => {
    if (isUser) return "bg-[#1e74bb] text-white border-[#1e74bb] shadow-md"

    switch (message.type) {
      case "feedback":
        return "bg-blue-50 border-blue-200 shadow-sm"
      case "question":
        return "bg-amber-50 border-amber-200 shadow-sm"
      case "summary":
        return "bg-green-50 border-green-200 shadow-sm"
      case "knowledge-gap":
        return "bg-purple-50 border-purple-200 shadow-sm"
      default:
        return "bg-white border-gray-200 shadow-sm"
    }
  }

  const getTypeLabel = () => {
    switch (message.type) {
      case "feedback":
        return "Feedback"
      case "question":
        return "Question"
      case "summary":
        return "Summary"
      case "knowledge-gap":
        return "Knowledge Gap"
      default:
        return null
    }
  }

  const getTypeLabelColor = () => {
    switch (message.type) {
      case "feedback":
        return "text-blue-700 bg-blue-100 border-blue-200"
      case "question":
        return "text-amber-700 bg-amber-100 border-amber-200"
      case "summary":
        return "text-green-700 bg-green-100 border-green-200"
      case "knowledge-gap":
        return "text-purple-700 bg-purple-100 border-purple-200"
      default:
        return null
    }
  }

  const getTypeIcon = () => {
    switch (message.type) {
      case "feedback":
        return "💡"
      case "question":
        return "❓"
      case "summary":
        return "📝"
      case "knowledge-gap":
        return "🎯"
      default:
        return "🤖"
    }
  }

  return (
    <div className="mb-4 animate-in slide-in-from-bottom-2 duration-300">
      {isUser ? (
        <div className="flex justify-start">
          <div className="max-w-[85%] flex items-start space-x-3">
            {/* Enhanced User Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e74bb] to-[#2a5d92] flex items-center justify-center shadow-md border-2 border-white">
                  <span className="text-white font-bold text-sm">{userInitials}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* User Message Content */}
            <div className="flex-1">
              {/* User message header */}
              <div className="flex items-center mb-2">
                <div className="font-semibold text-sm text-gray-800 mr-2">{userName}</div>
                <div className="text-xs text-gray-500">{message.timestamp}</div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Crown className="w-3 h-3 mr-1" />
                    Student
                  </span>
                </div>
              </div>

              {/* User message content */}
              <div className={`rounded-lg text-sm whitespace-pre-wrap py-4 pl-4 pr-24  border ${getMessageStyling()} hover:shadow-lg transition-all duration-200 relative`}>
                <MathRenderer content={message.content} />

                {/* Text-to-speech for user messages */}
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-white/20">
                    <TextToSpeech
                      id={`user-${index}`}
                      message={message.content}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="max-w-[85%] flex items-start space-x-3">
            {/* Enhanced Learning Assistant Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md border-2 border-white">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Brain className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>

            {/* Bot Message Content */}
            <div className="flex-1">
              {/* Bot message header */}
              <div className="flex items-center mb-2">
                <div className="font-semibold text-sm text-gray-800 mr-2">Learning Assistant</div>
                {getTypeLabel() && (
                  <span className={`text-xs px-2 py-1 rounded-full border ${getTypeLabelColor()} flex items-center space-x-1`}>
                    <span>{getTypeIcon()}</span>
                    <span>{getTypeLabel()}</span>
                  </span>
                )}
                <div className="text-xs text-gray-500 ml-auto">{message.timestamp}</div>
              </div>

              {/* Bot message content */}
              <div className={`rounded-lg text-sm whitespace-pre-wrap py-4 pl-4 pr-24 border ${getMessageStyling()} hover:shadow-md transition-all duration-200 relative`}>
                {/* Message type indicator */}
                {/* {message.type && (
                  // <div className="absolute -top-2 left-4 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                  //   <span className="text-xs text-gray-600 font-medium">{getTypeLabel()}</span> 
                  // </div>
                )} */}

                <MathRenderer content={message.content} />

                {/* Text-to-speech button positioned at right end */}
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-gray-200/50">
                    <TextToSpeech
                      id={`assistant-${index}`}
                      message={message.content}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
