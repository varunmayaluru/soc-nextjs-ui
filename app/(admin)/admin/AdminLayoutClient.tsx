"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Users,
  BookOpen,
  Settings,
  Menu,
  X,
  Building,
  Upload,
  LogOut,
  User,
  ChevronDown,
  Bell,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { logout, userInfo } = useAuth()

  // Get admin name or use fallback
  const adminName =
    userInfo?.first_name && userInfo?.last_name ? `${userInfo.first_name} ${userInfo.last_name}` : "Admin User"

  // Get admin email or use fallback
  const adminEmail = userInfo?.email || "admin@example.com"

  // Get initials for avatar
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const routes = [
    {
      href: "/admin",
      icon: BarChart3,
      label: "Dashboard",
      exact: true, // This route should match exactly
    },
    {
      href: "/admin/organization",
      icon: Building,
      label: "Organization",
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
    },
    {
      href: "/admin/subjects",
      icon: BookOpen,
      label: "Subjects Hub",
    },
    // {
    //   href: "/admin/quizupload",
    //   icon: Upload,
    //   label: "Quiz Upload",
    // },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
    },
  ]

  // Improved active state logic
  const isRouteActive = (route: (typeof routes)[0]) => {
    if (route.exact) {
      return pathname === route.href
    }

    // For non-exact routes, check if the pathname starts with the route href
    // but make sure it's not matching a parent route
    if (pathname.startsWith(route.href)) {
      // If the next character after the route.href is "/" or nothing, it's a match
      const nextChar = pathname.charAt(route.href.length)
      return nextChar === "/" || nextChar === ""
    }

    return false
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r shadow-sm">
          <div className="flex items-center justify-between px-6">
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold text-[#1e74bb]">Admin </span><span className="text-xl pl-1 text-muted-foreground font-bold"> Portal</span>
            </Link>
          </div>
          <div className="mt-8 flex-1 px-4">
            <nav className="space-y-2">
              {routes.map((route) => {
                const isActive = isRouteActive(route)
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all",
                      isActive
                        ? "bg-[#1e74bb] text-white shadow-md transform scale-[1.02]"
                        : "text-gray-700 hover:bg-blue-50 hover:text-[#1e74bb]",
                    )}
                  >
                    <route.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
                    {route.label}
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-gray-800/50 md:hidden transition-opacity",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform md:hidden shadow-lg",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-[#1e74bb]">Admin Portal</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="py-4 px-4">
          <nav className="space-y-2">
            {routes.map((route) => {
              const isActive = isRouteActive(route)
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all",
                    isActive
                      ? "bg-[#1e74bb] text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-[#1e74bb]",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <route.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
                  {route.label}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b md:py-4 md:px-6 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center ml-auto space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarFallback className="bg-[#1e74bb] text-white text-sm">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{adminName}</span>
                    <span className="text-xs text-gray-500">Administrator</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">


                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>



                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
