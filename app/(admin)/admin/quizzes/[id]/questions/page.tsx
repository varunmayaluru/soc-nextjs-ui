"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"

interface Quiz {
  quiz_id: number
  title: string
  subject_id: number
  topic_id: number
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

export default function QuizQuestionsPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
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
          setFilteredQuestions(questionsResponse.data)
        } else {
          setQuestions([])
          setFilteredQuestions([])
        }

        setQuiz({
          ...quizData,
          subject_name,
          topic_name,
        })
      } catch (error) {
        console.error("Error fetching quiz and questions:", error)
        setError("Failed to load quiz questions. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizAndQuestions()
  }, [params.id])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredQuestions(questions)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = questions.filter(
        (question) =>
          question.quiz_question_text.toLowerCase().includes(query) ||
          question.options.some((option) => option.option_text.toLowerCase().includes(query)),
      )
      setFilteredQuestions(filtered)
    }
  }, [questions, searchQuery])

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return
    }

    try {
      const response = await api.delete(`/questions/questions/${questionId}`)

      if (!response.ok) {
        throw new Error(`Failed to delete question: ${response.status}`)
      }

      // Remove the question from the list
      setQuestions(questions.filter((q) => q.question_id !== questionId))

      toast({
        title: "Question deleted",
        description: "The question has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting question:", error)
      toast({
        title: "Failed to delete question",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const toggleQuestionStatus = async (question: Question) => {
    try {
      const updatedQuestion = {
        ...question,
        is_active: !question.is_active,
      }

      const response = await api.put(`/questions/questions/${question.question_id}`, updatedQuestion)

      if (!response.ok) {
        throw new Error(`Failed to update question: ${response.status}`)
      }

      // Update the question in the list
      setQuestions(
        questions.map((q) => (q.question_id === question.question_id ? { ...q, is_active: !q.is_active } : q)),
      )

      toast({
        title: `Question ${updatedQuestion.is_active ? "activated" : "deactivated"}`,
        description: `The question has been ${updatedQuestion.is_active ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating question:", error)
      toast({
        title: "Failed to update question",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
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
            <h3 className="text-sm font-medium text-red-800">Error loading questions</h3>
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
          <Link href={`/admin/quizzes/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz
          </Link>
        </Button>

        <h1 className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-8 w-64" /> : `Questions: ${quiz?.title}`}
        </h1>

        {!isLoading && quiz && (
          <Button className="ml-auto bg-[#1e74bb] hover:bg-[#1a65a3]" asChild>
            <Link href={`/admin/quizzes/${params.id}/questions/create`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Link>
          </Button>
        )}
      </div>

      {!isLoading && quiz && (
        <Card className="bg-[#f8fafc] border-[#e2e8f0]">
          <CardContent className="p-4 flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="font-medium">{quiz.title}</h2>
              <p className="text-sm text-gray-500">
                {quiz.subject_name} / {quiz.topic_name}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <Badge className="mr-2 bg-blue-100 text-blue-800">{questions.length} Questions</Badge>
              <Badge className="bg-green-100 text-green-800">
                {questions.filter((q) => q.is_active).length} Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search questions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Questions ({questions.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({questions.filter((q) => q.is_active).length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({questions.filter((q) => !q.is_active).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="py-2">
                      <Skeleton className="h-6 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : filteredQuestions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                {searchQuery ? (
                  <p className="text-gray-500">No questions match your search criteria</p>
                ) : (
                  <>
                    <p className="text-gray-500 mb-6">This quiz doesn't have any questions yet</p>
                    <Button className="bg-[#1e74bb] hover:bg-[#1a65a3]" asChild>
                      <Link href={`/admin/quizzes/${params.id}/questions/create`}>Add First Question</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
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
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={
                          question.is_active ? "bg-green-100 text-green-800 mr-2" : "bg-gray-100 text-gray-800 mr-2"
                        }
                      >
                        {question.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/quizzes/${params.id}/questions/${question.question_id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Question
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleQuestionStatus(question)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {question.is_active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteQuestion(question.question_id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                            {option.is_correct && <Badge className="ml-2 bg-green-100 text-green-800">Correct</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="py-2">
                      <Skeleton className="h-6 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : filteredQuestions.filter((q) => q.is_active).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active questions found</h3>
                <p className="text-gray-500">Activate questions or add new ones</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredQuestions
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
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                          Active
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/quizzes/${params.id}/questions/${question.question_id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Question
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleQuestionStatus(question)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteQuestion(question.question_id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                              {option.is_correct && <Badge className="ml-2 bg-green-100 text-green-800">Correct</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="py-2">
                      <Skeleton className="h-6 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : filteredQuestions.filter((q) => !q.is_active).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inactive questions found</h3>
                <p className="text-gray-500">All questions are currently active</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredQuestions
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
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 mr-2">
                          Inactive
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/quizzes/${params.id}/questions/${question.question_id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Question
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleQuestionStatus(question)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteQuestion(question.question_id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                              {option.is_correct && <Badge className="ml-2 bg-green-100 text-green-800">Correct</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
