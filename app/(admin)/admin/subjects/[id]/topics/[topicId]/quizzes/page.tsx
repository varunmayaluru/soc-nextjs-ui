"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, ArrowLeft, Search, FileText, ArrowUpDown, Clock, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

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

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogId, setEditDialogId] = useState<number | null>(null)

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
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/subjects">Subjects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/subjects/${subjectId}/topics`}>{subject?.subject_name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{topic?.topic_name || "Quizzes"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/subjects/${subjectId}/topics`)}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#1e74bb]" />
            Quizzes for {topic?.topic_name || "Loading..."}
          </h1>
          <p className="text-gray-500 mt-1">Manage quizzes for this topic</p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setAddDialogOpen(true)}>
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

      <Card className="border border-gray-100 shadow-sm mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Topic Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Subject</p>
              <p>{subject?.subject_name || "Loading..."}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Topic</p>
              <p>{topic?.topic_name || "Loading..."}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge variant={topic?.is_active ? "default" : "outline"} className="mt-1">
                {topic?.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search quizzes..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("name")
                    toggleSortOrder()
                  }}
                >
                  By Name ({sortOrder === "asc" ? "A-Z" : "Z-A"})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("date")
                    toggleSortOrder()
                  }}
                >
                  By Date ({sortOrder === "asc" ? "Oldest" : "Newest"})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="grid" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1e74bb]"></div>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No quizzes match your search" : "No quizzes found. Add your first quiz!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.quiz_id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{quiz.description}</CardDescription>
                      </div>
                      <Badge variant={quiz.is_active ? "default" : "outline"}>
                        {quiz.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                        <span>{formatTimeLimit(quiz.time_limit)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-gray-500" />
                        <span>Pass: {quiz.passing_score}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(quiz.create_date_time).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm" className="gap-1">
                      <FileText className="h-4 w-4" />
                      Questions
                    </Button>
                    <div className="flex gap-2">
                      <Dialog
                        open={editDialogId === quiz.quiz_id}
                        onOpenChange={(open) => setEditDialogId(open ? quiz.quiz_id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
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
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
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
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1e74bb]"></div>
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "No quizzes match your search" : "No quizzes found. Add your first quiz!"}
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">ID</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Quiz Name</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Time Limit</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Pass %</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Created</th>
                        <th className="h-12 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuizzes.map((quiz) => (
                        <tr key={quiz.quiz_id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{quiz.quiz_id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{quiz.title}</td>
                          <td className="px-4 py-3 text-sm">{formatTimeLimit(quiz.time_limit)}</td>
                          <td className="px-4 py-3 text-sm">{quiz.passing_score}%</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={quiz.is_active ? "default" : "outline"}>
                              {quiz.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{new Date(quiz.create_date_time).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                                <span className="sr-only md:not-sr-only md:ml-2">Questions</span>
                              </Button>

                              <Dialog
                                open={editDialogId === quiz.quiz_id}
                                onOpenChange={(open) => setEditDialogId(open ? quiz.quiz_id : null)}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
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
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the quiz "{quiz.title}" and all associated
                                      questions. This action cannot be undone.
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
            <Input id="subject" value={subjectName} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" value={topicName} disabled />
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
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="is_active">Active</Label>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
          {quiz ? "Update Quiz" : "Create Quiz"}
        </Button>
      </DialogFooter>
    </form>
  )
}
