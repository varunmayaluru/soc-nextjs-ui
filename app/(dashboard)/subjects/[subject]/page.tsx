"use client"

import { api } from "@/lib/api-client"
import Link from "next/link"
import { useEffect, useState } from "react"

// Update the interface to match the new API response format
interface TopicProgress {
  topic_id: number
  subject_id: number
  organization_id: number
  user_id: number
  total_quizzes: number
  completed_quizzes: number
  progress_percentage: number
  topic_name: string
}

// Replace the existing component with this updated version
export default function SubjectPage({ params }: { params: { subject: string } }) {
  // Replace the useState line with this updated version
  const [progressData, setProgressData] = useState<TopicProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get subject name from the URL parameter
  const subjectName =
    params.subject === "arthematic"
      ? "Mathematics"
      : params.subject === "science"
        ? "Science"
        : params.subject === "english"
          ? "English"
          : params.subject === "social-studies"
            ? "Social Studies"
            : params.subject === "computer-science"
              ? "Computer Science"
              : params.subject === "hindhi"
                ? "Hindi"
                : params.subject

  // Fetch progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
       const response = await api.get<any>("user-topic-progress/topic-progress/1")
        const data = await response.data
        setProgressData(data)
      } catch (error) {
        console.error("Error fetching progress data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgressData()
  }, [])

  // Helper function to get icon and color based on topic name
  const getTopicVisuals = (topicName: string ,topic_id : number) => {
    const name = topicName.toLowerCase()

    if (name.includes("arithmetic") || name.includes("number")) {
      return { icon: "📊", color: "green", path: 'topic/'+topic_id }
    } else if (name.includes("algebra")) {
      return { icon: "📈", color: "blue", path:`topic/{topic_id}`}
    } else if (name.includes("geometry")) {
      return { icon: "📏", color: "orange", path: `topic/{topic_id}` }
    } else if (name.includes("trigonometry")) {
      return { icon: "📊", color: "green", path: "trigonometry" }
    } else if (name.includes("statistic") || name.includes("probability")) {
      return { icon: "📈", color: "blue", path: `topic/{topic_id}` }
    } else if (name.includes("measurement")) {
      return { icon: "📏", color: "orange", path: `topic/{topic_id}` }
    } else {
      return { icon: "📚", color: "purple", path: `topic/{topic_id}` }
    }
  }

  return (
    <div>
      {/* Blue header banner */}
      <div className="bg-[#1e74bb] text-white p-8">
        <h1 className="text-2xl font-medium mb-2">Welcome to {subjectName}</h1>
        <p>Select a topic below to explore concepts, examples, and practice quizzes.</p>
      </div>

      {/* Topics section */}
      <div className="p-6">
        <h2 className="text-xl font-medium mb-6">Topics</h2>

        {/* Topics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e74bb]"></div>
            </div>
          ) : progressData.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No topics found for this subject.</p>
            </div>
          ) : (
            progressData.map((topic) => {
              const { icon, color, path } = getTopicVisuals(topic.topic_name, topic.topic_id)
              return (
                <div
                  key={topic.topic_id}
                  className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group"
                >
                  <div className="flex items-center mb-4 relative">
                    <div
                      className={`w-10 h-10 rounded-md bg-${color}-100 flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className={`text-${color}-600 text-lg`}>{icon}</span>
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
                        className="bg-[#1e74bb] h-2.5 rounded-full"
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
                      href={`/subjects/${params.subject}/${path}`}
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
