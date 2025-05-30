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
import { useParams } from "next/navigation"

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

export default function TopicPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [quizzes, setQuizzes] = useState<any>([])
  const [subjectName, setSubjectName] = useState<string>("")
  const [topicName, setTopicName] = useState<string>("")

  // console.log(params.subject, params.topic)
  // const subject = getSubject(params.subject)
  const params = useParams()
  const subjectId = params?.subject as string
  const topicId = params?.topic as string
  let subject = null as unknown as Subject;
  let topic = null as unknown as Topic;

  // const topic = getTopic(params.subject, params.topic)

  // if (!subject || !topic) {
  //   notFound()
  // }

  // const quizzes = getQuizzes(params.topic)

  useEffect(() => {
    const fetchSubjectName = async () => {
      try {
        const response = await api.get<Subject>(`/subjects/subjects/${subjectId}`)

        if (response.ok) {
          subject = response.data
          setSubjectName(subject.subject_name)
        } else {
          throw new Error("Failed to fetch subject name")
        }
      } catch (error) {
        console.error("Error fetching subject name:", error)
      }
    }

    fetchSubjectName()
  }, [subjectId])

  useEffect(() => {
    const fetchTopicName = async () => {
      try {
        const response = await api.get<Topic>(`/topics/topics/${topicId}`)

        if (response.ok) {
          topic = response.data
          setTopicName(topic.topic_name)
        } else {
          throw new Error("Failed to fetch topic name")
        }
      } catch (error) {
        console.error("Error fetching topic name:", error)
      }
    }

    fetchTopicName()
  }, [topicId])

  // useEffect(() => {
  //   const fetchProgressData = async () => {
  //     try {

  //       const userId = localStorage.getItem("userId")
  //       const response = await api.get<any>(`user-quiz-progress/quiz-progress/${userId}?subject_id=${subjectId}&topic_id=${topicId}`)
  //       const data = await response.data
  //       setQuizzes(data)
  //     } catch (error) {
  //       console.error("Error fetching progress data:", error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchProgressData()
  // }, [])

  useEffect(() => {
    const fetchProgressData = async () => {
      try {

        const userId = localStorage.getItem("userId")
        const response = await api.get<any>(`/quizzes/quizzes/`)
        const data = await response.data
        setQuizzes(data)
      } catch (error) {
        console.error("Error fetching progress data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgressData()
  }, [])

  // Icons for different quiz types
  const quizIcons = ["📊", "📈", "📏", "🧮", "📚", "🔍", "🧩", "🎯"]

  // Background colors for icons
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

  // Progress bar colors
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

  return (
    <div>
      <div className="bg-[#1e74bb] text-white px-8 py-6 relative">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link className="text-white" href="/">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link className="text-white" href={`/subjects/${subjectId}`}>
                  {subjectName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-white" href={`/subjects/${subjectId}`}>{topicName}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-medium text-gray-600 mb-6">Select a quiz to test your knowledge</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map(
            (
              quiz: {
                is_completed: any
                quiz_id: Key | null | undefined
                title: string
                description: any
                total_questions: any
                time_limit: any
                level: any
                icon: any
                iconBg: any
                progress_percentage: any
                progressColor: any
                completed_questions: any
              },
              index: number,
            ) => (
              <QuizCard
                key={quiz.quiz_id}
                title={quiz.title}
                description={quiz.description || "Test your knowledge with this quiz on "}
                questions={quiz.total_questions}
                time={quiz.time_limit}
                difficulty={quiz.level || "Beginner"}
                href={`/subjects/${subjectId}/${topicId}/${quiz.quiz_id}`}
                icon={quiz.icon || quizIcons[index % quizIcons.length]}
                iconBg={quiz.iconBg || iconBgs[index % iconBgs.length]}
                progress={quiz.progress_percentage} // Use quiz progress or generate random for demo
                progressColor={quiz.progressColor || progressColors[index % progressColors.length]}
                completedQuestions={quiz.completed_questions}
                totalQuestions={quiz.total_questions}
                isCompleted={quiz.is_completed}
              />
            ),
          )}
        </div>
      </div>
    </div>
  )
}
