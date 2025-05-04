import Link from "next/link"
import { FileText, Clock, Star } from "lucide-react"

type QuizCardProps = {
  title: string
  description: string
  questions: number
  minutes: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  href: string
}

export default function QuizCard({ title, description, questions, minutes, difficulty, href }: QuizCardProps) {
  // Determine the difficulty badge color
  const difficultyColor =
    difficulty === "Beginner"
      ? "bg-green-100 text-green-800"
      : difficulty === "Intermediate"
        ? "bg-blue-100 text-blue-800"
        : "bg-orange-100 text-orange-800"

  return (
    <div className="border rounded-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor}`}>{difficulty}</span>
      </div>

      <p className="text-gray-600 mb-6 flex-grow">{description}</p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-gray-600">
          <FileText className="w-5 h-5 mr-2" />
          <span>{questions} questions</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-5 h-5 mr-2" />
          <span>{minutes} minutes</span>
        </div>
      </div>

      <Link
        href={href}
        className="w-full bg-black text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        Start Quiz <Star className="ml-2 w-5 h-5" />
      </Link>
    </div>
  )
}
