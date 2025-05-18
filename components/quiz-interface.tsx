"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Bot, Check, ChevronLeft, ChevronRight, LinkIcon, SquarePen, ThumbsDown, ThumbsUp, User, X } from "lucide-react"
import { api } from "@/lib/api-client"
import Link from "next/link"

interface Option {
  quiz_question_option_id: number
  option_text: string
  is_correct: boolean
}

interface Question {
  question_id: number
  quiz_id: number
  quiz_question_text: string
  difficulty_level: string
  is_active: boolean
  is_maths: boolean
  created_by: number
  create_date_time: string
  update_date_time: string | null
  options: Option[]
}

interface Message {
  id: number
  sender: "user" | "response"
  content: string
  timestamp: string
}

export function QuizInterface({
  quizId,
  questionId,
  subjectId,
  topicId,
}: {
  quizId: string
  questionId?: string
  subjectId?: string
  topicId?: string
}) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(1)
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [quizTitle, setQuizTitle] = useState("Algebra Fundamentals Quiz")
  const [subjectName, setSubjectName] = useState("Mathematics / Athematic / Counting and Number Recognition")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "user",
      content: "you're a UX writer now. Generate 3 versions of 404 error messages for a ecommerce clothing website.",
      timestamp: "1 min ago",
    },
    {
      id: 2,
      sender: "response",
      content: `Sure! Here are three different versions of 404 error messages for an ecommerce clothing website:

1. Uh-oh! It looks like the page you're looking for isn't here. Please check the URL and try again or return to the homepage to continue shopping.

2. Whoops! We can't seem to find the page you're looking for. Please double-check the URL or use our collection of stylish clothes and accessories.

3. Sorry, the page you're trying to access isn't available. It's possible that the item has sold out or the page has`,
      timestamp: "Just now",
    },
  ])
  const [newMessage, setNewMessage] = useState("")


  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true)
      setError(null)
      setIsAnswerChecked(false)
      setSelectedOption(null)

      try {
        // Use the provided questionId or fetch the first question for the quiz
        const id = questionId || "1" // Default to 1 if no questionId provided
        setCurrentQuestionId(Number(id))

        const response = await api.get<Question>(`questions/questions/quiz-question/${id}?quiz_id=${quizId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch question: ${response.status}`)
        }

        const data = await response.data
        setQuestion(data)
      } catch (err) {
        console.error("Error fetching question:", err)
        setError("Failed to load question. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [quizId, questionId])

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId)
    setIsAnswerChecked(false)
  }

  const checkAnswer = () => {
    if (selectedOption === null) return

    const selectedOptionData = question?.options.find((option) => option.quiz_question_option_id === selectedOption)

    setIsCorrect(selectedOptionData?.is_correct || false)
    setIsAnswerChecked(true)
  }

  const navigateToQuestion = async (direction: "prev" | "next") => {
    if (!currentQuestionId) return

    // Simple navigation logic - in a real app, you'd fetch the actual next/prev question IDs
    const newQuestionId = direction === "next" ? currentQuestionId + 1 : currentQuestionId - 1

    if (newQuestionId < 1) return // Prevent going below question 1

    setCurrentQuestionId(newQuestionId)

    // Reset states
    setLoading(true)
    setError(null)
    setIsAnswerChecked(false)
    setSelectedOption(null)

    try {
      const response = await api.get<Question>(`questions/questions/quiz-question/${newQuestionId}?quiz_id=${quizId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.status}`)
      }

      const data = await response.data
      setQuestion(data)
    } catch (err) {
      console.error("Error fetching question:", err)
      setError("Failed to load question. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: newMessage,
      timestamp: "1 min ago",
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        id: messages.length + 2,
        sender: "response",
        content: `Sure! Here are three different versions of 404 error messages for an ecommerce clothing website:

1. Uh-oh! It looks like the page you're looking for isn't here. Please check the URL and try again or return to the homepage to continue shopping.

2. Whoops! We can't seem to find the page you're looking for. Please double-check the URL or use our collection of stylish clothes and accessories.

3. Sorry, the page you're trying to access isn't available. It's possible that the item has sold out or the page has`,
        timestamp: "Just now",
      }
      setMessages((prev) => [...prev, responseMessage])
    }, 1000)
  }

  // Generate pagination numbers
  const paginationNumbers = Array.from({ length: 20 }, (_, i) => i + 1)

  // Mock relevant links
  const relevantLinks = [
    { title: "Why Atomic Radius Decreases", href: "#" },
    { title: "Why Atomic Radius Decreases", href: "#" },
    { title: "Nuclear Charge vs Shielding", href: "#" },
  ]

  return (
    <div className="mx-auto bg-white">
      {/* Blue header bar */}

      {/* Pagination */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Question Panel */}
        <div className="bg-white p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="flex justify-between mt-6">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg font-medium text-center">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div>
              <div className="bg-white border-b border-t mb-4 border-gray-200 px-4 pt-2 flex overflow-x-auto">
                {paginationNumbers.map((num) => (
                  <button
                    key={num}
                    className={`min-w-[36px] h-9 flex items-center justify-center mx-1 ${num === currentQuestionId ? "text-[#3373b5] font-bold border-b border-[#3373b5]" : "text-gray-500"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {/* Question navigation */}
              <div className="bg-[#F7F8FA] rounded-tl-2xl rounded-tr-2xl flex justify-between items-center mb-4 py-4 px-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-[#1E74BB] hover:bg-gray-400 disabled:bg-gray-400 border-none h-12 w-12 flex items-center justify-center"
                  onClick={() => navigateToQuestion("prev")}
                  disabled={currentQuestionId === 1}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </Button>
                <h2 className="text-xl font-bold">
                  {currentQuestionId}. {question?.quiz_question_text || quizTitle} ?
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-[#1E74BB] hover:bg-[#1E74BB84] disabled:bg-gray-400 border-none h-12 w-12 flex items-center justify-center"
                  onClick={() => navigateToQuestion("next")}
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </Button>
              </div>

              {/* Options */}
              <RadioGroup
                value={selectedOption?.toString()}
                onValueChange={(value) => handleOptionSelect(Number.parseInt(value))}
                className="space-y-4 px-4"
              >
                {question?.options.map((option) => {
                  const isSelected = selectedOption === option.quiz_question_option_id;
                  const isCorrect = option.is_correct;

                  return (
                    <div
                      key={option.quiz_question_option_id}
                      className={`border rounded-full flex items-center 
                         ${isSelected
                          ? isAnswerChecked
                            ? isCorrect
                              ? "border-green-500 bg-white border-2"
                              : "border-red-500 bg-white border-2"
                            : "border-[#3373b5] bg-white border-2"
                          : "border-gray-200 bg-[#F1F1F1] hover:border-gray-300"
                        }`}
                    >
                      <div
                        className={`
                              rounded-full flex items-center justify-center ml-4 mr-4
                              ${isSelected
                            ? isAnswerChecked
                              ? isCorrect
                                ? "bg-[#C2E6B1]"
                                : "bg-red-100"
                              : "bg-[#3373b5]"
                            : "bg-white"
                          }`}
                      >
                        <RadioGroupItem
                          value={option.quiz_question_option_id.toString()}
                          id={`option-${option.quiz_question_option_id}`}
                          className={`
                                h-5 w-5 
                                ${isSelected
                              ? isAnswerChecked
                                ? isCorrect
                                  ? "border-green-500 ring-2 text-green-700 ring-green-200"
                                  : "border-red-500 ring-2 text-red-700 ring-red-200"
                                : "border-[#3373b5] text-[#3373b5]"
                              : "border-gray-300"
                            }
            `}
                        />
                      </div>
                      <Label
                        htmlFor={`option-${option.quiz_question_option_id}`}
                        className={`flex-grow cursor-pointer p-6 
                          ${isSelected ? "text-[#3373b5] font-medium" : ""}
                        `}
                      >
                        {option.option_text}
                      </Label>

                    </div>
                  );
                })}
              </RadioGroup>


              {/* Action buttons */}
              <div className="mt-8 bg-[#F7F8FA] p-4 rounded-bl-2xl rounded-br-2xl flex justify-between">
                <Button variant="outline" className="border-gray-300 text-gray-600 bg-white hover:bg-gray-100 rounded-md">
                  Skip
                </Button>
                <Button className="bg-[#3373b5] hover:bg-[#2a5d92] rounded-full px-6" onClick={checkAnswer}>
                  SUBMIT
                </Button>
              </div>


              {/* correct wrong answer banner */}
              {isAnswerChecked && (
                <div className="flex flex-col items-center">
                  <div className={`mt-4 p-4 w-[300px] text-center inline-block rounded-md ${isCorrect ? "bg-[#C2E6B1] text-black" : "bg-[#E87E7B] text-white"}`}>
                    {(isCorrect ? (
                      <div className="flex items-center">
                        <ThumbsUp className="mr-4" />
                        <div className="text-center"><span className="font-bold">Correct!</span> Great Job</div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <ThumbsDown className="mr-4" />
                        <div className="text-center"><span className="font-bold">Wrong!</span> Better luck next time</div>
                      </div>
                    )
                    )}
                  </div>
                </div>
              )}

              {/* Relevant links section */}

            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="bg-white border-l border-gray-200 flex flex-col overflow-auto" style={{ height: "calc(100vh - 342px)" }}>
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="mb-6">
                {message.sender === "user" ? (
                  <div className="mb-6">
                    <div className="flex items-center mb-2 relative top-4 left-[-6px]">
                      <div className="w-8 h-8 rounded-sm bg-amber-100 flex items-center justify-center overflow-hidden mr-2">
                        <User />
                      </div>
                      <div className="font-medium">You</div>
                      <div className="text-xs text-gray-500 ml-2">{message.timestamp}</div>
                      <button className="ml-auto">
                        <SquarePen size={14} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="text-sm pl-10">{message.content}</div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center mb-2 relative top-4 left-[-6px]">
                      <div className="w-8 h-8 rounded-sm bg-green-200 flex items-center justify-center mr-2">
                        <Bot />
                      </div>
                      <div className="font-medium">Response</div>
                      <div className="text-xs text-gray-500 ml-2">{message.timestamp}</div>
                    </div>
                    <div className="bg-gray-100  rounded-lg text-sm whitespace-pre-wrap pl-10 py-4 pr-4">{message.content}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="p-4 border-t border-gray-200">
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
                  <path
                    d="M12 3V15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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

      </div>
      <div className="mt-4 bg-gray-100 p-8 rounded-md">
        <h3 className="text-lg font-bold mb-4">Relevant links</h3>
        <div className="flex flex-wrap gap-4">
          {relevantLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="flex items-center text-sm text-gray-700 hover:text-[#3373b5]"
            >
              <LinkIcon className="h-4 w-4 mr-1" />
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
