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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type SubjectsPageViewModel = Subject & {
 organization_name: string;
 
}


export default function SubjectsPage() {
  const { toast } = useToast()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [SubjectPageViewModel, setSubjectPageViewModel] = useState<SubjectsPageViewModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch subjects on component mount
useEffect(() => {
  const fetchData = async () => {
    const orgs = await fetchOrganizations();
    await fetchSubjects(orgs); 
  };

  fetchData();

}, []);


 const fetchOrganizations = async (): Promise<Organization[]> => {
  setIsLoading(true);
  try {
    const response = await api.get<Organization[]>(`/organizations/organizations/organizations`);
    if (response.ok) {
      const data = response.data;
      setOrganizations(data);
      return data;
    } else {
      throw new Error("Failed to fetch organizations");
    }
  } catch (error) {
    console.error("Error fetching organizations:", error);
    toast({
      title: "Error",
      description: "Failed to load organizations. Please try again.",
      variant: "destructive",
    });
    return [];
  } finally {
    setIsLoading(false);
  }
};

  // Fetch subjects from API
  const fetchSubjects = async (orgs: Organization[]) => {
  setIsLoading(true);
  try {
    const response = await api.get<Subject[]>("/subjects/subjects/");
    if (response.ok) {
      const subjectsWithOrganizationName = response.data.map((subject) => {
        const organization = orgs.find((org) => org.organization_id === subject.organization_id);
        return {
          ...subject,
          organization_name: organization ? organization.organization_name : "Unknown",
        };
      });
      setSubjectPageViewModel(subjectsWithOrganizationName);
    } else {
      throw new Error("Failed to fetch subjects");
    }
  } catch (error) {
    console.error("Error fetching subjects:", error);
    toast({
      title: "Error",
      description: "Failed to load subjects. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  // Filter subjects based on search query
  let filteredSubjects = SubjectPageViewModel.filter(
    (subject) =>
      subject.subject_name.toString().toLowerCase().includes(searchQuery.toLowerCase()) 
  )

  // Delete subject handler
  const handleDeleteSubject = async (id: number) => {
    try {
      // This would be replaced with your actual API endpoint
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
            <SubjectForm subject={undefined}  onSuccess={() => fetchSubjects(organizations)}
                              organizationOptions={organizations.map((org) => ({
                                  value: org.organization_id,
                                  label: org.organization_name,
                                }))} />
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
                    <TableHead>Id</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Organization Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={subject.subject_id}>
                      <TableCell className="font-medium">{subject.subject_id}</TableCell>
                       <TableCell>{subject.subject_name}</TableCell>
                      <TableCell className="font-medium">{subject.organization_name}</TableCell>
                     
                      <TableCell>{new Date(subject.create_date_time).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/subjects/${subject.subject_id}/topics`}>
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
                              <SubjectForm subject={subject} onSuccess={() => fetchSubjects(organizations)}
                              organizationOptions={organizations.map((org) => ({
                                  value: org.organization_id,
                                  label: org.organization_name,
                                }))} />
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
                                  This will permanently delete the subject "{subject.subject_name}" and all associated topics.
                                  This action cannot be undone.
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


interface SubjectFormProps {
  subject?: Subject;
  onSuccess: () => void;
  organizationOptions: { value: number; label: string }[];
}

export function SubjectForm({ subject, onSuccess, organizationOptions }: SubjectFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject_name: subject?.subject_name || "",
    organization_id: subject?.organization_id || 0,
    is_active: subject?.is_active ?? true,
    created_by: subject?.created_by || 0, // hardcode or get from session if needed
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "organization_id" ? +value : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.subject_name || !formData.organization_id) {
        throw new Error("Please fill in all required fields");
      }

      const payload = {
        ...formData,
        update_date_time: new Date().toISOString(),
      };

      const response = subject
        ? await api.put(`/subjects/subjects/${subject.subject_id}`, payload)
        : await api.post("subjects/subjects/", {
            ...payload,
            create_date_time: new Date().toISOString(),
          });

      if (response.ok) {
        toast({
          title: "Success",
          description: subject ? "Subject updated successfully" : "Subject created successfully",
        });
        onSuccess();
        
      } else {
        throw new Error(subject ? "Failed to update subject" : "Failed to create subject");
      }
    } catch (error) {
      console.error("Error saving subject:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, is_active: checked }))
            }
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
  );
}
