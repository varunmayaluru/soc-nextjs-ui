"use client"

import { useState } from "react"
import { AlertCircle, ChevronLeft, ChevronRight, X, Search, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import SuccessModal from "./success-modal"

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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()

  // Options with correct/incorrect flags
  const quizOptions = [
    { id: 0, text: "Identify variables, constants, and coefficients", isCorrect: true },
    { id: 1, text: "Simplify expressions like 3x + 5 - x + 2.", isCorrect: false },
    { id: 2, text: "Solve equations like 2y + 5 = 11.", isCorrect: true },
    { id: 3, text: "Translate word problems into simple algebraic", isCorrect: true },
  ]

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index)
    const selectedQuizOption = quizOptions.find((option) => option.id === index)
    if (selectedQuizOption && !selectedQuizOption.isCorrect) {
      setShowChat(true)
    } else {
      setShowChat(false)
    }
  }

  const handleSubmit = () => {
    setShowSuccessModal(true)
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    const topicId = quiz.topicId || "arithmetic-number-sense"
    router.push(`/subjects/${quiz.subjectId}/${topicId}/${quiz.id}/results`)
  }

  return (
    <div className="flex h-[calc(100vh-160px)]">
      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />

      {/* Left side - Quiz content with scrolling */}
      <div className="w-full md:w-8/12 p-6 overflow-y-auto">
        {/* Question navigation */}
        <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-2 sticky top-0 z-10">
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md">
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex overflow-x-auto space-x-1">
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

        {/* Simplified chat section */}
        {showChat && (
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Help Assistant</h3>
                  <p className="text-xs text-gray-500">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-40 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4 border border-gray-100">
              <p className="text-sm">
                Let me explain this concept further. When simplifying algebraic expressions, we need to combine like
                terms. In the expression '3x + 5 - x + 2', the like terms are '3x' and '-x', which combine to '2x'. The
                constants '5' and '2' combine to '7'. So the final simplified expression is '2x + 7'.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Ask for help with this question..."
                className="w-full border border-gray-300 rounded-full py-3 pl-5 pr-16"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1e74bb] text-white p-2 rounded-full">
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

      {/* Right side - Relevant Topics (simplified) */}
      <div className="hidden md:block w-4/12 border-l border-gray-200 p-6 bg-white overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium">Relevant Topics</h3>
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
            className="pl-10 pr-10 py-2 w-full border border-gray-200 rounded-md text-sm"
          />
        </div>

        {/* Topics list (simplified) */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <div className="w-6 h-6 flex items-center justify-center">🌟</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">Cosmic Evolution</h4>
                  <span className="text-xs text-gray-500">7:34 PM</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Some 15 billion years ago the universe emerged from a hot, dense sea of matter and energy.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-blue-100 cursor-pointer">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <div className="w-6 h-6 flex items-center justify-center">⚠️</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">Warning Messages Samples</h4>
                  <span className="text-xs text-gray-500">Wed</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Here are three different versions of 404 error messages for an ecommerce clothing website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
