"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api-client";

interface Option {
  id: number;
  option_text: string;
  is_correct: boolean;
  option_index: number;
  organization_id: number;
}

interface Question {
  question_number: number
  quiz_id: number
  quiz_question_text: string
  difficulty_level: string
  is_active: boolean
  is_maths: boolean
  question_type: "mcq" | "fib" | "tf" | "match" | "sa"
  correct_answer?: string // For fill in the blank questions
  created_by: number
  create_date_time: string
  update_date_time: string | null
  options: Option[] 
  short_answer_text?: string // For short answer questions
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedQuestionId, setLastFetchedQuestionId] = useState<
    number | null
  >(null);

  // Safely access localStorage on client side only
  const organizationId =
    typeof window !== "undefined"
      ? localStorage.getItem("organizationId")
      : null;

  const fetchQuestion = useCallback(
    async (targetQuestionId: number) => {
      if (!targetQuestionId || !organizationId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const endpoint = `/questions/questions/quiz-question/${targetQuestionId}?quiz_id=${quizId}&organization_id=${organizationId}`;
        console.log("Fetching question:", endpoint);

        const response = await api.get<Question>(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        if (!response.data) {
          throw new Error("No data received");
        }

        console.log("Question fetched successfully:", response.data);
        //response.data.question_type =  "multiple_choice";
        setQuestion(response.data);
        
        setLastFetchedQuestionId(targetQuestionId);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load question"
        );
        setQuestion(null);
        setLastFetchedQuestionId(null);
      } finally {
        setLoading(false);
      }
    },
    [quizId, organizationId]
  );

  useEffect(() => {
    if (currentQuestionId && currentQuestionId !== lastFetchedQuestionId) {
      console.log("Fetching question for ID:", currentQuestionId);
      fetchQuestion(currentQuestionId);
    }
  }, [currentQuestionId, fetchQuestion, lastFetchedQuestionId]);

  return {
    question,
    loading,
    error,
    fetchQuestion,
  };
}
