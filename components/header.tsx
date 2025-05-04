"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "./auth-provider"

export default function Header() {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/probed-logo.svg" alt="ProbEd" width={40} height={40} />
            <span className="text-[#1e74bb] text-xl font-semibold">ProbEd</span>
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
          <button className="rounded-full p-2 hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="/abstract-geometric-shapes.png"
                  alt="Eleanor Pena"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="hidden flex-col md:flex">
                <span className="text-sm font-medium">Eleanor Pena</span>
                <span className="text-xs text-gray-500">Welcome to "Your name"</span>
              </div>
            </div>
            <div className="h-10 w-10">
              <Image
                src="/delhi-public-school.svg"
                alt="Delhi Public School"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
