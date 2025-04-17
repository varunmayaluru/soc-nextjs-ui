"use client"

import { useState } from "react"
import Image from "next/image"
import { Send } from "lucide-react"

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
      content: `Here are three different versions of 404 error messages for an ecommerce clothing website:

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
          <div key={message.id} className="flex mb-4">
            {message.sender === "assistant" ? (
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 mr-2 overflow-hidden">
                  <Image src="/helpful-robot.png" alt="Assistant" width={32} height={32} />
                </div>
                <div className="max-w-[85%]">
                  <div className="font-medium text-sm">
                    Response <span className="text-xs text-gray-500 font-normal">{message.timestamp}</span>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg mt-1 text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className="flex mt-2 space-x-2">
                    <button className="bg-gray-200 text-xs px-2 py-1 rounded-full">👍</button>
                    <button className="bg-gray-200 text-xs px-2 py-1 rounded-full">👎</button>
                    <button className="bg-blue-100 text-xs px-2 py-1 rounded-full text-blue-700">
                      Generate Response
                    </button>
                    <button className="bg-blue-100 text-xs px-2 py-1 rounded-full text-blue-700">Copy</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex-shrink-0 mr-2 overflow-hidden">
                  <Image src="/diverse-group-city.png" alt="User" width={32} height={32} />
                </div>
                <div className="max-w-[85%]">
                  <div className="font-medium text-sm">
                    You <span className="text-xs text-gray-500 font-normal">{message.timestamp}</span>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg mt-1 text-sm">{message.content}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type message..."
            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1e74bb]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#1e74bb]"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
