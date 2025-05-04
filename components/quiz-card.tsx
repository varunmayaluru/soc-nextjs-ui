import type React from "react"
import Link from "next/link"
import { FileText, Clock, Star } from "lucide-react"

type QuizCardProps = {
  title: string
  description: string
  questions: number
  minutes: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  href: string
  icon?: React.ReactNode
  iconBg?: string
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
}: QuizCardProps) {
  // Determine the difficulty badge color
  const difficultyColor =
    difficulty === "Beginner"
      ? "bg-green-100 text-green-800"
      : difficulty === "Intermediate"
        ? "bg-blue-100 text-blue-800"
        : "bg-orange-100 text-orange-800"

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className={`${iconBg} w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <span className="text-sm">{icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold line-clamp-1">{title}</h3>
          </div>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${difficultyColor}`}>
            {difficulty}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-3 flex-grow text-sm line-clamp-2">{description}</p>

      <div className="space-y-1 mb-3 text-sm">
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
        Start Quiz <Star className="ml-2 w-4 h-4" />
      </Link>
    </div>
  )
}
