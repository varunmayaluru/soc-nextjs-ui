"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api-client";

interface Option {
  quiz_question_option_id: number;
  option_text: string;
  is_correct: boolean;
}

interface Question {
  question_id: number;
  quiz_id: number;
  quiz_question_text: string;
  difficulty_level: string;
  is_active: boolean;
  is_maths: boolean;
  created_by: number;
  create_date_time: string;
  update_date_time: string | null;
  options: Option[];
}

interface UseQuizQuestionProps {
  quizId: string;
  questionId?: string;
  subjectId?: string;
  topicId?: string;
  currentQuestionId: number | null;
}

export function useQuizQuestion({
  quizId,
  questionId,
  subjectId,
  topicId,
  currentQuestionId,
}: UseQuizQuestionProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = useCallback(
    async (questionIdToFetch?: number) => {
      const targetQuestionId = questionIdToFetch || currentQuestionId;

      if (!targetQuestionId) {
        setError("No question ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching question with ID:", targetQuestionId);
        const endpoint = `/questions/questions/quiz-question/${targetQuestionId}?quiz_id=${quizId}&subject_id=${
          subjectId || 1
        }&topic_id=${topicId || 1}`;

        const response = await api.get<Question>(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch question: ${response.status}`);
        }

        if (!response.data) {
          throw new Error("No question data received");
        }

        setQuestion(response.data);
        console.log("Question fetched successfully:", response.data);
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load question. Please try again."
        );
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    },
    [quizId, subjectId, topicId, currentQuestionId]
  );

  useEffect(() => {
    if (currentQuestionId) {
      fetchQuestion(currentQuestionId);
    }
  }, [currentQuestionId, fetchQuestion]);

  return {
    question,
    loading,
    error,
    fetchQuestion,
  };
}
