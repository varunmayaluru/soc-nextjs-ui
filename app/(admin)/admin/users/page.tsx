"use client"
import { useState, useEffect, useCallback } from "react"
import { Search, Filter, MoreHorizontal, ArrowUpDown, UserPlus, Layers, ChevronRight, Users, Eye, Edit, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Organization } from "@/app/types/types"

type UserForm = {
  first_name: string
  last_name: string
  email: string
  password: string
  organization_id: string
  organization_name?: string  // Add this field
  role: string
  is_active: boolean
  email_verified: boolean
  create_date_time: string
  update_date_time: string
  status: string
  user_id?: string
}

type FormErrors = {
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  organization_id?: string
  role?: string
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserForm | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: "asc" | "desc" }>({
    column: "first_name",
    direction: "asc",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrganization, setSelectedOrganization] = useState<string>("all")

  const [users, setUsers] = useState<UserForm[]>([])

  const [form, setForm] = useState<UserForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    organization_id: "",
    role: "",
    is_active: true,
    email_verified: false,
    create_date_time: new Date().toISOString(),
    update_date_time: new Date().toISOString(),
    status: "Active",
  })

  const [showEditUserDialog, setShowEditUserDialog] = useState(false)
  const [userToEdit, setUserToEdit] = useState<UserForm | null>(null)
  const [editForm, setEditForm] = useState<UserForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    organization_id: "",
    role: "",
    is_active: true,
    email_verified: false,
    create_date_time: new Date().toISOString(),
    update_date_time: new Date().toISOString(),
    status: "Active",
  })
  const [editErrors, setEditErrors] = useState<FormErrors>({})

  // Fetch organizations on component mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true)
        const response = await api.get<Organization[]>("/organizations/organizations/organizations")
        if (response.status === 200) {
          setOrganizations(response.data)
          if (response.data.length > 0) {
            // setSelectedOrganization(response.data[0].organization_name)
          }
        } else {
          toast.error(`Failed to fetch organizations. Server responded with status ${response.status}`)
        }
      } catch (error) {
        toast.error("Failed to fetch organizations")
        setOrganizations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  // Fetch users when organization changes
  useEffect(() => {
    if (organizations.length > 0 && selectedOrganization) {
      bindUsersToOrganization(selectedOrganization)
    }
  }, [organizations, selectedOrganization])

  const bindUsersToOrganization = useCallback(async (organizationName: string) => {
    try {
      setIsLoading(true)
      setUsers([])

      if (organizationName === "all") {
        // Fetch users from all organizations
        const allUsersPromises = organizations.map(async (org) => {
          try {
            const response = await api.get(`/users/organizations/${org.organization_id}/users`)
            if (response.status === 200 && Array.isArray(response.data)) {
              // Add organization name to each user
              return response.data.map((user: UserForm) => ({
                ...user,
                organization_name: org.organization_name
              }))
            }
            return []
          } catch (error) {
            console.error(`Error fetching users for ${org.organization_name}:`, error)
            return []
          }
        })

        const allUsersArrays = await Promise.all(allUsersPromises)
        const allUsers = allUsersArrays.flat()
        setUsers(allUsers)
      } else {
        // Fetch users from specific organization
        const orgId = organizations.find(org => org.organization_name === organizationName)?.organization_id

        if (!orgId) {
          toast.error("Organization not found")
          return
        }

        const response = await api.get(`/users/organizations/${orgId}/users`)

        if (response.status === 200 && Array.isArray(response.data)) {
          // Add organization name to each user
          const usersWithOrgName = response.data.map((user: UserForm) => ({
            ...user,
            organization_name: organizationName
          }))
          setUsers(usersWithOrgName)
        } else {
          toast.error("Failed to fetch users for organization")
        }
      }
    } catch (error) {
      setUsers([])
      toast.error("Error fetching users")
    } finally {
      setIsLoading(false)
    }
  }, [organizations])

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!form.first_name.trim()) {
      newErrors.first_name = "First name is required"
    } else if (form.first_name.length < 2) {
      newErrors.first_name = "First name must be at least 2 characters"
    }

    if (!form.last_name.trim()) {
      newErrors.last_name = "Last name is required"
    } else if (form.last_name.length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters"
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!form.organization_id) {
      newErrors.organization_id = "Organization is required"
    }

    if (!form.role) {
      newErrors.role = "Role is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form])

  // Reset form
  const resetForm = useCallback(() => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      organization_id: "",
      role: "",
      is_active: true,
      email_verified: false,
      create_date_time: new Date().toISOString(),
      update_date_time: new Date().toISOString(),
      status: "Active",
    })
    setErrors({})
  }, [])

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    try {
      setIsSubmitting(true)
      const newUser = {
        ...form,
        create_date_time: new Date().toISOString(),
        update_date_time: new Date().toISOString(),
      }

      const response = await api.post<UserForm>("/users/register", newUser)

      if (response.status === 201 || response.status === 200) {
        toast.success("User created successfully")
        setShowAddUserDialog(false)
        resetForm()
        bindUsersToOrganization(selectedOrganization)
      } else {
        toast.error(`Failed to create user. Server responded with status ${response.status}`)
      }
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Error creating user. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle user deletion
  const handleDeleteUser = async (user: UserForm) => {
    try {
      const response = await api.delete(`/users/users/${user.user_id}?organization_id=${user.organization_id}`)
      if (response.status === 200 || response.status === 204) {
        toast.success("User deleted successfully")
        bindUsersToOrganization(selectedOrganization)
      } else {
        toast.error("Failed to delete user")
      }
    } catch (error) {
      toast.error("Error deleting user")
    }
  }

  // Handle edit user
  const handleEditUser = (user: UserForm) => {
    setUserToEdit(user)
    setEditForm({
      ...user,
      password: "", // Don't pre-fill password for security
    })
    setEditErrors({})
    setShowEditUserDialog(true)
  }

  // Validate edit form
  const validateEditForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!editForm.first_name.trim()) {
      newErrors.first_name = "First name is required"
    } else if (editForm.first_name.length < 2) {
      newErrors.first_name = "First name must be at least 2 characters"
    }

    if (!editForm.last_name.trim()) {
      newErrors.last_name = "Last name is required"
    } else if (editForm.last_name.length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters"
    }

    if (!editForm.organization_id) {
      newErrors.organization_id = "Organization is required"
    }

    if (!editForm.role) {
      newErrors.role = "Role is required"
    }

    setEditErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [editForm])

  // Handle edit form submission
  const handleEditSubmit = async () => {
    if (!validateEditForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    if (!userToEdit) {
      toast.error("No user selected for editing")
      return
    }

    try {
      setIsSubmitting(true)

      const updatePayload = {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        organization_id: parseInt(editForm.organization_id),
        role: editForm.role,
        is_active: editForm.is_active,
        last_login: new Date().toISOString(),
        email_verified: editForm.email_verified,
        update_date_time: new Date().toISOString()
      }

      const response = await api.patch(
        `/users/users/${Number(userToEdit.user_id)}?organization_id=${userToEdit.organization_id.toString()}`,
        updatePayload
      )

      if (response.status === 200 || response.status === 204) {
        toast.success("User updated successfully")
        setShowEditUserDialog(false)
        setUserToEdit(null)
        bindUsersToOrganization(selectedOrganization)
      } else {
        toast.error(`Failed to update user. Server responded with status ${response.status}`)
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Error updating user. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sort function
  const sortData = (column: string) => {
    const newDirection = sortConfig.column === column && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ column, direction: newDirection })
  }

  // Filter users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        (user.first_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (user.last_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      const column = sortConfig.column as keyof UserForm
      const direction = sortConfig.direction === "asc" ? 1 : -1

      const aValue = a[column] || ""
      const bValue = b[column] || ""

      if (aValue < bValue) return -1 * direction
      if (aValue > bValue) return 1 * direction
      return 0
    })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1e74bb] to-[#4a9eda] text-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Admin Level
              </Badge>
              <Badge className="bg-[#0d4c7a] text-white border-[#0d4c7a]">
                User Management
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-blue-100">Manage your platform users and their permissions</p>
          </div>
          <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
            <DialogTrigger asChild>
              <Button className="bg-white text-[#1e74bb] hover:bg-blue-50 shadow-md">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account for your learning platform.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">User Details</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name *</Label>
                        <Input
                          id="first-name"
                          value={form.first_name}
                          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                          placeholder="Enter first name"
                          className={errors.first_name ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {errors.first_name && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.first_name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name *</Label>
                        <Input
                          id="last-name"
                          value={form.last_name}
                          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                          placeholder="Enter last name"
                          className={errors.last_name ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {errors.last_name && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.last_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        placeholder="john.doe@example.com"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Enter password (min. 6 characters)"
                        className={errors.password ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organization_id">Organization *</Label>
                        <Select
                          value={form.organization_id}
                          onValueChange={(value) => setForm({ ...form, organization_id: value })}
                        >
                          <SelectTrigger className={errors.organization_id ? "border-red-500 focus:ring-red-500" : ""}>
                            <SelectValue placeholder="Select organization" />
                          </SelectTrigger>
                          <SelectContent>
                            {organizations.map((organization) => (
                              <SelectItem key={organization.organization_id} value={organization.organization_id.toString()}>
                                {organization.organization_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.organization_id && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.organization_id}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role-dropdown">Role *</Label>
                        <Select
                          value={form.role}
                          onValueChange={(value) => setForm({ ...form, role: value })}
                        >
                          <SelectTrigger className={errors.role ? "border-red-500 focus:ring-red-500" : ""}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.role && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.role}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="is-active"
                          className="accent-[#1e74bb] w-4 h-4"
                          checked={form.is_active}
                          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                        />
                        <Label htmlFor="is-active" className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Account Active
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="email-verified"
                          className="accent-[#1e74bb] w-4 h-4"
                          checked={form.email_verified}
                          onChange={(e) => setForm({ ...form, email_verified: e.target.checked })}
                        />
                        <Label htmlFor="email-verified" className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          Email Verified
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4 mt-6">
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-blue-900 mb-2">Role Permissions</h3>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p><strong>Admin:</strong> Full access to all features and user management</p>
                        <p><strong>User:</strong> Access to learning materials and personal dashboard</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddUserDialog(false)
                    resetForm()
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#1e74bb] hover:bg-[#1a65a3]"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit User</DialogTitle>
                <DialogDescription>
                  Update user information and permissions.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">User Details</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-first-name">First name *</Label>
                        <Input
                          id="edit-first-name"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                          placeholder="Enter first name"
                          className={editErrors.first_name ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {editErrors.first_name && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {editErrors.first_name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-last-name">Last name *</Label>
                        <Input
                          id="edit-last-name"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          placeholder="Enter last name"
                          className={editErrors.last_name ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {editErrors.last_name && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {editErrors.last_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        value={editForm.email}
                        type="email"
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-sm text-gray-500">Email cannot be changed after account creation</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-organization_id">Organization *</Label>
                        <Select
                          disabled
                          value={editForm.organization_id}
                        // onValueChange={(value) => setEditForm({ ...editForm, organization_id: value })}
                        >
                          <SelectTrigger className={editErrors.organization_id ? "border-red-500 focus:ring-red-500 " : ""}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-100 cursor-not-allowed">
                            <SelectItem value={editForm.organization_id}>{editForm.organization_name}</SelectItem>

                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500">organization cannot be changed after account creation</p>
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="edit-organization_id">Organization *</Label>
                        <Select
                          value={editForm.organization_id}
                          onValueChange={(value) => setEditForm({ ...editForm, organization_id: value })}
                        >
                          <SelectTrigger className={editErrors.organization_id ? "border-red-500 focus:ring-red-500" : ""}>
                            <SelectValue placeholder="Select organization" />
                          </SelectTrigger>
                          <SelectContent>
                            {organizations.map((organization) => (
                              <SelectItem key={organization.organization_id} value={organization.organization_id.toString()}>
                                {organization.organization_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {editErrors.organization_id && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {editErrors.organization_id}
                          </p>
                        )}
                      </div> */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-role-dropdown">Role *</Label>
                        <Select
                          value={editForm.role}
                          onValueChange={(value) => setEditForm({ ...editForm, role: value })}
                        >
                          <SelectTrigger className={editErrors.role ? "border-red-500 focus:ring-red-500" : ""}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                        {editErrors.role && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {editErrors.role}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="edit-is-active"
                          className="accent-[#1e74bb] w-4 h-4"
                          checked={editForm.is_active}
                          onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                        />
                        <Label htmlFor="edit-is-active" className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Account Active
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="edit-email-verified"
                          className="accent-[#1e74bb] w-4 h-4"
                          checked={editForm.email_verified}
                          onChange={(e) => setEditForm({ ...editForm, email_verified: e.target.checked })}
                        />
                        <Label htmlFor="edit-email-verified" className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          Email Verified
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4 mt-6">
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-blue-900 mb-2">Role Permissions</h3>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p><strong>Admin:</strong> Full access to all features and user management</p>
                        <p><strong>User:</strong> Access to learning materials and personal dashboard</p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h3 className="font-medium text-amber-900 mb-2">Account Status</h3>
                      <div className="space-y-2 text-sm text-amber-800">
                        <p><strong>Active:</strong> User can log in and access the platform</p>
                        <p><strong>Inactive:</strong> User account is disabled and cannot log in</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditUserDialog(false)
                    setUserToEdit(null)
                    setEditErrors({})
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#1e74bb] hover:bg-[#1a65a3]"
                  onClick={handleEditSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update User
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="bg-white p-4 rounded-lg shadow-sm border border-gray-200" aria-label="Breadcrumb">
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
                <Users className="w-4 h-4 mr-2" />
                Users
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-xl">User Management</CardTitle>
          <CardDescription>View and manage all users on your platform</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex items-center gap-4">
                <Select
                  value={selectedOrganization}
                  onValueChange={(value) => {
                    setSelectedOrganization(value)
                    bindUsersToOrganization(value)
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[200px] bg-white">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Organizations</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.organization_id} value={org.organization_name}>
                        {org.organization_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search users by name or email..."
                    className="pl-9 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-lg border bg-white overflow-hidden">
              {isLoading ? (
                <div className="p-8">
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[160px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead onClick={() => sortData("first_name")} className="cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center">
                          User
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead onClick={() => sortData("organization_name")} className="cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center">
                          Organization
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead onClick={() => sortData("role")} className="cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center">
                          Role
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead onClick={() => sortData("status")} className="cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center">
                          Status
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Email Verified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-12 w-12 text-gray-400" />
                            <p className="text-gray-500 font-medium">
                              {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                                ? "No users match your search criteria"
                                : "No users found"}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "Add your first user to get started"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.user_id} className="group hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-[#1e74bb] text-white font-medium">
                                  {`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{`${user.first_name} ${user.last_name}`}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                              {user.organization_name || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                ${user.role === "admin" ? "border-purple-200 bg-purple-50 text-purple-700" : ""}
                                ${user.role === "user" ? "border-green-200 bg-green-50 text-green-700" : ""}
                              `}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                ${user.status === "Active" ? "border-green-200 bg-green-50 text-green-700" : ""}
                                ${user.status === "Inactive" ? "border-gray-200 bg-gray-50 text-gray-700" : ""}
                              `}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {user.email_verified ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                              )}
                              <span className="text-sm">
                                {user.email_verified ? "Verified" : "Pending"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              <Link href={`/admin/users/${user.user_id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </Link>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit user
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Reset password
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setUserToDelete(user)
                                      setShowDeleteDialog(true)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete user
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
                <span className="font-medium">{users.length}</span> users
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-white" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for{" "}
              <strong>{userToDelete?.first_name} {userToDelete?.last_name}</strong> and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete)
                  setShowDeleteDialog(false)
                  setUserToDelete(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}