"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, HelpCircle, XCircle } from "lucide-react"
import ChatInterface from "@/components/chat-interface"
import { api } from "@/lib/api-client"

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

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Question Panel */}
      <div className="md:col-span-2">
        <Card className="h-full">
          <CardContent className="p-6">
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
            ) : question ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Question {currentQuestionId}</h2>
                    <Badge className={`mt-1 ${getDifficultyColor(question.difficulty_level)}`}>
                      {question.difficulty_level}
                    </Badge>
                    {question.is_maths && (
                      <Badge variant="outline" className="ml-2 mt-1">
                        Math
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigateToQuestion("prev")}
                      disabled={currentQuestionId === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateToQuestion("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="my-6">
                  <p className="text-lg">{question.quiz_question_text}</p>
                </div>

                <RadioGroup
                  value={selectedOption?.toString()}
                  onValueChange={(value) => handleOptionSelect(Number.parseInt(value))}
                  className="space-y-3"
                >
                  {question.options.map((option) => (
                    <div
                      key={option.quiz_question_option_id}
                      className={`flex items-center space-x-2 p-3 rounded-md border ${isAnswerChecked && option.quiz_question_option_id === selectedOption
                        ? option.is_correct
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <RadioGroupItem
                        value={option.quiz_question_option_id.toString()}
                        id={`option-${option.quiz_question_option_id}`}
                      />
                      <Label htmlFor={`option-${option.quiz_question_option_id}`} className="flex-grow cursor-pointer">
                        {option.option_text}
                      </Label>
                      {isAnswerChecked && option.is_correct && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {isAnswerChecked && !option.is_correct && option.quiz_question_option_id === selectedOption && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Back to Quiz
                  </Button>
                  <Button onClick={checkAnswer} disabled={selectedOption === null || isAnswerChecked}>
                    Check Answer
                  </Button>
                </div>

                {isAnswerChecked && (
                  <div
                    className={`mt-4 p-4 rounded-md ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <div className="flex items-center">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <p className="font-medium text-green-800">Correct answer!</p>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          <p className="font-medium text-red-800">Incorrect answer. Try again!</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <HelpCircle className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-center">No question found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Panel */}
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-blue-500 text-white">AI</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">Study Assistant</h3>
            </div>
            <Separator className="mb-4" />
            {/* <ChatInterface questionText={question?.quiz_question_text || ""} /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
