"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { api } from "@/lib/api-client"

interface Message {
  id: number
  sender: "user" | "response"
  content: string
  timestamp: string
  type?: "feedback" | "question" | "summary"
}

interface ConvoMessage {
  role: string
  content: string
}

interface Option {
  quiz_question_option_id: number
  option_text: string
  is_correct: boolean
}

interface Question {
  question_id: number
  quiz_id: number
  quiz_question_text: string
  options: Option[]
}

interface UseQuizChatProps {
  question: Question | null
  selectedOption: number | null
  contextAnswer: string
  quizId: string
  subjectId?: string
  topicId?: string
}

export function useQuizChat({
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

  // Auto-scroll to bottom when new messages arrive
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

  const addConversationMessage = useCallback((message: ConvoMessage) => {
    setConversationMessages((prev) => [...prev, message])
  }, [])

  const initializeChat = async (selectedOptionData: Option | undefined) => {
    if (!question || !selectedOptionData) return

    setIsTyping(true)

    try {
      // Initialize conversation
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
          content: selectedOptionData.option_text,
          timestamp: "Just now",
        },
        {
          id: 3,
          sender: "response",
          content: "I'll help you understand this question better. Let me analyze your answer...",
          timestamp: "Just now",
        },
      ]

      setMessages(initialMessages)

      const conversationObj = [
        { role: "assistant", content: question.quiz_question_text },
        { role: "user", content: selectedOptionData.option_text },
        { role: "assistant", content: "I'll help you understand this question better." },
      ]

      setConversationMessages(conversationObj)

      // Get contextual answer
      const payload = {
        user_content: question.quiz_question_text,
        model: "gpt-4o",
        collection_name: "linear_algebra",
        top_k: 5,
      }

      const response = await api.post<any>("/genai/socratic/contextual-answer", payload)

      if (response.ok && response.data) {
        setContextAnswer(response.data.assistant_response)

        // Get initial Socratic question
        const socraticPayload = {
          model: "gpt-4o",
          complex_question: question.quiz_question_text,
          actual_answer: response.data.assistant_response,
          correct_answer: question.options.find((option) => option.is_correct)?.option_text,
          student_answer: selectedOption?.toString(),
        }

        const socraticResponse = await api.post<any>("/genai/socratic/initial", socraticPayload)

        if (socraticResponse.ok && socraticResponse.data) {
          setActualAnswer(socraticResponse.data.sub_question)

          addMessage({
            sender: "response",
            content: socraticResponse.data.sub_question,
            type: "question",
          })

          addConversationMessage({
            role: "assistant",
            content: socraticResponse.data.sub_question,
          })
        }
      }
    } catch (error) {
      console.error("Error initializing chat:", error)
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

    // Add user message
    addMessage({
      sender: "user",
      content,
    })

    addConversationMessage({
      role: "user",
      content,
    })

    setIsTyping(true)

    try {
      // Check if conversation should continue
      const isCompletePayload = {
        complex_question: question.quiz_question_text,
        messages: conversationMessages,
        model: "gpt-4o",
        actual_answer: contextAnswer,
      }

      const isContinueResponse = await api.post<any>("genai/missing-context/evaluate", isCompletePayload)
      const shouldContinue = !isContinueResponse.data.is_complete

      if (shouldContinue && feedbackCounter < 5) {
        // Generate feedback
        const feedbackPayload = {
          messages: [
            { role: "assistant", content: actualAnswer },
            { role: "user", content },
          ],
          model: "gpt-4o",
          actual_answer: contextAnswer,
        }

        const feedbackResponse = await api.post<any>("/genai/feedback/generate", feedbackPayload)
        let feedback = `**Feedback**\n\n${feedbackResponse.data.feedback}`

        addConversationMessage({
          role: "assistant",
          content: feedback,
        })

        // Get follow-up question
        const followUpPayload = {
          complex_question: question.quiz_question_text,
          student_answer: selectedOption?.toString(),
          correct_answer: question.options.find((option) => option.is_correct)?.option_text,
          messages: conversationMessages,
          model: "gpt-4o",
          actual_answer: contextAnswer,
        }

        const followUpResponse = await api.post<any>("/genai/follow-up-socratic/ask", followUpPayload)

        if (followUpResponse.ok && followUpResponse.data) {
          feedback += `\n\n${followUpResponse.data.sub_question}`

          addMessage({
            sender: "response",
            content: feedback,
            type: "feedback",
          })
        }

        setFeedbackCounter((prev) => prev + 1)
      } else {
        // Generate final summary
        const summaryPayload = {
          complex_question: question.quiz_question_text,
          messages: conversationMessages,
          model: "gpt-4o",
          actual_answer: contextAnswer,
        }

        const knowledgeGapPayload = {
          messages: conversationMessages,
          model: "gpt-4o",
          actual_answer: contextAnswer,
        }

        const [summaryResponse, knowledgeGapResponse] = await Promise.all([
          api.post<any>("/genai/user-summary/generate", summaryPayload),
          api.post<any>("/genai/knowledge-gap/analyze", knowledgeGapPayload),
        ])

        let finalContent = `**Summary**\n\n${summaryResponse.data.summary}`
        finalContent += `\n\n**Knowledge Gap Analysis**\n\n${knowledgeGapResponse.data.knowledge_gap}`

        addMessage({
          sender: "response",
          content: finalContent,
          type: "summary",
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
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
    messagesEndRef,
  }
}
