"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, ChevronRight, Search, BookOpen, School, Filter, ArrowUpDown, Layers } from "lucide-react"
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const organizationId = localStorage.getItem("organizationId")

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
      const response = await api.get<Organization[]>(`/organizations/organizations`)
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
      let organization_id = localStorage.getItem("organizationId")
      const response = await api.get<Subject[]>(`/subjects/subjects/?organization_id=${organization_id}`)
      if (response.ok) {
        const subjectsWithOrganizationName = response.data.map((subject) => {
          const organization = orgs.find((org) => org.id === subject.organization_id)
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
  const handleDeleteSubject = async (id: number, slug: string, organizationId: number) => {
    try {
      const response = await api.delete(`/subjects/subjects/${slug}/${id}?organization_id=${organizationId}`)

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1e74bb] to-[#4a9eda] text-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white text-[#1e74bb] hover:bg-gray-100">Admin Level</Badge>
              <Badge className="bg-[#0d4c7a] text-white">Subjects Hub</Badge>
            </div>
            <h1 className="text-2xl font-bold mb-1">Subjects Management</h1>
            <p className="text-gray-100">Create and manage subjects for your learning platform</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setAddDialogOpen(true)} className="bg-white text-[#1e74bb] hover:bg-gray-100">
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
                    value: org.id,
                    label: org.organization_name,
                  }))}
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
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-sm font-medium text-[#1e74bb] flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Subjects
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex justify-between items-center">

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            {/* <Button onClick={() => setAddDialogOpen(true)} className="bg-brand hover:bg-brand-hover">
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button> */}
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
                value: org.id,
                label: org.organization_name,
              }))}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="grid" className="data-[state=active]:bg-brand data-[state=active]:text-white">
              Grid View
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-brand data-[state=active]:text-white">
              Table View
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search subjects..."
                className="pl-8 w-[200px] md:w-[300px] border-gray-300 focus:border-brand focus:ring-brand"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem onClick={() => setFilterOrg(null)} className="hover:bg-brand-light">
                  All Organizations
                </DropdownMenuItem>
                {organizations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => setFilterOrg(org.id)}
                    className="hover:bg-brand-light"
                  >
                    {org.organization_name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("name")
                    toggleSortOrder()
                  }}
                  className="hover:bg-brand-light"
                >
                  By Name ({sortOrder === "asc" ? "A-Z" : "Z-A"})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("date")
                    toggleSortOrder()
                  }}
                  className="hover:bg-brand-light"
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
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No subjects found</h3>
              <p className="text-gray-500">
                {searchQuery ? "No subjects match your search criteria" : "Add your first subject to get started!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSubjects.map((subject) => (
                <Card
                  key={subject.id}
                  className={`overflow-hidden transition-all duration-200 ${hoveredCard === subject.id ? "shadow-md border-brand" : "shadow border-gray-200"
                    }`}
                  onMouseEnter={() => setHoveredCard(subject.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardHeader className="pb-2 bg-gradient-to-r from-brand-light to-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{subject.subject_name}</CardTitle>
                        <CardDescription className="flex items-center mt-1 text-gray-600">
                          <School className="h-3.5 w-3.5 mr-1" />
                          {subject.organization_name}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={subject.is_active ? "default" : "outline"}
                        className={
                          subject.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : "text-gray-500"
                        }
                      >
                        {subject.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-500 mb-4">
                      Created: {new Date(subject.create_date_time).toLocaleDateString()}
                    </div>
                    <div className="flex justify-between items-center">
                      <Link
                        href={{
                          pathname: `/admin/subjects/${subject.id}/topics`,
                          query: {
                            organization_id: subject.organization_id,
                            organization_name: subject.organization_name,
                            subject_slug: subject.slug,
                          },
                        }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-brand text-brand hover:bg-brand-light"
                        >
                          <BookOpen className="h-4 w-4" />
                          Manage Topics
                        </Button>
                      </Link>
                      <div className="flex gap-2">
                        <Dialog
                          open={editDialogOpen === subject.id}
                          onOpenChange={(open) => setEditDialogOpen(open ? subject.id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-gray-300 hover:border-brand hover:bg-brand-light"
                            >
                              <Pencil className="h-4 w-4 text-gray-600" />
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
                                value: org.id,
                                label: org.organization_name,
                              }))}
                            />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-gray-300 hover:border-red-300 hover:bg-red-50"
                            >
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
                                onClick={() => handleDeleteSubject(subject.id, subject.slug, subject.organization_id)}
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
          <Card className="border border-gray-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-12 bg-gray-50">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No subjects found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? "No subjects match your search criteria" : "Add your first subject to get started!"}
                  </p>
                </div>
              ) : (
                <div className="rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-brand-light border-b border-gray-200">
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-700">ID</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-700">Subject Name</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-700">Organization</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="h-12 px-4 text-left text-sm font-medium text-gray-700">Created</th>
                        <th className="h-12 px-4 text-right text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.map((subject, index) => (
                        <tr
                          key={subject.id}
                          className={`border-b hover:bg-brand-light transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">{subject.id}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{subject.subject_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{subject.organization_name}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge
                              variant={subject.is_active ? "default" : "outline"}
                              className={
                                subject.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : "text-gray-500"
                              }
                            >
                              {subject.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(subject.create_date_time).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/subjects/${subject.id}/topics`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-brand text-brand hover:bg-brand-light"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                  <span className="sr-only md:not-sr-only md:ml-2">Topics</span>
                                </Button>
                              </Link>

                              <Dialog
                                open={editDialogOpen === subject.id}
                                onOpenChange={(open) => setEditDialogOpen(open ? subject.id : null)}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 hover:border-brand hover:bg-brand-light"
                                  >
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
                                      value: org.id,
                                      label: org.organization_name,
                                    }))}
                                  />
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 hover:border-red-300 hover:bg-red-50"
                                  >
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
                                      onClick={() => handleDeleteSubject(subject.id, subject.slug, subject.organization_id)}
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

  const user_id = localStorage.getItem("userId")

  const [formData, setFormData] = useState({
    subject_name: subject?.subject_name || "",
    organization_id: subject?.organization_id || 0,
    slug: subject?.slug || "",
    is_active: subject?.is_active ?? true,
    created_by: user_id, // hardcode or get from session if needed
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === "id" ? +value : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.subject_name || !formData.organization_id || !formData.slug) {
        throw new Error("Please fill in all required fields")
      }

      if (formData.slug.includes(" ")) {
        throw new Error("Slug should not contain spaces")
      }



      const payload = {
        ...formData,
        update_date_time: new Date().toISOString(),
      }

      const response = subject
        ? await api.put(`/subjects/subjects/${subject.slug}/${subject.id}?organization_id=${subject.organization_id}`, payload)
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
            className="border-gray-300 focus:border-brand focus:ring-brand"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g., Mathematics"
            className="border-gray-300 focus:border-brand focus:ring-brand"
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
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
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
          <Label htmlFor="is_active" className="cursor-pointer">
            Active
          </Label>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
            className="data-[state=checked]:bg-brand"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading} className="bg-brand hover:bg-brand-hover">
          {isLoading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
          {subject ? "Update Subject" : "Create Subject"}
        </Button>
      </DialogFooter>
    </form>
  )
}
