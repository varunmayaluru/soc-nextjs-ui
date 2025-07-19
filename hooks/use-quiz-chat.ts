// useQuizChat.ts

"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { secureApi } from "@/lib/secure-api-client"
import { api } from "@/lib/api-client"

/* ------------------------------------------------------------------
   Type definitions
-------------------------------------------------------------------*/
interface Message {
  id: number
  sender: "user" | "response"
  content: string
  timestamp: string
  type?: "feedback" | "question" | "summary" | "knowledge-gap" | "Actual-Answer"
}

interface ConvoMessage {
  role: "user" | "assistant"
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

/* ------------------------------------------------------------------
   Hook
-------------------------------------------------------------------*/
export function useQuizChat({
  currentQuestionId,
  attemptId,
  selectedOptionData,
  question,
  selectedOption,
  contextAnswer: initialContextAnswer,
  quizId,
}: UseQuizChatProps) {
  /* ---------------------------- state & refs ---------------------------- */
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationMessages, setConversationMessages] = useState<ConvoMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [contextAnswer, setContextAnswer] = useState(initialContextAnswer)
  const [feedbackCounter, setFeedbackCounter] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : ""

  /* --------------------------- id generator --------------------------- */
  const generateSessionId = useCallback(
    () => `${userId}:${quizId}:${currentQuestionId}:${attemptId || 1}`,
    [userId, quizId, currentQuestionId, attemptId],
  )

  /* ------------------------------------------------------------------
     Helpers – API wrappers
  -------------------------------------------------------------------*/
  const loadConversation = useCallback(async (): Promise<ConversationData | null> => {
    try {
      const payload = {
        user_session_id: generateSessionId(),
        db_name: "probed-edu-db",
        collection_name: "probed-edu-collection",
      }
      const res = await secureApi.post<ConversationData>('/conv-store/conv-store/read', payload)
      return res.ok && res.data ? res.data : null
    } catch (err) {
      console.error("❌ Error loading conversation:", err)
      return null
    }
  }, [generateSessionId])

  const saveConversation = useCallback(async (conv: ConversationData) => {
    try {
      const payload = { ...conv, user_session_id: generateSessionId() }
      const res = await secureApi.post('/conv-store/conv-store/write', payload)
      if (!res.ok) console.error("❌ Failed to save conversation")
    } catch (err) {
      console.error("❌ Error saving conversation:", err)
    }
  }, [generateSessionId])

  /* ------------------------------------------------------------------
     UI helpers
  -------------------------------------------------------------------*/
  const uiFromConvo = useCallback((convo: ConvoMessage[]): Message[] =>
    convo.map((m, i) => ({
      id: i + 1,
      sender: m.role === 'user' ? 'user' : 'response',
      content: m.content,
      timestamp: 'Previously',
    })), [])

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMsg: Message = { ...msg, id: Date.now() + Math.random(), timestamp: 'Just now' }
    setMessages(prev => [...prev, newMsg])
    return newMsg
  }, [])

  /* ------------------------------------------------------------------
     Hydrate (or reset) whenever question / attempt changes
  -------------------------------------------------------------------*/
  const hydrate = useCallback(async () => {
    if (!question || !currentQuestionId) return
    setIsTyping(true)
    const existing = await loadConversation()
    if (existing && existing.messages.length) {
      setConversationMessages(existing.messages)
      setMessages(uiFromConvo(existing.messages))
      setContextAnswer(existing.contextual_answer)
      const fbCount = existing.messages.filter(m => m.role === 'assistant' && m.content.includes('feedback')).length
      setFeedbackCounter(fbCount)
    } else {
      // brand‑new question → clear UI state
      setMessages([])
      setConversationMessages([])
      setContextAnswer('')
      setFeedbackCounter(0)
    }
    setIsTyping(false)
  }, [question, currentQuestionId, loadConversation, uiFromConvo])

  useEffect(() => { hydrate() }, [hydrate])

  /* keep scroll at bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* ------------------------------------------------------------------
     Public API –  initializeChat & sendMessage
  -------------------------------------------------------------------*/
  const initializeChat = useCallback(async (userAnswer: string) => {
    // always try to hydrate first
    const existing = await loadConversation()
    if (existing && existing.messages.length) {
      setConversationMessages(existing.messages)
      setMessages(uiFromConvo(existing.messages))
      return
    }

    if (!question) return

    // new conversation bootstrap
    setIsTyping(true)
    const questionMsg: ConvoMessage = { role: 'assistant', content: question.quiz_question_text }
    const userMsg: ConvoMessage = { role: 'user', content: userAnswer }
    const introMsg: ConvoMessage = { role: 'assistant', content: "I'll help you understand this question better." }

    const convo: ConvoMessage[] = [questionMsg, userMsg, introMsg]
    setConversationMessages(convo)
    setMessages(uiFromConvo(convo))

    // (call your contextual‑answer + Socratic API here…)

    // finally save
    await saveConversation({
      query: question.quiz_question_text,
      options: question.options.map(o => o.option_text).join(', '),
      student_answer: userAnswer,
      correct_answer: question.options.find(o => o.is_correct)?.option_text || '',
      contextual_answer: '',
      timestamp: new Date().toISOString(),
      messages: convo,
    })
    setIsTyping(false)
  }, [question, loadConversation, uiFromConvo, saveConversation])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !question) return

    // update UI immediately
    const userMsg: ConvoMessage = { role: 'user', content }
    const newConvo = [...conversationMessages, userMsg]
    setConversationMessages(newConvo)
    setMessages(uiFromConvo(newConvo))
    setIsTyping(true)

    // TODO → call your evaluation / feedback endpoints exactly like before

    await saveConversation({
      query: question.quiz_question_text,
      options: question.options.map(o => o.option_text).join(', '),
      student_answer: '',
      correct_answer: question.options.find(o => o.is_correct)?.option_text || '',
      contextual_answer: contextAnswer,
      timestamp: new Date().toISOString(),
      messages: newConvo,
    })
    setIsTyping(false)
  }, [question, conversationMessages, uiFromConvo, saveConversation, contextAnswer])

  /* ------------------------------------------------------------------
     Return values
  -------------------------------------------------------------------*/
  return {
    messages,
    isTyping,
    initializeChat,
    sendMessage,
    messagesEndRef,
  }
}
