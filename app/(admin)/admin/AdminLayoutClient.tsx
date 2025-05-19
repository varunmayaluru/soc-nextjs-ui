"use client"

import type React from "react"
import Link from "next/link"
import {
  Building,
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
  ChevronRight,
  Menu,
  X,
  BookAIcon,
  FileText,
} from "lucide-react"
import { AuthProvider } from "@/components/auth-provider"
import ProtectedRoute from "@/components/protected-route"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/organization", icon: Building, label: "Organization" },
    { href: "/admin/subjects", icon: BookOpen, label: "Subjects Hub" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/quizupload", icon: BookAIcon, label: "Quiz Upload" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50">
          {/* Mobile sidebar backdrop */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Admin Sidebar */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="flex flex-col h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/admin" className="flex items-center gap-2">
                    <span className="text-xl font-semibold">
                      <span className="text-brand">Admin</span>
                      <span className="text-black">Panel</span>
                    </span>
                  </Link>
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center justify-between px-3 py-2.5 text-gray-700 rounded-lg hover:bg-brand-light hover:text-brand transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-gray-500 group-hover:text-brand transition-colors" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}

                </nav>
              </div>

              <div className="mt-auto p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0">
            {/* <Header> */}
            <button className="p-2 rounded-md hover:bg-gray-100 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
            {/* </Header> */}
            <main className="flex-1 p-4 md:p-6 overflow-x-auto">{children}</main>
            <footer className="py-4 px-6 border-t border-gray-200 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Learning Platform Admin. All rights reserved.
            </footer>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  )
}
