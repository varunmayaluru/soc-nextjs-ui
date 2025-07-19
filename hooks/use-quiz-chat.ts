// useQuizChat.ts

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

interface ConversationData {
  query: string
  options: string
  student_answer: string
  correct_answer: string
  contextual_answer: string
  timestamp: string
  messages: ConvoMessage[]
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

  const userId = localStorage.getItem("userId")

  const generateSessionId = useCallback(
    () => `${userId}:${quizId}:${currentQuestionId}:${attemptId || 1}`,
    [userId, quizId, currentQuestionId, attemptId],
  )

  const loadConversation = useCallback(
    async (): Promise<ConversationData | null> => {
      try {
        const sessionId = generateSessionId()
        const payload = {
          user_session_id: sessionId,
          db_name: "probed-edu-db",
          collection_name: "probed-edu-collection",
        }
        const res = await secureApi.post<ConversationData>(
          "/conv-store/conv-store/read",
          payload,
        )
        return res.ok && res.data ? res.data : null
      } catch (error) {
        console.error("❌ Error loading conversation:", error)
        return null
      }
    },
    [generateSessionId],
  )

  const convertConvoMessagesToUIMessages = useCallback(
    (convo: ConvoMessage[]): Message[] =>
      convo.map((msg, i) => ({
        id: i + 1,
        sender: msg.role === "user" ? "user" : "response",
        content: msg.content,
        timestamp: "Previously",
      })),
    [],
  )

  // 1️⃣ Auto-load saved conversation when question/attempt changes
  useEffect(() => {
    if (!question) return

    const hydrate = async () => {
      setIsTyping(true)
      try {
        const existing = await loadConversation()
        if (existing && existing.messages.length > 0) {
          setConversationMessages(existing.messages)
          setMessages(convertConvoMessagesToUIMessages(existing.messages))
          setContextAnswer(existing.contextual_answer)
          setActualAnswer(existing.student_answer)
          const fbCount = existing.messages.filter(
            (m) => m.role === "assistant" && m.content.includes("feedback"),
          ).length
          setFeedbackCounter(fbCount)
        }
      } catch (e) {
        console.error("Error loading conversation:", e)
      } finally {
        setIsTyping(false)
      }
    }

    hydrate()
  }, [
    question?.quiz_question_text,
    currentQuestionId,
    attemptId,
    loadConversation,
    convertConvoMessagesToUIMessages,
  ])

  // scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">) => {
      const newMessage: Message = {
        ...message,
        id: Date.now() + Math.random(),
        timestamp: "Just now",
      }
      setMessages((prev) => [...prev, newMessage])
      return newMessage
    },
    [],
  )

  const resetChat = useCallback(() => {
    setMessages([])
    setConversationMessages([])
    setFeedbackCounter(0)
    setContextAnswer("")
    setActualAnswer("")
  }, [])

  const saveConversation = useCallback(
    async (
      query: string,
      options: string,
      studentAnswer: string,
      correctAnswer: string,
      contextualAnswer: string,
      messages: ConvoMessage[],
    ) => {
      try {
        const sessionId = generateSessionId()
        const payload = {
          user_session_id: sessionId,
          query,
          options,
          student_answer: studentAnswer,
          correct_answer: correctAnswer,
          contextual_answer: contextualAnswer,
          messages,
        }
        const response = await secureApi.post("/conv-store/conv-store/write", payload)
        if (!response.ok) {
          console.error("❌ Failed to save conversation")
        }
      } catch (error) {
        console.error("❌ Error saving conversation:", error)
      }
    },
    [generateSessionId],
  )

  const initializeChat = useCallback(
    async (userAnswer: string) => {
      if (!question) return
      setIsTyping(true)

      try {
        // Guard against re-initializing if we already hydrated
        const existing = await loadConversation()
        if (existing && existing.messages.length > 0) {
          setConversationMessages(existing.messages)
          setMessages(convertConvoMessagesToUIMessages(existing.messages))
          setContextAnswer(existing.contextual_answer)
          setActualAnswer(existing.student_answer)
          const fbCount = existing.messages.filter(
            (m) => m.role === "assistant" && m.content.includes("feedback"),
          ).length
          setFeedbackCounter(fbCount)
          return
        }

        // New conversation flow
        const initialUI: Message[] = [
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
        setMessages(initialUI)

        const intro: Message = {
          id: 3,
          sender: "response",
          content: "I'll help you understand this question better.",
          timestamp: "Just now",
        }
        setTimeout(() => setMessages((prev) => [...prev, intro]), 500)

        const convoStart: ConvoMessage[] = [
          { role: "assistant", content: question.quiz_question_text },
          { role: "user", content: userAnswer },
          { role: "assistant", content: "I'll help you understand this question better." },
        ]
        setConversationMessages(convoStart)

        // Fetch contextual answer
        const contextPayload = {
          query: question.quiz_question_text,
          options: question.options.map((o) => o.option_text).join(", "),
          student_answer: userAnswer,
          correct_answer:
            question.question_type === "sa"
              ? question.short_answer_text
              : question.options.find((o) => o.is_correct)?.option_text || "",
          model: "gpt-4o",
          collection_name: "linear_algebra",
          top_k: 5,
        }
        const contextRes = await secureApi.post<any>(
          "/genai/socratic/contextual-answer",
          contextPayload,
        )
        let ctxAns = ""
        if (contextRes.ok && contextRes.data) {
          ctxAns = contextRes.data.assistant_response
          setContextAnswer(ctxAns)
        }

        // Fetch initial Socratic question
        const correctAns =
          question.question_type === "sa"
            ? question.short_answer_text
            : question.options.find((o) => o.is_correct)?.option_text
        const socraticPayload = {
          model: "gpt-4o",
          query: question.quiz_question_text,
          contextual_answer: ctxAns,
          correct_answer: correctAns,
          student_answer: userAnswer,
        }
        const socraticRes = await secureApi.post<any>(
          "/genai/socratic/initial",
          socraticPayload,
        )
        if (socraticRes.ok && socraticRes.data) {
          addMessage({
            sender: "response",
            content: socraticRes.data.sub_question,
            type: "question",
          })
          const updatedConvo = [
            ...convoStart,
            { role: "assistant", content: socraticRes.data.sub_question },
          ]
          setConversationMessages(updatedConvo)

          await saveConversation(
            question.quiz_question_text,
            question.options.map((o) => o.option_text).join(", "),
            userAnswer,
            correctAns || "",
            ctxAns,
            updatedConvo,
          )
        }
      } catch (error) {
        console.error(error)
        addMessage({ sender: "response", content: "Sorry, I encountered an error." })
      } finally {
        setIsTyping(false)
      }
    },
    [
      question,
      loadConversation,
      convertConvoMessagesToUIMessages,
      saveConversation,
      addMessage,
    ],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !question) return
      addMessage({ sender: "user", content })
      const updatedConvo = [...conversationMessages, { role: "user", content }]
      setConversationMessages(updatedConvo)
      setIsTyping(true)

      try {
        const correctAns =
          question.question_type === "sa"
            ? question.short_answer_text
            : question.options.find((o) => o.is_correct)?.option_text

        // Evaluate answer
        const evalRes = await secureApi.post<any>(
          "/genai/answer-evaluation/answer/evaluate",
          {
            question_text: question.quiz_question_text,
            user_answer: content,
            correct_answer: correctAns,
            model: "gpt-4o",
            contextual_answer: contextAnswer,
          },
        )
        const shouldContinue = !evalRes.data.is_correct

        if (shouldContinue && feedbackCounter < 5) {
          // Generate feedback
          const fbRes = await secureApi.post<any>(
            "/genai/feedback/generate",
            {
              messages: updatedConvo,
              model: "gpt-4o",
              query: question.quiz_question_text,
              student_answer:
                question.question_type === "sa"
                  ? question.short_answer_text || ""
                  : selectedOptionData?.option_text || "",
              correct_answer: correctAns,
              contextual_answer: contextAnswer,
            },
          )
          addMessage({ sender: "response", content: fbRes.data.feedback, type: "feedback" })
          const afterFb = [...updatedConvo, { role: "assistant", content: fbRes.data.feedback }]
          setConversationMessages(afterFb)

          // Follow-up question
          const fuRes = await secureApi.post<any>(
            "/genai/follow-up-socratic/ask",
            {
              query: question.quiz_question_text,
              student_answer:
                question.question_type === "sa"
                  ? question.short_answer_text || ""
                  : selectedOptionData?.option_text || "",
              correct_answer: correctAns,
              messages: afterFb,
              model: "gpt-4o",
              contextual_answer: contextAnswer,
            },
          )
          if (fuRes.ok && fuRes.data) {
            addMessage({
              sender: "response",
              content: fuRes.data.sub_question,
              type: "question",
            })
            const finalConvo = [
              ...afterFb,
              { role: "assistant", content: fuRes.data.sub_question },
            ]
            setConversationMessages(finalConvo)
            await saveConversation(
              question.quiz_question_text,
              question.options.map((o) => o.option_text).join(", "),
              question.question_type === "sa"
                ? question.short_answer_text || ""
                : selectedOptionData?.option_text || "",
              correctAns || "",
              contextAnswer,
              finalConvo,
            )
          }
          setFeedbackCounter((prev) => prev + 1)
        } else {
          // Summary and knowledge-gap
          const [sumRes, gapRes] = await Promise.all([
            secureApi.post<any>(
              "/genai/user-summary/generate",
              {
                query: question.quiz_question_text,
                messages: updatedConvo,
                model: "gpt-4o",
                contextual_answer: contextAnswer,
              },
            ),
            secureApi.post<any>(
              "/genai/knowledge-gap/analyze",
              {
                query: question.quiz_question_text,
                student_answer:
                  question.question_type === "sa"
                    ? question.short_answer_text || ""
                    : selectedOptionData?.option_text || "",
                correct_answer: correctAns,
                messages: updatedConvo,
                model: "gpt-4o",
                contextual_answer: contextAnswer,
              },
            ),
          ])

          addMessage({
            sender: "response",
            content: `The correct answer is: ${correctAns}`,
            type: "Actual-Answer",
          })
          addMessage({ sender: "response", content: sumRes.data.summary, type: "summary" })
          addMessage({
            sender: "response",
            content: gapRes.data["knowledge-gap"],
            type: "knowledge-gap",
          })

          const finalConvo = [
            ...updatedConvo,
            { role: "assistant", content: `The correct answer is: ${correctAns}` },
            { role: "assistant", content: sumRes.data.summary },
            { role: "assistant", content: gapRes.data["knowledge-gap"] },
          ]
          setConversationMessages(finalConvo)

          await saveConversation(
            question.quiz_question_text,
            question.options.map((o) => o.option_text).join(", "),
            question.question_type === "sa"
              ? question.short_answer_text || ""
              : selectedOptionData?.option_text || "",
            correctAns || "",
            contextAnswer,
            finalConvo,
          )
        }
      } catch (error) {
        console.error(error)
        addMessage({
          sender: "response",
          content: "Sorry, I encountered an error processing your message.",
        })
      } finally {
        setIsTyping(false)
      }
    },
    [
      question,
      conversationMessages,
      contextAnswer,
      feedbackCounter,
      selectedOptionData,
      addMessage,
      saveConversation,
    ],
  )

  return {
    messages,
    isTyping,
    initializeChat,
    sendMessage,
    resetChat,
    messagesEndRef,
  }
}
