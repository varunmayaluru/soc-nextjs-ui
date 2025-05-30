"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ChevronRight } from "lucide-react"
import { QuizInterface } from "@/components/quiz-interface"
import { useParams } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"

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
    attempt_id: number,
    question_id: number,
    question_is_complete: boolean,
    quiz_status: string
  }

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subjectName, setSubjectName] = useState<string>("")
  const [topicName, setTopicName] = useState<string>("")
  const [isQuizExists, setIsQuizExists] = useState(false)

  const params = useParams()
  const subjectId = params?.subject as string
  const topicId = params?.topic as string
  const quizId = params?.quiz as string
  let subject = null as unknown as Subject;
  let topic = null as unknown as Topic;
  const userId = localStorage.getItem("userId")
  const organizationId = localStorage.getItem("organizationId")

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

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true)
        setError(null)



        // Get user ID from localStorage or use a default


        const response = await api.get<Quiz>(`questions/questions/quiz-question/${userId}?quiz_id=${quizId}&subject_id=${subjectId}&topic_id=${topicId}`)

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

  // useEffect(() => {
  //   const fetchQuizProgressExists = async () => {
  //     try {
  //       setIsLoading(true)
  //       setError(null)



  //       // Get user ID from localStorage or use a default
  //       const userId = localStorage.getItem("userId")

  //       const response = await api.get<any>(`user-quiz-progress/quiz-progress/${userId}/exists?subject_id=${subjectId}&topic_id=${topicId}&quiz_id=${quizId}`)

  //       if (!response.ok) {
  //         throw new Error(`API error: ${response.status}`)
  //       }

  //       if (response.data) {
  //         console.log(response.data)
  //         setIsQuizExists(response.data.exists);
  //         if (!response.data.exists) {
  //           try {
  //             const quizAttemptPayload = {
  //               organization_id: organizationId,
  //               user_id: userId,
  //               subject_id: subjectId,
  //               topic_id: topicId,
  //               quiz_id: quizId,
  //               question_id: 1,
  //               attempt_id: 1,
  //               is_complete: false,
  //               is_correct: false,
  //               is_ai_assisted: true,
  //               completion_time_seconds: 0
  //             }

  //             const quizProgressPayload = {
  //               organization_id: organizationId,
  //               user_id: userId,
  //               subject_id: subjectId,
  //               topic_id: topicId,
  //               quiz_id: quizId,
  //               is_complete: false,
  //               latest_score: 0,
  //               best_score: 0,
  //               attempts_count: 1,
  //               completion_time_seconds: 0
  //             }
  //             const response = await api.post<any>(`user-quiz-attempts/quiz-attempts/`, quizAttemptPayload)

  //             const response2 = await api.post<any>(`user-quiz-progress/quiz-progress/`, quizProgressPayload)

  //             if (response.ok) {
  //               console.log(response.data)
  //               console.log(response2.data)
  //             }

  //           } catch (error) {
  //             console.error("Error fetching quiz:", error)
  //             setError(error instanceof Error ? error.message : "Failed to load quiz")

  //           }
  //         }


  //       } else {
  //         throw new Error("No quiz data received")
  //       }
  //     } catch (error) {
  //       console.error("Error fetching quiz:", error)
  //       setError(error instanceof Error ? error.message : "Failed to load quiz")
  //     } finally {
  //       setIsLoading(false)
  //     }

  //   }

  //   fetchQuizProgressExists()

  // }, [])


  useEffect(() => {
    let isMounted = true;
    const fetchQuizProgressExists = async () => {
      try {
        if (!isMounted) return;
  
        setIsLoading(true)
        setError(null)
  
        const userId = localStorage.getItem("userId")
        const response = await api.get<any>(`user-quiz-progress/quiz-progress/${userId}/exists?subject_id=${subjectId}&topic_id=${topicId}&quiz_id=${quizId}`)
  
        if (!response.ok) throw new Error(`API error: ${response.status}`)
  
        if (response.data) {
          setIsQuizExists(response.data.exists)
  
          if (!response.data.exists) {
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
              completion_time_seconds: 0
            }
  
            const quizProgressPayload = {
              organization_id: organizationId,
              user_id: userId,
              subject_id: subjectId,
              topic_id: topicId,
              quiz_id: quizId,
              is_complete: false,
              latest_score: 0,
              best_score: 0,
              attempts_count: 1,
              completion_time_seconds: 0
            }
  
            const response1 = await api.post<any>(`user-quiz-attempts/quiz-attempts/`, quizAttemptPayload)
            const response2 = await api.post<any>(`user-quiz-progress/quiz-progress/`, quizProgressPayload)
  
            if (response1.ok && response2.ok) {
              console.log(response1.data, response2.data)
            }
          }
          else{
            try {
              const quizResponse = await api.get<quizSummary>(`user-quiz-progress/quiz-progress/${userId}/latest-summary?subject_id=${subjectId}&topic_id=${topicId}&quiz_id=${quizId}`)
  
              if (quizResponse.ok) {
                console.log(quizResponse.data)
                 //here we get question_id and attempt_id
                const currentQuestionId = quizResponse.data.question_id;
                const attemptId = quizResponse.data.attempt_id;
                const quizStatus = quizResponse.data.quiz_status;
                // navigate user to currentquestion if quiz status is completed

              } else {
                throw new Error("Failed to fetch quiz data")
              }
            }
            catch (error) {
              console.error("Error fetching quiz:", error)
              setError(error instanceof Error ? error.message : "Failed to load quiz")
            }
          }
        } else {
          throw new Error("No quiz data received")
        }
      } catch (error) {
        console.error("Error fetching quiz:", error)
        setError(error instanceof Error ? error.message : "Failed to load quiz")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
  
    fetchQuizProgressExists()
  
    return () => {
      isMounted = false;
    };
  }, []);
  

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
              <BreadcrumbLink className="text-white" href={`/subjects/${subjectId}/${topicId}`}>{topicName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-white">questions</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <QuizInterface quizId={quizId} subjectId={subjectId} topicId={topicId} />
    </div>
  )
}
