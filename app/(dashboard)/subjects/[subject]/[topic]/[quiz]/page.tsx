"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { QuizInterface } from "@/components/quiz-interface"

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
  quiz_id: number
  title: string
  description: string
  total_questions: number
  questions: Question[]
}

export default function QuizPage({
  params,
}: {
  params: { subject: string; topic: string; quiz: string }
}) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log(params.subject, params.topic, params.quiz)

        // Get user ID from localStorage or use a default
        const userId = localStorage.getItem("userId") || "1"

        const response = await api.get<Quiz>(`questions/questions/quiz-question/1`)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        if (response.data) {
          console.log(response.data)
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
  }, [params.quiz])

  if (isLoading) {
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
    <div className="p-6">
      <QuizInterface quizId={params.quiz} subjectId={params.subject} topicId={params.topic} />
    </div>
  )
}
