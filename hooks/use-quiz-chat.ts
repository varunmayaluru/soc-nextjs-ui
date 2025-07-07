"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { secureApi } from "@/lib/secure-api-client"
import { api } from "@/lib/api-client"

interface Message {
  id: number
  sender: "user" | "response"
  content: string
  timestamp: string
  type?: "feedback" | "question" | "summary" | "knowledge-gap" | "Actual-Answer"
}

interface ConvoMessage {
  role: string
  content: string
}

interface QuestionOption {
  id: number
  option_text: string
  is_correct: boolean
  option_index: number
  organization_id: number
}

interface Question {
  question_number: number
  quiz_id: number
  quiz_question_text: string
  difficulty_level: string
  is_active: boolean
  is_maths: boolean
  question_type: "mcq" | "fib" | "tf" | "match" | "sa"
  correct_answer?: string
  created_by: number
  create_date_time: string
  update_date_time: string | null
  options: QuestionOption[]
  short_answer_text?: string
}

interface UseQuizChatProps {
  question: Question | null
  selectedOption: number | null
  contextAnswer: string
  quizId: string
  subjectId?: string
  topicId?: string
  currentQuestionId: number | null
  attemptId?: number | null
  selectedOptionData: QuestionOption | undefined
}

export function useQuizChat({
  currentQuestionId,
  attemptId,
  selectedOptionData,
  question,
  selectedOption,
  contextAnswer: initialContextAnswer,
  quizId,
  subjectId,
  topicId,
}: UseQuizChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [contextAnswer, setContextAnswer] = useState(initialContextAnswer)
  const [actualAnswer, setActualAnswer] = useState("")
  const [conversationMessages, setConversationMessages] = useState<ConvoMessage[]>([])
  const [feedbackCounter, setFeedbackCounter] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const organizationId = localStorage.getItem("organizationId")
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now() + Math.random(),
      timestamp: "Just now",
    }
    setMessages((prev) => [...prev, newMessage])
    return newMessage
  }, [])

  const resetChat = useCallback(() => {
    setMessages([])
    setConversationMessages([])
    setFeedbackCounter(0)
    setContextAnswer("")
    setActualAnswer("")
  }, [])

  const initializeChat = async (userAnswer: string) => {
    if (!question) return

    setIsTyping(true)

    try {
      const initialMessages: Message[] = [
        {
          id: 1,
          sender: "response",
          content: question.quiz_question_text,
          timestamp: "Just now",
          type: "question",
        },
        {
          id: 2,
          sender: "user",
          content: userAnswer,
          timestamp: "Just now",
        },
      ]

      setMessages(initialMessages)

      const intro: Message = {
        id: 3,
        sender: "response",
        content: "I'll help you understand this question better.",
        timestamp: "Just now",
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, intro])
      }, 500)

      const conversationObj: ConvoMessage[] = [
        { role: "assistant", content: question.quiz_question_text },
        { role: "user", content: userAnswer },
        { role: "assistant", content: "I'll help you understand this question better." },
      ]

      setConversationMessages(conversationObj)

      const payload = {
        query: question.quiz_question_text,
        options: question.options.map((option) => option.option_text).join(", "),
        student_answer: userAnswer,
        correct_answer:
          question.options.find((o) => o.is_correct)?.option_text || question.short_answer_text || "",
        model: "gpt-4o",
        collection_name: "linear_algebra",
        top_k: 5,
      }

      const response = await secureApi.post<any>("/genai/socratic/contextual-answer", payload)

      if (response.ok && response.data) {
        setContextAnswer(response.data.assistant_response)

        const correct_answer =
          question.question_type === "sa"
            ? question.short_answer_text
            : question.options.find((o) => o.is_correct)?.option_text

        const socraticPayload = {
          model: "gpt-4o",
          query: question.quiz_question_text,
          contextual_answer: response.data.assistant_response,
          correct_answer,
          student_answer: userAnswer,
        }

        const socraticResponse = await secureApi.post<any>("/genai/socratic/initial", socraticPayload)

        if (socraticResponse.ok && socraticResponse.data) {
          setActualAnswer(socraticResponse.data.sub_question)

          addMessage({
            sender: "response",
            content: socraticResponse.data.sub_question,
            type: "question",
          })

          setConversationMessages((prev) => [
            ...prev,
            { role: "assistant", content: socraticResponse.data.sub_question },
          ])
        }
      }
    } catch (error) {
      console.error("❌ Error initializing chat:", error)
      addMessage({
        sender: "response",
        content: "Sorry, I encountered an error. Please try again.",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || !question) return

    addMessage({ sender: "user", content })

    const updatedConversationMessages: ConvoMessage[] = [
      ...conversationMessages,
      { role: "user", content },
    ]
    setConversationMessages(updatedConversationMessages)

    setIsTyping(true)

    try {
      const correct_answer =
        question.question_type === "sa"
          ? question.short_answer_text
          : question.options.find((o) => o.is_correct)?.option_text

      const isCorrectPayload = {
        question_text: question.quiz_question_text,
        user_answer: content,
        correct_answer,
        model: "gpt-4o",
        contextual_answer: contextAnswer,
      }

      const isCorrectResponse = await secureApi.post<any>(
        "/genai/answer-evaluation/answer/evaluate",
        isCorrectPayload
      )
      const shouldContinue = !isCorrectResponse.data.is_correct

      if (shouldContinue && feedbackCounter < 5) {
        const feedbackPayload = {
          messages: updatedConversationMessages,
          model: "gpt-4o",
          query: question.quiz_question_text,
          student_answer:
            question.question_type === "sa"
              ? question.short_answer_text || ""
              : selectedOptionData?.option_text || "",
          correct_answer:
            question.options.find((o) => o.is_correct)?.option_text || question.short_answer_text || "",
          contextual_answer: contextAnswer,
        }

        const feedbackResponse = await secureApi.post<any>("/genai/feedback/generate", feedbackPayload)
        const feedback = feedbackResponse.data.feedback

        addMessage({ sender: "response", content: feedback, type: "feedback" })

        const newConvoMessages: ConvoMessage[] = [
          ...updatedConversationMessages,
          { role: "assistant", content: feedback },
        ]
        setConversationMessages(newConvoMessages)

        const followUpPayload = {
          query: question.quiz_question_text,
          student_answer:
            question.question_type === "sa"
              ? question.short_answer_text || ""
              : selectedOptionData?.option_text || "",
          correct_answer,
          messages: newConvoMessages,
          model: "gpt-4o",
          contextual_answer: contextAnswer,
        }

        const followUpResponse = await secureApi.post<any>(
          "/genai/follow-up-socratic/ask",
          followUpPayload
        )

        if (followUpResponse.ok && followUpResponse.data) {
          const followUpQuestion = followUpResponse.data.sub_question

          addMessage({ sender: "response", content: followUpQuestion, type: "question" })
          setConversationMessages((prev) => [
            ...prev,
            { role: "assistant", content: followUpQuestion },
          ])
        }

        // if (feedbackCounter === 0) {
        //   const payload = {
        //     organization_id: organizationId,
        //     user_id: userId,
        //     subject_id: subjectId,
        //     topic_id: topicId,
        //     quiz_id: quizId,
        //     question_number: currentQuestionId,
        //     attempt_id: attemptId || 1,
        //     is_complete: true,
        //     is_correct: selectedOptionData?.is_correct || false,
        //     is_ai_assisted: true,
        //     completion_time_seconds: 0,
        //   }

        //   await api.patch(`/user-quiz-attempts/quiz-attempts/`, payload)
        // }

        setFeedbackCounter((prev) => prev + 1)
      } else {
        const summaryPayload = {
          query: question.quiz_question_text,
          messages: updatedConversationMessages,
          model: "gpt-4o",
          contextual_answer: contextAnswer,
        }

        const knowledgeGapPayload = {
          query: question.quiz_question_text,
          student_answer:
            question.question_type === "sa"
              ? question.short_answer_text || ""
              : selectedOptionData?.option_text || "",
          correct_answer,
          messages: updatedConversationMessages,
          model: "gpt-4o",
          contextual_answer: contextAnswer,
        }

        const [summaryResponse, knowledgeGapResponse] = await Promise.all([
          secureApi.post<any>("/genai/user-summary/generate", summaryPayload),
          secureApi.post<any>("/genai/knowledge-gap/analyze", knowledgeGapPayload),
        ])

        addMessage({
          sender: "response",
          content: `The correct answer is : ${correct_answer}`,
          type: "Actual-Answer",
        })

        addMessage({
          sender: "response",
          content: summaryResponse.data.summary,
          type: "summary",
        })

        addMessage({
          sender: "response",
          content: knowledgeGapResponse.data.knowledge_gap,
          type: "knowledge-gap",
        })
      }
    } catch (error) {
      console.error("❌ Error sending message:", error)
      addMessage({
        sender: "response",
        content: "Sorry, I encountered an error processing your message. Please try again.",
      })
    } finally {
      setIsTyping(false)
    }
  }

  return {
    messages,
    isTyping,
    sendMessage,
    initializeChat,
    resetChat,
    messagesEndRef,
  }
}
