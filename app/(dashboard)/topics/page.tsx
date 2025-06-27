"use client"

import { api } from "@/lib/api-client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Topic, TopicProgress } from "@/app/types/types"




// Frontend topic type


// Visual configuration for topics
const TOPIC_CONFIG = {
  arithmetic: { icon: "📊", color: "green" },
  number: { icon: "📊", color: "green" },
  algebra: { icon: "📈", color: "blue" },
  geometry: { icon: "📏", color: "orange" },
  trigonometry: { icon: "📐", color: "purple" },
  statistic: { icon: "📊", color: "indigo" },
  probability: { icon: "📊", color: "indigo" },
  measurement: { icon: "📏", color: "yellow" },
} as const

// Color mapping for Tailwind classes
const COLOR_CLASSES = {
  green: { bg: "bg-green-100", text: "text-green-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
} as const

// Helper functions
const getTopicVisuals = (topicName: string) => {
  const name = topicName.toLowerCase()

  for (const [key, config] of Object.entries(TOPIC_CONFIG)) {
    if (name.includes(key)) {
      return config
    }
  }

  return { icon: "📚", color: "purple" }
}

const getColorClasses = (color: keyof typeof COLOR_CLASSES) => {
  return COLOR_CLASSES[color] || COLOR_CLASSES.purple
}

const formatTopic = (topic: Topic): TopicProgress => {
  const { icon, color } = getTopicVisuals(topic.topic_name)

  return {
    id: topic.id,
    name: topic.topic_name,
    category: "",
    slug: topic.slug,
    icon,
    iconBg: "",
    iconColor: "",
    progress: 0,
    progressColor: "",
    completedLessons: 0,
    totalLessons: 0,
  }
}

export default function TopicsPage() {
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const subjectId = searchParams.get("subjectId")
  const subjectSlug = searchParams.get("subjectSlug")
  const subjectName = searchParams.get("subjectName")

  const userId = localStorage.getItem("userId")
  const organizationId = localStorage.getItem("organizationId")

  useEffect(() => {
  const fetchTopics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!subjectId || !organizationId || !userId) {
        throw new Error("Missing required parameters")
      }

      // Step 1: Get topics
      const response = await api.get<Topic[]>(
        `topics/topics/by-subject/${subjectId}?organization_id=${organizationId}`,
      )
      if (!response.ok || !response.data) {
        throw new Error(`Failed to fetch topics: ${response.status}`)
      }

      const baseTopics = response.data.map(formatTopic)

      // Step 2: Get topic-level progress
      const progressResponse = await api.get<
        {
          topic_id: string
          topic_name: string
          total_quizzes: number
          completed_quizzes: number
          completion_ratio: number
        }[]
      >(
        `topic-progress/subjects/topic-progress?user_id=${userId}&subject_id=${subjectId}`
      )

      if (!progressResponse.ok) {
        throw new Error(`Failed to fetch topic progress: ${progressResponse.status}`)
      }

      const progressMap = new Map(
        progressResponse.data.map((p) => [
          p.topic_id,
          {
            completed: p.completed_quizzes,
            total: p.total_quizzes,
            ratio: p.completion_ratio,
          },
        ])
      )

      // Step 3: Merge topic progress into base topic list
      const enrichedTopics = baseTopics.map((topic) => {
        const progress = progressMap.get(topic.id.toString()) // Ensure we use string keys for consistency
        if (progress) {
          return {
            ...topic,
            completedLessons: progress.completed,
            totalLessons: progress.total,
            progress: Math.round(progress.ratio * 100),
          }
        }
        return topic
      })

      setTopicProgress(enrichedTopics)
    } catch (error) {
      console.error("Error fetching topics:", error)
      setError(error instanceof Error ? error.message : "Failed to load topics")
    } finally {
      setIsLoading(false)
    }
  }

  fetchTopics()
}, [subjectId, organizationId])


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

  const renderTopicCard = (topic: TopicProgress) => {
    const { icon, color } = getTopicVisuals(topic.name)
    const { bg, text } = getColorClasses(color as keyof typeof COLOR_CLASSES)

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
            {topic.name}
          </h3>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="text-[#1e74bb] font-medium">{topic.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#1e74bb] h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${topic.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between relative">
          <p className="text-[#1e74bb] font-medium flex items-center">
            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs mr-2">
              {topic.completedLessons}/{topic.totalLessons} Quizzes
            </span>
          </p>
          <Link
            href={`/quizzes?topicId=${topic.id}&subjectId=${subjectId}&topicSlug=${topic.slug}&subjectSlug=${subjectSlug}&subjectName=${subjectName}&topicName=${topic.name}`}
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
  }

  const renderEmptyState = () => (
    <div className="col-span-3 bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
      <p className="text-lg font-medium mb-2">No topics found</p>
      <p className="text-sm">There are no topics available for this subject yet.</p>
    </div>
  )

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

        {isLoading ? (
          renderLoadingSkeletons()
        ) : topicProgress.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            renderEmptyState()
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topicProgress.map(renderTopicCard)}
          </div>
        )}

      </div>
    </div>
  )
}


