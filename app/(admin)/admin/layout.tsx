import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Building, BookOpen, LayoutDashboard, Settings, Users } from "lucide-react"
import { AuthProvider } from "@/components/auth-provider"
import ProtectedRoute from "@/components/protected-route"
import Header from "@/components/header"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing the learning platform.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
            <div className="p-6">
              <Link href="/admin" className="flex items-center gap-2 mb-6">
                <span className="text-xl font-semibold">
                  <span className="text-[#1e74bb]">Admin</span>
                  <span className="text-black">Panel</span>
                </span>
              </Link>

              <nav className="space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <LayoutDashboard className="w-5 h-5 text-gray-500" />
                  Dashboard
                </Link>

                <Link
                  href="/admin/organization"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Building className="w-5 h-5 text-gray-500" />
                  Organization
                </Link>

                <Link
                  href="/admin/subjects"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  Subjects & Topics
                </Link>

                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Users className="w-5 h-5 text-gray-500" />
                  Users
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  Settings
                </Link>
              </nav>
            </div>
          </aside>

          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  )
}
