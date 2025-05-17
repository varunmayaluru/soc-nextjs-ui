"use client"
import { useState } from "react"
import { Search, Filter, MoreHorizontal, ArrowUpDown, UserPlus } from "lucide-react"
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

// Mock data for users
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    status: "Active",
    lastActive: "2 hours ago",
    avatar: "/stylized-jd-initials.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Teacher",
    status: "Active",
    lastActive: "1 day ago",
    avatar: "/javascript-code.png",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "Just now",
    avatar: "/abstract-rj.png",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Student",
    status: "Inactive",
    lastActive: "1 week ago",
    avatar: "/ed-initials-abstract.png",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "Student",
    status: "Active",
    lastActive: "3 days ago",
    avatar: "/intertwined-letters.png",
  },
  {
    id: "6",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    role: "Teacher",
    status: "Active",
    lastActive: "5 hours ago",
    avatar: "/stylized-letter-sb.png",
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: "asc" | "desc" }>({
    column: "name",
    direction: "asc",
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
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      const column = sortConfig.column as keyof (typeof users)[0]
      const direction = sortConfig.direction === "asc" ? 1 : -1

      if (a[column] < b[column]) return -1 * direction
      if (a[column] > b[column]) return 1 * direction
      return 0
    })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-500 mt-1">Manage your platform users</p>
        </div>

        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1e74bb] hover:bg-[#1a65a3]">
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
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="john.doe@example.com" type="email" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
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
              <Button className="bg-[#1e74bb] hover:bg-[#1a65a3]">Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all users on your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
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
                      <TableRow key={user.id} className="group hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-[#1e74bb] text-white">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
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
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <Link href={`/admin/users/${user.id}`}>
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
                                <DropdownMenuItem className="text-red-600">Delete user</DropdownMenuItem>
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
