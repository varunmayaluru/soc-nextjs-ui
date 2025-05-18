"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { api } from "@/lib/api-client"

// Update the API response type to match the exact structure
type SubjectApiResponse = {
  subject_id: number
  organization_id: number
  user_id: number
  total_quizzes: number
  subject_name: string
  completed_quizzes: number
  progress_percentage: number

}

type User = {
  email: string
  first_name: string
  last_name: string
  organization_id: number
  role: string
  is_active: boolean
  user_id: number
}

// Update the Subject type definition
type Subject = {
  id: number
  name: string
  category: string
  icon: string
  iconBg: string
  iconColor: string
  progress: number
  progressColor: string
  completedLessons: number
  totalLessons: number
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)

        // Fetch user info
        const userResponse = await api.get<User>("users/me")
        if (!userResponse.ok) {
          throw new Error(`API error: ${userResponse.status}`)
        }

        const user = userResponse.data
        const userId = user.user_id.toString()
        localStorage.setItem("organizationId", user.organization_id.toString())
        localStorage.setItem("userId", userId)

        // Fetch subjects using userId
        const subjectsResponse = await api.get<SubjectApiResponse[]>(`user-subject-progress/subjects/progress/${userId}`)
        if (!subjectsResponse.ok) {
          throw new Error(`API error: ${subjectsResponse.status}`)
        }

        const formattedSubjects = subjectsResponse.data.map((subject: SubjectApiResponse) => ({
          id: subject.subject_id,
          name: subject.subject_name,
          category: getSubjectCategory(subject.subject_name),
          icon: getIconForSubject(subject.subject_name),
          iconBg: getIconBgForSubject(subject.subject_name),
          iconColor: getIconColorForSubject(subject.subject_name),
          progress: subject.progress_percentage,
          progressColor: getProgressColorForSubject(subject.subject_name),
          completedLessons: subject.completed_quizzes,
          totalLessons: subject.total_quizzes,
        }))

        setSubjects(formattedSubjects)
        setError(null)
      } catch (err) {
        console.error("Error in dashboard data fetch:", err)
        setError(err instanceof Error ? err.message : "Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Helper functions to assign consistent visual properties
  function getIconForSubject(name: string): string {
    const icons: Record<string, string> = {
      Mathematics: "📊",
      Science: "🧬",
      English: "ENG",
      "Social Studies": "🌎",
      "Computer Science": "💻",
      Hindi: "⭐",
    }
    return icons[name] || "📚"
  }

  function getIconBgForSubject(name: string): string {
    const backgrounds: Record<string, string> = {
      Mathematics: "bg-amber-100",
      Science: "bg-blue-100",
      English: "bg-red-100",
      "Social Studies": "bg-green-100",
      "Computer Science": "bg-purple-100",
      Hindi: "bg-yellow-100",
    }
    return backgrounds[name] || "bg-gray-100"
  }

  function getIconColorForSubject(name: string): string {
    const colors: Record<string, string> = {
      Mathematics: "text-amber-600",
      Science: "text-blue-600",
      English: "text-red-600",
      "Social Studies": "text-green-600",
      "Computer Science": "text-purple-600",
      Hindi: "text-yellow-600",
    }
    return colors[name] || "text-gray-600"
  }

  function getProgressColorForSubject(name: string): string {
    const colors: Record<string, string> = {
      Mathematics: "bg-purple-500",
      Science: "bg-blue-500",
      English: "bg-blue-500",
      "Social Studies": "bg-yellow-500",
      "Computer Science": "bg-green-500",
      Hindi: "bg-red-500",
    }
    return colors[name] || "bg-gray-500"
  }

  // Add a helper function to determine subject category
  function getSubjectCategory(name: string): string {
    const categories: Record<string, string> = {
      Mathematics: "Mathematics",
      Science: "Science",
      English: "Languages",
      "Social Studies": "Humanities",
      "Computer Science": "Technology",
      Hindi: "Languages",
    }
    return categories[name] || "Subject"
  }

  return (
    <div className="p-0">
      {/* Learning Overview Banner */}
      <div className="bg-[#1e74bb] text-white p-4 rounded-none">
        <h2 className="text-xl font-medium">Learning Overview</h2>
      </div>

      {/* Learning Overview Title */}
      <div className="px-6 pt-6">
        {/* <h2 className="text-xl font-medium mb-6">Learning Overview</h2> */}

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
                <span className="text-green-500">{subjects.length} Subjects</span>
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e74bb]"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>Error: {error}</p>
            <p className="text-sm mt-1">Please check your API connection or try refreshing the page.</p>
          </div>
        )}

        {/* Subjects Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group"
              >
                <div className="flex items-center justify-between mb-4 relative">
                  <h3 className="text-lg font-medium group-hover:text-[#1e74bb] transition-colors duration-300">
                    {subject.name}
                  </h3>
                  <div
                    className={`w-8 h-8 rounded-md ${subject.iconBg} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className={`${subject.iconColor} font-bold`}>{subject.icon}</span>
                  </div>
                </div>

                <div className="mb-4 relative">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{subject.progress}%</span>
                    <span className="text-gray-400 text-sm">
                      {subject.completedLessons}/{subject.totalLessons} Lessons
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${subject.progressColor} h-2 rounded-full`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Link
                  href={`/subjects/${subject.id}`}
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
