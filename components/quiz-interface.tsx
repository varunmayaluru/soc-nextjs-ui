"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal, Search, ChevronLeft, ChevronRight, X, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import SuccessModal from "./success-modal"

type Topic = {
  id: string
  title: string
  icon: string
  time: string
  preview: string
}

type Message = {
  id: number
  sender: "user" | "assistant"
  content: string
  timestamp: string
}

type QuizOption = {
  id: number
  text: string
  isCorrect: boolean
}

type QuizInterfaceProps = {
  quiz: any
  breadcrumb: {
    subject: string
    category: string
    topic: string
  }
}

export default function QuizInterface({ quiz, breadcrumb }: QuizInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      content:
        "I noticed you selected an incorrect answer. The correct way to simplify this expression is to combine like terms: 3x - x = 2x and 5 + 2 = 7, giving us 2x + 7.",
      timestamp: "Just now",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const chatSectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // First, add a new state to track the selected topic
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  // Options with correct/incorrect flags
  const quizOptions: QuizOption[] = [
    { id: 0, text: "Identify variables, constants, and coefficients", isCorrect: true },
    { id: 1, text: "Simplify expressions like 3x + 5 - x + 2.", isCorrect: false },
    { id: 2, text: "Solve equations like 2y + 5 = 11.", isCorrect: true },
    { id: 3, text: "Translate word problems into simple algebraic", isCorrect: true },
  ]

  // Update the topics data to include more complete content for each topic
  const topics: Topic[] = [
    {
      id: "cosmic-evolution",
      title: "Cosmic Evolution",
      icon: "🌟",
      time: "7:34 PM",
      preview:
        "Some 15 billion years ago the universe emerged from a hot, dense sea of matter and energy. As the cosmos expanded and cooled, the simplest elements formed, and then gravity gradually pulled matter together into galaxies, stars, and planets.\n\nThis process of cosmic evolution has led to the formation of hundreds of billions of galaxies, each containing hundreds of billions of stars. Our own star, the Sun, formed about 5 billion years ago, and its planets, including Earth, formed soon after.\n\nCosmic evolution is the scientific story of the universe's journey from the Big Bang to the formation of complex structures like galaxies, stars, and planets.",
    },
    {
      id: "warning-messages",
      title: "Warning Messages Samples",
      icon: "⚠️",
      time: "Wed",
      preview:
        "Here are three different versions of 404 error messages for an ecommerce clothing website:\n\n1. Uh-oh! It looks like the page you're looking for isn't here. Please check the URL and try again or return to the homepage to continue shopping.\n\n2. Whoops! We can't seem to find the page you're looking for. Please double-check the URL or use our search to find what you need. You can also browse our collection of stylish clothes and accessories.\n\n3. Sorry, the page you're trying to access isn't available. It's possible that the item has sold out or the page has moved. Please try our search function or return to browsing.",
    },
    {
      id: "competitive-analysis",
      title: "Competitive Analysis research",
      icon: "📊",
      time: "Thu",
      preview:
        "A competitive analysis of restaurant delivery mobile applications reveals key insights into market leaders and potential opportunities for differentiation.\n\nThe major players (UberEats, DoorDash, GrubHub) all offer similar core features: restaurant browsing, menu viewing, ordering, payment processing, and delivery tracking. However, they differ in their user experience, fee structures, and special features.\n\nUberEats leverages its existing driver network and familiar interface. DoorDash focuses on suburban areas and exclusive partnerships. GrubHub emphasizes restaurant variety and loyalty programs.\n\nOpportunities for new entrants include: more transparent pricing, better filtering options for dietary restrictions, improved customer service, and more accurate delivery time estimates.",
    },
    {
      id: "user-personas",
      title: "User Personas Research",
      icon: "👤",
      time: "Mon",
      preview:
        "User persona research is a process of creating fictional but realistic representations of your target customers based on data and research. These personas help teams understand the needs, behaviors, motivations, and limitations of the users they're designing for.\n\nEffective user personas typically include:\n\n1. Demographic information (name, age, location, job, etc.)\n2. Goals and motivations\n3. Pain points and frustrations\n4. Behaviors and preferences\n5. A quote that captures their essence\n6. A photo or avatar\n\nPersonas should be based on real user research like interviews, surveys, and analytics data - not assumptions. They should be shared across teams to ensure everyone understands who they're building for.",
    },
    {
      id: "call-to-action",
      title: "Call To Action texts",
      icon: "📢",
      time: "17:20",
      preview:
        'Here are a few examples of CTA button text:\n\n1. "Get started now" - Creates urgency and encourages immediate action\n2. "Join for free" - Emphasizes no-risk engagement\n3. "See pricing" - Direct and transparent for price-conscious users\n4. "Try it risk-free" - Reduces perceived risk\n5. "Request a demo" - Focused on showing value before commitment\n6. "Get the free ebook" - Offers immediate value\n7. "Add to cart" - Clear shopping action\n8. "Subscribe" - Simple commitment for newsletters\n9. "Learn more" - Low commitment for information seeking\n10. "Start your free trial" - Combines free with immediate action\n\nEffective CTAs are action-oriented, create urgency, address objections, and clearly communicate value.',
    },
    {
      id: "video-script",
      title: "Video Script Intros",
      icon: "🎬",
      time: "10:01",
      preview:
        "Hi, I'm [insert name here], and I'm on my way to Prague, one of the most beautiful cities in Europe. As I journey through this historic capital, I'll be sharing with you the stunning architecture, delicious food, and rich cultural experiences that make Prague a must-visit destination.\n\nAlternative intro:\n\nThe cobblestone streets of Prague have witnessed centuries of history, from kings and revolutions to artists and dreamers. Today, we're exploring this magical city, discovering hidden gems and famous landmarks that make Prague truly special. Join me as we wander through time in the heart of Czechia.",
    },
    {
      id: "ux-banana",
      title: "UX of a Banana",
      icon: "🍌",
      time: "21 Aug",
      preview:
        "A humorous breakdown of why bananas have perfect UX design:\n\n1. Intuitive User Interface: The curved shape naturally fits the human hand and indicates how to hold it.\n\n2. Color-Coded System Status: Clear visual feedback about ripeness - green (not ready), yellow (ready), brown (overripe).\n\n3. Error Prevention: The thick skin prevents accidental access to the contents.\n\n4. Consistent Standards: All bananas follow the same design pattern, creating familiarity.\n\n5. Efficient Use: The peel provides a clean handle that keeps hands free from the edible portion.\n\n6. Aesthetic & Minimalist Design: Simple form with no unnecessary elements.\n\n7. Built-in Progress Indicator: The peel can be gradually pulled down to reveal more content as needed.",
    },
  ]

  // Then add a function to handle clicking on a topic
  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic)
  }

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Scroll to chat section when it appears
  useEffect(() => {
    if (showChat && chatSectionRef.current) {
      setTimeout(() => {
        chatSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [showChat])

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index)

    // Show chat only if the selected option is incorrect
    const selectedQuizOption = quizOptions.find((option) => option.id === index)
    if (selectedQuizOption && !selectedQuizOption.isCorrect) {
      setShowChat(true)
    } else {
      setShowChat(false)
    }
  }

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
        content:
          "Let me explain this concept further. When simplifying algebraic expressions, we need to combine like terms. In the expression '3x + 5 - x + 2', the like terms are '3x' and '-x', which combine to '2x'. The constants '5' and '2' combine to '7'. So the final simplified expression is '2x + 7'.",
        timestamp: "Just now",
      }

      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const handleSubmit = () => {
    setShowSuccessModal(true)
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    // Navigate to results page using the correct IDs from the data
    const topicId = quiz.topicId || "arithmetic-number-sense" // Fallback to a default if not available
    router.push(`/subjects/${quiz.subjectId}/${topicId}/${quiz.id}/results`)
  }

  return (
    <div className="flex h-[calc(100vh-160px)]">
      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />

      {/* Left side - Quiz content with scrolling */}
      <div className="w-full md:w-8/12 p-6 overflow-y-auto">
        {/* Question navigation */}
        <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-sm p-2 sticky top-0 z-10">
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md">
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex overflow-x-auto hide-scrollbar space-x-1">
            {Array.from({ length: 20 }, (_, i) => (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                  i + 1 === currentPage
                    ? "bg-[#1e74bb] text-white"
                    : i + 1 < currentPage
                      ? "text-[#1e74bb] border-b-2 border-[#1e74bb]"
                      : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Quiz content */}
        <div className="bg-gray-50 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-medium text-center mb-6">Algebra Fundamentals Quiz ?</h2>

          <div className="flex justify-center mb-8">
            <button className="bg-[#1e74bb] text-white py-2 px-6 rounded-md text-sm font-medium">QUIZ 1 TO 20</button>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {quizOptions.map((option) => (
              <div
                key={option.id}
                className={`bg-white border ${
                  selectedOption === option.id
                    ? option.isCorrect
                      ? "border-2 border-green-500"
                      : "border-2 border-red-500"
                    : "border-gray-200"
                } rounded-lg p-4 flex items-center cursor-pointer`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div
                  className={`w-6 h-6 rounded-full ${
                    selectedOption === option.id
                      ? option.isCorrect
                        ? "bg-green-500 flex items-center justify-center"
                        : "bg-red-500 flex items-center justify-center"
                      : "border-2 border-gray-300"
                  } mr-4 flex-shrink-0`}
                >
                  {selectedOption === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span>{option.text}</span>
                {selectedOption === option.id && !option.isCorrect && (
                  <div className="ml-auto flex items-center text-red-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Incorrect</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-10 max-w-2xl mx-auto">
            <button className="bg-[#1e74bb] text-white py-2 px-6 rounded-md text-sm font-medium">PREV</button>
            <button className="bg-[#1e74bb] text-white py-2 px-6 rounded-md text-sm font-medium" onClick={handleSubmit}>
              SUBMIT
            </button>
          </div>
        </div>

        {/* Chat section - Now under the questions */}
        {showChat && (
          <div ref={chatSectionRef} className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3 shadow-md">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Help Assistant</h3>
                  <p className="text-xs text-gray-500">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat messages with increased height and improved styling */}
            <div
              ref={chatContainerRef}
              className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white rounded-lg mb-4 border border-gray-100 shadow-inner"
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex mb-6 ${message.sender === "assistant" ? "" : "justify-end"}`}>
                  {message.sender === "assistant" ? (
                    <div className="flex max-w-[80%]">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 mr-3 overflow-hidden shadow-sm flex items-center justify-center text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                          <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
                          <path d="M12 12 2 12" />
                          <path d="M12 12v10" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm flex items-center">
                          Assistant
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2 mr-1"></span>
                          <span className="text-xs text-gray-500 font-normal">{message.timestamp}</span>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl rounded-tl-none mt-1 text-sm whitespace-pre-wrap shadow-sm border border-blue-100">
                          {message.content}
                        </div>
                        <div className="flex mt-2 space-x-2">
                          <button className="bg-white text-xs px-3 py-1 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                            👍 Helpful
                          </button>
                          <button className="bg-white text-xs px-3 py-1 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                            👎 Not helpful
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex max-w-[80%] flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex-shrink-0 ml-3 overflow-hidden shadow-sm">
                        <Image src="/diverse-group-city.png" alt="User" width={40} height={40} />
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm flex items-center justify-end">
                          You
                          <span className="text-xs text-gray-500 font-normal ml-2">{message.timestamp}</span>
                        </div>
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-2xl rounded-tr-none mt-1 text-sm shadow-sm border border-amber-100 text-left">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message input with improved styling */}
            <div className="relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask for help with this question..."
                className="w-full border border-gray-300 rounded-full py-3 pl-5 pr-16 focus:outline-none focus:ring-2 focus:ring-[#1e74bb] focus:border-transparent shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1e74bb] text-white p-2 rounded-full hover:bg-[#1a67a7] transition-colors shadow-sm"
                onClick={handleSendMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right side - Relevant Topics */}
      <div className="hidden md:block w-4/12 border-l border-gray-200 p-6 bg-white overflow-y-auto">
        {/* In the "Right side - Relevant Topics" section, modify the header to include a back button when a topic is selected */}
        <div className="flex items-center justify-between mb-6">
          {selectedTopic ? (
            <>
              <button
                onClick={() => setSelectedTopic(null)}
                className="flex items-center text-gray-600 hover:text-[#1e74bb]"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <h3 className="text-xl font-medium">Back to Topics</h3>
              </button>
            </>
          ) : (
            <h3 className="text-xl font-medium">Relevant Topics</h3>
          )}
          <button className="text-gray-400">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-10 py-2 w-full border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e74bb]"
          />
          <button className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>

        {/* Replace the "Topics list" section with this conditional rendering */}
        {selectedTopic ? (
          // Topic Detail View
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md flex items-center justify-center mr-3">
                <span className="text-xl">{selectedTopic.icon}</span>
              </div>
              <div>
                <h4 className="font-medium">{selectedTopic.title}</h4>
                <p className="text-xs text-gray-500">{selectedTopic.time}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTopic.preview}</p>

              {/* Sample related content that would be fetched in a real app */}
              <div className="mt-4 space-y-4">
                <h5 className="font-medium text-sm">Related Resources:</h5>
                <ul className="space-y-2">
                  <li className="bg-blue-50 p-3 rounded-md text-sm">
                    <div className="flex items-center text-[#1e74bb]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M18 6V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                        <path d="M18 11h4l-4-4-4 4h4z"></path>
                        <path d="M18 14v6"></path>
                      </svg>
                      Learning Guide PDF
                    </div>
                  </li>
                  <li className="bg-green-50 p-3 rounded-md text-sm">
                    <div className="flex items-center text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                      </svg>
                      Video Tutorial
                    </div>
                  </li>
                  <li className="bg-amber-50 p-3 rounded-md text-sm">
                    <div className="flex items-center text-amber-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      Practice Examples
                    </div>
                  </li>
                </ul>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex justify-end">
                <button className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm">Save to Favorites</button>
              </div>
            </div>
          </div>
        ) : (
          // Topics list
          <div className="space-y-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`p-4 rounded-lg ${topic.id === "warning-messages" ? "bg-blue-100" : "hover:bg-gray-50"} cursor-pointer`}
                onClick={() => handleTopicClick(topic)}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {topic.id === "warning-messages" ? (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        ⚠️
                      </div>
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center">{topic.icon}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{topic.title}</h4>
                      <span className="text-xs text-gray-500">{topic.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{topic.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
