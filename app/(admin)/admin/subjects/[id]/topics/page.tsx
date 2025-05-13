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
import { Textarea } from "@/components/ui/textarea"
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

// Define types
type Subject = {
  id: number
  name: string
  category: string
}

type Topic = {
  id: number
  title: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  subjectId: number
  createdAt: string
}

export default function TopicsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const subjectId = params.id as string

  // Fetch subject and topics on component mount
  useEffect(() => {
    fetchSubject()
    fetchTopics()
  }, [subjectId])

  // Fetch subject from API
  const fetchSubject = async () => {
    try {
      // This would be replaced with your actual API endpoint
      const response = await api.get<Subject>(`/admin/subjects/${subjectId}`)

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

      // For demo purposes, set sample data
      setSubject({
        id: Number.parseInt(subjectId),
        name: "Mathematics",
        category: "Core",
      })
    }
  }

  // Fetch topics from API
  const fetchTopics = async () => {
    setIsLoading(true)
    try {
      // This would be replaced with your actual API endpoint
      const response = await api.get<Topic[]>(`/admin/subjects/${subjectId}/topics`)

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
      setTopics([
        {
          id: 1,
          title: "Arithmetic & Number Sense",
          description: "Basic arithmetic operations and number concepts",
          icon: "📊",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          subjectId: Number.parseInt(subjectId),
          createdAt: "2023-05-15",
        },
        {
          id: 2,
          title: "Algebra",
          description: "Algebraic expressions and equations",
          icon: "📈",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          subjectId: Number.parseInt(subjectId),
          createdAt: "2023-05-16",
        },
        {
          id: 3,
          title: "Geometry",
          description: "Shapes, sizes, and properties of space",
          icon: "📏",
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600",
          subjectId: Number.parseInt(subjectId),
          createdAt: "2023-05-17",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Filter topics based on search query
  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Delete topic handler
  const handleDeleteTopic = async (id: number) => {
    try {
      // This would be replaced with your actual API endpoint
      const response = await api.delete(`/admin/topics/${id}`)

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
          <h1 className="text-2xl font-bold">{subject?.name} Topics</h1>
          <p className="text-gray-500">Manage topics for {subject?.name}</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Topic</DialogTitle>
              <DialogDescription>Create a new topic for {subject?.name}.</DialogDescription>
            </DialogHeader>
            <TopicForm subjectId={Number.parseInt(subjectId)} onSuccess={() => fetchTopics()} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Topics</CardTitle>
          <CardDescription>Manage topics for {subject?.name}</CardDescription>
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
                    <TableHead>Icon</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopics.map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <div className={`w-8 h-8 rounded-md ${topic.iconBg} flex items-center justify-center`}>
                          <span className={topic.iconColor}>{topic.icon}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{topic.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{topic.description}</TableCell>
                      <TableCell>{new Date(topic.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
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
                                onSuccess={() => fetchTopics()}
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
                                  This will permanently delete the topic "{topic.title}" and all associated content.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteTopic(topic.id)}
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
  onSuccess: () => void
}

function TopicForm({ topic, subjectId, onSuccess }: TopicFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: topic?.title || "",
    description: topic?.description || "",
    icon: topic?.icon || "📚",
    iconBg: topic?.iconBg || "bg-blue-100",
    iconColor: topic?.iconColor || "text-blue-600",
  })

  // Available icons and colors for selection
  const icons = ["📚", "📊", "📈", "📏", "🧮", "🔍", "🧩", "🎯"]
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
  const iconColors = [
    "text-blue-600",
    "text-green-600",
    "text-yellow-600",
    "text-purple-600",
    "text-pink-600",
    "text-indigo-600",
    "text-red-600",
    "text-orange-600",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIconSelect = (icon: string) => {
    setFormData((prev) => ({ ...prev, icon }))
  }

  const handleBgSelect = (bg: string) => {
    setFormData((prev) => ({ ...prev, iconBg: bg }))
  }

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, iconColor: color }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.title) {
        throw new Error("Topic title is required")
      }

      const payload = {
        ...formData,
        subjectId,
      }

      // This would be replaced with your actual API endpoint
      const response = topic
        ? await api.put(`/admin/topics/${topic.id}`, payload)
        : await api.post("/admin/topics", payload)

      if (response.ok) {
        toast({
          title: "Success",
          description: topic ? "Topic updated successfully" : "Topic created successfully",
        })
        onSuccess()
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
            Topic Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Arithmetic & Number Sense"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this topic"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Icon</label>
          <div className="grid grid-cols-8 gap-2">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  formData.icon === icon ? "ring-2 ring-[#1e74bb]" : "hover:bg-gray-100"
                }`}
                onClick={() => handleIconSelect(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Icon Background</label>
          <div className="grid grid-cols-8 gap-2">
            {iconBgs.map((bg) => (
              <button
                key={bg}
                type="button"
                className={`w-8 h-8 ${bg} rounded-md ${formData.iconBg === bg ? "ring-2 ring-[#1e74bb]" : ""}`}
                onClick={() => handleBgSelect(bg)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Icon Color</label>
          <div className="grid grid-cols-8 gap-2">
            {iconColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 bg-white flex items-center justify-center rounded-md ${
                  formData.iconColor === color ? "ring-2 ring-[#1e74bb]" : "hover:bg-gray-100"
                }`}
                onClick={() => handleColorSelect(color)}
              >
                <div className={`w-4 h-4 rounded-full ${color.replace("text-", "bg-")}`}></div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preview</label>
          <div className="flex items-center gap-2 p-4 border rounded-md">
            <div className={`w-10 h-10 rounded-md ${formData.iconBg} flex items-center justify-center`}>
              <span className={formData.iconColor}>{formData.icon}</span>
            </div>
            <div>
              <div className="font-medium">{formData.title || "Topic Title"}</div>
              <div className="text-sm text-gray-500">{formData.description || "Topic description"}</div>
            </div>
          </div>
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
