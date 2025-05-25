"use client"
import { useState } from "react"
import { Search, Filter, MoreHorizontal, ArrowUpDown, UserPlus, Layers, ChevronRight, Users } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Organization } from "@/app/types/types"
import { useEffect } from "react"
import { set } from "date-fns"
// Mock data for users
// const users = [
//   {
//     id: "1",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     role: "Student",
//     status: "Active",
//     lastActive: "2 hours ago",
//     avatar: "/stylized-jd-initials.png",
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     role: "Teacher",
//     status: "Active",
//     lastActive: "1 day ago",
//     avatar: "/javascript-code.png",
//   },
//   {
//     id: "3",
//     name: "Robert Johnson",
//     email: "robert.johnson@example.com",
//     role: "Admin",
//     status: "Active",
//     lastActive: "Just now",
//     avatar: "/abstract-rj.png",
//   },
//   {
//     id: "4",
//     name: "Emily Davis",
//     email: "emily.davis@example.com",
//     role: "Student",
//     status: "Inactive",
//     lastActive: "1 week ago",
//     avatar: "/ed-initials-abstract.png",
//   },
//   {
//     id: "5",
//     name: "Michael Wilson",
//     email: "michael.wilson@example.com",
//     role: "Student",
//     status: "Active",
//     lastActive: "3 days ago",
//     avatar: "/intertwined-letters.png",
//   },
//   {
//     id: "6",
//     name: "Sarah Brown",
//     email: "sarah.brown@example.com",
//     role: "Teacher",
//     status: "Active",
//     lastActive: "5 hours ago",
//     avatar: "/stylized-letter-sb.png",
//   },
// ]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: "asc" | "desc" }>({
    column: "name",
    direction: "asc",
  })
const [nameError, setNameError] = useState({ show: false, message: "" })
const [lastNameError, setLastNameError] = useState({ show: false, message: "" })
const [emailError, setEmailError] = useState({ show: false, message: "" })
const [passwordError, setPasswordError] = useState({ show: false, message: "" })
const [organizationError, setOrganizationError] = useState({ show: false, message: "" })
const [roleError, setRoleError] = useState({ show: false, message: "" })
const [isActiveError, setIsActiveError] = useState({ show: false, message: "" })
const [emailVerifiedError, setEmailVerifiedError] = useState({ show: false, message: "" })
// State to hold organizations
const [organizations, setOrganizations] = useState<Organization[]>([])
const [selectedOrganization, setSelectedOrganization] = useState<string>("")
const [users, setUsers] = useState<UserForm[]>([])

// call ngonInit to fetch organizations

useEffect(() => {
  fetchOrganizations()
  setTimeout(() => {
    if (organizations.length > 0) {
             bindUsersToOrganization(organizations[0].organization_name)
             }
  }, 10);
}, [])

const fetchOrganizations = async () => {
    try {
      setOrganizations([]) // Reset organizations before fetching
      const response = await api.get<Organization[]>("/organizations/organizations/organizations")
      console.log("Organizations fetched:", response.data)
      // Handle the fetched organizations as needed
      if (response.status === 200) {
        setOrganizations(response.data)
      } else {
        toast.error(`Failed to fetch organizations. Server responded with status ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to fetch organizations")
      setOrganizations([]) // Reset organizations on error
    }
  }

const bindUsersToOrganization = async (organizationName: string) => {
  setSelectedOrganization(organizationName);
  setUsers([]);
  console.log("Selected organization:", organizationName);
  const orgId = organizations.find(org => org.organization_name === organizationName)?.organization_id;
  const response = await api.get(`/users/organizations/${orgId}/users`)
    .then((response) => {
      if (response.status === 200 && Array.isArray(response.data)) {
        // If you want to update the users grid, you need a users state
       setUsers(response.data)
      } else {
        toast.error("Failed to fetch users for organization")
      }
    })
    .catch((error) => {
      setUsers([]);
      toast.error("Error fetching users for organization")
    })
}

  type UserForm = {
  first_name: string
  last_name: string
  email: string
  password: string
  organization_id: string
  role: string
  is_active: boolean
  email_verified: boolean
  create_date_time: string
  update_date_time: string
  status: string
  user_id?:string
}

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

  // Sort function
  const sortData = (column: string) => {
    const newDirection = sortConfig.column === column && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ column, direction: newDirection })
  }

  // Filter users based on search query, role, and status
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        (user.first_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      const column = sortConfig.column as keyof (typeof users)[0]
      const direction = sortConfig.direction === "asc" ? 1 : -1

      // if (a[column] < b[column]) return -1 * direction
      // if (a[column] > b[column]) return 1 * direction
      return 0
    })

  const clearErrors = () => {
    setNameError({ show: false, message: "" })
    setLastNameError({ show: false, message: "" })
    setEmailError({ show: false, message: "" })
    setPasswordError({ show: false, message: "" })
    setOrganizationError({ show: false, message: "" })
    setRoleError({ show: false, message: "" })
    setIsActiveError({ show: false, message: "" })
    setEmailVerifiedError({ show: false, message: "" })
  }

   const validateForm = () => {
    clearErrors()
    if (form.first_name === "") {
      setNameError({ show: true, message: "First Name Required" })
      return false
    }
    if (form.last_name === "") {
      setLastNameError({ show: true, message: "Last Name are Required" })
      return false
    }
    if (form.email === "") {
      setEmailError({ show: true, message: "Email is Required" })
      return false
    }
    if (form.password === "") {
      setPasswordError({ show: true, message: "Password is Required" })
      return false
    }
    if (form.organization_id === "") {
      setOrganizationError({ show: true, message: "Organization is Required" })
      return false
    }
    if (form.role === "") {
      setRoleError({ show: true, message: "Role is Required" })
      return false
    }
    if (!form.is_active) {
      setIsActiveError({ show: true, message: "User must be active" })
      return false
    }
    if (form.first_name.length < 2) {
      setNameError({ show: true, message: "First and Last Name must be at least 2 characters" })
      return false
    }
    if (form.last_name.length < 2) {
      setLastNameError({ show: true, message: "First and Last Name must be at least 2 characters" })
      return false
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setEmailError({ show: true, message: "Email is not valid" })
      return false
    }
    if (form.password.length < 6) {
      setPasswordError({ show: true, message: "Password must be at least 6 characters" })
      return false
    }
    if (form.organization_id === "") {
      setOrganizationError({ show: true, message: "Organization is required" })
      return false
    }
    if (form.role === "") {
      setRoleError({ show: true, message: "Role is required" })
      return false
    }
    // if (!form.emailVerified) {
    //   setEmailError({ show: true, message: "Email must be verified" })
    //   return false
    // }
    // if (!form.isActive) {
    //   setNameError({ show: true, message: "User must be active" })
    //   return false
    // }
    // if (!form.emailVerified) {
    //   setNameError({ show: true, message: "Email must be verified" })
    //   return false
    // }
    // If all validations pass, clear errors and return true
    clearErrors()
    return true
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    // Here you would typically send the form data to your backend API
    createUser(form);
    // Reset form after successful submission
    ResetForm();
  }
  function ResetForm() {
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
  }
  // Create a new user (mock implementation)
  const createUser = async (
    newUser: Omit<UserForm, "status"> & { status?: string }
  ) => {
    try {
      // Here you would typically send the newUser data to your backend API
      newUser = {
        ...form,
        create_date_time: new Date().toISOString(),
        update_date_time: new Date().toISOString(),
      }
      console.log("Creating user:", newUser)
      // Simulate API call with a delay
      const response = await api.post<UserForm>("/users/register", newUser)

      console.log("User created response:", response);
      if (response.status !== 201 && response.status !== 200) {
        toast.error(`Failed to create user. Server responded with status ${response.status}`);
        return;
      }
      toast.success("User created successfully");
      setShowAddUserDialog(false)
    }
     catch (error) {
      console.error("Error creating user:", error)
      toast.error("Error creating user. Please try again.")
    }
  }

  return (
    <div className="space-y-6 mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1e74bb] to-[#4a9eda] text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white text-[#1e74bb] hover:bg-gray-100">Admin Level</Badge>
              <Badge className="bg-[#0d4c7a] text-white">User Management</Badge>
            </div>
            <h1 className="text-2xl font-bold mb-1">Users</h1>
            <p className="text-gray-100">Manage your platform users</p>
          </div>
          <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
            <DialogTrigger asChild>
              <Button className="bg-white text-[#1e74bb] hover:bg-gray-100">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account for your learning platform.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">User Details</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input
                          id="first-name"
                          value={form.first_name}
                          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                          placeholder="Enter first name"
                          className={nameError.show ? "border-red-500" : ""}/>
                        {
                        nameError.show && form.first_name === "" && (
                         <p className="text-red-500 text-sm">{nameError.message || "First name is required"}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input
                          id="last-name"
                          value={form.last_name}
                          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                          placeholder="Last name"
                          className={lastNameError.show ? "border-red-500" : ""}
                        />
                        {lastNameError.show && form.last_name === "" && (
                        <p className="text-red-500 text-sm">{lastNameError.message || "Last name is required"}</p>)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                      id="email"
                      placeholder="john.doe@example.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={emailError.show ? "border-red-500" : ""}
                      />
                      {emailError.show && form.email === "" && (
                      <p className="text-red-500 text-sm">{emailError.message || "Email is required"}</p>)}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Enter password"
                      className={passwordError.show && form.password === "" ? "border-red-500" : ""}
                      />
                      {passwordError.show && form.password === "" && (
                      <p className="text-red-500 text-sm">{passwordError.message || "Password is required"}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization_id">Organization</Label>
                      <Select
                        value={form.organization_id}
                        onValueChange={(value) => setForm({ ...form, organization_id: value })}
                      >
                        <SelectTrigger className={organizationError.show && form.organization_id === "" ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select organization_id" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Organization 1</SelectItem>
                          <SelectItem value="2">Organization 2</SelectItem>
                          <SelectItem value="3">Organization 3</SelectItem>
                        </SelectContent>
                      </Select>
                      {organizationError.show && form.organization_id === "" && (
                        <p className="text-red-500 text-sm">{organizationError.message || "Organization is required"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role-dropdown">Role</Label>
                        <Select
                        value={form.role}
                        onValueChange={(value) => setForm({ ...form, role: value })}
                        >
                        <SelectTrigger className={roleError.show && form.role === "" ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                        </Select>
                        {roleError.show && form.role === "" && (
                        <p className="text-red-500 text-sm">{roleError.message || "Role is required"}</p>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <input
                      type="checkbox"
                      id="is-active"
                      className="accent-[#1e74bb] w-4 h-4"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      />
                      <Label htmlFor="is-active">Is Active</Label>
                    </div>
                    {/* {nameError.show && form.isActive === false && (
                      <p className="text-red-500 text-sm">{nameError.message || "User must be active"}</p>
                    )} */}
                    <div className="flex items-center space-x-2">
                      <input
                      type="checkbox"
                      id="email-verified"
                      className="accent-[#1e74bb] w-4 h-4"
                      checked={form.email_verified}
                      onChange={(e) => setForm({ ...form, email_verified: e.target.checked })}
                      />
                      <Label htmlFor="email-verified">Email Verified</Label>
                    </div>
                    {/* {nameError.show && !form.emailVerified && (
                      <p className="text-red-500 text-sm">{nameError.message || "Email must be verified"}</p>
                    )} */}
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue="active">
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#1e74bb] hover:bg-[#1a65a3]"
                  onClick={handleSubmit}>
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="bg-white p-3 rounded-lg shadow-sm border border-gray-200" aria-label="Breadcrumb">
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all users on your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-4 px-6 pb-2">
            <Label htmlFor="organization-filter" className="mr-2">
              Organization
            </Label>
            <Select
              value={selectedOrganization}
              // onValueChange={(value) => setForm({ ...form, organization_id: value })}
              onValueChange={(value) => {bindUsersToOrganization(value)}}>
              <SelectTrigger id="organization-filter" className="w-[180px] bg-white">
              <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
              {/* Render organizations dynamically, first value is default */}
              {/* <SelectItem value="Select organization">Select organization</SelectItem> */}
              {(Array.isArray(organizations) ? organizations : []).map((org) => (
                <SelectItem key={org.organization_id} value={org.organization_name}>
                {org.organization_name}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[130px] bg-white">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] bg-white">
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

            <div className="rounded-md border bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => sortData("name")}>
                      <div className="flex items-center cursor-pointer">
                        User
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => sortData("role")}>
                      <div className="flex items-center cursor-pointer">
                        Role
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => sortData("status")}>
                      <div className="flex items-center cursor-pointer">
                        Status
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => sortData("lastActive")}>
                      <div className="flex items-center cursor-pointer">
                        Last Active
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                          ? "No users match your search criteria"
                          : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.organization_id} className="group hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-[#1e74bb] text-white">
                                {user.first_name?.split(" ").map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.first_name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${user.role === "Admin" ? "border-purple-200 bg-purple-50 text-purple-700" : ""}
                              ${user.role === "Teacher" ? "border-blue-200 bg-blue-50 text-blue-700" : ""}
                              ${user.role === "Student" ? "border-green-200 bg-green-50 text-green-700" : ""}
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
                        <TableCell>{user.is_active}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <Link href={`/admin/users/${user.organization_id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity mr-2"
                              >
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
                                <DropdownMenuItem>Edit user</DropdownMenuItem>
                                <DropdownMenuItem>Reset password</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={async () => {
                                  if (
                                    window.confirm(
                                    `Are you sure you want to delete user "${user.user_id}"?`
                                    )
                                  ) {
                                    try {
                                    const response = await api.delete(`/users/${user.user_id}`);
                                    if (response.status === 200 || response.status === 204) {
                                      toast.success("User deleted successfully");
                                      // Refresh users list
                                      bindUsersToOrganization(selectedOrganization);
                                    } else {
                                      toast.error("Failed to delete user");
                                    }
                                    } catch (error) {
                                    toast.error("Error deleting user");
                                    }
                                  }
                                  }}>
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
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
                <span className="font-medium">{users.length}</span> users
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
