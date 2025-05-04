import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-0">
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
                <span className="text-green-600">📚</span>
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
                <span className="text-blue-600">✓</span>
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
                <span className="text-orange-600">⏱️</span>
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
