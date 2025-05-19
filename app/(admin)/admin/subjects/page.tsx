"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, ChevronRight, Search, BookOpen, School, Filter, ArrowUpDown } from "lucide-react"
import { api } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

import type { Organization, Subject } from "../../../types/types"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type SubjectsPageViewModel = Subject & {
  organization_name: string
}

export default function SubjectsPage() {
  const { toast } = useToast()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectPageViewModel, setSubjectPageViewModel] = useState<SubjectsPageViewModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOrg, setFilterOrg] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "date">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState<number | null>(null)

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchData = async () => {
      const orgs = await fetchOrganizations()
      await fetchSubjects(orgs)
    }

    fetchData()
  }, [])

  const fetchOrganizations = async (): Promise<Organization[]> => {
    setIsLoading(true)
    try {
      const response = await api.get<Organization[]>(`/organizations/organizations/organizations`)
      if (response.ok) {
        const data = response.data
        setOrganizations(data)
        return data
      } else {
        throw new Error("Failed to fetch organizations")
      }
    } catch (error) {
      console.error("Error fetching organizations:", error)
      toast({
        title: "Error",
        description: "Failed to load organizations. Please try again.",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch subjects from API
  const fetchSubjects = async (orgs: Organization[]) => {
    setIsLoading(true)
    try {
      const response = await api.get<Subject[]>("/subjects/subjects/")
      if (response.ok) {
        const subjectsWithOrganizationName = response.data.map((subject) => {
          const organization = orgs.find((org) => org.organization_id === subject.organization_id)
          return {
            ...subject,
            organization_name: organization ? organization.organization_name : "Unknown",
          }
        })
        setSubjectPageViewModel(subjectsWithOrganizationName)
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
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and sort subjects
  const filteredSubjects = subjectPageViewModel
    .filter(
      (subject) =>
        subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterOrg === null || subject.organization_id === filterOrg),
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.subject_name.localeCompare(b.subject_name)
          : b.subject_name.localeCompare(a.subject_name)
      } else {
        return sortOrder === "asc"
          ? new Date(a.create_date_time).getTime() - new Date(b.create_date_time).getTime()
          : new Date(b.create_date_time).getTime() - new Date(a.create_date_time).getTime()
      }
    })

  // Delete subject handler
  const handleDeleteSubject = async (id: number) => {
    try {
      const response = await api.delete(`/subjects/subjects/${id}`)

      if (response.ok) {
        fetchSubjects(organizations)
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

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subjects Management</h1>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>Create a new subject for your learning platform.</DialogDescription>
            </DialogHeader>
            <SubjectForm
              subject={undefined}
              onSuccess={() => {
                fetchSubjects(organizations)
                setAddDialogOpen(false)
              }}
              organizationOptions={organizations.map((org) => ({
                value: org.organization_id,
                label: org.organization_name,
              }))}
            />
          </DialogContent>
        </Dialog>
      </div>

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
                placeholder="Search subjects..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterOrg(null)}>All Organizations</DropdownMenuItem>
                {organizations.map((org) => (
                  <DropdownMenuItem key={org.organization_id} onClick={() => setFilterOrg(org.organization_id)}>
                    {org.organization_name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No subjects match your search" : "No subjects found. Add your first subject!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map((subject) => (
                <Card key={subject.subject_id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{subject.subject_name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <School className="h-3.5 w-3.5 mr-1" />
                          {subject.organization_name}
                        </CardDescription>
                      </div>
                      <Badge variant={subject.is_active ? "default" : "outline"}>
                        {subject.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500 mb-4">
                      Created: {new Date(subject.create_date_time).toLocaleDateString()}
                    </div>
                    <div className="flex justify-between items-center">
                      <Link href={`/admin/subjects/${subject.subject_id}/topics`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <BookOpen className="h-4 w-4" />
                          Manage Topics
                        </Button>
                      </Link>
                      <div className="flex gap-2">
                        <Dialog
                          open={editDialogOpen === subject.subject_id}
                          onOpenChange={(open) => setEditDialogOpen(open ? subject.subject_id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Subject</DialogTitle>
                              <DialogDescription>Update the subject details.</DialogDescription>
                            </DialogHeader>
                            <SubjectForm
                              subject={subject}
                              onSuccess={() => {
                                fetchSubjects(organizations)
                                setEditDialogOpen(null)
                              }}
                              organizationOptions={organizations.map((org) => ({
                                value: org.organization_id,
                                label: org.organization_name,
                              }))}
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
                                This will permanently delete the subject "{subject.subject_name}" and all associated
                                topics. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteSubject(subject.subject_id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
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
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "No subjects match your search" : "No subjects found. Add your first subject!"}
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">ID</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Subject Name</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Organization</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-500">Created</th>
                        <th className="h-12 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.map((subject) => (
                        <tr key={subject.subject_id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{subject.subject_id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{subject.subject_name}</td>
                          <td className="px-4 py-3 text-sm">{subject.organization_name}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={subject.is_active ? "default" : "outline"}>
                              {subject.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(subject.create_date_time).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/subjects/${subject.subject_id}/topics`}>
                                <Button variant="outline" size="sm">
                                  <ChevronRight className="h-4 w-4" />
                                  <span className="sr-only md:not-sr-only md:ml-2">Topics</span>
                                </Button>
                              </Link>

                              <Dialog
                                open={editDialogOpen === subject.subject_id}
                                onOpenChange={(open) => setEditDialogOpen(open ? subject.subject_id : null)}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Subject</DialogTitle>
                                    <DialogDescription>Update the subject details.</DialogDescription>
                                  </DialogHeader>
                                  <SubjectForm
                                    subject={subject}
                                    onSuccess={() => {
                                      fetchSubjects(organizations)
                                      setEditDialogOpen(null)
                                    }}
                                    organizationOptions={organizations.map((org) => ({
                                      value: org.organization_id,
                                      label: org.organization_name,
                                    }))}
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
                                      This will permanently delete the subject "{subject.subject_name}" and all
                                      associated topics. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() => handleDeleteSubject(subject.subject_id)}
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

interface SubjectFormProps {
  subject?: Subject
  onSuccess: () => void
  organizationOptions: { value: number; label: string }[]
}

export function SubjectForm({ subject, onSuccess, organizationOptions }: SubjectFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    subject_name: subject?.subject_name || "",
    organization_id: subject?.organization_id || 0,
    is_active: subject?.is_active ?? true,
    created_by: subject?.created_by || 0, // hardcode or get from session if needed
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === "organization_id" ? +value : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.subject_name || !formData.organization_id) {
        throw new Error("Please fill in all required fields")
      }

      const payload = {
        ...formData,
        update_date_time: new Date().toISOString(),
      }

      const response = subject
        ? await api.put(`/subjects/subjects/${subject.subject_id}`, payload)
        : await api.post("subjects/subjects/", {
            ...payload,
            create_date_time: new Date().toISOString(),
          })

      if (response.ok) {
        toast({
          title: "Success",
          description: subject ? "Subject updated successfully" : "Subject created successfully",
        })
        onSuccess()
        // Close the dialog by returning true
        return true
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
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="subject_name">Subject Name *</Label>
          <Input
            id="subject_name"
            name="subject_name"
            value={formData.subject_name}
            onChange={handleChange}
            placeholder="e.g., Mathematics"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization_id">Organization *</Label>
          <select
            id="organization_id"
            name="organization_id"
            value={formData.organization_id}
            onChange={handleChange}
            className="w-full border rounded px-2 py-2"
            required
          >
            <option value="">Select Organization</option>
            {organizationOptions.map((org) => (
              <option key={org.value} value={org.value}>
                {org.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="is_active">Active</Label>
          <Switch
            className="h-6 w-11 rounded-full"
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
          {subject ? "Update Subject" : "Create Subject"}
        </Button>
      </DialogFooter>
    </form>
  )
}
