"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ChevronLeft, ChevronRight, LinkIcon } from "lucide-react"
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

interface Quiz {
  quiz_id: number
  title: string
  description: string
  total_questions: number
  questions: Question[]
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
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null)
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [quizTitle, setQuizTitle] = useState("Algebra Fundamentals Quiz")
  const [subjectName, setSubjectName] = useState("Mathematics / Athematic / Counting and Number Recognition")

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

        const response = await api.get<Question>(`questions/questions/quiz-question/1`)

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
      const response = await api.get<Question>(`questions/questions/quiz-question/${newQuestionId}`)

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

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const numbers = []
    for (let i = 1; i <= 20; i++) {
      numbers.push(i)
    }
    return numbers
  }

  const paginationNumbers = generatePaginationNumbers()

  // Mock relevant links
  const relevantLinks = [
    { title: "Why Atomic Radius Decreases", href: "#" },
    { title: "Why Atomic Radius Decreases", href: "#" },
    { title: "Nuclear Charge vs Shielding", href: "#" },
  ]

  return (
    <div className="mx-auto">
      {/* Blue header bar */}
      <div className="bg-[#3373b5] text-white p-4 rounded-t-md flex justify-between items-center">
        <div className="text-sm font-medium">{subjectName}</div>
        <div className="text-sm font-medium">
          [Quiz {currentQuestionId} of {totalQuestions}]
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex overflow-x-auto">
        {paginationNumbers.map((num) => (
          <button
            key={num}
            className={`min-w-[36px] h-9 flex items-center justify-center mx-1 rounded-md ${num === currentQuestionId ? "text-[#3373b5] font-medium" : "text-gray-500"
              }`}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Question Panel */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="space-y-4 p-6 bg-white rounded-md">
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
            <div className="flex flex-col items-center justify-center h-full p-6 bg-white rounded-md">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg font-medium text-center">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-md p-6">
              {/* Question navigation */}
              <div className="flex justify-between items-center mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-200 hover:bg-gray-300 border-none h-12 w-12"
                  onClick={() => navigateToQuestion("prev")}
                  disabled={currentQuestionId === 1}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </Button>
                <h2 className="text-xl font-bold">
                  {currentQuestionId}. {question?.quiz_question_text || quizTitle} ?
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-200 hover:bg-gray-300 border-none h-12 w-12"
                  onClick={() => navigateToQuestion("next")}
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </Button>
              </div>

              {/* Options */}
              <RadioGroup
                value={selectedOption?.toString()}
                onValueChange={(value) => handleOptionSelect(Number.parseInt(value))}
                className="space-y-4"
              >
                {question?.options.map((option) => (
                  <div
                    key={option.quiz_question_option_id}
                    className={`border ${selectedOption === option.quiz_question_option_id
                      ? "border-[#3373b5] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                      } rounded-full p-2 flex items-center`}
                  >
                    <div
                      className={`${selectedOption === option.quiz_question_option_id ? "bg-[#3373b5]" : ""
                        } rounded-full flex items-center justify-center ml-2 mr-4`}
                    >
                      <RadioGroupItem
                        value={option.quiz_question_option_id.toString()}
                        id={`option-${option.quiz_question_option_id}`}
                        className={selectedOption === option.quiz_question_option_id ? "text-white border-white" : ""}
                      />
                    </div>
                    <Label
                      htmlFor={`option-${option.quiz_question_option_id}`}
                      className={`flex-grow cursor-pointer py-2 ${selectedOption === option.quiz_question_option_id ? "text-[#3373b5] font-medium" : ""
                        }`}
                    >
                      {option.option_text}
                    </Label>
                    {isAnswerChecked && option.is_correct && selectedOption === option.quiz_question_option_id && (
                      <div className="mr-2 text-green-500">✓</div>
                    )}
                    {isAnswerChecked && !option.is_correct && selectedOption === option.quiz_question_option_id && (
                      <div className="mr-2 text-red-500">✗</div>
                    )}
                  </div>
                ))}
              </RadioGroup>

              {/* Action buttons */}
              <div className="mt-8 flex justify-between">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  Skip
                </Button>
                <Button className="bg-[#3373b5] hover:bg-[#2a5d92]" onClick={checkAnswer}>
                  SUBMIT
                </Button>
              </div>

              {/* Relevant links section */}
              <div className="mt-12 bg-gray-100 p-4 rounded-md">
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
          )}
        </div>

        {/* Chat Panel */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-blue-500 text-white">AI</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">Study Assistant</h3>
              </div>
              <Separator className="mb-4" />
              {/* Chat interface would go here */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-yellow-100 text-yellow-800">You</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">You</span>
                      <span className="text-xs text-gray-500">1 min ago</span>
                    </div>
                    <p className="text-sm mt-1">
                      you're a UX writer now. Generate 3 versions of 404 error messages for a ecommerce clothing
                      website.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-800">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Response</span>
                      <span className="text-xs text-gray-500">Just now</span>
                    </div>
                    <div className="text-sm mt-1 space-y-2">
                      <p>
                        Sure! Here are three different versions of 404 error messages for an ecommerce clothing website:
                      </p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>
                          Uh-oh! It looks like the page you're looking for isn't here. Please check the URL and try
                          again or return to the homepage to continue shopping.
                        </li>
                        <li>
                          Whoops! We can't seem to find the page you're looking for. Please double-check the URL or use
                          our collection of stylish clothes and accessories.
                        </li>
                        <li>
                          Sorry, the page you're trying to access isn't available. It's possible that the item has sold
                          out or the page has
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
