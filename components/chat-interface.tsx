"use client"

import { Bot, User } from "lucide-react"
import { useState } from "react"

type Message = {
  id: number
  sender: "user" | "assistant"
  content: string
  timestamp: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "user",
      content: "you're a UX writer now. Generate 3 versions of 404 error messages for a ecommerce clothing website.",
      timestamp: "1 min ago",
    },
    {
      id: 2,
      sender: "assistant",
      content: `Sure! Here are three different versions of 404 error messages for an ecommerce clothing website:

1. Uh-oh! It looks like the page you're looking for isn't here. Please check the URL and try again or return to the homepage to continue shopping.

2. Whoops! We can't seem to find the page you're looking for. Please double-check the URL or use our search to find what you need. You can also browse our collection of stylish clothes and accessories.

3. Sorry, the page you're trying to access isn't available. It's possible that the item has sold out or the page has moved. Please try our search function or return to browsing.`,
      timestamp: "Just now",
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message: Message = {
      id: messages.length + 1,
      sender: "user",
      content: newMessage,
      timestamp: "Just now",
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate assistant response
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        sender: "assistant",
        content: "I'm processing your request. Please wait a moment...",
        timestamp: "Just now",
      }

      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-300px)]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-6">
            {message.sender === "assistant" ? (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <Bot />
                  </div>
                  <div className="font-medium">Response</div>
                  <div className="text-xs text-gray-500 ml-2">{message.timestamp}</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 overflow-hidden mr-2">
                    <User />
                  </div>
                  <div className="font-medium">You</div>
                  <div className="text-xs text-gray-500 ml-2">{message.timestamp}</div>
                  <button className="ml-auto">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7 17L17 7M7 7L17 17"
                        stroke="#CCCCCC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-sm">{message.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center bg-white rounded-full border border-gray-300">
          <button className="p-3 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 19L17.5 17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="p-3 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 8L12 3L7 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 border-none focus:ring-0 py-3 px-3 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <button className="p-3 text-gray-400 hover:text-blue-500" onClick={handleSendMessage}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 2L11 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
