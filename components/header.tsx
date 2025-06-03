"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell, MessageSquare, LogOut, Search, HelpCircle, User } from "lucide-react"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function Header() {
  const { userInfo, logout } = useAuth()
  const { toast } = useToast()

  // Get the user's name, fallback to "User" if not available
  const userName = userInfo?.first_name + " " + userInfo?.last_name || "User"
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/probed-logo.png" alt="ProbEd" width={30} height={30} />
            <span className="text-xl font-semibold">
              <span className="text-[#1e74bb]">Prob</span>
              <span className="text-black">Ed</span>
            </span>
          </Link>
          <div className="relative ml-4 hidden md:block">
            <input
              type="search"
              placeholder="Search here"
              className="w-[400px] rounded-md border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1e74bb] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* School Logo */}
          <div className="h-10 w-15">
            <Image
              src="/delhi-public-school.png"
              alt="Delhi Public School"
              width={80}
              height={49}
              className="object-contain"
            />
          </div>

          {/* Notification and Message Icons */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#1e74bb] text-white font-medium">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden flex-col text-left md:flex">
                  <span className="text-sm font-medium text-gray-900">{userName}</span>
                  <span className="text-xs text-gray-500">Welcome to ProbEd</span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userInfo?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>

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
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
