"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, LinkIcon } from "lucide-react"
import Link from "next/link"
import { QuestionPanel } from "@/components/quiz/question-panel"
import { ChatPanel } from "@/components/quiz/chat-panel"
import { useQuizChat } from "@/hooks/use-quiz-chat"
import { useQuizQuestion } from "@/hooks/use-quiz-question"
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
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(1)
  const [totalQuestions] = useState(10)

  const { question, loading, error, fetchQuestion } = useQuizQuestion({
    quizId,
    questionId,
    subjectId,
    topicId,
    currentQuestionId,
  })

  const { messages, isTyping, sendMessage, initializeChat, resetChat } = useQuizChat({
    question,
    selectedOption,
    contextAnswer: "",
    quizId,
    subjectId,
    topicId,
  })

  const userId = localStorage.getItem("userId")

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId)
    setIsAnswerChecked(false)
  }

  const checkAnswer = async () => {
    if (selectedOption === null || !question) return

    const selectedOptionData = question.options.find((option) => option.quiz_question_option_id === selectedOption)

    setIsCorrect(selectedOptionData?.is_correct || false)


    try {
      const payload = {
        organization_id: questionId,
        user_id: userId,
        subject_id: subjectId,
        topic_id: topicId,
        quiz_id: quizId,
        question_id: questionId,
        attempt_id: 1,
        is_complete: selectedOptionData?.is_correct || false,
        is_correct: true,
        is_ai_assisted: true,
        completion_time_seconds: 0
      }
      const response = await api.patch(`/user-quiz-attempts/quiz-attempts/`, payload);

      if (response.ok) {
        console.log("User quiz attempt updated successfully")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }


    setIsAnswerChecked(true)


    if (!selectedOptionData?.is_correct) {
      await initializeChat(selectedOptionData)
    }
  }

  const navigateToQuestion = (direction: "prev" | "next") => {
    if (!currentQuestionId) return

    const newQuestionId = direction === "next" ? currentQuestionId + 1 : currentQuestionId - 1

    if (newQuestionId < 1 || newQuestionId > totalQuestions) return

    // Reset chat when changing questions
    resetChat()
    setCurrentQuestionId(newQuestionId)
    setSelectedOption(null)
    setIsAnswerChecked(false)
  }

  // Generate pagination numbers
  const paginationNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1)

  // Mock relevant links
  const relevantLinks = [
    { title: "Understanding Algebra Fundamentals", href: "#" },
    { title: "Solving Linear Equations", href: "#" },
    { title: "Mathematical Formulas Reference", href: "#" },
  ]

  if (loading) {
    return <QuizSkeleton />
  }

  if (error) {
    return <QuizError error={error} onRetry={() => window.location.reload()} />
  }

  if (!question) {
    return <QuizNotFound />
  }

  return (
    <div className="mx-auto bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <QuestionPanel
          question={question}
          currentQuestionId={currentQuestionId}
          totalQuestions={totalQuestions}
          paginationNumbers={paginationNumbers}
          selectedOption={selectedOption}
          isAnswerChecked={isAnswerChecked}
          isCorrect={isCorrect}
          onOptionSelect={handleOptionSelect}
          onNavigate={navigateToQuestion}
          onSubmit={checkAnswer}
          onQuestionSelect={(questionId) => {
            resetChat()
            setCurrentQuestionId(questionId)
            setSelectedOption(null)
            setIsAnswerChecked(false)
          }}
        />

        <ChatPanel
          messages={messages}
          isTyping={isTyping}
          onSendMessage={sendMessage}
          disabled={!isAnswerChecked || isCorrect}
        />
      </div>

      <RelevantLinks links={relevantLinks} />
    </div>
  )
}

// Loading skeleton component
function QuizSkeleton() {
  return (
    <div className="mx-auto bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-white p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2 mt-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
            <div className="flex justify-between mt-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
        <div className="bg-white border-l border-gray-200 p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Error component
function QuizError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-lg font-medium text-center mb-4">{error}</p>
      <Button variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  )
}

// Not found component
function QuizNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium text-center">Quiz not found</p>
      <p className="text-gray-600 text-center mt-2">
        The requested quiz could not be found. Please go back and select another quiz.
      </p>
    </div>
  )
}

// Relevant links component
function RelevantLinks({ links }: { links: Array<{ title: string; href: string }> }) {
  return (
    <div className="mt-4 bg-gray-100 p-8 rounded-md">
      <h3 className="text-lg font-bold mb-4">Relevant links</h3>
      <div className="flex flex-wrap gap-4">
        {links.map((link, index) => (
          <Link key={index} href={link.href} className="flex items-center text-sm text-gray-700 hover:text-[#3373b5]">
            <LinkIcon className="h-4 w-4 mr-1" />
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
