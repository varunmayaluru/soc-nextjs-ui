"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell, MessageSquare } from "lucide-react"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Header() {
  const { userInfo } = useAuth()

  // Get the user's name, fallback to "User" if not available
  const userName = userInfo?.first_name || "User"

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
              className="w-[400px] rounded-md border border-gray-200 py-2 pl-10 pr-4 focus:outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-15">
            <Image
              src="/delhi-public-school.png"
              alt="Delhi Public School"
              width={80}
              height={49}
              className="object-contain"
            />
          </div>
          <div>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <MessageSquare className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[#1e74bb] text-white">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col md:flex">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-gray-500">Welcome to ProbEd</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
