"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, ChevronRight, Search } from "lucide-react"
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


import { Organization, Subject } from "../../../types/types"

type SubjectsPageProps = Subject & {
 organization_name: string;
 
}


export default function SubjectsPage() {
  const { toast } = useToast()
  const [organizations, setorganizations] = useState<Organization[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch subjects on component mount
  useEffect(() => {
    fetchOrganizations();
    fetchSubjects();
  }, [])


  const fetchOrganizations = async () => {
    try {
          const response = await api.get<Organization[]>(`/organizations/organizations/organizations`)
    
          if (response.ok) {
            setorganizations(response.data)
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
          //setLoading(false)
        }
  };

  // Fetch subjects from API
  const fetchSubjects = async () => {
    setIsLoading(true)
    try {
      // This would be replaced with your actual API endpoint
      const response = await api.get<Subject[]>("/subjects/subjects/")

      if (response.ok) {
        setSubjects(response.data)
      } else {
        throw new Error("Failed to fetch subjects")
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
      toast({
        title: "Error",
        description: "Failed to load subjects. Please try again.",
        variant: "destructive",
      })

      // For demo purposes, set some sample data
      setSubjects([
        { id: 1, name: "Mathematics", category: "Core", totalTopics: 8, createdAt: "2023-05-15" },
        { id: 2, name: "Science", category: "Core", totalTopics: 6, createdAt: "2023-05-16" },
        { id: 3, name: "English", category: "Languages", totalTopics: 4, createdAt: "2023-05-17" },
        { id: 4, name: "Computer Science", category: "Technology", totalTopics: 5, createdAt: "2023-05-18" },
        { id: 5, name: "Social Studies", category: "Humanities", totalTopics: 7, createdAt: "2023-05-19" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Delete subject handler
  const handleDeleteSubject = async (id: number) => {
    try {
      // This would be replaced with your actual API endpoint
      const response = await api.delete(`/admin/subjects/${id}`)

      if (response.ok) {
        setSubjects(subjects.filter((subject) => subject.id !== id))
        toast({
          title: "Success",
          description: "Subject deleted successfully",
        })
      } else {
        throw new Error("Failed to delete subject")
      }
    } catch (error) {
      console.error("Error deleting subject:", error)
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subjects Management</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>Create a new subject for your learning platform.</DialogDescription>
            </DialogHeader>
            <SubjectForm onSuccess={() => fetchSubjects()} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>All Subjects</CardTitle>
          <CardDescription>Manage your learning platform subjects and their topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search subjects..."
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
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No subjects match your search" : "No subjects found. Add your first subject!"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.category}</TableCell>
                      <TableCell>{subject.totalTopics}</TableCell>
                      <TableCell>{new Date(subject.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/subjects/${subject.id}/topics`}>
                            <Button variant="outline" size="sm">
                              <ChevronRight className="h-4 w-4" />
                              <span className="sr-only">View Topics</span>
                            </Button>
                          </Link>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Subject</DialogTitle>
                                <DialogDescription>Update the subject details.</DialogDescription>
                              </DialogHeader>
                              <SubjectForm subject={subject} onSuccess={() => fetchSubjects()} />
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
                                  This will permanently delete the subject "{subject.name}" and all associated topics.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteSubject(subject.id)}
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

// Subject Form Component
interface SubjectFormProps {
  subject?: Subject
  onSuccess: () => void
}

function SubjectForm({ subject, onSuccess }: SubjectFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: subject?.name || "",
    category: subject?.category || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.name || !formData.category) {
        throw new Error("Please fill in all required fields")
      }

      // This would be replaced with your actual API endpoint
      const response = subject
        ? await api.put(`/admin/subjects/${subject.id}`, formData)
        : await api.post("/admin/subjects", formData)

      if (response.ok) {
        toast({
          title: "Success",
          description: subject ? "Subject updated successfully" : "Subject created successfully",
        })
        onSuccess()
      } else {
        throw new Error(subject ? "Failed to update subject" : "Failed to create subject")
      }
    } catch (error) {
      console.error("Error saving subject:", error)
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
          <label htmlFor="name" className="text-sm font-medium">
            Subject Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Mathematics"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Core, Languages, Technology"
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
          {subject ? "Update Subject" : "Create Subject"}
        </Button>
      </DialogFooter>
    </form>
  )
}
