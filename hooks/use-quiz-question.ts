"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api-client"

interface Option {
  quiz_question_option_id: number
  option_text: string
  is_correct: boolean
}

interface Question {
  question_id: number
  quiz_id: number
  quiz_question_text: string
  difficulty_level: string
  is_active: boolean
  is_maths: boolean
  created_by: number
  create_date_time: string
  update_date_time: string | null
  options: Option[]
}

interface UseQuizQuestionProps {
  quizId: string
  questionId?: string
  subjectId?: string
  topicId?: string
  currentQuestionId: number | null
}

export function useQuizQuestion({ quizId, questionId, subjectId, topicId, currentQuestionId }: UseQuizQuestionProps) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestion = async () => {
    setLoading(true)
    setError(null)

    try {
      const id = questionId || currentQuestionId?.toString() || "1"
      const endpoint = `/questions/questions/quiz-question/${id}?quiz_id=${quizId}&subject_id=${subjectId || 1}&topic_id=${topicId || 1}`

      const response = await api.get<Question>(endpoint)

      if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.status}`)
      }

      setQuestion(response.data)
    } catch (err) {
      console.error("Error fetching question:", err)
      setError("Failed to load question. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestion()
  }, [quizId, questionId, currentQuestionId, subjectId, topicId])

  return {
    question,
    loading,
    error,
    fetchQuestion,
  }
}
