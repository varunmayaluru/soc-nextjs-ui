import type React from "react"
import Link from "next/link"
import { FileText, Clock, ArrowRight, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

type QuizCardProps = {
  title: string
  description: string
  questions: number
  time: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  href: string
  icon?: React.ReactNode
  iconBg?: string
  progress?: number
  progressColor?: string
  completedQuestions?: number
  totalQuestions?: number
  quizStatus?: 'not_started' | 'in_progress' | 'completed'
  progressObj?: any
  onRetake?: () => void | Promise<void>
}

export default function QuizCard({
  title,
  description,
  questions,
  time,
  difficulty,
  href,
  icon = "📚",
  iconBg = "bg-blue-100",
  progress = 0,
  progressColor = "bg-blue-500",
  completedQuestions = 0,
  totalQuestions = 0,
  quizStatus = 'not_started',
  progressObj,
  onRetake,
}: QuizCardProps) {
  const router = useRouter();

  // Determine the difficulty badge color
  const difficultyColor =
    difficulty === "Beginner"
      ? "bg-green-100 text-green-800"
      : difficulty === "Intermediate"
        ? "bg-blue-100 text-blue-800"
        : "bg-orange-100 text-orange-800"

  // Use the provided questions count if totalQuestions is not provided
  const total = totalQuestions || questions

  // Determine quiz status badge
  let statusLabel = "Not Started"
  let statusColor = "bg-gray-200 text-gray-700"
  if (quizStatus === "completed") {
    statusLabel = "Completed"
    statusColor = "bg-green-100 text-green-800"
  } else if (quizStatus === "in_progress") {
    statusLabel = "In Progress"
    statusColor = "bg-yellow-100 text-yellow-800"
  }

  // Navigation handler for Continue
  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!progressObj || !progressObj.answers) {
      router.push(href);
      return;
    }
    // Find first skipped question
    const answeredNumbers = Object.keys(progressObj.answers).map(Number);
    let targetQuestion = null;
    for (let i = 1; i <= progressObj.total_questions; i++) {
      if (!answeredNumbers.includes(i)) {
        targetQuestion = i;
        break;
      }
    }
    // If no skipped, go to current_question
    if (!targetQuestion) {
      targetQuestion = progressObj.current_question || 1;
    }
    // Build new href with currentQuestion param
    const url = new URL(href, window.location.origin);
    url.searchParams.set("currentQuestion", String(targetQuestion));
    router.push(url.pathname + url.search);
  };

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
      <div className="mb-2">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 text-sm">{progress}%</span>
          <span className="text-gray-400 text-xs">
            {completedQuestions}/{totalQuestions} Questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${progressColor} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      {/* Status badge */}
      <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-4 ${statusColor}`}>{statusLabel}</div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <FileText className="w-4 h-4 mr-2" />
          <span>{questions} questions</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{Math.floor(time / 60)}m {time % 60}s</span>
        </div>
      </div>

      {/* Action button */}
      {quizStatus === 'in_progress' ? (
        <button
          onClick={handleContinue}
          className={`w-full py-2 px-3 rounded-md flex items-center justify-center transition-colors bg-yellow-500 hover:bg-yellow-600 text-white`}
        >
          Continue Quiz
          <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      ) : quizStatus === 'completed' && onRetake ? (
        <button
          onClick={onRetake}
          className="w-full py-2 px-3 rounded-md flex items-center justify-center transition-colors bg-violet-500 hover:bg-violet-600 text-white"
        >
          Re-Take Quiz
          <RefreshCw className="ml-2 w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300" />
        </button>
      ) : (
        <Link
          href={href}
          className="w-full py-2 px-3 rounded-md flex items-center justify-center transition-colors bg-[#1e74bb] hover:bg-[#1a67a7] text-white"
        >
          Start Quiz
          <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      )}
    </div>
  )
}
