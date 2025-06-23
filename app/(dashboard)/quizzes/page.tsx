"use client"
import { getSubject } from "@/lib/data"
import { api } from "@/lib/api-client"
import QuizCard from "@/components/quiz-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { type Key, useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"

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

interface QuizProgress {
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

export default function TopicPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [quizProgress, setQuizProgress] = useState<QuizProgress>({})

  const searchParams = useSearchParams() // query params
  const subjectId = searchParams.get("subjectId")
  const topicId = searchParams.get("topicId")
  const topicSlug = searchParams.get("topicSlug")
  const subjectSlug = searchParams.get("subjectSlug")
  const subjectName = searchParams.get("subjectName")
  const topicName = searchParams.get("topicName")
  const organizationId = localStorage.getItem("organizationId")

  const userId = localStorage.getItem("userId")
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get<any[]>(
          `quizzes/quizzes/by-subject-topic/${subjectId}/${topicId}?organization_id=${organizationId}`
        )
        setQuizzes(response.ok && response.data ? response.data : [])
      } catch (err) {
        setError("Failed to load quizzes")
        setQuizzes([])
      } finally {
        setIsLoading(false)
      }
    }
    if (subjectId && topicId && organizationId) fetchQuizzes()
  }, [subjectId, topicId, organizationId])


  useEffect(() => {
    const fetchQuizzesProgress = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get<QuizProgress>(
          `quiz-progress/quiz-progress/?user_id=${userId}`
        )
        if (response.ok && response.data) {
          setQuizProgress(response.data)
        }
      } catch (err) {
        setError("Failed to load quizzes")
        setQuizProgress({})
      } finally {
        setIsLoading(false)
      }
    }
    if (userId) fetchQuizzesProgress()
  }, [userId])

  // Icons for different quiz types
  const quizIcons = ["📊", "📈", "📏", "🧮", "📚", "🔍", "🧩", "🎯"]
  const iconBgs = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-red-100",
    "bg-orange-100",
  ]
  const progressColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-orange-500",
  ]

  // Retake handler for quiz card
  const handleRetake = async (quiz: any) => {
    try {
      const payload = {
        quiz_id: quiz.id || quiz.quiz_id,
        subject_id: subjectId,
        topic_id: topicId,
      };
      const response = await api.post<any>(`quiz-attempts/quiz-attempts/start?user_id=${userId}`, payload);
      if (response.ok && response.data && response.data.attempt_number) {
        // Navigate to quiz page with new attempt_number as a query param
        const url = `/quiz?quizId=${quiz.id || quiz.quiz_id}&subjectId=${subjectId}&topicId=${topicId}&topicSlug=${topicSlug}&subjectSlug=${subjectSlug}&quizName=${quiz.title}&subjectName=${subjectName}&topicName=${topicName}&totalQuizQuestions=${quiz.total_questions}&attemptNumber=${response.data.attempt_number}`;
        router.push(url);
      }
    } catch (error) {
      console.error("Failed to start new quiz attempt", error);
    }
  };

  return (
    <div>
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
                <Link className="text-white text-md font-semibold" href={`/topics?subjectId=${subjectId}&subjectSlug=${subjectSlug}&subjectName=${subjectName}`}>
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
      <div className="p-6">
        <h1 className="text-2xl font-medium text-gray-600 mb-6">Select a quiz to test your knowledge</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz, index) => {
              const progressArr = Object.values(quizProgress || {})
              const progress = progressArr.find(
                (p: any) => p.quiz_id === (quiz.id || quiz.quiz_id)
              )
              let progressPercentage = 0
              let completedQuestions = 0
              let totalQuestions = quiz.total_questions || 0
              let quizStatus: 'not_started' | 'in_progress' | 'completed' = 'not_started'

              if (progress) {
                completedQuestions = progress.answered_questions
                totalQuestions = progress.total_questions
                progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0
                if (progress.completed) {
                  quizStatus = 'completed'
                } else if (completedQuestions > 0) {
                  quizStatus = 'in_progress'
                }
              }

              return (
                <QuizCard
                  key={quiz.id || quiz.quiz_id || index}
                  title={quiz.title}
                  description={quiz.description || ""}
                  questions={quiz.total_questions || 0}
                  time={quiz.time_limit || 0}
                  difficulty={quiz.level || "Beginner"}
                  href={`/quiz?quizId=${quiz.id || quiz.quiz_id}&subjectId=${subjectId}&topicId=${topicId}&topicSlug=${topicSlug}&subjectSlug=${subjectSlug}&quizName=${quiz.title}&subjectName=${subjectName}&topicName=${topicName}&totalQuizQuestions=${quiz.total_questions}`}
                  icon={quiz.icon || quizIcons[index % quizIcons.length]}
                  iconBg={quiz.iconBg || iconBgs[index % iconBgs.length]}
                  progress={progressPercentage}
                  progressColor={quiz.progressColor || progressColors[index % progressColors.length]}
                  completedQuestions={completedQuestions}
                  totalQuestions={totalQuestions}
                  quizStatus={quizStatus}
                  progressObj={progress}
                  onRetake={() => handleRetake(quiz)}
                />
              )
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500">No quizzes found</div>
        )}
      </div>
    </div>
  )
}
