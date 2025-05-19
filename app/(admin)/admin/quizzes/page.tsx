"use client"

import { Skeleton } from "@/components/ui/skeleton"

import { useState, useEffect } from "react"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  AlertCircle,
  ArrowUpDown,
  Book,
  Edit,
  Eye,
  Grid,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import type { Subject } from "@/app/types/types"
import Link from "next/link"

// Define the Quiz interface
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

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState("grid")
  const [sortField, setSortField] = useState<"title" | "create_date_time">("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    subject_id: "",
    topic_id: "",
    difficulty_level: "medium",
    time_limit_minutes: 30,
    passing_percentage: 70,
  })
  const [topics, setTopics] = useState<{ [key: string]: { topic_id: number; topic_name: string }[] }>({})

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await api.get<Quiz[]>("/quizzes/quizzes/")

        if (!response.ok) {
          throw new Error(`Failed to fetch quizzes: ${response.status}`)
        }

        // Fetch subject and topic names for each quiz
        const quizzesWithNames = await Promise.all(
          response.data.map(async (quiz) => {
            try {
              // Fetch subject name
              const subjectResponse = await api.get<Subject>(`/subjects/subjects/${quiz.subject_id}`)
              const subject_name = subjectResponse.ok ? subjectResponse.data.subject_name : "Unknown Subject"

              // Fetch topic name
              const topicResponse = await api.get<{ topic_id: number; topic_name: string }>(
                `/topics/topics/${quiz.topic_id}`,
              )
              const topic_name = topicResponse.ok ? topicResponse.data.topic_name : "Unknown Topic"

              return {
                ...quiz,
                subject_name,
                topic_name,
              }
            } catch (error) {
              console.error("Error fetching subject/topic details:", error)
              return {
                ...quiz,
                subject_name: "Unknown Subject",
                topic_name: "Unknown Topic",
              }
            }
          }),
        )

        setQuizzes(quizzesWithNames)
        setFilteredQuizzes(quizzesWithNames)
      } catch (error) {
        console.error("Error fetching quizzes:", error)
        setError("Failed to load quizzes. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  // Fetch subjects for filter
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get<Subject[]>("/subjects/subjects/")

        if (response.ok) {
          setSubjects(response.data)

          // Fetch topics for each subject
          const topicsMap: { [key: string]: any[] } = {}

          await Promise.all(
            response.data.map(async (subject) => {
              try {
                const topicsResponse = await api.get<any[]>(`/topics/topics/subject/${subject.subject_id}`)

                if (topicsResponse.ok) {
                  topicsMap[subject.subject_id.toString()] = topicsResponse.data
                }
              } catch (error) {
                console.error(`Error fetching topics for subject ${subject.subject_id}:`, error)
              }
            }),
          )

          setTopics(topicsMap)
        }
      } catch (error) {
        console.error("Error fetching subjects:", error)
      }
    }

    fetchSubjects()
  }, [])

  // Filter and sort quizzes
  useEffect(() => {
    let filtered = [...quizzes]

    // Apply subject filter
    if (selectedSubject !== "all") {
      filtered = filtered.filter((quiz) => quiz.subject_id.toString() === selectedSubject)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(query) ||
          quiz.description.toLowerCase().includes(query) ||
          (quiz.subject_name && quiz.subject_name.toLowerCase().includes(query)) ||
          (quiz.topic_name && quiz.topic_name.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortField === "title") {
        return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else {
        const dateA = new Date(a.create_date_time).getTime()
        const dateB = new Date(b.create_date_time).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      }
    })

    setFilteredQuizzes(filtered)
  }, [quizzes, searchQuery, selectedSubject, sortField, sortDirection])

  const handleCreateQuiz = async () => {
    try {
      if (!newQuiz.title || !newQuiz.subject_id || !newQuiz.topic_id) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const quizData = {
        ...newQuiz,
        subject_id: Number.parseInt(newQuiz.subject_id),
        topic_id: Number.parseInt(newQuiz.topic_id),
        is_active: true,
        created_by: 1, // This would typically come from the authenticated user
      }

      const response = await api.post<Quiz>("/quizzes/quizzes/", quizData)

      if (!response.ok) {
        throw new Error(`Failed to create quiz: ${response.status}`)
      }

      // Get subject and topic names
      const subjectName =
        subjects.find((s) => s.subject_id === Number.parseInt(newQuiz.subject_id))?.subject_name || "Unknown Subject"
      const topicName =
        topics[newQuiz.subject_id]?.find((t) => t.topic_id === Number.parseInt(newQuiz.topic_id))?.topic_name ||
        "Unknown Topic"

      // Add the new quiz to the list
      const newQuizWithNames = {
        ...response.data,
        subject_name: subjectName,
        topic_name: topicName,
      }

      setQuizzes([newQuizWithNames, ...quizzes])

      // Reset form and close dialog
      setNewQuiz({
        title: "",
        description: "",
        subject_id: "",
        topic_id: "",
        difficulty_level: "medium",
        time_limit_minutes: 30,
        passing_percentage: 70,
      })
      setIsCreateDialogOpen(false)

      toast({
        title: "Quiz created",
        description: "The quiz has been created successfully",
      })
    } catch (error) {
      console.error("Error creating quiz:", error)
      toast({
        title: "Failed to create quiz",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) {
      return
    }

    try {
      const response = await api.delete(`/quizzes/quizzes/${quizId}`)

      if (!response.ok) {
        throw new Error(`Failed to delete quiz: ${response.status}`)
      }

      // Remove the quiz from the list
      setQuizzes(quizzes.filter((quiz) => quiz.quiz_id !== quizId))

      toast({
        title: "Quiz deleted",
        description: "The quiz has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast({
        title: "Failed to delete quiz",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
    setNewQuiz({
      ...newQuiz,
      subject_id: value,
      topic_id: "", // Reset topic when subject changes
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
            <h3 className="text-sm font-medium text-red-800">Error loading quizzes</h3>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Quiz Management</h1>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1e74bb] hover:bg-[#1a65a3]">
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  placeholder="Enter quiz title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={newQuiz.subject_id} onValueChange={handleSubjectChange}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                          {subject.subject_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="topic">Topic *</Label>
                  <Select
                    value={newQuiz.topic_id}
                    onValueChange={(value) => setNewQuiz({ ...newQuiz, topic_id: value })}
                    disabled={!newQuiz.subject_id}
                  >
                    <SelectTrigger id="topic">
                      <SelectValue placeholder={newQuiz.subject_id ? "Select topic" : "Select subject first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {newQuiz.subject_id &&
                        topics[newQuiz.subject_id]?.map((topic) => (
                          <SelectItem key={topic.topic_id} value={topic.topic_id.toString()}>
                            {topic.topic_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={newQuiz.difficulty_level}
                    onValueChange={(value) => setNewQuiz({ ...newQuiz, difficulty_level: value })}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time_limit">Time Limit (min)</Label>
                  <Input
                    id="time_limit"
                    type="number"
                    value={newQuiz.time_limit_minutes}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, time_limit_minutes: Number.parseInt(e.target.value) || 0 })
                    }
                    min={1}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="passing_percentage">Passing % (0-100)</Label>
                  <Input
                    id="passing_percentage"
                    type="number"
                    value={newQuiz.passing_percentage}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, passing_percentage: Number.parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#1e74bb] hover:bg-[#1a65a3]" onClick={handleCreateQuiz}>
                Create Quiz
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search quizzes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                {subject.subject_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center ml-auto">
          <Button
            variant="outline"
            size="sm"
            className={`px-3 ${sortField === "title" ? "bg-gray-100" : ""}`}
            onClick={() => {
              setSortField("title")
              if (sortField === "title") toggleSortDirection()
            }}
          >
            Name
            {sortField === "title" && (
              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={`px-3 ml-2 ${sortField === "create_date_time" ? "bg-gray-100" : ""}`}
            onClick={() => {
              setSortField("create_date_time")
              if (sortField === "create_date_time") toggleSortDirection()
            }}
          >
            Date
            {sortField === "create_date_time" && (
              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
            )}
          </Button>

          <div className="border rounded-md p-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${view === "grid" ? "bg-gray-100" : ""}`}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${view === "table" ? "bg-gray-100" : ""}`}
              onClick={() => setView("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" value={view} onValueChange={setView} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="pb-2">
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full mt-1" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <Book className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No quizzes found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.quiz_id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold line-clamp-1">{quiz.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/quizzes/${quiz.quiz_id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/quizzes/${quiz.quiz_id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Quiz
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteQuiz(quiz.quiz_id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className={getDifficultyColor(quiz.difficulty_level)}>
                        {quiz.difficulty_level.charAt(0).toUpperCase() + quiz.difficulty_level.slice(1)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={quiz.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {quiz.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {quiz.time_limit_minutes} min
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                      {quiz.description || "No description provided"}
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Subject:</span> {quiz.subject_name}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Topic:</span> {quiz.topic_name}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Created:</span> {formatDate(quiz.create_date_time)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/quizzes/${quiz.quiz_id}/questions`}>Manage Questions</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/quizzes/${quiz.quiz_id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Subject / Topic</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Time Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filteredQuizzes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No quizzes found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.quiz_id}>
                      <TableCell className="font-medium">{quiz.title}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{quiz.subject_name}</span>
                          <span className="text-xs text-gray-500">{quiz.topic_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getDifficultyColor(quiz.difficulty_level)}>
                          {quiz.difficulty_level.charAt(0).toUpperCase() + quiz.difficulty_level.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{quiz.time_limit_minutes} min</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={quiz.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {quiz.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(quiz.create_date_time)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/quizzes/${quiz.quiz_id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/quizzes/${quiz.quiz_id}/questions`}>
                                <Grid className="h-4 w-4 mr-2" />
                                Manage Questions
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/quizzes/${quiz.quiz_id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Quiz
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteQuiz(quiz.quiz_id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
