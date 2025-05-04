import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-0">
      {/* Header */}
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

      {/* Learning Overview Banner */}
      <div className="bg-[#1e74bb] text-white p-4 rounded-none">
        <h2 className="text-xl font-medium">Learning Overview</h2>
      </div>

      {/* Learning Overview Title */}
      <div className="px-6 pt-6">
        <h2 className="text-xl font-medium mb-6">Learning Overview</h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Courses Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-gray-600">Courses</h3>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-medium">
                <span className="text-green-500">6</span> <span className="text-gray-800">Subjects</span>
              </p>
              <Link href="#" className="text-gray-400 hover:text-gray-600 flex items-center">
                <span className="text-sm">View Details</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Tasks Complete Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-gray-600">Tasks Complete</h3>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-medium">
                <span className="text-[#5bceff]">8</span> <span className="text-gray-800">Tasks</span>{" "}
                <span className="text-gray-400 text-sm">/12 Tasks</span>
              </p>
              <Link href="#" className="text-gray-400 hover:text-gray-600 flex items-center">
                <span className="text-sm">View Details</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Spend Hours Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-600">Spend Hours</h3>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-medium">
                <span className="text-[#fa8b24]">8</span> <span className="text-gray-800">Hours</span>{" "}
                <span className="text-gray-400 text-sm">In a week</span>
              </p>
              <Link href="#" className="text-gray-400 hover:text-gray-600 flex items-center">
                <span className="text-sm">View Details</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* My Subjects Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">My Subjects</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {/* Mathematics */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Mathematics</h3>
              <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600 font-bold">📊</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">20%</span>
                <span className="text-gray-400 text-sm">5/19 Lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>

            <Link
              href="/subjects/arthematic"
              className="inline-block bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors"
            >
              Select a topic
            </Link>
          </div>

          {/* Science */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Science</h3>
              <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">🧬</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">80%</span>
                <span className="text-gray-400 text-sm">5/19 Lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>

            <Link
              href="/subjects/science"
              className="inline-block bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors"
            >
              Select a topic
            </Link>
          </div>

          {/* English */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">English</h3>
              <div className="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">ENG</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">50%</span>
                <span className="text-gray-400 text-sm">5/10 Lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "50%" }}></div>
              </div>
            </div>

            <Link
              href="/subjects/english"
              className="inline-block bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors"
            >
              Select a topic
            </Link>
          </div>

          {/* Social Studies */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Social Studies</h3>
              <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">🌎</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">20%</span>
                <span className="text-gray-400 text-sm">5/19 Lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>

            <Link
              href="/subjects/social-studies"
              className="inline-block bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors"
            >
              Select a topic
            </Link>
          </div>

          {/* Computer Science */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Computer Science</h3>
              <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold">💻</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">80%</span>
                <span className="text-gray-400 text-sm">5/19 Lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>

            <Link
              href="/subjects/computer-science"
              className="inline-block bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors"
            >
              Select a topic
            </Link>
          </div>

          {/* Hindi */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Hindi</h3>
              <div className="w-8 h-8 rounded-md bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⭐</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">50%</span>
                <span className="text-gray-400 text-sm">5/10 Lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "50%" }}></div>
              </div>
            </div>

            <Link
              href="/subjects/hindi"
              className="inline-block bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors"
            >
              Select a topic
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
