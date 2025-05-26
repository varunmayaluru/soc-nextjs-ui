"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FileText,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  BookOpen,
  BookOpenCheck,
  Layers,
  ChevronRight,
  Upload,
} from "lucide-react"
import { api } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import QuizUploadForm from "@/components/admin/quiz-upload-form"

type Subject = {
  subject_id: number
  subject_name: string
  organization_id: number
  is_active: boolean
  created_by: number
  create_date_time: string
}

type Topic = {
  organization_id: number
  subject_id: number
  topic_id: number
  topic_name: string
  is_active: boolean
  created_by: string
  create_date_time: string
}

type Quiz = {
  quiz_id: number
  title: string
  description: string
  topic_id: number
  subject_id: number
  organization_id: number
  level: string
  total_questions: number
  is_active: boolean
  time_limit: number
  passing_score: number
  created_by: number
  create_date_time: string
  update_date_time: string
}

export default function QuizzesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [subject, setSubject] = useState<Subject | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogId, setEditDialogId] = useState<number | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedQuizForUpload, setSelectedQuizForUpload] = useState<Quiz | null>(null)

  const subjectId = params.id as string
  const topicId = params.topicId as string

  // Fetch subject, topic, and quizzes on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchSubject()
      await fetchTopic()
      await fetchQuizzes()
    }

    fetchData()
  }, [subjectId, topicId])

  // Fetch subject from API
  const fetchSubject = async () => {
    try {
      const response = await api.get<Subject>(`/subjects/subjects/${subjectId}`)

      if (response.ok) {
        setSubject(response.data)
      } else {
        throw new Error("Failed to fetch subject")
      }
    } catch (error) {
      console.error("Error fetching subject:", error)
      toast({
        title: "Error",
        description: "Failed to load subject details. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Fetch topic from API
  const fetchTopic = async () => {
    try {
      const response = await api.get<Topic>(`/topics/topics/${topicId}`)

      if (response.ok) {
        setTopic(response.data)
      } else {
        throw new Error("Failed to fetch topic")
      }
    } catch (error) {
      console.error("Error fetching topic:", error)
      toast({
        title: "Error",
        description: "Failed to load topic details. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Fetch quizzes from API
  const fetchQuizzes = async () => {
    setIsLoading(true)
    try {
      // Use the API endpoint for fetching quizzes by topic
      const response = await api.get<Quiz[]>(`quizzes/quizzes/by-subject-topic/${subjectId}/${topicId}`)

      if (response.ok) {
        setQuizzes(response.data)
      } else {
        throw new Error("Failed to fetch quizzes")
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error)
      toast({
        title: "Error",
        description: "Failed to load quizzes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and sort quizzes
  const filteredQuizzes = quizzes
    .filter((quiz) => quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else {
        return sortOrder === "asc"
          ? new Date(a.create_date_time).getTime() - new Date(b.create_date_time).getTime()
          : new Date(b.create_date_time).getTime() - new Date(a.create_date_time).getTime()
      }
    })

  // Delete quiz handler
  const handleDeleteQuiz = async (id: number) => {
    try {
      const response = await api.delete(`/quizzes/quizzes/${id}`)

      if (response.ok) {
        setQuizzes(quizzes.filter((quiz) => quiz.quiz_id !== id))
        toast({
          title: "Success",
          description: "Quiz deleted successfully",
        })
      } else {
        throw new Error("Failed to delete quiz")
      }
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast({
        title: "Error",
        description: "Failed to delete quiz. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle upload button click for specific quiz
  const handleUploadClick = (quiz: Quiz) => {
    setSelectedQuizForUpload(quiz)
    setUploadDialogOpen(true)
  }

  // Handle upload dialog close
  const handleUploadDialogClose = (open: boolean) => {
    setUploadDialogOpen(open)
    if (!open) {
      setSelectedQuizForUpload(null)
    }
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  // Format seconds to minutes and seconds
  const formatTimeLimit = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1e74bb] to-[#4a9eda] text-white p-6 rounded-lg shadow-md mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-24"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full transform -translate-x-20 translate-y-20"></div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white text-[#1e74bb] hover:bg-gray-100">Admin Level</Badge>
              <Badge className="bg-[#0d4c7a] text-white">Quizzes Hub</Badge>
            </div>
            <h1 className="text-2xl font-bold mb-1 flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              Quizzes for {topic?.topic_name || "Loading..."}
            </h1>
            <p className="text-gray-100">Manage quizzes for this topic</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  className="bg-white text-[#1e74bb] hover:bg-gray-100 shadow-sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Quiz</DialogTitle>
                  <DialogDescription>Create a new quiz for {topic?.topic_name}.</DialogDescription>
                </DialogHeader>
                <QuizForm
                  subjectId={Number(subjectId)}
                  topicId={Number(topicId)}
                  subjectName={subject?.subject_name || ""}
                  topicName={topic?.topic_name || ""}
                  onSuccess={() => {
                    fetchQuizzes()
                    setAddDialogOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap">
          <li className="inline-flex items-center">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#1e74bb] transition-colors"
            >
              <Layers className="w-4 h-4 mr-2 text-[#1e74bb]" />
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center mx-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </li>
          <li>
            <Link
              href="/admin/subjects"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#1e74bb] transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2 text-[#1e74bb]" />
              Subjects
            </Link>
          </li>
          <li>
            <div className="flex items-center mx-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </li>
          <li>
            <Link
              href={`/admin/subjects/${subjectId}/topics`}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#1e74bb] transition-colors"
            >
              <BookOpenCheck className="w-4 h-4 mr-2 text-[#1e74bb]" />
              {subject?.subject_name || "Topics"}
            </Link>
          </li>
          <li>
            <div className="flex items-center mx-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-sm font-medium text-[#1e74bb] flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                {topic?.topic_name || "Quizzes"}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <Card className="border border-[#e6f0f9] shadow-sm mb-6 overflow-hidden">
        <CardHeader className="pb-0 bg-gradient-to-r from-[#e6f0f9] to-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e74bb] opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
          <CardTitle className="text-lg flex items-center">
            <BookOpenCheck className="mr-2 h-5 w-5 text-[#1e74bb]" />
            Topic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-gradient-to-b from-[#f0f7ff] to-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm border border-[#e6f0f9] flex items-start gap-3">
              <div className="bg-[#e6f0f9] p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-[#1e74bb]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1e74bb]">Subject</p>
                <p className="font-medium text-gray-800">{subject?.subject_name || "Loading..."}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm border border-[#e6f0f9] flex items-start gap-3">
              <div className="bg-[#e6f0f9] p-2 rounded-full">
                <BookOpenCheck className="h-5 w-5 text-[#1e74bb]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1e74bb]">Topic</p>
                <p className="font-medium text-gray-800">{topic?.topic_name || "Loading..."}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm border border-[#e6f0f9] flex items-start gap-3">
              <div className="bg-[#e6f0f9] p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-[#1e74bb]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1e74bb]">Status</p>
                <Badge
                  variant={topic?.is_active ? "default" : "outline"}
                  className={
                    topic?.is_active
                      ? "bg-green-100 text-green-800 hover:bg-green-200 mt-1 border border-green-200"
                      : "bg-gray-100 text-gray-500 mt-1 border border-gray-200"
                  }
                >
                  {topic?.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="grid" className="data-[state=active]:bg-white data-[state=active]:text-[#1e74bb]">
              <div className="flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                Grid View
              </div>
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-white data-[state=active]:text-[#1e74bb]">
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Table View
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search quizzes..."
                className="pl-8 w-[200px] md:w-[300px] border-gray-200 focus-visible:ring-[#1e74bb]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-200">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-gray-200">
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("name")
                    toggleSortOrder()
                  }}
                  className="cursor-pointer"
                >
                  By Name ({sortOrder === "asc" ? "A-Z" : "Z-A"})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("date")
                    toggleSortOrder()
                  }}
                  className="cursor-pointer"
                >
                  By Date ({sortOrder === "asc" ? "Oldest" : "Newest"})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="grid" className="mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#e6f0f9] border-t-4 border-t-[#1e74bb]"></div>
              <p className="mt-4 text-[#1e74bb] font-medium">Loading quizzes...</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-b from-[#f0f7ff] to-white rounded-lg border border-[#e6f0f9] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1e74bb] opacity-5 rounded-full transform translate-x-32 -translate-y-24"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#1e74bb] opacity-5 rounded-full transform -translate-x-20 translate-y-20"></div>
              <div className="relative z-10">
                <div className="bg-[#e6f0f9] rounded-full p-5 w-24 h-24 mx-auto mb-4 flex items-center justify-center shadow-inner">
                  <FileText className="h-12 w-12 text-[#1e74bb]" />
                </div>
                <h3 className="text-xl font-medium text-[#1e74bb] mb-2">No quizzes found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery ? "No quizzes match your search" : "Add your first quiz to start testing your students"}
                </p>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  className="bg-[#1e74bb] hover:bg-[#1a65a3] text-white shadow-md transition-all hover:shadow-lg px-6"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Quiz
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.quiz_id}
                  className={`group relative bg-white rounded-lg shadow-md border overflow-hidden transition-all duration-300 hover:shadow-xl ${hoveredCard === quiz.quiz_id ? "border-[#1e74bb] translate-y-[-4px]" : "border-gray-100"
                    }`}
                  onMouseEnter={() => setHoveredCard(quiz.quiz_id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Decorative diagonal element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#e6f0f9] transform rotate-45 translate-x-12 -translate-y-12 z-0"></div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge
                      variant={quiz.is_active ? "default" : "outline"}
                      className={
                        quiz.is_active
                          ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }
                    >
                      {quiz.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {/* Main content */}
                  <div className="p-5 relative z-10">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`rounded-full p-2.5 ${hoveredCard === quiz.quiz_id ? "bg-[#1e74bb] text-white" : "bg-[#e6f0f9] text-[#1e74bb]"
                          } transition-colors duration-300`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#1e74bb] transition-colors duration-300">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{quiz.description}</p>
                      </div>
                    </div>

                    {/* Quiz details */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#f8fafc] rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#1e74bb]" />
                          <span className="text-sm font-medium text-gray-700">{formatTimeLimit(quiz.time_limit)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Time Limit</p>
                      </div>
                      <div className="bg-[#f8fafc] rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#1e74bb]" />
                          <span className="text-sm font-medium text-gray-700">{quiz.passing_score}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Passing Score</p>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-500">Questions</span>
                        <span className="text-xs font-medium text-[#1e74bb]">{quiz.total_questions}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1e74bb] rounded-full"
                          style={{ width: `${(quiz.total_questions / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span>Created: {new Date(quiz.create_date_time).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-[#1e74bb] text-[#1e74bb] hover:bg-[#e6f0f9] group-hover:bg-[#1e74bb] group-hover:text-white transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        Questions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUploadClick(quiz)}
                        className="gap-1 border-green-600 text-green-600 hover:bg-green-50 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Dialog
                        open={editDialogId === quiz.quiz_id}
                        onOpenChange={(open) => setEditDialogId(open ? quiz.quiz_id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-200 hover:border-[#1e74bb] hover:text-[#1e74bb] transition-all"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                          <DialogHeader>
                            <DialogTitle>Edit Quiz</DialogTitle>
                            <DialogDescription>Update the quiz details.</DialogDescription>
                          </DialogHeader>
                          <QuizForm
                            quiz={quiz}
                            subjectId={Number(subjectId)}
                            topicId={Number(topicId)}
                            subjectName={subject?.subject_name || ""}
                            topicName={topic?.topic_name || ""}
                            onSuccess={() => {
                              fetchQuizzes()
                              setEditDialogId(null)
                            }}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-200 hover:border-red-200 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the quiz "{quiz.title}" and all associated questions. This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => handleDeleteQuiz(quiz.quiz_id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#e6f0f9] border-t-4 border-t-[#1e74bb]"></div>
                  <p className="mt-4 text-[#1e74bb] font-medium">Loading quizzes...</p>
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-b from-[#f0f7ff] to-white rounded-lg border border-[#e6f0f9] shadow-sm">
                  <div className="bg-[#e6f0f9] rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-[#1e74bb]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#1e74bb] mb-2">No quizzes found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? "No quizzes match your search"
                      : "Add your first quiz to start testing your students"}
                  </p>
                  <Button
                    onClick={() => setAddDialogOpen(true)}
                    className="bg-[#1e74bb] hover:bg-[#1a65a3] text-white shadow-sm transition-all hover:shadow"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Quiz
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#1e74bb] to-[#4a9eda] text-white">
                        <th className="h-12 px-4 text-left text-sm font-medium">ID</th>
                        <th className="h-12 px-4 text-left text-sm font-medium">Quiz Name</th>
                        <th className="h-12 px-4 text-left text-sm font-medium">Time Limit</th>
                        <th className="h-12 px-4 text-left text-sm font-medium">Pass %</th>
                        <th className="h-12 px-4 text-left text-sm font-medium">Status</th>
                        <th className="h-12 px-4 text-left text-sm font-medium">Created</th>
                        <th className="h-12 px-4 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuizzes.map((quiz, index) => (
                        <tr
                          key={quiz.quiz_id}
                          className={`border-b hover:bg-[#f0f7ff] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                            }`}
                        >
                          <td className="px-4 py-3 text-sm">{quiz.quiz_id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{quiz.title}</td>
                          <td className="px-4 py-3 text-sm">{formatTimeLimit(quiz.time_limit)}</td>
                          <td className="px-4 py-3 text-sm">{quiz.passing_score}%</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge
                              variant={quiz.is_active ? "default" : "outline"}
                              className={
                                quiz.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : "text-gray-500"
                              }
                            >
                              {quiz.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{new Date(quiz.create_date_time).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 border-[#1e74bb] text-[#1e74bb] hover:bg-[#e6f0f9]"
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only md:not-sr-only md:ml-2">Questions</span>
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUploadClick(quiz)}
                                className="gap-1 border-green-600 text-green-600 hover:bg-green-50"
                              >
                                <Upload className="h-4 w-4" />
                                <span className="sr-only md:not-sr-only md:ml-2">Upload</span>
                              </Button>

                              <Dialog
                                open={editDialogId === quiz.quiz_id}
                                onOpenChange={(open) => setEditDialogId(open ? quiz.quiz_id : null)}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-200 hover:border-[#1e74bb] hover:text-[#1e74bb]"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[550px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Quiz</DialogTitle>
                                    <DialogDescription>Update the quiz details.</DialogDescription>
                                  </DialogHeader>
                                  <QuizForm
                                    quiz={quiz}
                                    subjectId={Number(subjectId)}
                                    topicId={Number(topicId)}
                                    subjectName={subject?.subject_name || ""}
                                    topicName={topic?.topic_name || ""}
                                    onSuccess={() => {
                                      fetchQuizzes()
                                      setEditDialogId(null)
                                    }}
                                  />
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-200 hover:border-red-200 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the quiz "{quiz.title}" and all associated questions.
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() => handleDeleteQuiz(quiz.quiz_id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Quiz Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={handleUploadDialogClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#1e74bb]" />
              Upload Quiz Questions
            </DialogTitle>
            <DialogDescription>
              Upload quiz questions for "{selectedQuizForUpload?.title}" via Excel spreadsheet
            </DialogDescription>
          </DialogHeader>
          {selectedQuizForUpload && (
            <QuizUploadForm
              subjectId={Number(subjectId)}
              topicId={Number(topicId)}
              quizId={selectedQuizForUpload.quiz_id}
              quizTitle={selectedQuizForUpload.title}
              onSuccess={() => {
                fetchQuizzes()
                setUploadDialogOpen(false)
                setSelectedQuizForUpload(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Quiz Form Component
interface QuizFormProps {
  quiz?: Quiz
  subjectId: number
  topicId: number
  subjectName: string
  topicName: string
  onSuccess: () => void
}

function QuizForm({ quiz, subjectId, topicId, subjectName, topicName, onSuccess }: QuizFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: quiz?.title || "",
    description: quiz?.description || "",
    time_limit: quiz?.time_limit || 300, // Default 5 minutes
    passing_score: quiz?.passing_score || 70,
    total_questions: quiz?.total_questions || 10,
    is_active: quiz?.is_active ?? true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.title) {
        throw new Error("Quiz name is required")
      }

      let userId = localStorage.getItem("userId")
      if (!userId) {
        userId = "1"
      }

      const organizationId = localStorage.getItem("organizationId")
      const payload = {
        ...formData,
        subject_id: subjectId,
        topic_id: topicId,
        organization_id: Number.parseInt(organizationId || "1"), // Default to 1 if not found
        created_by: userId, // Hardcoded for now
        create_date_time: new Date().toISOString(),
        update_date_time: new Date().toISOString(),
      }

      // API endpoint for creating or updating a quiz
      const response = quiz
        ? await api.put(`/quizzes/quizzes/${quiz.quiz_id}`, payload)
        : await api.post("/quizzes/quizzes/", payload)

      if (response.ok) {
        toast({
          title: "Success",
          description: quiz ? "Quiz updated successfully" : "Quiz created successfully",
        })
        onSuccess()
      } else {
        throw new Error(quiz ? "Failed to update quiz" : "Failed to create quiz")
      }
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subjectName} disabled className="bg-gray-50 border-gray-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" value={topicName} disabled className="bg-gray-50 border-gray-200" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">
            Quiz Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Basic Arithmetic Quiz"
            required
            className="border-gray-200 focus-visible:ring-[#1e74bb]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a description for this quiz"
            rows={3}
            className="border-gray-200 focus-visible:ring-[#1e74bb]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="time_limit">Time Limit (seconds)</Label>
            <Input
              id="time_limit"
              name="time_limit"
              type="number"
              min="30"
              value={formData.time_limit}
              onChange={handleChange}
              className="border-gray-200 focus-visible:ring-[#1e74bb]"
            />
            <p className="text-xs text-gray-500">
              {Math.floor(formData.time_limit / 60)}m {formData.time_limit % 60}s
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passing_score">Passing Percentage</Label>
            <Input
              id="passing_score"
              name="passing_score"
              type="number"
              min="1"
              max="100"
              value={formData.passing_score}
              onChange={handleChange}
              className="border-gray-200 focus-visible:ring-[#1e74bb]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_questions">Total Questions</Label>
            <Input
              id="total_questions"
              name="total_questions"
              type="number"
              min="1"
              max="100"
              value={formData.total_questions}
              onChange={handleChange}
              className="border-gray-200 focus-visible:ring-[#1e74bb]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="is_active">Active</Label>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
            className="data-[state=checked]:bg-[#1e74bb]"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading} className="bg-[#1e74bb] hover:bg-[#1a65a3] text-white">
          {isLoading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
          {quiz ? "Update Quiz" : "Create Quiz"}
        </Button>
      </DialogFooter>
    </form>
  )
}

interface QuizUploadFormProps {
  subjectId: number
  topicId: number
  quizId: number
  quizTitle: string
  onSuccess: () => void
}
