"use client"

import { User, Bot, SquarePen, Brain } from "lucide-react"
import { MathRenderer } from "@/components/math-renderer"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { useAuth } from "../auth-provider"
import TextToSpeech from "../TextToSpeech"

interface Message {
  id: number
  sender: "user" | "response"
  content: string
  timestamp: string
  type?: "feedback" | "question" | "summary"
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
    if (isUser) return "bg-gray-50 border-gray-200"

    switch (message.type) {
      case "feedback":
        return "bg-blue-50 border-blue-200"
      case "question":
        return "bg-yellow-50 border-yellow-200"
      case "summary":
        return "bg-green-50 border-green-200 "
      default:
        return "bg-gray-50 border-gray-200"
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
      default:
        return null
    }
  }

  const getTypeLabelColor = () => {
    switch (message.type) {
      case "feedback":
        return "text-blue-600 bg-blue-100"
      case "question":
        return "text-yellow-600 bg-yellow-100"
      case "summary":
        return "text-green-600 bg-green-100"
      default:
        return null
    }
  }

  return (
    <div className="mb-0 animate-in slide-in-from-bottom-2 duration-300">
      {isUser ? (
        <div className="mb-2">
          <div className="flex items-center mb-2 relative top-4 left-[-6px]">
            {/* <div className="w-8 h-8 rounded-sm bg-amber-100 flex items-center justify-center overflow-hidden mr-2"> */}
            {/* <User className="w-5 h-5" /> */}
            <Avatar className="h-7 w-7 bg-[#1e74bb] flex items-center justify-center rounded-sm mr-2">
              <AvatarFallback className=" text-white font-bold text-xs">{userInitials}</AvatarFallback>
            </Avatar>
            {/* </div> */}
            <div className="font-medium">You</div>
            <div className="text-xs text-gray-500 ml-2">{message.timestamp}</div>
            <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <SquarePen size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          <div className={`rounded-lg text-sm whitespace-pre-wrap pl-10 py-4 pr-4 border ${getMessageStyling()}`}>
            <MathRenderer content={message.content} />
          </div>
        </div>
      ) : (
        <div className="mb-2 group">
          <div className="flex items-center mb-2 relative top-4 left-[-6px]">
            <div className="w-8 h-8 rounded-sm bg-green-200 flex items-center justify-center mr-2">
              <Bot className="w-5 h-5" />
            </div>
            <div className="font-medium">Assistant</div>
            {getTypeLabel() && (
              <span className={`text-xs  px-2 py-1 rounded-full ml-2 ${getTypeLabelColor()}`}>{getTypeLabel()}</span>
            )}
            <div className="text-xs text-gray-500 ml-2">{message.timestamp}</div>
          </div>
          <div className={`rounded-lg text-sm whitespace-pre-wrap pl-10 py-4 pr-4 border ${getMessageStyling()}`}>
            <MathRenderer content={message.content} />
          </div>
          <div key={index}>
                <TextToSpeech
                  id={index.toString()}
                  message={message.content}
                />
            </div>
        </div>
      )}
    </div>
  )
}
