"use client"
import { useEffect, useState } from "react"
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

interface ExistingAnswer {
  answer_choice_id: number
  is_correct: boolean
  answer_text?: string
  is_ai_assisted?: boolean
}

export function QuizInterface({
  subjectName,
  topicName,
  quizName,
  quizStatus,
  quizId,
  questionId,
  subjectId,
  topicId,
  attemptId,
  setQuizStatus,
}: {
  subjectName: string
  topicName: string
  quizName: string
  quizStatus: boolean
  quizId: string
  questionId?: string
  subjectId?: string
  topicId?: string
  attemptId?: number | null
  setQuizStatus: (status: boolean) => void
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(Number(questionId))
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)

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
  const organizationId = localStorage.getItem("organizationId")

  useEffect(() => {
    setCurrentQuestionId(Number(questionId))
    setSelectedOption(null)
    setIsAnswerChecked(false)
    setIsCorrect(false)
  }, [questionId])

  const loadExistingAnswer = async (questionIdToLoad?: number) => {
    const targetQuestionId = questionIdToLoad || currentQuestionId
    if (!targetQuestionId || !userId || !organizationId) return

    setIsLoadingAnswer(true)
    try {
      const endpoint = `/quizzes/quizzes/answers/${userId}?organization_id=${organizationId}&subject_id=${subjectId}&topic_id=${topicId}&quiz_id=${quizId}&question_id=${targetQuestionId}&attempt_id=${attemptId || 1}`

      const response = await api.get<ExistingAnswer>(endpoint)

      if (response.ok && response.data && response.data.answer_choice_id) {
        // If an answer exists, set the question as submitted
        setSelectedOption(response.data.answer_choice_id)
        setIsAnswerChecked(true)
        setIsCorrect(response.data.is_correct)

        console.log("Loaded existing answer:", response.data)
      } else {
        // No existing answer found, reset state
        setSelectedOption(null)
        setIsAnswerChecked(false)
        setIsCorrect(false)
      }
    } catch (error) {
      console.error("Error loading existing answer:", error)
      // Reset state on error
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setIsCorrect(false)
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  const quizData = async () => {
    try {
      const response = await api.get<any>(`/quizzes/quizzes/${quizId}`)
      if (response.ok) {
        const data = response.data
        setTotalQuestions(data?.total_questions)
      } else {
        throw new Error("Failed to fetch quiz data")
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error)
    }
  }

  useEffect(() => {
    const initializeQuizData = async () => {
      await quizData()
      if (currentQuestionId) {
        await loadExistingAnswer(currentQuestionId)
      }
    }

    initializeQuizData()
  }, [currentQuestionId])

  const handleOptionSelect = (optionId: number) => {
    if (isAnswerChecked) return // Prevent changing answer if already submitted
    setSelectedOption(optionId)
    setIsAnswerChecked(false)
  }

  const checkAnswer = async () => {
    if (selectedOption === null || !question || isAnswerChecked) return

    const selectedOptionData = question.options.find((option) => option.quiz_question_option_id === selectedOption)

    setIsCorrect(selectedOptionData?.is_correct || false)

    try {
      // First, save the answer
      const checkAnswerPayload = {
        organization_id: organizationId,
        user_id: userId,
        subject_id: subjectId,
        topic_id: topicId,
        quiz_id: quizId,
        question_id: currentQuestionId,
        attempt_id: attemptId || 1,
        answer_text: "",
        answer_choice_id: selectedOptionData?.quiz_question_option_id,
        is_correct: selectedOptionData?.is_correct || false,
      }

      const response = await api.post(`/quizzes/quizzes/answers`, checkAnswerPayload)
      if (response.ok) {
        console.log("Answer saved successfully")

        // Then update the quiz attempt status
        const payload = {
          organization_id: organizationId,
          user_id: userId,
          subject_id: subjectId,
          topic_id: topicId,
          quiz_id: quizId,
          question_id: currentQuestionId,
          attempt_id: attemptId || 1,
          is_complete: true,
          is_correct: selectedOptionData?.is_correct || false,
          is_ai_assisted: messages.length > 0,
          completion_time_seconds: 0,
        }

        const attemptResponse = await api.patch(`/user-quiz-attempts/quiz-attempts/`, payload)
        if (attemptResponse.ok) {
          console.log("Quiz attempt updated successfully")
        } else {
          console.error("Failed to update quiz attempt:", attemptResponse.status)
        }

        // Check if this is the last question to determine if the quiz is complete
        const isComplete = currentQuestionId === totalQuestions

        // Update overall quiz progress
        const quizProgressPayload = {
          organization_id: organizationId,
          user_id: userId,
          subject_id: subjectId,
          topic_id: topicId,
          quiz_id: quizId,
          is_complete: isComplete,
          latest_score: 0, // This should be calculated based on correct answers
          best_score: 0, // This should be updated if this is a better score
          attempts_count: 1,
          completion_time_seconds: 0,
        }

        const progressResponse = await api.patch(`user-quiz-progress/quiz-progress/`, quizProgressPayload)
        if (progressResponse.ok) {
          console.log("Quiz progress updated successfully")

          // If this is the last question and the quiz is now complete, update the UI
          if (isComplete) {
            setQuizStatus(true)
          }
        } else {
          console.error("Failed to update quiz progress:", progressResponse.status)
        }
      } else {
        console.error("Failed to save answer:", response.status)
      }
    } catch (error) {
      console.error("Error updating quiz progress:", error)
    }

    setIsAnswerChecked(true)

    if (!selectedOptionData?.is_correct) {
      await initializeChat(selectedOptionData)
    }
  }

  const navigateToQuestion = async (direction: "prev" | "next") => {
    if (!currentQuestionId) return

    const newQuestionId = direction === "next" ? currentQuestionId + 1 : currentQuestionId - 1

    if (newQuestionId < 1 || newQuestionId > totalQuestions) return

    try {
      // Reset chat and UI state immediately
      resetChat()
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setIsCorrect(false)

      // Update the current question ID first
      setCurrentQuestionId(newQuestionId)

      // Create a new quiz attempt for this question if it doesn't exist
      const quizAttemptPayload = {
        organization_id: organizationId,
        user_id: userId,
        subject_id: subjectId,
        topic_id: topicId,
        quiz_id: quizId,
        question_id: newQuestionId,
        attempt_id: attemptId,
        is_complete: false,
        is_correct: false,
        is_ai_assisted: false,
        completion_time_seconds: 0,
      }

      const response = await api.post<any>(`user-quiz-attempts/quiz-attempts/`, quizAttemptPayload)

      if (response.ok) {
        console.log("Quiz attempt created successfully for question:", newQuestionId)
      } else {
        console.error("Failed to create quiz attempt:", response.status)
      }

      // Load existing answer for the new question after a short delay to ensure question is loaded
      setTimeout(() => {
        loadExistingAnswer(newQuestionId)
      }, 100)
    } catch (error) {
      console.error("Error navigating to question:", error)
    }
  }

  const handleQuestionSelect = async (questionId: number) => {
    resetChat()
    setSelectedOption(null)
    setIsAnswerChecked(false)
    setIsCorrect(false)

    // Update the current question ID
    setCurrentQuestionId(questionId)

    // Load existing answer for the selected question after a short delay
    setTimeout(() => {
      loadExistingAnswer(questionId)
    }, 100)
  }

  // Generate pagination numbers
  const paginationNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1)

  // Mock relevant links
  const relevantLinks = [
    { title: "Understanding Algebra Fundamentals", href: "#" },
    { title: "Solving Linear Equations", href: "#" },
    { title: "Mathematical Formulas Reference", href: "#" },
  ]

  if (loading || isLoadingAnswer) {
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
          subjectName={subjectName}
          topicName={topicName}
          quizName={quizName}
          subjectId={subjectId || ""}
          topicId={topicId || ""}
          quizId={quizId}
          quizStatus={quizStatus}
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
          onQuestionSelect={handleQuestionSelect}
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
