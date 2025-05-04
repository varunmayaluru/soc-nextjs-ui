"use client"

import { LogOut } from "lucide-react"
import { useAuth } from "./auth-provider"

export default function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button
      onClick={logout}
      className="p-3 rounded-md text-gray-500 hover:bg-blue-50 hover:text-[#1e74bb] transition-colors relative group"
    >
      <LogOut className="h-6 w-6" />
      <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Logout
      </span>
    </button>
  )
}
