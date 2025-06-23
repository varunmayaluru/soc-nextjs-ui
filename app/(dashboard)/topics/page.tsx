"use client"

import { api } from "@/lib/api-client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useParams, useSearchParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { number } from "framer-motion"

// Updated interface to match the API response
interface TopicProgress {
  id: number
  subject_id: number
  slug: string
  organization_id: number
  user_id: number
  total_quizzes: number
  completed_quizzes: number
  progress_percentage: number
  topic_name: string
}

interface Subject {

  organization_id: number
  subject_id: number
  subject_name: string
  is_active: boolean
  created_by: number
  create_date_time: number
  update_date_time: number

}

export default function SubjectPage() {
  const [progressData, setProgressData] = useState<TopicProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams() // query params
  const subjectId = searchParams.get("subjectId")
  const subjectSlug = searchParams.get("subjectSlug")
  const subjectName = searchParams.get("subjectName")
  console.log("subjectSlug", subjectSlug)
  let subject = null as unknown as Subject;

  const userId = localStorage.getItem("userId")
  const organizationId = localStorage.getItem("organizationId")



  // Fetch progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get user ID from localStorage or use a default


        const response = await api.get<TopicProgress[]>(
          `topics/topics/by-subject/${subjectId}?organization_id=${organizationId}`,
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        if (response.data) {
          setProgressData(response.data)
        } else {
          throw new Error("No data received from API")
        }
      } catch (error) {
        console.error("Error fetching progress data:", error)
        setError(error instanceof Error ? error.message : "Failed to load topics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgressData()
  }, [subjectId])

  // Helper function to get icon and color based on topic name
  const getTopicVisuals = (topicName: string, id: number) => {
    const name = topicName.toLowerCase()
    let icon = "📚"
    let color = "purple"

    if (name.includes("arithmetic") || name.includes("number")) {
      icon = "📊"
      color = "green"
    } else if (name.includes("algebra")) {
      icon = "📈"
      color = "blue"
    } else if (name.includes("geometry")) {
      icon = "📏"
      color = "orange"
    } else if (name.includes("trigonometry")) {
      icon = "📐"
      color = "purple"
    } else if (name.includes("statistic") || name.includes("probability")) {
      icon = "📊"
      color = "indigo"
    } else if (name.includes("measurement")) {
      icon = "📏"
      color = "yellow"
    }

    // Create a path using the id
    return { icon, color }
  }

  // Map color names to Tailwind classes
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      green: { bg: "bg-green-100", text: "text-green-600" },
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
      yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
    }

    return colorMap[color] || { bg: "bg-gray-100", text: "text-gray-600" }
  }

  return (
    <div>
      {/* Blue header banner */}
      <div className="bg-[#1e74bb] text-white p-8">
        <h1 className="text-2xl font-medium mb-2">Welcome to {subjectName}</h1>
        <p>Select a topic below to explore concepts, examples, and practice quizzes.</p>
      </div>

      {/* Breadcrumb navigation */}
      <div className="bg-[#1e74bb] pb-2 px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-md font-semibold">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-md font-semibold">{subjectName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Topics section */}
      <div className="p-6">
        <h2 className="text-xl font-medium mb-6">Topics</h2>

        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <button onClick={() => window.location.reload()} className="ml-2 underline hover:no-underline">
                Try again
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Topics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(6)
              .fill(0)
              .map((_, index) => (
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
              ))
          ) : progressData.length === 0 ? (
            <div className="col-span-3 bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
              <p className="text-lg font-medium mb-2">No topics found</p>
              <p className="text-sm">There are no topics available for this subject yet.</p>
            </div>
          ) : (
            progressData.map((topic) => {
              const { icon, color } = getTopicVisuals(topic.topic_name, topic.id)
              const { bg, text } = getColorClasses(color)

              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group"
                >
                  <div className="flex items-center mb-4 relative">
                    <div
                      className={`w-10 h-10 rounded-md ${bg} flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className={`${text} text-lg`}>{icon}</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold text-lg group-hover:text-[#1e74bb] transition-colors duration-300">
                      {topic.topic_name}
                    </h3>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-[#1e74bb] font-medium">{topic.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#1e74bb] h-2.5 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${topic.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between relative">
                    <p className="text-[#1e74bb] font-medium flex items-center">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs mr-2">
                        {topic.completed_quizzes}/{topic.total_quizzes} Quizzes
                      </span>
                    </p>
                    <Link
                      href={`/quizzes?topicId=${topic.id}&subjectId=${topic.subject_id}&topicSlug=${topic.slug}&subjectSlug=${subjectSlug}&subjectName=${subjectName}&topicName=${topic.topic_name}`}
                      className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm flex items-center group-hover:bg-[#1a67a7] transition-all duration-300"
                    >
                      Select a Quiz
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
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
