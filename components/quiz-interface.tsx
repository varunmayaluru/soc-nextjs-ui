"use client"

import { useState } from "react"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
  const [selectedOption, setSelectedOption] = useState<number | null>(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [showChat, setShowChat] = useState(true)
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
            <button className="bg-[#1e74bb] text-white py-2 px-6 rounded-md text-sm font-medium">NEXT</button>
          </div>
        </div>
      </div>

      {/* Right side - Chat interface */}
      <div className="hidden md:block w-4/12 border-l border-gray-200 p-6 bg-white overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto">
            <div className="flex mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <Image src="/abstract-geometric-shapes.png" alt="You" width={40} height={40} className="object-cover" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">You</span>
                  <span className="text-xs text-gray-500">1 min ago</span>
                </div>
                <p className="text-sm">
                  you're a UX writer now. Generate 3 versions of 404 error messages for a ecommerce clothing website.
                </p>
              </div>
              <button className="ml-2 text-gray-400 self-start">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.6667 6.00001V2.66668C12.6667 2.48987 12.5964 2.32031 12.4714 2.19528C12.3464 2.07025 12.1768 2.00001 12 2.00001H4.00004C3.82323 2.00001 3.65366 2.07025 3.52864 2.19528C3.40361 2.32031 3.33337 2.48987 3.33337 2.66668V13.3333C3.33337 13.5101 3.40361 13.6797 3.52864 13.8047C3.65366 13.9298 3.82323 14 4.00004 14H12C12.1768 14 12.3464 13.9298 12.4714 13.8047C12.5964 13.6797 12.6667 13.5101 12.6667 13.3333V10"
                    stroke="#9B9DA6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M5.33337 6.66667L14 6.66667" stroke="#9B9DA6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 6.66667L11.3334 4" stroke="#9B9DA6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 6.66667L11.3334 9.33334" stroke="#9B9DA6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="flex mb-4 justify-end">
              <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">Response</span>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
                <p className="text-sm">
                  Here are three different versions of 404 error messages for an ecommerce clothing website:
                </p>
                <ol className="list-decimal pl-5 mt-2 text-sm">
                  <li className="mb-1">
                    Uh-oh! It looks like the page you're looking for isn't here. Please check the URL and try again or
                    return to the homepage to continue shopping.
                  </li>
                  <li className="mb-1">
                    Whoops! We can't seem to find the page you're looking for. Please double-check the URL or use our
                    search to find what you need. You can also browse our collection of stylish clothes and accessories.
                  </li>
                  <li>
                    Sorry, the page you're trying to access isn't available. It's possible that the item has sold out or
                    the page has been moved.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Type message..."
                className="w-full border border-gray-300 rounded-full py-3 pl-5 pr-16"
              />
              <div className="absolute inset-y-0 left-3 flex items-center">
                <button className="text-gray-400 mr-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#9B9DA6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
                      stroke="#9B9DA6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M9 9H9.01" stroke="#9B9DA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M15 9H15.01"
                      stroke="#9B9DA6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
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
        </div>
      </div>
    </div>
  )
}
