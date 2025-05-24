"use client"

import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="mb-6 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center mb-2 relative top-4 left-[-6px]">
        <div className="w-8 h-8 rounded-sm bg-green-200 flex items-center justify-center mr-2">
          <Bot className="w-5 h-5" />
        </div>
        <div className="font-medium">Assistant</div>
        <div className="text-xs text-gray-500 ml-2">typing...</div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg text-sm pl-10 py-4 pr-4">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <span className="text-gray-500 ml-2">Assistant is thinking...</span>
        </div>
      </div>
    </div>
  )
}
