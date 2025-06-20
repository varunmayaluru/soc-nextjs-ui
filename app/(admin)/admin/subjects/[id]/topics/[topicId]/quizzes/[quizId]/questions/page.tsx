"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Quiz = {
  quiz_id: number
  quiz_name: string
  quiz_description: string
  topic_id: number
  subject_id: number
  organization_id: number
  is_active: boolean
  time_limit_seconds: number
  passing_percentage: number
  created_by: number
  create_date_time: string
  update_date_time: string
}

type Question = {
  question_number: number
  quiz_id: number
  question_text: string
  question_type: string
  is_active: boolean
  created_by: number
  create_date_time: string
  update_date_time: string
  options: QuestionOption[]
}

type QuestionOption = {
  option_id: number
  option_number: number
  option_text: string
  is_correct: boolean
  created_by: number
  create_date_time: string
  update_date_time: string
}

export default function QuestionsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const subjectId = params.id as string
  const topicId = params.topicId as string
  const quizId = params.quizId as string

  // Fetch quiz and questions on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizResponse = await api.getQuizById(quizId)
        setQuiz(quizResponse.data)

        const questionsResponse = await api.getQuestionsByQuizId(quizId)
        setQuestions(questionsResponse.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch quiz and questions",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [quizId, toast])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  return (
    <div className="p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/subjects/${subjectId}`}>Subjects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/subjects/${subjectId}/topics/${topicId}`}>Topics</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/subjects/${subjectId}/topics/${topicId}/quizzes/${quizId}`}>
              Quizzes
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" aria-current="page">
              Questions
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{quiz.quiz_name}</CardTitle>
          <CardContent>
            <p>{quiz.quiz_description}</p>
          </CardContent>
        </CardHeader>
      </Card>

      <div className="mt-4 flex justify-between items-center">
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3"
        />
      </div>

      <div className="mt-4">{/* Grid/Table view toggle and question list here */}</div>
    </div>
  )
}
