import type React from "react"
import Link from "next/link"
import { FileText, Clock, ArrowRight } from "lucide-react"

type QuizCardProps = {
  title: string
  description: string
  questions: number
  minutes: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  href: string
  icon?: React.ReactNode
  iconBg?: string
  progress?: number
  progressColor?: string
  completedQuestions?: number
  totalQuestions?: number
}

export default function QuizCard({
  title,
  description,
  questions,
  minutes,
  difficulty,
  href,
  icon = "📚",
  iconBg = "bg-blue-100",
  progress = 0,
  progressColor = "bg-blue-500",
  completedQuestions = 0,
  totalQuestions = 0,
}: QuizCardProps) {
  // Determine the difficulty badge color
  const difficultyColor =
    difficulty === "Beginner"
      ? "bg-green-100 text-green-800"
      : difficulty === "Intermediate"
        ? "bg-blue-100 text-blue-800"
        : "bg-orange-100 text-orange-800"

  // Use the provided questions count if totalQuestions is not provided
  const total = totalQuestions || questions

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 h-full flex flex-col hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] transition-all duration-300 min-h-[280px] relative group">
      <div className="flex items-start gap-3 mb-3 relative">
        <div
          className={`${iconBg} w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transform group-hover:scale-110 transition-transform duration-300`}
        >
          <span className="text-sm">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold line-clamp-1 pr-24 group-hover:text-[#1e74bb] transition-colors duration-300">
            {title}
          </h3>
        </div>
        <span className={`absolute top-0 right-0 px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor}`}>
          {difficulty}
        </span>
      </div>

      <p className="text-gray-600 mb-4 flex-grow text-sm line-clamp-2">{description}</p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 text-sm">{progress}%</span>
          <span className="text-gray-400 text-xs">
            {completedQuestions}/{total} Questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${progressColor} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <FileText className="w-4 h-4 mr-2" />
          <span>{questions} questions</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{minutes} minutes</span>
        </div>
      </div>

      <Link
        href={href}
        className="w-full bg-[#1e74bb] text-white py-2 px-3 rounded-md flex items-center justify-center hover:bg-[#1a67a7] transition-colors"
      >
        Start Quiz{" "}
        <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  )
}
