import Link from "next/link"
import { Building, BookOpen, Users, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/organization">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#1e74bb]" />
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage organization details, branding, and settings</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/subjects">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#1e74bb]" />
                Subjects & Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage subjects, topics, and educational content</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#1e74bb]" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage users, roles, and permissions</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#1e74bb]" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Configure system settings and preferences</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
