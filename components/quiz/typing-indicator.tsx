"use client"

import { Bot, GraduationCap, Brain } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="mb-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-start">
        <div className="max-w-[85%] flex items-start space-x-3">
          {/* Enhanced Learning Assistant Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md border-2 border-white">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <Brain className="w-2 h-2 text-white" />
              </div>
            </div>
          </div>

          {/* Typing Indicator Content */}
          <div className="flex-1">
            {/* Bot message header */}
            <div className="flex items-center mb-2">
              <div className="font-semibold text-sm text-gray-800 mr-2">Learning Assistant</div>
              <span className="text-xs px-2 py-1 rounded-full border text-blue-700 bg-blue-100 border-blue-200 flex items-center space-x-1">
                <span>🤖</span>
                <span>Typing</span>
              </span>
            </div>

            {/* Typing indicator content */}
            <div className="rounded-lg text-sm py-4 pl-4 pr-20 border bg-white border-gray-200 shadow-sm relative">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className="text-gray-600 font-medium">Assistant is thinking...</span>
              </div>

              {/* Subtle pulse effect on the entire message */}
              <div className="absolute inset-0 bg-blue-50/30 rounded-lg animate-pulse pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
