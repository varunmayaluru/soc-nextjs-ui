import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Layers, ChevronRight, Users } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1e74bb] to-[#4a9eda] text-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-white/20 text-white border-white/30">Admin Level</Badge>
              <Badge className="bg-[#0d4c7a] text-white border-[#0d4c7a]">User Management</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-blue-100">Manage your platform users and their permissions</p>
          </div>
          <Button className="bg-white text-[#1e74bb] hover:bg-blue-50 shadow-md" disabled>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="bg-white p-4 rounded-lg shadow-sm border border-gray-200" aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap">
          <li className="inline-flex items-center">
            <div className="inline-flex items-center text-sm font-medium text-gray-700">
              <Layers className="w-4 h-4 mr-2 text-[#1e74bb]" />
              Dashboard
            </div>
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
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 w-80" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-[140px]" />
                <Skeleton className="h-10 w-[140px]" />
                <Skeleton className="h-10 w-[120px]" />
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-lg border bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email Verified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(8)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}