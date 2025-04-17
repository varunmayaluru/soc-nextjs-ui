import Link from "next/link"
import { BookOpen, Users, MessageSquare, Settings, HelpCircle, LogOut, Home, BarChart } from "lucide-react"

export default function Sidebar() {
  return (
    <aside className="w-16 border-r border-gray-200 flex flex-col items-center py-6 bg-white shadow-sm">
      <div className="flex-1 flex flex-col items-center gap-6">
        <Link
          href="/"
          className="p-3 rounded-md text-gray-500 hover:bg-blue-50 hover:text-[#1e74bb] transition-colors relative group"
        >
          <Home className="h-6 w-6" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Dashboard
          </span>
        </Link>

        <Link
          href="/subjects"
          className="p-3 rounded-md text-gray-500 hover:bg-blue-50 hover:text-[#1e74bb] transition-colors relative group"
        >
          <BookOpen className="h-6 w-6" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Subjects
          </span>
        </Link>

        <Link
          href="/chat"
          className="p-3 rounded-md text-gray-500 hover:bg-blue-50 hover:text-[#1e74bb] transition-colors relative group"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat
          </span>
        </Link>

        <Link
          href="/users"
          className="p-3 rounded-md text-gray-500 hover:bg-blue-50 hover:text-[#1e74bb] transition-colors relative group"
        >
          <Users className="h-6 w-6" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Users
          </span>
        </Link>

        <Link
          href="/analytics"
          className="p-3 rounded-md text-gray-500 hover:bg-blue-50 hover:text-[#1e74bb] transition-colors relative group"
        >
          <BarChart className="h-6 w-6" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Analytics
          </span>
        </Link>

        <Link
          href="/settings"
          className="p-3 rounded-md text-gray-500 hover:bg-blue-50 hover:text-[#1e74bb] transition-colors relative group"
        >
          <Settings className="h-6 w-6" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Settings
          </span>
        </Link>
      </div>

      <div className="flex flex-col items-center gap-6">
        <Link
          href="/help"
          className="p-3 rounded-md text-gray-500 hover:bg-blue-50 hover:text-[#1e74bb] transition-colors relative group"
        >
          <HelpCircle className="h-6 w-6" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Help
          </span>
        </Link>

        <Link
          href="/login"
          className="p-3 rounded-md text-red-500 hover:bg-red-50 transition-colors relative group"
          title="Logout"
        >
          <LogOut className="h-6 w-6" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Logout
          </span>
        </Link>
      </div>
    </aside>
  )
}
