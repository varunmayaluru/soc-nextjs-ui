import Link from "next/link"
import { getTopics } from "@/lib/data"

export default function TopicsList({ subjectId }: { subjectId: string }) {
  const topics = getTopics(subjectId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <div key={topic.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-md ${topic.iconBg} flex items-center justify-center mr-3`}>
              <span className={`${topic.iconColor}`}>{topic.icon}</span>
            </div>
            <h3 className="text-gray-800 font-medium">{topic.title}</h3>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[#1e74bb] font-medium">
              10 Quizs
              {topic.completed && <span className="text-gray-400 text-sm"> /{topic.completed} Completed</span>}
              {topic.timeframe && <span className="text-gray-400 text-sm"> In a week</span>}
            </p>
            <Link href={`/subjects/${subjectId}/${topic.id}`} className="text-gray-400 hover:text-gray-600">
              <span className="text-sm">Select a Quiz</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline-block ml-1"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
