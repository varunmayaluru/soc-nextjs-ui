"use client"

import { api } from "@/lib/api-client"
import QuizCard from "@/components/quiz-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

// API response types
interface QuizApiResponse {
  id: string
  title: string
  description?: string
  total_questions: number
  time_limit: number
  level: string
  organization_id: string
  subject_id: string
  topic_id: string
  is_active: boolean
  created_by: string
  create_date_time: string
  update_date_time: string
  icon?: string
  iconBg?: string
  progressColor?: string
}

interface QuizProgressResponse {
  [key: string]: {
    user_id: string
    subject_id: string
    topic_id: string
    quiz_id: string
    attempt_number: number
    current_question: number
    total_questions: number
    answered_questions: number
    score: number
    time_spent: number
    completed: boolean
    answers: {
      [questionId: string]: number
    }
    id: number
    started_at: string
    updated_at: string
  }
}

// Frontend quiz type
interface Quiz {
  id: string
  title: string
  description: string
  totalQuestions: number
  timeLimit: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string
  iconBg: string
  progressColor: string
  progress: number
  completedQuestions: number
  totalQuestionsForProgress: number
  quizStatus: "not_started" | "in_progress" | "completed"
  progressObj?: QuizProgressResponse[string]
}

// Visual configuration for quizzes
const QUIZ_VISUALS = {
  icons: ["📊", "📈", "📏", "🧮", "📚", "🔍", "🧩", "🎯"],
  iconBgs: [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-red-100",
    "bg-orange-100",
  ],
  progressColors: [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-orange-500",
  ],
} as const

// Helper functions
const getQuizVisuals = (index: number) => ({
  icon: QUIZ_VISUALS.icons[index % QUIZ_VISUALS.icons.length],
  iconBg: QUIZ_VISUALS.iconBgs[index % QUIZ_VISUALS.iconBgs.length],
  progressColor: QUIZ_VISUALS.progressColors[index % QUIZ_VISUALS.progressColors.length],
})

const mapDifficulty = (level: string): "Beginner" | "Intermediate" | "Advanced" => {
  const lowerLevel = level.toLowerCase()
  if (lowerLevel.includes("intermediate") || lowerLevel.includes("medium")) {
    return "Intermediate"
  } else if (lowerLevel.includes("advanced") || lowerLevel.includes("hard")) {
    return "Advanced"
  }
  return "Beginner"
}

const calculateQuizProgress = (quiz: QuizApiResponse, progressData: QuizProgressResponse): Quiz => {
  const progressArr = Object.values(progressData || {})
  const progress = progressArr.find((p) => p.quiz_id === quiz.id)

  let progressPercentage = 0
  let completedQuestions = 0
  let totalQuestionsForProgress = quiz.total_questions
  let quizStatus: "not_started" | "in_progress" | "completed" = "not_started"

  if (progress) {
    completedQuestions = progress.answered_questions
    totalQuestionsForProgress = progress.total_questions
    progressPercentage =
      totalQuestionsForProgress > 0 ? Math.round((completedQuestions / totalQuestionsForProgress) * 100) : 0

    if (progress.completed) {
      quizStatus = "completed"
    } else if (completedQuestions > 0) {
      quizStatus = "in_progress"
    }
  }

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description || "",
    totalQuestions: quiz.total_questions,
    timeLimit: quiz.time_limit,
    difficulty: mapDifficulty(quiz.level),
    icon: quiz.icon || "",
    iconBg: quiz.iconBg || "",
    progressColor: quiz.progressColor || "",
    progress: progressPercentage,
    completedQuestions,
    totalQuestionsForProgress,
    quizStatus,
    progressObj: progress,
  }
}

const formatQuiz = (quiz: QuizApiResponse, index: number, progressData: QuizProgressResponse): Quiz => {
  const visuals = getQuizVisuals(index)
  const quizWithProgress = calculateQuizProgress(quiz, progressData)

  return {
    ...quizWithProgress,
    icon: quizWithProgress.icon || visuals.icon,
    iconBg: quizWithProgress.iconBg || visuals.iconBg,
    progressColor: quizWithProgress.progressColor || visuals.progressColor,
  }
}

export default function QuizzesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [quizzes, setQuizzes] = useState<QuizApiResponse[]>([])
  const [formattedQuizzes, setFormattedQuizzes] = useState<Quiz[]>([])
  const [error, setError] = useState<string | null>(null)
  const [quizProgress, setQuizProgress] = useState<QuizProgressResponse>({})
  const [quizzesLoaded, setQuizzesLoaded] = useState(false)
  const [progressLoaded, setProgressLoaded] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  const subjectId = searchParams.get("subjectId")
  const topicId = searchParams.get("topicId")
  const topicSlug = searchParams.get("topicSlug")
  const subjectSlug = searchParams.get("subjectSlug")
  const subjectName = searchParams.get("subjectName")
  const topicName = searchParams.get("topicName")

  const organizationId = localStorage.getItem("organizationId")
  const userId = localStorage.getItem("userId")

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!subjectId || !topicId || !organizationId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await api.get<QuizApiResponse[]>(
          `quizzes/quizzes/by-subject-topic/${subjectId}/${topicId}?organization_id=${organizationId}`,
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const quizzesData = response.data || []
        setQuizzes(quizzesData)
        setQuizzesLoaded(true)
      } catch (err) {
        console.error("Error fetching quizzes:", err)
        setError("Failed to load quizzes")
        setQuizzes([])
        setQuizzesLoaded(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizzes()
  }, [subjectId, topicId, organizationId])

  // Fetch quiz progress
  useEffect(() => {
    const fetchQuizProgress = async () => {
      if (!userId) {
        setProgressLoaded(true)
        return
      }

      try {
        const response = await api.get<QuizProgressResponse>(`quiz-progress/quiz-progress/?user_id=${userId}`)

        if (response.ok && response.data) {
          setQuizProgress(response.data)
        }
      } catch (err) {
        console.error("Error fetching quiz progress:", err)
        setQuizProgress({})
      } finally {
        setProgressLoaded(true)
      }
    }

    fetchQuizProgress()
  }, [userId])

  // Format quizzes with progress data when both are loaded
  useEffect(() => {
    if (quizzesLoaded && progressLoaded) {
      const formatted = quizzes.map((quiz, index) => formatQuiz(quiz, index, quizProgress))
      setFormattedQuizzes(formatted)
    }
  }, [quizzesLoaded, progressLoaded, quizProgress, quizzes])

  // Check if all data is loaded
  const isDataLoaded = quizzesLoaded && progressLoaded

  // Retake handler
  const handleRetake = async (quiz: Quiz) => {
    if (!userId) return

    try {

        const deleteQuizProgress = await api.delete<any>(
          `quiz-progress/quiz-progress/?quiz_id=${quiz.id}&subject_id=${subjectId}&topic_id=${topicId}&user_id=${userId}`,
        )
        if (deleteQuizProgress.ok) {
          console.log("Quiz progress deleted successfully")
        } else {
          console.error("Failed to delete quiz progress")
        }
      const payload = {
        quiz_id: quiz.id,
        subject_id: subjectId,
        topic_id: topicId,
      }

      const response = await api.post<any>(`quiz-attempts/quiz-attempts/start?user_id=${userId}`, payload)

      if (response.ok && response.data?.attempt_number) {
        const url = `/quiz?quizId=${quiz.id}&subjectId=${subjectId}&topicId=${topicId}&topicSlug=${topicSlug}&subjectSlug=${subjectSlug}&quizName=${quiz.title}&subjectName=${subjectName}&topicName=${topicName}&totalQuizQuestions=${quiz.totalQuestions}&attemptNumber=${response.data.attempt_number}`
        router.push(url)
      }
    } catch (error) {
      console.error("Failed to start new quiz attempt", error)
    }
  }

  // Review handler with handleContinue functionality
  const handleReview = async (quiz: Quiz) => {
    if (!userId || !quiz.progressObj) return

    try {
      // Build URL with review mode and navigation parameters
      const url = new URL(
        `/quiz?quizId=${quiz.id}&subjectId=${subjectId}&topicId=${topicId}&topicSlug=${topicSlug}&subjectSlug=${subjectSlug}&quizName=${quiz.title}&subjectName=${subjectName}&topicName=${topicName}&totalQuizQuestions=${quiz.totalQuestions}`,
        window.location.origin,
      )

      // Add review mode parameters
      url.searchParams.set("mode", "review")
      url.searchParams.set("currentQuestion", "1")
      url.searchParams.set("attemptId", String(quiz.progressObj.id))
      url.searchParams.set("attemptNumber", String(quiz.progressObj.attempt_number))

      router.push(url.pathname + url.search)
    } catch (error) {
      console.error("Failed to navigate to review mode", error)
    }
  }

  const renderBreadcrumb = () => (
    <div className="bg-[#1e74bb] text-white px-8 py-6 relative">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-white text-md font-semibold" href="/">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                className="text-white text-md font-semibold"
                href={`/topics?subjectId=${subjectId}&subjectSlug=${subjectSlug}&subjectName=${subjectName}`}
              >
                {subjectName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-white text-md font-semibold">{topicName}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )

  const renderQuizCard = (quiz: Quiz, index: number) => (
    <QuizCard
      key={quiz.id}
      title={quiz.title}
      description={quiz.description}
      questions={quiz.totalQuestions}
      time={quiz.timeLimit}
      difficulty={quiz.difficulty}
      href={`/quiz?quizId=${quiz.id}&subjectId=${subjectId}&topicId=${topicId}&topicSlug=${topicSlug}&subjectSlug=${subjectSlug}&quizName=${quiz.title}&subjectName=${subjectName}&topicName=${topicName}&totalQuizQuestions=${quiz.totalQuestions}`}
      icon={quiz.icon}
      iconBg={quiz.iconBg}
      progress={quiz.progress}
      progressColor={quiz.progressColor}
      completedQuestions={quiz.completedQuestions}
      totalQuestions={quiz.totalQuestionsForProgress}
      quizStatus={quiz.quizStatus}
      progressObj={quiz.progressObj}
      onRetake={() => handleRetake(quiz)}
      onReview={() => handleReview(quiz)}
    />
  )

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <Skeleton className="bg-gray-200 w-10 h-10 rounded-md mr-4" />
              <div className="flex-1">
                <Skeleton className="bg-gray-200 h-6 w-32 mb-2" />
                <Skeleton className="bg-gray-200 h-4 w-24" />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <Skeleton className="bg-gray-200 h-4 w-16" />
                <Skeleton className="bg-gray-200 h-4 w-12" />
              </div>
              <Skeleton className="bg-gray-200 h-2.5 w-full rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <Skeleton className="bg-gray-200 h-6 w-20 rounded-full" />
              <Skeleton className="bg-gray-200 h-10 w-32 rounded-md" />
            </div>
          </div>
        ))}
    </div>
  )

  const renderErrorState = () => (
    <div className="text-center py-8">
      <div className="text-red-500 mb-2">⚠️</div>
      <p className="text-red-500 mb-2">{error}</p>
      <button onClick={() => window.location.reload()} className="text-[#1e74bb] underline hover:no-underline">
        Try again
      </button>
    </div>
  )

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <div className="text-gray-400 mb-2">📝</div>
      <p className="text-gray-500">No quizzes found for this topic</p>
    </div>
  )

  return (
    <div>
      {renderBreadcrumb()}

      <div className="p-6">
        <h1 className="text-2xl font-medium text-gray-600 mb-6">Select a quiz to test your knowledge</h1>

        {isLoading || !isDataLoaded ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : formattedQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {formattedQuizzes.map((quiz, index) => renderQuizCard(quiz, index))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  )
}
