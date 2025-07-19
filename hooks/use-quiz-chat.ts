"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { secureApi } from "@/lib/secure-api-client"

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

interface ConversationData {
  query: string
  options: string
  student_answer: string
  correct_answer: string
  contextual_answer: string
  timestamp: string
  messages: ConvoMessage[]
  question_number?: number
  quiz_id?: string
  attempt_id?: number
  feedback_counter?: number
  actual_answer?: string
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
  const [isInitialized, setIsInitialized] = useState(false)
  const [conversationLoaded, setConversationLoaded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const organizationId = localStorage.getItem("organizationId")
  const userId = localStorage.getItem("userId")

  // Generate unique session ID for conversation persistence
  const generateSessionId = useCallback(
    () => `${userId}:${quizId}:${currentQuestionId}:${attemptId || 1}`,
    [userId, quizId, currentQuestionId, attemptId],
  )

  // Load conversation from storage
  const loadConversation = useCallback(async (): Promise<ConversationData | null> => {
    if (!currentQuestionId || !userId) return null

    try {
      const payload = {
        user_session_id: generateSessionId(),
        db_name: "probed-edu-db",
        collection_name: "probed-edu-collection",
      }
      console.log("Loading conversation for session:", generateSessionId())
      const res = await secureApi.post<ConversationData>("/conv-store/conv-store/read", payload)

      if (res.ok && res.data && res.data.messages && res.data.messages.length > 0) {
        console.log("Conversation loaded with", res.data.messages.length, "messages")
        return res.data
      } else {
        console.log("No existing conversation found")
        return null
      }
    } catch (err) {
      console.error("Error loading conversation:", err)
      return null
    }
  }, [generateSessionId, currentQuestionId, userId])

  // Save conversation to storage
  const saveConversation = useCallback(
    async (conv: ConversationData) => {
      if (!currentQuestionId || !userId) return

      try {
        const payload = {
          ...conv,
          user_session_id: generateSessionId(),
          db_name: "probed-edu-db",
          collection_name: "probed-edu-collection",
        }
        console.log("Saving conversation for session:", generateSessionId())
        const res = await secureApi.post("/conv-store/conv-store/write", payload)
        if (!res.ok) {
          console.error("Failed to save conversation:", res)
        } else {
          console.log("Conversation saved successfully")
        }
      } catch (err) {
        console.error("Error saving conversation:", err)
      }
    },
    [generateSessionId, currentQuestionId, userId],
  )

  // Convert conversation messages to UI messages
  const uiFromConvo = useCallback((convo: ConvoMessage[]): Message[] => {
    return convo.map((m, i) => ({
      id: i + 1,
      sender: m.role === "user" ? "user" : "response",
      content: m.content,
      timestamp: "Previously",
      type: i === 0 ? "question" : undefined,
    }))
  }, [])

  // Create conversation data object
  const createConversationData = useCallback(
    (messages: ConvoMessage[], userAnswer?: string): ConversationData => {
      if (!question) {
        throw new Error("Question is required to create conversation data")
      }

      return {
        query: question.quiz_question_text,
        options: question.options.map((o) => o.option_text).join(", "),
        student_answer: userAnswer || "",
        correct_answer: question.options.find((o) => o.is_correct)?.option_text || question.short_answer_text || "",
        contextual_answer: contextAnswer,
        timestamp: new Date().toISOString(),
        messages: messages,
        question_number: currentQuestionId || undefined,
        quiz_id: quizId,
        attempt_id: attemptId || 1,
        feedback_counter: feedbackCounter,
        actual_answer: actualAnswer,
      }
    },
    [question, contextAnswer, currentQuestionId, quizId, attemptId, feedbackCounter, actualAnswer],
  )

  // Load existing conversation when question changes
  const loadExistingConversation = useCallback(async () => {
    if (!question || !currentQuestionId || conversationLoaded) return

    console.log("Loading existing conversation for question:", currentQuestionId)
    setIsTyping(true)

    try {
      const existing = await loadConversation()
      if (existing && existing.messages && existing.messages.length > 0) {
        console.log("Found existing conversation, restoring state")
        setConversationMessages(existing.messages)

        // Convert conversation messages to UI messages
        const uiMessages: Message[] = existing.messages.map((m, i) => ({
          id: i + 1,
          sender: m.role === "user" ? "user" : "response",
          content: m.content,
          timestamp: "Previously",
          type: i === 0 ? "question" : undefined,
        }))
        setMessages(uiMessages)

        setContextAnswer(existing.contextual_answer || "")
        setActualAnswer(existing.actual_answer || "")
        setFeedbackCounter(existing.feedback_counter || 0)
        setIsInitialized(true)
      } else {
        console.log("📭 No existing conversation found")
        // Reset state for new question
        setMessages([])
        setConversationMessages([])
        setContextAnswer("")
        setActualAnswer("")
        setFeedbackCounter(0)
        setIsInitialized(false)
      }
      setConversationLoaded(true)
    } catch (error) {
      console.error("Error loading existing conversation:", error)
      setMessages([])
      setConversationMessages([])
      setIsInitialized(false)
      setConversationLoaded(true)
    } finally {
      setIsTyping(false)
    }
  }, [question, currentQuestionId, conversationLoaded, loadConversation])

  // Reset conversation state when question changes
  const resetConversationState = useCallback(() => {
    console.log("Resetting conversation state for new question")
    setMessages([])
    setConversationMessages([])
    setContextAnswer("")
    setActualAnswer("")
    setFeedbackCounter(0)
    setIsInitialized(false)
    setConversationLoaded(false)
    setIsTyping(false)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Reset and load conversation when question changes
  useEffect(() => {
    if (currentQuestionId && question) {
      resetConversationState()
      // Small delay to ensure state is reset before loading
      const timer = setTimeout(() => {
        loadExistingConversation()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [currentQuestionId, question])

  // Update context answer when it changes
  useEffect(() => {
    setContextAnswer(initialContextAnswer)
  }, [initialContextAnswer])

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
    setIsInitialized(false)
    setConversationLoaded(false)
  }, [])

  const initializeChat = async (userAnswer: string) => {
    if (!question || !currentQuestionId) {
      console.log("Cannot initialize chat: missing question or currentQuestionId")
      return
    }

    // If already initialized or conversation exists, don't reinitialize
    if (isInitialized || conversationMessages.length > 0) {
      console.log("Chat already initialized or conversation exists")
      return
    }

    console.log("Initializing new chat for question:", currentQuestionId)
    setIsTyping(true)

    try {
      // Double-check if conversation exists
      const existing = await loadConversation()
      if (existing && existing.messages && existing.messages.length > 0) {
        console.log("Found existing conversation during initialization")
        setConversationMessages(existing.messages)
        const uiMessages: Message[] = existing.messages.map((m, i) => ({
          id: i + 1,
          sender: m.role === "user" ? "user" : "response",
          content: m.content,
          timestamp: "Previously",
          type: i === 0 ? "question" : undefined,
        }))
        setMessages(uiMessages)
        setContextAnswer(existing.contextual_answer || "")
        setActualAnswer(existing.actual_answer || "")
        setFeedbackCounter(existing.feedback_counter || 0)
        setIsInitialized(true)
        setIsTyping(false)
        return
      }

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
      setIsInitialized(true)

      const payload = {
        query: question.quiz_question_text,
        options: question.options.map((option) => option.option_text).join(", "),
        student_answer: userAnswer,
        correct_answer: question.options.find((o) => o.is_correct)?.option_text || question.short_answer_text || "",
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
          const updatedConvo = [...conversationObj, { role: "assistant", content: socraticResponse.data.sub_question }]
          setConversationMessages(updatedConvo)

          // Save initial conversation
          const conversationData = createConversationData(updatedConvo, userAnswer)
          await saveConversation(conversationData)
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

    addMessage({ sender: "user", content })
    const updatedConversationMessages: ConvoMessage[] = [...conversationMessages, { role: "user", content }]
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

      const isCorrectResponse = await secureApi.post<any>("/genai/answer-evaluation/answer/evaluate", isCorrectPayload)

      const shouldContinue = !isCorrectResponse.data.is_correct

      if (shouldContinue && feedbackCounter < 5) {
        const feedbackPayload = {
          messages: updatedConversationMessages,
          model: "gpt-4o",
          query: question.quiz_question_text,
          student_answer:
            question.question_type === "sa" ? question.short_answer_text || "" : selectedOptionData?.option_text || "",
          correct_answer: question.options.find((o) => o.is_correct)?.option_text || question.short_answer_text || "",
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
            question.question_type === "sa" ? question.short_answer_text || "" : selectedOptionData?.option_text || "",
          correct_answer,
          messages: newConvoMessages,
          model: "gpt-4o",
          contextual_answer: contextAnswer,
        }

        const followUpResponse = await secureApi.post<any>("/genai/follow-up-socratic/ask", followUpPayload)

        if (followUpResponse.ok && followUpResponse.data) {
          const followUpQuestion = followUpResponse.data.sub_question
          addMessage({ sender: "response", content: followUpQuestion, type: "question" })
          const finalConvo = [...newConvoMessages, { role: "assistant", content: followUpQuestion }]
          setConversationMessages(finalConvo)

          // Save updated conversation
          const conversationData = createConversationData(finalConvo)
          await saveConversation(conversationData)
        }

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
            question.question_type === "sa" ? question.short_answer_text || "" : selectedOptionData?.option_text || "",
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

        const finalConvo = [
          ...updatedConversationMessages,
          { role: "assistant", content: `The correct answer is : ${correct_answer}` },
          { role: "assistant", content: summaryResponse.data.summary },
          { role: "assistant", content: knowledgeGapResponse.data.knowledge_gap },
        ]
        setConversationMessages(finalConvo)

        // Save final conversation
        const conversationData = createConversationData(finalConvo)
        await saveConversation(conversationData)
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
    resetChat,
    messagesEndRef,
    isInitialized,
    conversationLoaded,
    feedbackCounter,
  }
}
