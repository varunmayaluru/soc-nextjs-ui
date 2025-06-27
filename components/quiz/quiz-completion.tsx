"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, HelpCircle, SkipForward, RotateCcw, Trophy, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuizCompletionProps {
  score: number
  totalQuestions: number
  timeSpent: string
  subject: string
  quizTitle: string
  attemptNumber?: number
  submittedAt?: string
  answers?: { [key: string]: { selected: string; is_correct: boolean } }
  questions?: any[]
  onRetake?: () => void
  quizzesListUrl?: string
}

export default function QuizCompletion({
  score = 17,
  totalQuestions = 20,
  timeSpent = "12:34",
  subject = "Mathematics",
  quizTitle = "Algebra Fundamentals",
  attemptNumber,
  submittedAt,
  answers = {},
  questions = [],
  onRetake,
  quizzesListUrl = "/quizzes",
}: QuizCompletionProps) {
  const [animateScore, setAnimateScore] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const router = useRouter()

  // Calculate breakdown
  let correctAnswers = 0, incorrectAnswers = 0, noAnswers = 0, skippedAnswers = 0;
  if (questions.length > 0) {
    questions.forEach((q) => {
      const ans = answers[q.question_number];
      if (ans === undefined) {
        noAnswers++;
      } else if (q.question_type === "mcq") {
        const opt = q.options.find((o: any) => o.option_index === ans);
        if (opt && opt.is_correct) correctAnswers++;
        else incorrectAnswers++;
      } else if (q.question_type === "sa") {
        // For short answer, treat as correct if not empty (customize as needed)
        if (ans) correctAnswers++;
        else incorrectAnswers++;
      }
    });
    skippedAnswers = totalQuestions - (correctAnswers + incorrectAnswers + noAnswers);
  }

  const percentage = Math.round((score / totalQuestions) * 100)
  const grade = getGrade(percentage)

  useEffect(() => {
    setAnimateScore(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  function getGrade(percentage: number) {
    if (percentage >= 90) return { letter: "A+", color: "text-green-600", bg: "bg-green-100" }
    if (percentage >= 80) return { letter: "A", color: "text-green-600", bg: "bg-green-100" }
    if (percentage >= 70) return { letter: "B", color: "text-blue-600", bg: "bg-blue-100" }
    if (percentage >= 60) return { letter: "C", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { letter: "D", color: "text-red-600", bg: "bg-red-100" }
  }

  const handleSubmit = () => {
    router.push(quizzesListUrl)
  }

  const handleRetake = () => {
    if (onRetake) {
      onRetake()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header Celebration */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 animate-pulse">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎉 Quiz Completed! 🎉</h1>
          <p className="text-xl text-gray-600">You've finished the {quizTitle} quiz!</p>
          {attemptNumber && (
            <div className="mt-2 text-sm text-gray-500">Attempt: {attemptNumber}</div>
          )}
          {submittedAt && (
            <div className="text-xs text-gray-400">Submitted at: {new Date(submittedAt).toLocaleString()}</div>
          )}
        </div>

        {/* Score Display */}
        <Card className="mb-8 border-2 border-yellow-200 shadow-lg">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className={`text-6xl font-bold mb-2 text-green-600`}>
                  {score}/{totalQuestions}
                </div>
                <p className="text-gray-600">Questions Correct</p>
              </div>
              <div>
                <div className={`text-6xl font-bold mb-2 text-blue-600`}>{Math.round((score / totalQuestions) * 100)}%</div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                  Attempt: {attemptNumber || 1}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-700 mb-2">{timeSpent}</div>
                <p className="text-gray-600">Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Summary Stats */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Correct</div>
                  <div className="text-xl font-bold text-green-500">{correctAnswers}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Incorrect</div>
                  <div className="text-xl font-bold text-red-500">{incorrectAnswers}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">No Answer</div>
                  <div className="text-xl font-bold text-gray-500">{noAnswers}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <SkipForward className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Skipped</div>
                  <div className="text-xl font-bold text-yellow-500">{skippedAnswers}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Content Review */}
        {/* <Card className="mt-8">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-4">{quizTitle} Review</h2>

              <div className="flex justify-center mb-8">
                <button className="bg-[#1e74bb] text-white px-6 py-2 rounded-full text-sm">
                  QUIZ {score} TO {totalQuestions}
                </button>
              </div>

              <div className="space-y-4">
                <div className="border rounded-full p-3 flex items-center">
                  <div className="w-6 h-6 rounded-full border border-gray-300 mr-3"></div>
                  <span>Identify variables, constants, and coefficients</span>
                </div>

                <div className="border-2 border-[#1e74bb] rounded-full p-3 flex items-center bg-blue-50">
                  <div className="w-6 h-6 rounded-full border-2 border-[#1e74bb] flex items-center justify-center mr-3">
                    <div className="w-3 h-3 rounded-full bg-[#1e74bb]"></div>
                  </div>
                  <span>Simplify expressions like 3x + 5 - x + 2</span>
                </div>

                <div className="border rounded-full p-3 flex items-center">
                  <div className="w-6 h-6 rounded-full border border-gray-300 mr-3"></div>
                  <span>Solve equations like 2y + 5 = 11</span>
                </div>

                <div className="border rounded-full p-3 flex items-center">
                  <div className="w-6 h-6 rounded-full border border-gray-300 mr-3"></div>
                  <span>Translate word problems into simple algebraic</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Action Buttons */}
        {/* <div className="flex justify-center space-x-4 mt-8 mb-8">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-auto flex items-center" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outline" className="px-8 py-2 h-auto flex items-center" onClick={handleRetake}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div> */}
      </div>
    </div>
  )
}
