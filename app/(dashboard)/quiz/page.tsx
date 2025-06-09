"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { QuizInterface } from "@/components/quiz-interface"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import QuizCompletion from "@/components/quiz/quiz-completion"

// Define the Question interface
interface Question {
  question_id: number
  question_text: string
  options: {
    option_id: number
    option_text: string
  }[]
  correct_option_id?: number
}

// Define the Quiz interface
interface Quiz {
  quizId: number
  title: string
  description: string
  total_questions: number
  questions: Question[]
}

interface Subject {
  organization_id: number
  subject_id: number
  subject_name: string
  is_active: boolean
  created_by: number
  create_date_time: number
  update_date_time: number
}

interface Topic {
  organization_id: number
  subject_id: number
  topic_id: number
  topic_name: string
  is_active: boolean
  created_by: number
  create_date_time: number
  update_date_time: number
}

interface quizSummary {
  attempt_id: number
  question_id: number
  question_is_complete: boolean
  quiz_status: string
}

interface answers {
  organization_id: number
  user_id: number
  subject_id: number
  topic_id: number
  quiz_id: number
  question_id: number
  attempt_id: number
  answer_text: string
  answer_choice_id: number
  submitted_at: ""
  is_correct: boolean
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isQuizExists, setIsQuizExists] = useState(false)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [currentquestionId, setCurrentquestionId] = useState<number | null>(1)
  const [quizStatus, setQuizStatus] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const searchParams = useSearchParams() // query params
  const subjectId = searchParams.get("subjectId")
  const topicId = searchParams.get("topicId")
  const quizId = searchParams.get("quizId")
  const topicSlug = searchParams.get("topicSlug")
  const subjectSlug = searchParams.get("subjectSlug")
  const quizName = searchParams.get("quizName")
  const subjectName = searchParams.get("subjectName")
  const topicName = searchParams.get("topicName")
  let subject = null as unknown as Subject
  let topic = null as unknown as Topic
  const userId = localStorage.getItem("userId")
  const organizationId = localStorage.getItem("organizationId")




  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Note: This endpoint seems to always return question 1 data
        // We'll use it just to verify the quiz exists, not for question data
        const response = await api.get<Quiz>(
          `questions/questions/quiz-question/1?quiz_id=${quizId}&organization_id=${organizationId}`,
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        if (response.data) {
          console.log("Quiz verified:", response.data)
          setQuiz(response.data)
        } else {
          throw new Error("No quiz data received")
        }
      } catch (error) {
        console.error("Error fetching quiz:", error)
        setError(error instanceof Error ? error.message : "Failed to load quiz")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    let isMounted = true
    const fetchQuizProgressExists = async () => {
      try {
        if (!isMounted) return

        setIsLoading(true)
        setError(null)

        const userId = localStorage.getItem("userId")
        const response = await api.get<any>(
          `user-quiz-progress/quiz-progress/${userId}/exists?organization_id=${organizationId}&subject_id=${subjectId}&topic_id=${topicId}&quiz_id=${quizId}`,
        )

        if (!response.ok) throw new Error(`API error: ${response.status}`)

        if (response.data) {
          setIsQuizExists(response.data.exists)

          if (!response.data.exists) {
            // Create new quiz attempt and progress if it doesn't exist
            const quizAttemptPayload = {
              organization_id: organizationId,
              user_id: userId,
              subject_id: subjectId,
              topic_id: topicId,
              quiz_id: quizId,
              question_id: 1,
              attempt_id: 1,
              is_complete: false,
              is_correct: false,
              is_ai_assisted: false,
              completion_time_seconds: 0,
            }

            const quizProgressPayload = {
              organization_id: organizationId,
              user_id: userId,
              subject_id: subjectId,
              topic_id: topicId,
              quiz_id: quizId,
              is_completed: false,
              latest_score: 0,
              best_score: 0,
              attempts_count: 1,
              completion_time_seconds: 0,
            }

            const [attemptResponse, progressResponse] = await Promise.all([
              api.post<any>(`user-quiz-attempts/quiz-attempts/`, quizAttemptPayload),
              api.post<any>(`user-quiz-progress/quiz-progress/`, quizProgressPayload),
            ])

            if (attemptResponse.ok && progressResponse.ok) {
              console.log("New quiz attempt and progress created")
              setCurrentquestionId(1)
              setAttemptId(1)
              setIsInitialized(true)
            } else {
              console.error("Failed to create quiz attempt or progress")
            }
          } else {
            // If quiz exists, fetch the latest question and attempt
            try {
              const quizResponse = await api.get<quizSummary>(
                `user-quiz-attempts/quiz-attempts/${userId}/latest?organization_id=${organizationId}&subject_id=${subjectId}&topic_id=${topicId}&quiz_id=${quizId}`,
              )

              if (quizResponse.ok && quizResponse.data) {
                console.log("Retrieved quiz progress:", quizResponse.data)

                // Set quiz status based on the response
                if (quizResponse.data.quiz_status === "complete") {
                  setQuizStatus(true)
                  setCurrentquestionId(1)
                } else {
                  setQuizStatus(false)
                  // If the question is complete, move to the next question
                  if (quizResponse.data.question_is_complete) {
                    const nextQuestionId = quizResponse.data.question_id + 1
                    setCurrentquestionId(nextQuestionId)
                    console.log("Moving to next question:", nextQuestionId)
                  } else {
                    setCurrentquestionId(quizResponse.data.question_id)
                    console.log("Continuing with current question:", quizResponse.data.question_id)
                  }
                  if (!quizResponse.data.question_id) {
                    setCurrentquestionId(1)
                  }
                }

                setAttemptId(quizResponse.data.attempt_id)
                setIsInitialized(true)
              } else {
                throw new Error("Failed to fetch quiz data")
              }
            } catch (error) {
              console.error("Error fetching quiz summary:", error)
              setError(error instanceof Error ? error.message : "Failed to load quiz")
            }
          }
        } else {
          throw new Error("No quiz data received")
        }
      } catch (error) {
        console.error("Error fetching quiz progress:", error)
        setError(error instanceof Error ? error.message : "Failed to load quiz")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchQuizProgressExists()

    return () => {
      isMounted = false
    }
  }, [])

  const handleRetakeQuiz = async () => {
    try {
      // Fetch the latest quiz progress to get the current attempt count
      const progressResponse = await api.get<any>(
        `user-quiz-attempts/quiz-attempts/${userId}/latest?organization_id=${organizationId}&subject_id=${subjectId}&topic_id=${topicId}&quiz_id=${quizId}`,
      )

      if (progressResponse.ok && progressResponse.data) {
        const newAttemptId = progressResponse.data.attempt_id + 1
        setAttemptId(newAttemptId)
        setCurrentquestionId(1)
        setQuizStatus(false)

        console.log("Quiz retake initialized with attempt ID:", newAttemptId)
      }
    } catch (error) {
      console.error("Error handling quiz retake:", error)
    }
  }

  if (isLoading || !isInitialized) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-3/4 max-w-md mb-4" />
        <Skeleton className="h-6 w-1/2 max-w-sm mb-8" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Skeleton className="h-8 w-full max-w-2xl mb-6" />

          <div className="space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
          </div>

          <div className="flex justify-between mt-8">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <button onClick={() => window.location.reload()} className="ml-2 underline hover:no-underline">
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Quiz not found</AlertTitle>
          <AlertDescription>
            The requested quiz could not be found. Please go back and select another quiz.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <QuizInterface
        topicSlug={topicSlug || ""}
        subjectSlug={subjectSlug || ""}
        quizStatus={quizStatus}
        questionId={currentquestionId?.toString()}
        attemptId={attemptId}
        quizId={quizId?.toString() || ""}
        subjectId={subjectId?.toString() || ""}
        topicId={topicId?.toString() || ""}
        subjectName={subjectName || ""}
        topicName={topicName || ""}
        quizName={quizName || ""}
        setQuizStatus={setQuizStatus}
        onRetakeQuiz={handleRetakeQuiz}
      />
    </div>
  )
}
