import Link from "next/link"
import { Search, Bell, MessageSquare } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b border-gray-200 py-3 px-6 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#1e74bb] flex items-center justify-center mr-2">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="text-[#1e74bb] text-xl font-medium">ProbEd</span>
        </Link>

        <div className="relative ml-8 hidden sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search here"
            className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="flex items-center">
        <button className="p-2 text-gray-500 hover:text-[#1e74bb] rounded-full">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-[#1e74bb] rounded-full ml-2">
          <MessageSquare className="h-5 w-5" />
        </button>

        <div className="flex items-center ml-4">
          <div className="flex flex-col items-end mr-3 hidden sm:block">
            <span className="font-medium block text-gray-800">Eleanor Pena</span>
            <span className="text-sm text-gray-500 block">Welcome to "Your name"</span>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
            <img src="/placeholder.svg?key=ag92w" alt="Eleanor Pena" className="w-full h-full object-cover" />
          </div>
          <div className="ml-4">
            <img src="/placeholder.svg?key=zt551" alt="Delhi Public School" className="h-10" />
          </div>
        </div>
      </div>
    </header>
  )
}
