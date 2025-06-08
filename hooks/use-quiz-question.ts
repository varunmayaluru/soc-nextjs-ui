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
  const [lastFetchedQuestionId, setLastFetchedQuestionId] = useState<
    number | null
  >(null);

  const organizationId = localStorage.getItem("organizationId");

  const fetchQuestion = useCallback(
    async (questionIdToFetch?: number) => {
      const targetQuestionId = questionIdToFetch || currentQuestionId;

      if (!targetQuestionId) {
        setError("No question ID provided");
        setLoading(false);
        return;
      }

      // Don't fetch if we already have the correct question
      if (
        question &&
        question.question_id === targetQuestionId &&
        lastFetchedQuestionId === targetQuestionId
      ) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching question with ID:", targetQuestionId);
        const endpoint = `/questions/questions/quiz-question/${targetQuestionId}?quiz_id=${quizId}&organization_id=${organizationId}`;

        const response = await api.get<Question>(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch question: ${response.status}`);
        }

        if (!response.data) {
          throw new Error("No question data received");
        }

        // Verify we got the correct question
        if (response.data.question_id !== targetQuestionId) {
          console.warn(
            `Question ID mismatch: requested ${targetQuestionId}, got ${response.data.question_id}. Retrying...`
          );
          // Retry with explicit question ID
          const retryEndpoint = `/questions/questions/quiz-question/${targetQuestionId}?quiz_id=${quizId}&organization_id=${organizationId}`;

          const retryResponse = await api.get<Question>(retryEndpoint);
          if (retryResponse.ok && retryResponse.data) {
            setQuestion(retryResponse.data);
            setLastFetchedQuestionId(targetQuestionId);
            console.log(
              "Question fetched successfully on retry:",
              retryResponse.data
            );
          } else {
            throw new Error(`Failed to fetch correct question after retry`);
          }
        } else {
          setQuestion(response.data);
          setLastFetchedQuestionId(targetQuestionId);
          console.log("Question fetched successfully:", response.data);
        }
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load question. Please try again."
        );
        setQuestion(null);
        setLastFetchedQuestionId(null);
      } finally {
        setLoading(false);
      }
    },
    [
      quizId,
      subjectId,
      topicId,
      currentQuestionId,
      question,
      lastFetchedQuestionId,
    ]
  );

  useEffect(() => {
    if (currentQuestionId && currentQuestionId !== lastFetchedQuestionId) {
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
