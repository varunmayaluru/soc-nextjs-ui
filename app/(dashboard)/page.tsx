"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Subject, SubjectProgress, User } from "../types/types"


// Visual configuration for subjects
const SUBJECT_CONFIG = {
  Mathematics: {
    icon: "📊",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    progressColor: "bg-purple-500",
    category: "Mathematics"
  },
  Science: {
    icon: "🧬",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    progressColor: "bg-blue-500",
    category: "Science"
  },
  English: {
    icon: "ENG",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    progressColor: "bg-blue-500",
    category: "Languages"
  },
  "Social Studies": {
    icon: "🌎",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    progressColor: "bg-yellow-500",
    category: "Humanities"
  },
  "Computer Science": {
    icon: "💻",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    progressColor: "bg-green-500",
    category: "Technology"
  },
  Hindi: {
    icon: "⭐",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    progressColor: "bg-red-500",
    category: "Languages"
  }
} as const

// Helper functions
const getSubjectConfig = (name: string) => {
  return SUBJECT_CONFIG[name as keyof typeof SUBJECT_CONFIG] || {
    icon: "📚",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    progressColor: "bg-gray-500",
    category: "Subject"
  }
}

const formatSubject = (subject: Subject): SubjectProgress => {
  const config = getSubjectConfig(subject.subject_name)

  return {
    id: subject.id,
    name: subject.subject_name,
    category: config.category,
    slug: subject.slug,
    icon: config.icon,
    iconBg: config.iconBg,
    iconColor: config.iconColor,
    progress: 0,
    progressColor: config.progressColor,
    completedLessons: 0,
    totalLessons: 0,
  }
}

export default function Dashboard() {
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!api) {
          throw new Error("API client not available")
        }

        // Fetch user info
        const userResponse = await api.get<User>("users/me")
        if (!userResponse.ok) {
          throw new Error(`API error: ${userResponse.status}`)
        }

        const user = userResponse.data
        console.log("User data:", user)

        // Store user data in localStorage
        localStorage.setItem("organizationId", user.organization_id.toString())
        localStorage.setItem("userId", user.user_id.toString())

        // Fetch subjects
        const subjectsResponse = await api.get<Subject[]>(
          `subjects/subjects?&organization_id=${user.organization_id}`,
        )
        if (!subjectsResponse.ok) {
          throw new Error(`API error: ${subjectsResponse.status}`)
        }

        const formattedSubjects = subjectsResponse.data.map(formatSubject)
        setSubjectProgress(formattedSubjects)
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

  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center mb-4">
            <Skeleton className="bg-gray-200 w-10 h-10 rounded-md mr-4" />
            <Skeleton className="bg-gray-200 h-6 w-40" />
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <Skeleton className="bg-gray-200 h-4 w-16" />
              <Skeleton className="bg-gray-200 h-4 w-12" />
            </div>
            <Skeleton className="bg-gray-200 h-2.5 w-full rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="bg-gray-200 h-6 w-24 rounded-full" />
            <Skeleton className="bg-gray-200 h-10 w-32 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )

  const renderOverviewCards = () => (
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
            <span className="text-green-500">{subjectProgress.length} Subjects</span>
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
          <h3 className="text-gray-600 group-hover:text-[#1e74bb] transition-colors duration-300">Tasks Complete</h3>
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
  )

  const renderSubjectCard = (subject: SubjectProgress) => (
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
        href={`/topics?subjectId=${subject.id}&subjectSlug=${subject.slug}&subjectName=${subject.name}`}
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
  )

  return (
    <div className="p-0">
      {/* Learning Overview Banner */}
      <div className="bg-[#1e74bb] text-white p-4 rounded-none">
        <h2 className="text-xl font-medium">Learning Overview</h2>
      </div>

      {/* Learning Overview Title */}
      <div className="px-6 pt-6">
        {renderOverviewCards()}

        {/* My Subjects Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">My Subjects</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Loading state */}
        {isLoading && renderLoadingSkeletons()}

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
            {subjectProgress.map(renderSubjectCard)}
          </div>
        )}
      </div>
    </div>
  )
}
