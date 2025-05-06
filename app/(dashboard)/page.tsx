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
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center mb-4 relative">
              <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-green-600">📚</span>
              </div>
              <h3 className="text-gray-600 group-hover:text-[#1e74bb] transition-colors duration-300">Courses</h3>
            </div>

            <div className="flex items-center justify-between relative">
              <p className="font-medium">
                <span className="text-green-500">6 Subjects</span>
              </p>
              <Link href="#" className="text-gray-400 hover:text-gray-600 flex items-center group">
                <span className="text-sm">View Details</span>
                <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Tasks Complete Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center mb-4 relative">
              <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600">✓</span>
              </div>
              <h3 className="text-gray-600 group-hover:text-[#1e74bb] transition-colors duration-300">
                Tasks Complete
              </h3>
            </div>

            <div className="flex items-center justify-between relative">
              <p className="font-medium">
                <span className="text-[#5bceff]">8 Tasks</span> <span className="text-gray-400 text-sm">/12 Tasks</span>
              </p>
              <Link href="#" className="text-gray-400 hover:text-gray-600 flex items-center group">
                <span className="text-sm">View Details</span>
                <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Spend Hours Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center mb-4 relative">
              <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center mr-3 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-orange-600">⏱️</span>
              </div>
              <h3 className="text-gray-600 group-hover:text-[#1e74bb] transition-colors duration-300">Spend Hours</h3>
            </div>

            <div className="flex items-center justify-between relative">
              <p className="font-medium">
                <span className="text-[#fa8b24]">8 Hours</span> <span className="text-gray-400 text-sm">In a week</span>
              </p>
              <Link href="#" className="text-gray-400 hover:text-gray-600 flex items-center group">
                <span className="text-sm">View Details</span>
                <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
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
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="text-lg font-medium group-hover:text-[#1e74bb] transition-colors duration-300">
                Mathematics
              </h3>
              <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-amber-600 font-bold">📊</span>
              </div>
            </div>

            <div className="mb-4 relative">
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
              className="inline w-40 bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors flex items-center"
            >
              Select a topic
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Science */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="text-lg font-medium group-hover:text-[#1e74bb] transition-colors duration-300">Science</h3>
              <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600 font-bold">🧬</span>
              </div>
            </div>

            <div className="mb-4 relative">
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
              className="inline w-40 bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors flex items-center"
            >
              Select a topic
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* English */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="text-lg font-medium group-hover:text-[#1e74bb] transition-colors duration-300">English</h3>
              <div className="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-red-600 font-bold">ENG</span>
              </div>
            </div>

            <div className="mb-4 relative">
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
              className="inline w-40  bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors flex items-center"
            >
              Select a topic
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Social Studies */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="text-lg font-medium group-hover:text-[#1e74bb] transition-colors duration-300">
                Social Studies
              </h3>
              <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-green-600 font-bold">🌎</span>
              </div>
            </div>

            <div className="mb-4 relative">
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
              className="inline w-40  bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors flex items-center"
            >
              Select a topic
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Computer Science */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="text-lg font-medium group-hover:text-[#1e74bb] transition-colors duration-300">
                Computer Science
              </h3>
              <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-purple-600 font-bold">💻</span>
              </div>
            </div>

            <div className="mb-4 relative">
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
              className="inline w-40  bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors flex items-center"
            >
              Select a topic
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Hindi */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="text-lg font-medium group-hover:text-[#1e74bb] transition-colors duration-300">Hindi</h3>
              <div className="w-8 h-8 rounded-md bg-yellow-100 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-yellow-600 font-bold">⭐</span>
              </div>
            </div>

            <div className="mb-4 relative">
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
              className="inline w-40 bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors flex items-center"
            >
              Select a topic
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
