"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, ArrowLeft, Search } from "lucide-react"
import { api } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogId, setEditDialogId] = useState<number | null>(null)

  const subjectId = params.id as string

  const organizationName = localStorage.getItem("organizationName")

  // Fetch subject and topics on component mount
  useEffect(() => {
    fetchSubject()
    fetchTopics()
  }, [subjectId])

  // Fetch subject from API
  const fetchSubject = async () => {
    try {
      // This would be replaced with your actual API endpoint
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
      // This would be replaced with your actual API endpoint
      const response = await api.get<Topic[]>(`/topics/topics/TopicsBySubjectId/${subjectId}`)

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

      // For demo purposes, set some sample data
    } finally {
      setIsLoading(false)
    }
  }

  // Filter topics based on search query
  const filteredTopics = topics.filter((topic) => topic.topic_name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Delete topic handler
  const handleDeleteTopic = async (id: number) => {
    try {
      // This would be replaced with your actual API endpoint
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

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.push("/admin/subjects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subjects
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{subject?.subject_name} Topics</h1>
          <p className="text-gray-500">Manage topics for {subject?.subject_name}</p>
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
              organizationName={organizationName || ""}
              onSuccess={() => {
                fetchTopics()
                setAddDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>All Topics</CardTitle>
          <CardDescription>Manage topics for {subject?.subject_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search topics..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopics.map((topic) => (
                    <TableRow key={topic.topic_id}>
                      <TableCell>{topic.topic_id}</TableCell>
                      <TableCell className="font-medium">{topic.topic_name}</TableCell>
                      <TableCell>{new Date(topic.create_date_time).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={editDialogId === topic.topic_id}
                            onOpenChange={(open) => setEditDialogId(open ? topic.topic_id : null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
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
                                <span className="sr-only">Delete</span>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Topic Form Component
interface TopicFormProps {
  topic?: Topic
  subjectId: number
  subjectName: string
  organizationName: string
  onSuccess: () => void
}

function TopicForm({ topic, subjectId, subjectName, organizationName, onSuccess }: TopicFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic_name: topic?.topic_name || "",
    is_active: topic?.is_active ?? true,
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
      const organizationId = localStorage.getItem("organizationId")
      const payload = {
        ...formData,
        subject_id: subjectId,
        organization_id: Number.parseInt(organizationId || ""),
        created_by: 101,
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
