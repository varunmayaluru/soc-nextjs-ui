"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, LinkIcon, RotateCcw } from "lucide-react"
import Link from "next/link"
import { QuestionPanel } from "@/components/quiz/question-panel"
import { ChatPanel } from "@/components/quiz/chat-panel"
import { useQuizChat } from "@/hooks/use-quiz-chat"
import { useQuizQuestion } from "@/hooks/use-quiz-question"
import { api } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import QuizCompletion from "./quiz/quiz-completion"

interface Option {
  id: number
  option_text: string
  is_correct: boolean
  option_index: number
  organization_id: number
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

interface QuizProgress {
  attempts_count: number
  latest_score: number
  best_score: number
  is_complete: boolean
}

export function QuizInterface({
  isQuizExists,
  totalQuizQuestions,
  topicSlug,
  subjectSlug,
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
  onRetakeQuiz,
}: {
  isQuizExists: boolean
  totalQuizQuestions: number
  topicSlug: string
  subjectSlug: string
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
  onRetakeQuiz: () => void
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(Number(questionId))
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  // const [totalQuestions, setTotalQuestions] = useState(0)
  const [showRetakeDialog, setShowRetakeDialog] = useState(false)
  const [isRetaking, setIsRetaking] = useState(false)
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null)

  // Timer states - hidden from UI but tracked internally
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [totalQuizTime, setTotalQuizTime] = useState<number>(0)
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({})
  const [selectedOptionData, setSelectedOptionData] = useState<Option | undefined>(undefined)

  const [quizCompleted, setQuizCompleted] = useState(false)

  const { question, loading, error, fetchQuestion } = useQuizQuestion({
    quizId,
    questionId,
    subjectId,
    topicId,
    currentQuestionId,
  })

  const { messages, isTyping, sendMessage, initializeChat, resetChat } = useQuizChat({
    currentQuestionId,
    attemptId,
    selectedOptionData,
    question,
    selectedOption,
    contextAnswer: "",
    quizId,
    subjectId,
    topicId,
  })

  console.log(totalQuizQuestions, "totalQuizQuestions")

  const userId = localStorage.getItem("userId")
  const organizationId = localStorage.getItem("organizationId")

  useEffect(() => {
    const newQuestionId = Number(questionId)
    console.log("QuizInterface: questionId prop changed to:", newQuestionId)

    if (newQuestionId !== currentQuestionId) {
      setCurrentQuestionId(newQuestionId)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setIsCorrect(false)
      // Reset timer for new question
      setQuestionStartTime(Date.now())
    }
  }, [questionId])

  const loadQuizProgress = async () => {
    try {
      const response = await api.get<QuizProgress>(
        `user-quiz-attempts/quiz-attempts/${userId}/latest?organization_id=${organizationId}&subject_id=${subjectId}&topic_id=${topicId}&quiz_id=${quizId}`,
      )

      if (response.ok && response.data) {
        setQuizProgress(response.data)
      }
    } catch (error) {
      console.error("Error loading quiz progress:", error)
    }
  }

  const loadExistingAnswer = async (questionIdToLoad?: number) => {
    const targetQuestionId = questionIdToLoad || currentQuestionId
    if (!targetQuestionId || !userId || !organizationId) return

    setIsLoadingAnswer(true)
    try {
      const endpoint = `/quizzes/quizzes/answers/${userId}?organization_id=${organizationId}&subject_id=${subjectId}&topic_id=${topicId}&quiz_id=${quizId}&question_id=${targetQuestionId}&attempt_id=${attemptId || 1}`

      console.log("Loading existing answer from:", endpoint)
      const response = await api.get<ExistingAnswer>(endpoint)

      if (response.ok && response.data && response.data.answer_choice_id) {
        // If an answer exists, set the question as submitted
        setSelectedOption(response.data.answer_choice_id)
        setIsAnswerChecked(true)
        setIsCorrect(response.data.is_correct)

        console.log("Loaded existing answer for question", targetQuestionId, ":", response.data)
      } else {
        // No existing answer found, reset state
        setSelectedOption(null)
        setIsAnswerChecked(false)
        setIsCorrect(false)
        console.log("No existing answer found for question", targetQuestionId)
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

  // const quizData = async () => {
  //   try {
  //     const response = await api.get<any>(`/quizzes/quizzes/${quizId}?organization_id=${organizationId}`)
  //     if (response.ok) {
  //       const data = response.data
  //       // setTotalQuestions(data?.total_questions)
  //     } else {
  //       throw new Error("Failed to fetch quiz data")
  //     }
  //   } catch (error) {
  //     console.error("Error fetching quiz data:", error)
  //   }
  // }

  // useEffect(() => {
  //   const initializeQuizData = async () => {
  //     // await quizData()

  //     if (isQuizExists) {
  //       await loadQuizProgress()
  //       if (currentQuestionId) {
  //         console.log("Loading existing answer for question:", currentQuestionId)
  //         await loadExistingAnswer(currentQuestionId)
  //       }
  //     }
  //   }

  //   initializeQuizData()
  // }, [currentQuestionId])

  const handleOptionSelect = (optionId: number) => {
    if (isAnswerChecked) return // Prevent changing answer if already submitted
    setSelectedOption(optionId)
    setIsAnswerChecked(false)
  }

  const checkAnswer = async () => {
    if (selectedOption === null || !question || isAnswerChecked) return

    const selectedOptionArray = question.options.find((option) => option.id === selectedOption)

    console.log("Selected option data:", selectedOptionArray)
    setSelectedOptionData(selectedOptionArray)

    // Calculate time spent on this question
    const questionCompletionTime = Math.floor((Date.now() - questionStartTime) / 1000)

    // Store question time
    setQuestionTimes((prev) => ({
      ...prev,
      [currentQuestionId!]: questionCompletionTime,
    }))

    // Update total quiz time
    setTotalQuizTime((prev) => prev + questionCompletionTime)

    setIsCorrect(selectedOptionArray?.is_correct || false)

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
        answer_choice_id: selectedOptionArray?.id,
        is_correct: selectedOptionArray?.is_correct || false,
      }

      const response = await api.post(`/quizzes/quizzes/answers`, checkAnswerPayload)
      if (response.ok) {
        console.log("Answer saved successfully")

        // Then update the quiz attempt status with completion time
        const payload = {
          organization_id: organizationId,
          user_id: userId,
          subject_id: subjectId,
          topic_id: topicId,
          quiz_id: quizId,
          question_id: currentQuestionId,
          attempt_id: attemptId || 1,
          is_complete: true,
          is_correct: selectedOptionArray?.is_correct || false,
          is_ai_assisted: messages.length > 0,
          completion_time_seconds: questionCompletionTime,
        }

        const attemptResponse = await api.patch(`/user-quiz-attempts/quiz-attempts/`, payload)
        if (attemptResponse.ok) {
          console.log("Quiz attempt updated successfully with completion time:", questionCompletionTime)
        } else {
          console.error("Failed to update quiz attempt:", attemptResponse.status)
        }

        // Check if this is the last question to determine if the quiz is complete
        const isComplete = currentQuestionId === totalQuizQuestions

        // Calculate total completion time for the entire quiz
        const totalCompletionTime = isComplete ? totalQuizTime + questionCompletionTime : 0

        // Update overall quiz progress
        const quizProgressPayload = {
          organization_id: organizationId,
          user_id: userId,
          subject_id: subjectId,
          topic_id: topicId,
          quiz_id: quizId,
          is_completed: isComplete,
          latest_score: 0, // This should be calculated based on correct answers
          best_score: 0, // This should be updated if this is a better score
          attempts_count: quizProgress?.attempts_count || 1,
          completion_time_seconds: totalCompletionTime,
        }

        const progressResponse = await api.patch(`user-quiz-progress/quiz-progress/`, quizProgressPayload)
        if (progressResponse.ok) {
          console.log("Quiz progress updated successfully")

          // If this is the last question and the quiz is now complete, update the UI
          if (isComplete) {
            setQuizStatus(true)
            await loadQuizProgress() // Reload progress to get updated data
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

    if (!selectedOptionArray?.is_correct) {
      await initializeChat(selectedOptionArray)
    }
  }

  const handleRetakeQuiz = async () => {
    setIsRetaking(true)
    try {
      // Calculate new attempt ID
      const newAttemptId = (quizProgress?.attempts_count || 1) + 1

      // Create new quiz attempt for question 1
      const quizAttemptPayload = {
        organization_id: organizationId,
        user_id: userId,
        subject_id: subjectId,
        topic_id: topicId,
        quiz_id: quizId,
        question_id: 1,
        attempt_id: newAttemptId,
        is_complete: false,
        is_correct: false,
        is_ai_assisted: false,
        completion_time_seconds: 0,
      }

      // Update quiz progress with incremented attempt count
      const quizProgressPayload = {
        organization_id: organizationId,
        user_id: userId,
        subject_id: subjectId,
        topic_id: topicId,
        quiz_id: quizId,
        is_completed: false,
        latest_score: 0,
        best_score: quizProgress?.best_score || 0, // Keep the best score
        attempts_count: newAttemptId,
        completion_time_seconds: 0,
      }

      const [attemptResponse, progressResponse] = await Promise.all([
        api.post(`user-quiz-attempts/quiz-attempts/`, quizAttemptPayload),
        api.patch(`user-quiz-progress/quiz-progress/`, quizProgressPayload),
      ])

      if (attemptResponse.ok && progressResponse.ok) {
        console.log("Quiz retake initialized successfully")

        // Reset all states including timers
        setQuizStatus(false)
        setCurrentQuestionId(1)
        setSelectedOption(null)
        setIsAnswerChecked(false)
        setIsCorrect(false)
        setQuestionStartTime(Date.now())
        setTotalQuizTime(0)
        setQuestionTimes({})
        resetChat()

        // Reload quiz progress
        await loadQuizProgress()

        // Call the parent callback to update attempt ID
        onRetakeQuiz()

        setShowRetakeDialog(false)
      } else {
        console.error("Failed to initialize quiz retake")
        throw new Error("Failed to initialize quiz retake")
      }
    } catch (error) {
      console.error("Error retaking quiz:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsRetaking(false)
    }
  }

  const navigateToQuestion = async (direction: "prev" | "next") => {
    if (!currentQuestionId) return

    const newQuestionId = direction === "next" ? currentQuestionId + 1 : currentQuestionId - 1

    if (newQuestionId < 1 || newQuestionId > totalQuizQuestions) return

    try {
      console.log(`Navigating ${direction} to question ${newQuestionId}`)

      // Reset chat and UI state immediately
      resetChat()
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setIsCorrect(false)

      // Reset timer for new question
      setQuestionStartTime(Date.now())

      // Update the current question ID first - this will trigger question fetch
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

      console.log("Creating quiz attempt for question:", newQuestionId)

      const response = await api.post<any>(`user-quiz-attempts/quiz-attempts/`, quizAttemptPayload)

      if (response.ok) {
        console.log("Quiz attempt created successfully for question:", newQuestionId)
      } else {
        console.log("Quiz attempt may already exist for question:", newQuestionId)
      }

      // Load existing answer for the new question after question is fetched
      // Use a timeout to ensure the question fetch completes first
      // setTimeout(() => {
      //   console.log("Loading existing answer for question:", newQuestionId)
      loadExistingAnswer(newQuestionId)
      // }, 500)
    } catch (error) {
      console.error("Error navigating to question:", error)
    }
  }

  const handleQuestionSelect = async (questionId: number) => {
    console.log("Selecting question:", questionId)

    resetChat()
    setSelectedOption(null)
    setIsAnswerChecked(false)
    setIsCorrect(false)

    // Reset timer for selected question
    setQuestionStartTime(Date.now())

    // Update the current question ID - this will trigger question fetch
    setCurrentQuestionId(questionId)

    // Load existing answer for the selected question after question is fetched
    setTimeout(() => {
      console.log("Loading existing answer for selected question:", questionId)
      loadExistingAnswer(questionId)
    }, 500)
  }

  // Generate pagination numbers
  const paginationNumbers = Array.from({ length: totalQuizQuestions }, (_, i) => i + 1)

  // Mock relevant links
  const relevantLinks = [
    { title: "Understanding Algebra Fundamentals", href: "#" },
    { title: "Solving Linear Equations", href: "#" },
    { title: "Mathematical Formulas Reference", href: "#" },
  ]

  // if (loading || isLoadingAnswer) {
  //   console.log("Loading quiz interface...")
  //   return <QuizSkeleton />
  // }

  if (error) {
    return <QuizError error={error} onRetry={() => window.location.reload()} />
  }

  if (!question) {
    return <QuizNotFound />
  }

  // Verify we have the correct question
  // if (question.question_id !== currentQuestionId) {
  //   console.warn(`Question mismatch: displaying question ${question.question_id} but should be ${currentQuestionId}`)
  //   return <QuizSkeleton />
  // }

  return (
    <>
      {quizCompleted && (
        <QuizCompletion
          score={0}
          totalQuestions={totalQuizQuestions}
          timeSpent={"900"}
          subject={subjectName}
          quizTitle={quizName || ""}
          correctAnswers={0}
          incorrectAnswers={0}
          noAnswers={0}
          skippedAnswers={0}
        />
      )}
      {!quizCompleted && (
        <div className="mx-auto bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <QuestionPanel
              isTyping={isTyping}
              topicSlug={topicSlug || ""}
              subjectSlug={subjectSlug || ""}
              subjectName={subjectName}
              topicName={topicName}
              quizName={quizName}
              subjectId={subjectId || ""}
              topicId={topicId || ""}
              quizId={quizId}
              quizStatus={quizStatus}
              question={question}
              currentQuestionId={currentQuestionId}
              totalQuestions={totalQuizQuestions}
              paginationNumbers={paginationNumbers}
              selectedOption={selectedOption}
              isAnswerChecked={isAnswerChecked}
              isCorrect={isCorrect}
              onOptionSelect={handleOptionSelect}
              onNavigate={navigateToQuestion}
              onSubmit={checkAnswer}
              onQuestionSelect={handleQuestionSelect}
              onRetakeQuiz={handleRetakeQuiz}
              showRetakeDialog={showRetakeDialog}
              setShowRetakeDialog={setShowRetakeDialog}
              isRetaking={isRetaking}
              quizProgress={quizProgress}
            />

            <ChatPanel
              messages={messages}
              isTyping={isTyping}
              onSendMessage={sendMessage}
              disabled={!isAnswerChecked || isCorrect}
            />
          </div>

          <RelevantLinks links={relevantLinks} />

          {/* Retake Confirmation Dialog */}
          <Dialog open={showRetakeDialog} onOpenChange={setShowRetakeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Retake Quiz</DialogTitle>
                <DialogDescription>
                  Are you sure you want to retake this quiz? This will start a new attempt and your current progress
                  will be saved as attempt {quizProgress?.attempts_count || 1}.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRetakeDialog(false)} disabled={isRetaking}>
                  Cancel
                </Button>
                <Button onClick={handleRetakeQuiz} disabled={isRetaking} className="flex items-center gap-2">
                  {isRetaking ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Start New Attempt
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  )
}

// Loading skeleton component
function QuizSkeleton() {
  return (
    <div className="mx-auto bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-white p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 bg-gray-200" />
            <Skeleton className="h-4 w-1/4 bg-gray-200" />
            <Skeleton className="h-24 w-full bg-gray-200" />
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
