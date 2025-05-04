"use client"

import type React from "react"

import { LogOut } from "lucide-react"
import { logout } from "@/lib/auth"
import Link from "next/link"

export default function LogoutButton() {
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    logout()
  }

  return (
    <Link
      href="#"
      onClick={handleLogout}
      className="p-3 rounded-md text-red-500 hover:bg-red-50 transition-colors relative group"
      title="Logout"
    >
      <LogOut className="h-6 w-6" />
      <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Logout
      </span>
    </Link>
  )
}
