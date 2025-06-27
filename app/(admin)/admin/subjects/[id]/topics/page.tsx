"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  ArrowUpDown,
  BookOpenCheck,
  Layers,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { api } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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

import type { Subject, Topic } from "@/app/types/types"

export default function TopicsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogId, setEditDialogId] = useState<number | null>(null)

  const searchParams = useSearchParams() // query params

  const subjectId = params.id as string
  console.log(subjectId)
  const subjectSlug = searchParams.get("subject_slug")
  const organizationId = searchParams.get("organization_id")
  const organizationName = searchParams.get("organization_name")

  // Fetch subject and topics on component mount
  useEffect(() => {
    fetchSubject()
    fetchTopics()
  }, [subjectId])

  // Fetch subject from API
  const fetchSubject = async () => {
    try {
      const response = await api.get<Subject>(`/subjects/subjects/${subjectSlug}/${subjectId}?organization_id=${organizationId}`)

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

  // Fetch topics from API
  const fetchTopics = async () => {
    setIsLoading(true)
    try {
      const response = await api.get<Topic[]>(`/topics/topics/by-subject/${subjectId}?organization_id=${organizationId}`)

      if (response.ok) {
        setTopics(response.data)
      } else {
        throw new Error("Failed to fetch topics")
      }
    } catch (error) {
      console.error("Error fetching topics:", error)
      toast({
        title: "Error",
        description: "Failed to load topics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and sort topics
  const filteredTopics = topics
    .filter((topic) => topic.topic_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.topic_name.localeCompare(b.topic_name) : b.topic_name.localeCompare(a.topic_name)
      } else {
        return sortOrder === "asc"
          ? new Date(a.create_date_time).getTime() - new Date(b.create_date_time).getTime()
          : new Date(b.create_date_time).getTime() - new Date(a.create_date_time).getTime()
      }
    })

  // Delete topic handler
  const handleDeleteTopic = async (id: number, slug: string, organizationId: number) => {
    try {
      const response = await api.delete(`topics/topics/${slug}/${id}?organization_id=${organizationId}`)

      if (response.ok) {
        setTopics(topics.filter((topic) => topic.id !== id))
        toast({
          title: "Success",
          description: "Topic deleted successfully",
        })
      } else {
        throw new Error("Failed to delete topic")
      }
    } catch (error) {
      console.error("Error deleting topic:", error)
      toast({
        title: "Error",
        description: "Failed to delete topic. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
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
              <Badge className="bg-[#0d4c7a] text-white">Topics Hub</Badge>
            </div>
            <h1 className="text-2xl font-bold mb-1 flex items-center">
              <BookOpenCheck className="mr-2 h-6 w-6" />
              {subject?.subject_name || "Loading..."} Topics
            </h1>
            <p className="text-gray-100">Manage topics for this subject</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  className="bg-white text-[#1e74bb] hover:bg-gray-100 shadow-sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Topic</DialogTitle>
                  <DialogDescription>Create a new topic for {subject?.subject_name}.</DialogDescription>
                </DialogHeader>
                <TopicForm
                  subjectId={subjectId}
                  subjectName={subject?.subject_name || ""}
                  // createdBy={0}
                  organizationName={organizationName || ""}
                  organizationId={organizationId || ""}
                  onSuccess={() => {
                    fetchTopics()
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
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-sm font-medium text-[#1e74bb] flex items-center">
                <BookOpenCheck className="w-4 h-4 mr-2" />
                {subject?.subject_name || "Topics"}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <Card className="border border-gray-100 shadow-sm mb-6 overflow-hidden">
        <CardHeader className="pb-0 bg-gradient-to-r from-[#e6f0f9] to-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e74bb] opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-[#1e74bb]" />
            Subject Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 bg-gradient-to-b from-[#f8fafc] to-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm border border-[#e6f0f9] flex items-start gap-3">
              <div className="bg-[#e6f0f9] p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-[#1e74bb]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Subject Name</p>
                <p className="font-medium text-gray-800">{subject?.subject_name}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm border border-[#e6f0f9] flex items-start gap-3">
              <div className="bg-[#e6f0f9] p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-[#1e74bb]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge
                  variant={subject?.is_active ? "default" : "outline"}
                  className={
                    subject?.is_active ? "bg-green-100 text-green-800 hover:bg-green-200 mt-1" : "text-gray-500 mt-1"
                  }
                >
                  {subject?.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm border border-[#e6f0f9] flex items-start gap-3">
              <div className="bg-[#e6f0f9] p-2 rounded-full">
                <Clock className="h-5 w-5 text-[#1e74bb]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-gray-800">
                  {subject?.create_date_time ? new Date(subject.create_date_time).toLocaleDateString() : "N/A"}
                </p>
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
                <BookOpenCheck className="mr-2 h-4 w-4" />
                Table View
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 bg-white">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search topics..."
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
              <p className="mt-4 text-[#1e74bb] font-medium">Loading topics...</p>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-b from-[#f0f7ff] to-white rounded-lg border border-[#e6f0f9] shadow-sm">
              <div className="bg-[#e6f0f9] rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <BookOpenCheck className="h-10 w-10 text-[#1e74bb]" />
              </div>
              <h3 className="text-xl font-medium text-[#1e74bb] mb-2">No topics found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "No topics match your search"
                  : "Add your first topic to get started with your curriculum"}
              </p>
              <Button
                onClick={() => setAddDialogOpen(true)}
                className="bg-[#1e74bb] hover:bg-[#1a65a3] text-white shadow-sm transition-all hover:shadow"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Topic
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => (
                <Card
                  key={topic.id}
                  className={`overflow-hidden transition-all duration-300 group hover:shadow-lg ${hoveredCard === topic.id ? "border-[#1e74bb] shadow-md translate-y-[-4px]" : "border-gray-100"
                    }`}
                  onMouseEnter={() => setHoveredCard(topic.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e6f0f9] to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
                  <CardHeader
                    className={`pb-2 relative ${hoveredCard === topic.id
                      ? "bg-gradient-to-r from-[#1e74bb] to-[#4a9eda] text-white"
                      : "bg-gradient-to-r from-[#e6f0f9] to-white"
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-full p-2 ${hoveredCard === topic.id ? "bg-white text-[#1e74bb]" : "bg-[#1e74bb] text-white"
                            }`}
                        >
                          <BookOpenCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle
                            className={`text-lg ${hoveredCard === topic.id ? "text-white" : "text-gray-800"}`}
                          >
                            {topic.topic_name}
                          </CardTitle>
                          <p
                            className={`text-xs mt-1 ${hoveredCard === topic.id ? "text-gray-100" : "text-gray-500"
                              }`}
                          >
                            ID: {topic.id}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={topic.is_active ? "default" : "outline"}
                        className={
                          topic.is_active
                            ? hoveredCard === topic.id
                              ? "bg-white text-[#1e74bb] hover:bg-gray-100"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                            : hoveredCard === topic.id
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "text-gray-500"
                        }
                      >
                        {topic.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Created: {new Date(topic.create_date_time).toLocaleDateString()}
                      </p>
                    </div>
                    {/* <div className="h-1 w-full bg-gray-100 mb-3 overflow-hidden rounded-full">
                      <div
                        className="h-full bg-[#1e74bb] rounded-full"
                        style={{ width: topic.is_active ? "100%" : "30%" }}
                      ></div>
                    </div> */}
                  </CardContent>
                  <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-100 p-4">
                    <Link
                      href={`/admin/subjects/${subjectId}/topics/${topic.id}/quizzes?organization_id=${organizationId}&organization_name=${organizationName}&subject_slug=${subjectSlug}&topic_slug=${topic.slug}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-[#1e74bb] text-[#1e74bb] hover:bg-[#e6f0f9] group-hover:bg-[#1e74bb] group-hover:text-white transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        Manage Quizzes
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Dialog
                        open={editDialogId === topic.id}
                        onOpenChange={(open) => setEditDialogId(open ? topic.id : null)}
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
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Topic</DialogTitle>
                            <DialogDescription>Update the topic details.</DialogDescription>
                          </DialogHeader>
                          <TopicForm
                            topic={topic}
                            subjectId={subjectId}
                            subjectName={subject?.subject_name || ""}
                            // createdBy={Number.parseInt(topic.created_by)}
                            organizationId={organizationId || ""}
                            organizationName={organizationName || ""}
                            onSuccess={() => {
                              fetchTopics()
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
                              This will permanently delete the topic "{topic.topic_name}" and all associated content.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => handleDeleteTopic(topic.id, topic.slug, topic.organization_id)}
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
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#e6f0f9] border-t-4 border-t-[#1e74bb]"></div>
                  <p className="mt-4 text-[#1e74bb] font-medium">Loading topics...</p>
                </div>
              ) : filteredTopics.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-b from-[#f0f7ff] to-white rounded-lg border border-[#e6f0f9] shadow-sm">
                  <div className="bg-[#e6f0f9] rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <BookOpenCheck className="h-10 w-10 text-[#1e74bb]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#1e74bb] mb-2">No topics found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? "No topics match your search"
                      : "Add your first topic to get started with your curriculum"}
                  </p>
                  <Button
                    onClick={() => setAddDialogOpen(true)}
                    className="bg-[#1e74bb] hover:bg-[#1a65a3] text-white shadow-sm transition-all hover:shadow"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Topic
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#1e74bb] to-[#4a9eda] text-white">
                        <th className="h-12 px-4 text-left text-sm font-medium">ID</th>
                        <th className="h-12 px-4 text-left text-sm font-medium">Topic Name</th>
                        <th className="h-12 px-4 text-left text-sm font-medium">Status</th>
                        <th className="h-12 px-4 text-left text-sm font-medium">Created</th>
                        <th className="h-12 px-4 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTopics.map((topic, index) => (
                        <tr
                          key={topic.id}
                          className={`border-b hover:bg-[#f0f7ff] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                            }`}
                        >
                          <td className="px-4 py-3 text-sm">{topic.id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{topic.topic_name}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge
                              variant={topic.is_active ? "default" : "outline"}
                              className={
                                topic.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : "text-gray-500"
                              }
                            >
                              {topic.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{new Date(topic.create_date_time).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/admin/subjects/${subjectId}/topics/${topic.id}/quizzes?organization_id=${organizationId}&organization_name=${organizationName}&subject_slug=${subjectSlug}&topic_slug=${topic.slug}`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-200 hover:border-[#1e74bb] hover:text-[#1e74bb]"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only md:not-sr-only md:ml-2">Quizzes</span>
                                </Button>
                              </Link>

                              <Dialog
                                open={editDialogId === topic.id}
                                onOpenChange={(open) => setEditDialogId(open ? topic.id : null)}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-200 hover:border-[#1e74bb] hover:text-[#1e74bb]"
                                  >
                                    <Pencil className="h-4 w-4 text-gray-600" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Topic</DialogTitle>
                                    <DialogDescription>Update the topic details.</DialogDescription>
                                  </DialogHeader>
                                  <TopicForm
                                    topic={topic}
                                    subjectId={subjectId || ""}
                                    subjectName={subject?.subject_name || ""}
                                    // createdBy={Number.parseInt(topic.created_by)}
                                    organizationId={organizationId || ""}
                                    organizationName={organizationName || ""}
                                    onSuccess={() => {
                                      fetchTopics()
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
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the topic "{topic.topic_name}" and all associated
                                      content. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() => handleDeleteTopic(topic.id, topic.slug, topic.organization_id)}
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

// Topic Form Component
interface TopicFormProps {
  topic?: Topic
  subjectId: string
  subjectName: string
  organizationName: string
  organizationId: string
  // createdBy: number
  onSuccess: () => void
}

function TopicForm({ topic, subjectId, subjectName, organizationName, organizationId, onSuccess }: TopicFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic_name: topic?.topic_name || "",
    slug: topic?.slug || "",
    is_active: topic?.is_active ?? true,
    created_by: topic?.created_by || 1,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.topic_name) {
        throw new Error("Topic title is required")
      }

      if (!formData.slug) {
        throw new Error("Topic Slug is required")
      }

      if (formData.slug.includes(" ")) {
        throw new Error("Slug should not contain spaces")
      }

      const userId = localStorage.getItem("userId")
      if (!userId) {
        throw new Error("User ID not found")
      }

      const payload = {
        ...formData,
        subject_id: subjectId,
        organization_id: organizationId,
        created_by: userId
      }

      // This would be replaced with your actual API endpoint
      const response = topic
        ? await api.put(`/topics/topics/${topic.slug}/${topic.id}?organization_id=${topic.organization_id}`, payload)
        : await api.post("/topics/topics", payload)

      if (response.ok) {
        toast({
          title: "Success",
          description: topic ? "Topic updated successfully" : "Topic created successfully",
        })
        onSuccess() // Make sure this is called
      } else {
        throw new Error(topic ? "Failed to update topic" : "Failed to create topic")
      }
    } catch (error) {
      console.error("Error saving topic:", error)
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
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Organization <span className="text-red-500">*</span>
          </label>
          <Input
            id="Organization"
            name="Organization"
            value={organizationName}
            disabled
            className="bg-gray-50 border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Subject <span className="text-red-500">*</span>
          </label>
          <Input id="Subject" name="Subject" value={subjectName} disabled className="bg-gray-50 border-gray-200" />
        </div>
        {/* <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Created by <span className="text-red-500">*</span>
          </label>
          <Input
            id="created_by"
            name="created_by"
            value={formData.created_by}
            onChange={handleChange}
            placeholder="e.g., 101"
            required
            className="border-gray-200 focus-visible:ring-[#1e74bb]"
          />
        </div> */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Topic Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="topic_name"
            name="topic_name"
            value={formData.topic_name}
            onChange={handleChange}
            placeholder="e.g., Arithmetic & Number Sense"
            required
            className="border-gray-200 focus-visible:ring-[#1e74bb]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Topic Slug <span className="text-red-500">*</span>
          </label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g., Arithmetic_Number_Sense"
            required
            className="border-gray-200 focus-visible:ring-[#1e74bb]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="h-4 w-4 text-[#1e74bb] border-gray-300 rounded focus:ring-[#1e74bb]"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Active
          </label>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading} className="bg-[#1e74bb] hover:bg-[#1a65a3] text-white">
          {isLoading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
          {topic ? "Update Topic" : "Create Topic"}
        </Button>
      </DialogFooter>
    </form>
  )
}
