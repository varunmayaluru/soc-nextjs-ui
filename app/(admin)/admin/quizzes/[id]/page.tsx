"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, Book, Clock, Edit, GraduationCap, Percent } from "lucide-react"
import Link from "next/link"

interface Quiz {
  quiz_id: number
  subject_id: number
  topic_id: number
  title: string
  description: string
  difficulty_level: string
  time_limit_minutes: number
  passing_percentage: number
  is_active: boolean
  created_by: number
  create_date_time: string
  update_date_time: string | null
  subject_name?: string
  topic_name?: string
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
  options: {
    quiz_question_option_id: number
    option_text: string
    is_correct: boolean
  }[]
}

export default function QuizDetailsPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch quiz details
        const quizResponse = await api.get<Quiz>(`/quizzes/quizzes/${params.id}`)

        if (!quizResponse.ok) {
          throw new Error(`Failed to fetch quiz: ${quizResponse.status}`)
        }

        const quizData = quizResponse.data

        // Fetch subject name
        const subjectResponse = await api.get(`/subjects/subjects/${quizData.subject_id}`)
        const subject_name = subjectResponse.ok ? subjectResponse.data.subject_name : "Unknown Subject"

        // Fetch topic name
        const topicResponse = await api.get(`/topics/topics/${quizData.topic_id}`)
        const topic_name = topicResponse.ok ? topicResponse.data.topic_name : "Unknown Topic"

        // Fetch questions for this quiz
        const questionsResponse = await api.get<Question[]>(`/questions/questions/quiz/${params.id}`)

        if (questionsResponse.ok) {
          setQuestions(questionsResponse.data)
        }

        setQuiz({
          ...quizData,
          subject_name,
          topic_name,
        })
      } catch (error) {
        console.error("Error fetching quiz details:", error)
        setError("Failed to load quiz details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizDetails()
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start mb-6">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading quiz details</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" asChild>
          <Link href="/admin/quizzes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Link>
        </Button>

        <h1 className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-64" /> : quiz?.title}</h1>

        {!isLoading && quiz && (
          <Button variant="outline" size="sm" className="ml-auto" asChild>
            <Link href={`/admin/quizzes/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Quiz
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : quiz ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quiz Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="mt-1">{quiz.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{quiz.description || "No description provided"}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getDifficultyColor(quiz.difficulty_level)}>
                    {quiz.difficulty_level.charAt(0).toUpperCase() + quiz.difficulty_level.slice(1)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={quiz.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {quiz.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quiz Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Book className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                    <p className="mt-1">{quiz.subject_name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Topic</h3>
                    <p className="mt-1">{quiz.topic_name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Time Limit</h3>
                    <p className="mt-1">{quiz.time_limit_minutes} minutes</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Percent className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Passing Percentage</h3>
                    <p className="mt-1">{quiz.passing_percentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quiz Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Questions</h3>
                  <p className="text-2xl font-semibold mt-1">{questions.length}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                  <p className="mt-1">{formatDate(quiz.create_date_time)}</p>
                </div>

                {quiz.update_date_time && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-1">{formatDate(quiz.update_date_time)}</p>
                  </div>
                )}

                <div className="pt-4">
                  <Button className="w-full bg-[#1e74bb] hover:bg-[#1a65a3]" asChild>
                    <Link href={`/admin/quizzes/${params.id}/questions`}>Manage Questions</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quiz Questions ({questions.length})</h2>

            {questions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Book className="h-12 w-12 text-gray-400 mb-4" />
                  <CardTitle className="text-xl mb-2">No Questions Added Yet</CardTitle>
                  <CardDescription className="text-center max-w-md mb-6">
                    This quiz doesn't have any questions yet. Add questions to make this quiz available to students.
                  </CardDescription>
                  <Button className="bg-[#1e74bb] hover:bg-[#1a65a3]" asChild>
                    <Link href={`/admin/quizzes/${params.id}/questions/create`}>Add First Question</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Questions ({questions.length})</TabsTrigger>
                  <TabsTrigger value="active">Active ({questions.filter((q) => q.is_active).length})</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive ({questions.filter((q) => !q.is_active).length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <Card key={question.question_id} className="overflow-hidden">
                        <div
                          className={`px-4 py-2 ${question.is_active ? "bg-green-50" : "bg-gray-50"} border-b flex justify-between items-center`}
                        >
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 mr-2">Question {index + 1}</span>
                            <Badge variant="outline" className={getDifficultyColor(question.difficulty_level)}>
                              {question.difficulty_level.charAt(0).toUpperCase() + question.difficulty_level.slice(1)}
                            </Badge>
                            {question.is_maths && (
                              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                                Math
                              </Badge>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={question.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {question.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <CardContent className="pt-4">
                          <p className="font-medium mb-4">{question.quiz_question_text}</p>

                          <div className="space-y-2 ml-4">
                            {question.options.map((option) => (
                              <div
                                key={option.quiz_question_option_id}
                                className={`p-2 rounded-md ${option.is_correct ? "bg-green-50 border border-green-200" : ""}`}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-4 h-4 rounded-full mr-2 ${option.is_correct ? "bg-green-500" : "border border-gray-300"}`}
                                  ></div>
                                  <span>{option.option_text}</span>
                                  {option.is_correct && (
                                    <Badge className="ml-2 bg-green-100 text-green-800">Correct</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/quizzes/${params.id}/questions/${question.question_id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Question
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="active" className="mt-0">
                  <div className="space-y-4">
                    {questions
                      .filter((q) => q.is_active)
                      .map((question, index) => (
                        <Card key={question.question_id} className="overflow-hidden">
                          <div className="px-4 py-2 bg-green-50 border-b flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700 mr-2">Question {index + 1}</span>
                              <Badge variant="outline" className={getDifficultyColor(question.difficulty_level)}>
                                {question.difficulty_level.charAt(0).toUpperCase() + question.difficulty_level.slice(1)}
                              </Badge>
                              {question.is_maths && (
                                <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                                  Math
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          </div>
                          <CardContent className="pt-4">
                            <p className="font-medium mb-4">{question.quiz_question_text}</p>

                            <div className="space-y-2 ml-4">
                              {question.options.map((option) => (
                                <div
                                  key={option.quiz_question_option_id}
                                  className={`p-2 rounded-md ${option.is_correct ? "bg-green-50 border border-green-200" : ""}`}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={`w-4 h-4 rounded-full mr-2 ${option.is_correct ? "bg-green-500" : "border border-gray-300"}`}
                                    ></div>
                                    <span>{option.option_text}</span>
                                    {option.is_correct && (
                                      <Badge className="ml-2 bg-green-100 text-green-800">Correct</Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-end mt-4">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/quizzes/${params.id}/questions/${question.question_id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Question
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="inactive" className="mt-0">
                  <div className="space-y-4">
                    {questions
                      .filter((q) => !q.is_active)
                      .map((question, index) => (
                        <Card key={question.question_id} className="overflow-hidden">
                          <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700 mr-2">Question {index + 1}</span>
                              <Badge variant="outline" className={getDifficultyColor(question.difficulty_level)}>
                                {question.difficulty_level.charAt(0).toUpperCase() + question.difficulty_level.slice(1)}
                              </Badge>
                              {question.is_maths && (
                                <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                                  Math
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              Inactive
                            </Badge>
                          </div>
                          <CardContent className="pt-4">
                            <p className="font-medium mb-4">{question.quiz_question_text}</p>

                            <div className="space-y-2 ml-4">
                              {question.options.map((option) => (
                                <div
                                  key={option.quiz_question_option_id}
                                  className={`p-2 rounded-md ${option.is_correct ? "bg-green-50 border border-green-200" : ""}`}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={`w-4 h-4 rounded-full mr-2 ${option.is_correct ? "bg-green-500" : "border border-gray-300"}`}
                                    ></div>
                                    <span>{option.option_text}</span>
                                    {option.is_correct && (
                                      <Badge className="ml-2 bg-green-100 text-green-800">Correct</Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-end mt-4">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/quizzes/${params.id}/questions/${question.question_id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Question
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Book className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Quiz not found</h3>
          <p className="text-gray-500 mt-1">The requested quiz could not be found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/admin/quizzes">Return to Quizzes</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
