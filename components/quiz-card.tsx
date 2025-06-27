"use client"

import type React from "react"
import Link from "next/link"
import { FileText, Clock, ArrowRight, RefreshCw, Trophy, Eye } from "lucide-react"
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
  quizStatus?: "not_started" | "in_progress" | "completed"
  progressObj?: any
  onRetake?: () => void | Promise<void>
  onReview?: () => void | Promise<void>
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
  quizStatus = "not_started",
  progressObj,
  onRetake,
  onReview,
}: QuizCardProps) {
  const router = useRouter()

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
    e.preventDefault()
    if (!progressObj || !progressObj.answers) {
      router.push(href)
      return
    }
    // Find first skipped question
    const answeredNumbers = Object.keys(progressObj.answers).map(Number)
    let targetQuestion = null
    for (let i = 1; i <= progressObj.total_questions; i++) {
      if (!answeredNumbers.includes(i)) {
        targetQuestion = i
        break
      }
    }
    // If no skipped, go to current_question
    if (!targetQuestion) {
      targetQuestion = progressObj.current_question || 1
    }
    // Build new href with currentQuestion param
    const url = new URL(href, window.location.origin)
    url.searchParams.set("currentQuestion", String(targetQuestion))
    router.push(url.pathname + url.search)
  }

  // Review handler with handleContinue functionality
  const handleReview = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!progressObj || !progressObj.answers) {
      // If no progress data, start from beginning in review mode
      const url = new URL(href, window.location.origin)
      url.searchParams.set("mode", "review")
      url.searchParams.set("currentQuestion", "1")
      router.push(url.pathname + url.search)
      return
    }

    // Start review from first question with all answers available
    const url = new URL(href, window.location.origin)
    url.searchParams.set("mode", "review")
    url.searchParams.set("currentQuestion", "1")
    url.searchParams.set("attemptId", String(progressObj.id))
    router.push(url.pathname + url.search)
  }

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-md border border-gray-100 h-full flex flex-col hover:shadow-xl hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 min-h-[260px] group ${
        quizStatus === "completed" ? "bg-gradient-to-br from-green-50 to-white" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-200 via-blue-100 to-white w-12 h-12 rounded-full flex items-center justify-center shadow border border-blue-100">
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-extrabold line-clamp-1 group-hover:text-[#1e74bb] transition-colors duration-200">
              {title}
            </h3>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold shadow bg-white border border-gray-200 text-gray-800">
                {difficulty}
              </span>
              {progressObj && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold shadow bg-yellow-100 border border-yellow-300 text-yellow-800">
                  Attempt {progressObj.attempt_number}
                </span>
              )}
            </div>
          </div>
        </div>
        <div>
          <Trophy className="w-6 h-6 text-yellow-500 inline-block mr-1 align-middle" />
          <span className="text-gray-800 text-base font-bold align-middle">
            Score:{" "}
            {progressObj && typeof progressObj.score === "number" && typeof progressObj.total_questions === "number"
              ? `${progressObj.score}/${progressObj.total_questions} (${Math.round(
                  (progressObj.score / progressObj.total_questions) * 100,
                )}%)`
              : `0/${totalQuestions} (0%)`}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-3 px-3 py-2 bg-gray-50 rounded text-gray-600 text-sm font-medium border border-gray-100">
        {description}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600 text-xs font-semibold">Progress</span>
          <span className="text-gray-500 text-xs font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div
            className={`${progressColor} h-3 rounded-full shadow-lg transition-all duration-300`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-end text-xs text-gray-400 mt-1">
          <span>
            {completedQuestions}/{totalQuestions} Questions
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <div className="flex items-center gap-3 text-gray-600 text-sm">
          <span className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            {questions}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {Math.floor(time / 60)}m {time % 60}s
          </span>
        </div>
        <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor} shadow`}>
          {statusLabel}
        </div>
      </div>

      {/* Action Area */}
      <div className="border-t border-gray-100 mt-auto pt-4">
        {quizStatus === "in_progress" ? (
          <button
            onClick={handleContinue}
            className="w-full py-2 px-3 rounded-lg flex items-center justify-center transition-colors bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-base shadow"
          >
            Continue Quiz
            <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        ) : quizStatus === "completed" && (onRetake || onReview) ? (
          <div className="flex gap-2">
            {onRetake && (
              <button
                onClick={onRetake}
                className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center transition-colors bg-violet-500 hover:bg-violet-600 text-white font-semibold text-sm shadow"
              >
                Re-Take
                <RefreshCw className="ml-1 w-3 h-3 transform group-hover:rotate-90 transition-transform duration-200" />
              </button>
            )}
            {onReview && (
              <button
                onClick={handleReview}
                className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center transition-colors bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow"
              >
                Review
                <Eye className="ml-1 w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <Link
            href={href}
            className="w-full py-2 px-3 rounded-lg flex items-center justify-center transition-colors bg-[#1e74bb] hover:bg-[#1a67a7] text-white font-semibold text-base shadow"
          >
            Start Quiz
            <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        )}
      </div>
    </div>
  )
}
