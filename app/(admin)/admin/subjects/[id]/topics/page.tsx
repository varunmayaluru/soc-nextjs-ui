"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Plus, Pencil, Trash2, Search, BookOpen, ArrowUpDown, FileText } from "lucide-react"
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import type { Subject } from "@/app/types/types"

type Topic = {
  organization_id: number
  subject_id: number
  topic_id: number
  topic_name: string
  is_active: boolean
  created_by: string
  create_date_time: string
}

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

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogId, setEditDialogId] = useState<number | null>(null)

  // const subjectId = params.id as string

  const searchParams = useSearchParams(); // query params

  const subjectId = params.id as string;
  const organizationId = searchParams.get('organization_id');
  const organizationName = searchParams.get('organization_name');

  console.log("subjectId:", subjectId);
  console.log("organizationId:", organizationId);

  // Fetch subject and topics on component mount
  useEffect(() => {
    fetchSubject()
    fetchTopics()
  }, [subjectId])

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

  // Fetch topics from API
  const fetchTopics = async () => {
    setIsLoading(true)
    try {
      const response = await api.get<Topic[]>(`/topics/topics/by-subject/${subjectId}`)

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
  const handleDeleteTopic = async (id: number) => {
    try {
      const response = await api.delete(`topics/topics/${id}`)

      if (response.ok) {
        setTopics(topics.filter((topic) => topic.topic_id !== id))
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
            <BreadcrumbLink>{subject?.subject_name || "Topics"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#1e74bb]" />
            {subject?.subject_name || "Loading..."} Topics
          </h1>
          <p className="text-gray-500 mt-1">Manage topics for this subject</p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setAddDialogOpen(true)}>
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
              subjectId={Number.parseInt(subjectId)}
              subjectName={subject?.subject_name || ""}
              createdBy={0}
              organizationName={organizationName || ""}
              organizationId={Number.parseInt(organizationId || "")}
              onSuccess={() => {
                fetchTopics()
                setAddDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-gray-100 shadow-sm mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Subject Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Subject Name</p>
              <p>{subject?.subject_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge variant={subject?.is_active ? "default" : "outline"} className="mt-1">
                {subject?.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p>{subject?.create_date_time ? new Date(subject.create_date_time).toLocaleDateString() : "N/A"}</p>
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
                placeholder="Search topics..."
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
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No topics match your search" : "No topics found. Add your first topic!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.map((topic) => (
                <Card key={topic.topic_id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{topic.topic_name}</CardTitle>
                      <Badge variant={topic.is_active ? "default" : "outline"}>
                        {topic.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-500">
                      Created: {new Date(topic.create_date_time).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Link href={`/admin/subjects/${subjectId}/topics/${topic.topic_id}/quizzes`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" />
                        Manage Quizzes
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Dialog
                        open={editDialogId === topic.topic_id}
                        onOpenChange={(open) => setEditDialogId(open ? topic.topic_id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
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
                            subjectId={Number.parseInt(subjectId)}
                            subjectName={subject?.subject_name || ""}
                            createdBy={Number.parseInt(topic.created_by)}
                            organizationId={Number.parseInt(organizationId || "")}
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
                          <Button variant="outline" size="icon">
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
                              onClick={() => handleDeleteTopic(topic.topic_id)}
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
              ) : filteredTopics.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "No topics match your search" : "No topics found. Add your first topic!"}
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">ID</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Topic Name</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Created</th>
                        <th className="h-12 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTopics.map((topic) => (
                        <tr key={topic.topic_id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{topic.topic_id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{topic.topic_name}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={topic.is_active ? "default" : "outline"}>
                              {topic.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{new Date(topic.create_date_time).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/subjects/${subjectId}/topics/${topic.topic_id}/quizzes`}>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only md:not-sr-only md:ml-2">Quizzes</span>
                                </Button>
                              </Link>

                              <Dialog
                                open={editDialogId === topic.topic_id}
                                onOpenChange={(open) => setEditDialogId(open ? topic.topic_id : null)}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Pencil className="h-4 w-4" />
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
                                    subjectId={Number.parseInt(subjectId)}
                                    subjectName={subject?.subject_name || ""}
                                    createdBy={Number.parseInt(topic.created_by)}
                                    organizationId={Number.parseInt(organizationId || "")}
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
                                  <Button variant="outline" size="sm">
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
                                      onClick={() => handleDeleteTopic(topic.topic_id)}
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
  subjectId: number
  subjectName: string
  organizationName: string
  organizationId: number
  createdBy: number
  onSuccess: () => void
}

function TopicForm({ topic, subjectId, subjectName, organizationName, organizationId, onSuccess }: TopicFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic_name: topic?.topic_name || "",
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

      const payload = {
        ...formData,
        subject_id: subjectId,
        organization_id: organizationId,
        created_by: topic?.created_by || 1,
      }

      // This would be replaced with your actual API endpoint
      const response = topic
        ? await api.put(`/topics/topics/${topic.topic_id}`, payload)
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
          <Input id="Organization" name="Organization" value={organizationName} disabled />
        </div>
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Subject <span className="text-red-500">*</span>
          </label>
          <Input id="Subject" name="Subject" value={subjectName} disabled />
        </div>
        <div className="space-y-2">
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
          />
        </div>
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
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Active
          </label>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
          {topic ? "Update Topic" : "Create Topic"}
        </Button>
      </DialogFooter>
    </form>
  )
}
