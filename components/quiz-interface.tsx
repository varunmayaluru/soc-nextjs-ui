"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  Bot,
  ChevronLeft,
  ChevronRight,
  LinkIcon,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  User,
  ImageIcon,
  PencilIcon,
  Eraser,
  Trash2,
  X,
  Check,
  Mic,
  MicOff,
} from "lucide-react"
import { api } from "@/lib/api-client"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MathRenderer } from "@/components/math-renderer"
import { MathInputHelper } from "@/components/math-input-helper"
import { set } from "date-fns"

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

interface Message {
  id: number
  sender: "user" | "response"
  content: string
  timestamp: string
}

interface DrawingTool {
  type: "pen" | "eraser"
  size: number
  color: string
}

interface convoMessage {
  role: string
  content: string
}

export function QuizInterface({
  quizId,
  questionId,
  subjectId,
  topicId,
}: {
  quizId: string
  questionId?: string
  subjectId?: string
  topicId?: string
}) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(1)
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [quizTitle, setQuizTitle] = useState("Algebra Fundamentals Quiz")
  const [subjectName, setSubjectName] = useState("Mathematics / Athematic / Counting and Number Recognition")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [questionIds, setQuestionIds] = useState<number[]>([])
  const [isProcessingMath, setIsProcessingMath] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const [currentTool, setCurrentTool] = useState<DrawingTool>({
    type: "pen",
    size: 3,
    color: "#000000",
  })
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [contextAnswer, setContextAnswer] = useState("")
  const [feedbackCounter, setFeedbackCounter] = useState(0);

  const [actualAnswer, setActualAnswer] = useState("")
  const [conversationMessages, setConversationMessages] = useState<convoMessage[]>([])
  const recognitionRef = useRef<any>(null)

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setSpeechSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("")

        setNewMessage(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }

  // Fetch quiz details to get total questions
  // useEffect(() => {
  //   const fetchQuizDetails = async () => {
  //     try {
  //       const response = await api.get(`/v1/quizzes/quizzes/${quizId}`)

  //       if (response.ok && response.data) {
  //         // Set quiz title if available
  //         if (response.data.title) {
  //           setQuizTitle(response.data.title)
  //         }

  //         // Set total questions if available
  //         if (response.data.total_questions) {
  //           setTotalQuestions(response.data.total_questions)
  //         }

  //         // Generate question IDs based on total questions
  //         if (response.data.total_questions) {
  //           const ids = Array.from({ length: response.data.total_questions }, (_, i) => i + 1)
  //           setQuestionIds(ids)
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error fetching quiz details:", err)
  //     }
  //   }

  //   fetchQuizDetails()
  // }, [quizId])

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true)
      setError(null)
      setIsAnswerChecked(false)
      setSelectedOption(null)

      try {
        // Use the provided questionId or fetch the first question for the quiz
        const id = questionId || currentQuestionId?.toString() || "1"
        setCurrentQuestionId(Number(id))

        // Use the exact API endpoint format from the provided example
        const endpoint = `/questions/questions/quiz-question/${id}?quiz_id=${quizId}&subject_id=${subjectId || 1}&topic_id=${topicId || 1}`
        console.log("Fetching question from:", endpoint)

        const response = await api.get<Question>(endpoint)

        if (!response.ok) {
          throw new Error(`Failed to fetch question: ${response.status}`)
        }

        console.log("Question data:", response.data)
        setQuestion(response.data)
      } catch (err) {
        console.error("Error fetching question:", err)
        setError("Failed to load question. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [quizId, questionId, currentQuestionId, subjectId, topicId])

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId)
    setIsAnswerChecked(false)
  }

  const checkAnswer = async (question: Question | null) => {

    console.log(question)
    if (selectedOption === null) return

    const selectedOptionData = question?.options.find((option) => option.quiz_question_option_id === selectedOption)

    setIsCorrect(selectedOptionData?.is_correct || false)
    setIsAnswerChecked(true)

    if (selectedOptionData?.is_correct === false) {
      const payload = {
        user_content: question?.quiz_question_text,
        model: "gpt-4o",
        collection_name: "linear_algebra",
        top_k: 5
      }

      try {

        const message: Message[] = [
          {
            id: 1,
            sender: "response",
            content: question?.quiz_question_text || "",
            timestamp: "Just now",
          },
          {
            id: 2,
            sender: "user",
            content: selectedOptionData?.option_text,
            timestamp: "Just now",
          },
          {
            id: 3,
            sender: "response",
            content: 'I\'ll help you understand this question better.',
            timestamp: "Just now",
          },
          {
            id: 3,
            sender: "user",
            content: 'Ok!',
            timestamp: "Just now",
          },
        ]

        setMessages([...message])

        let obj = [
          {
            "role": "assistant",
            "content": question?.quiz_question_text || "",
          },
          {
            "role": "user",
            "content": selectedOptionData?.option_text,
          },
          {
            "role": "assistant",
            "content": 'I\'ll help you understand this question better.',
          },
          {
            "role": "user",
            "content": 'Ok!',
          },
        ]

        setConversationMessages([...obj])


        const response = await api.post<any>('/genai/socratic/contextual-answer', payload);

        if (response.ok && response.data) {
          console.log("Response data:", response.data)

          const data = response.data
          setContextAnswer(data?.assistant_response)

          const payload = {
            model: "gpt-4o",
            complex_question: question?.quiz_question_text,
            actual_answer: data.assistant_response,
            correct_answer: question?.options.find((option) => option.is_correct)?.option_text,
            student_answer: selectedOption.toString()
          }

          const convo = await api.post<any>('/genai/socratic/initial', payload);

          if (convo.ok && convo.data) {
            console.log("Response data:", convo.data)

            const userMessage: Message = {
              id: messages.length + 1,
              sender: "response",
              content: convo.data.sub_question,
              timestamp: "Just now",
            }

            const userMessageObj = {
              "role": "assistant",
              "content": convo.data.sub_question,
            }

            setActualAnswer(convo.data.sub_question)


            setMessages((prev) => [...prev, userMessage])

            setConversationMessages((prev) => [...prev, userMessageObj])


          }
        }

      } catch (err) {
        console.error("Error fetching question:", err)
      }
    }


  }

  const navigateToQuestion = async (direction: "prev" | "next") => {
    if (!currentQuestionId) return

    // Simple navigation logic - in a real app, you'd fetch the actual next/prev question IDs
    const newQuestionId = direction === "next" ? currentQuestionId + 1 : currentQuestionId - 1

    if (newQuestionId < 1 || newQuestionId > totalQuestions) return // Prevent going beyond question range

    setCurrentQuestionId(newQuestionId)
  }


  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: newMessage,
      timestamp: "Just now",
    };

    const userMessageObj = {
      role: "user",
      content: newMessage,
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");
    setConversationMessages((prev) => [...prev, userMessageObj]);

    const payload = {
      messages: [
        { role: "assistant", content: actualAnswer },
        { role: "user", content: newMessage },
      ],
      model: "gpt-4o",
      actual_answer: contextAnswer,
    };

    try {
      const isCompletePayload = {
        complex_question: question?.quiz_question_text,
        messages: conversationMessages,
        model: "gpt-4o",
        actual_answer: contextAnswer,
      };

      const isContinueResponse = await api.post<any>('genai/missing-context/evaluate', isCompletePayload);
      const isContinue = isContinueResponse.data.is_complete;

      console.log("isContinue", isContinue);

      if (!isContinue) {
        if (feedbackCounter < 5) {
          // Step 1: Generate Feedback
          const response = await api.post<any>('/genai/feedback/generate', payload);
          let feedback = `Feedback\n\n${response.data.feedback}`;

          const tempobj = {
            role: "assistant",
            content: feedback,
          };

          setConversationMessages((prev) => [...prev, tempobj]);

          // Step 2: Follow-Up Socratic
          const Feedbackpayload = {
            complex_question: question?.quiz_question_text,
            student_answer: selectedOption?.toString(),
            correct_answer: question?.options.find((option) => option.is_correct)?.option_text,
            messages: conversationMessages,
            model: "gpt-4o",
            actual_answer: contextAnswer,
          };

          const res = await api.post<any>('/genai/follow-up-socratic/ask', Feedbackpayload);

          feedback += `\n\n${res.data.sub_question}`;

          if (res.ok && res.data) {
            setMessages((prev) => [
              ...prev,
              {
                id: messages.length + 1,
                sender: "response",
                content: feedback,
                timestamp: "Just now",
              },
            ]);
          }

          // 🔁 Increment feedback counter
          setFeedbackCounter(prev => prev + 1);
        } else {
          // 👇 After 5 times, hit the final feedback API

          let summaryPayload = {
            complex_question: question?.quiz_question_text,
            messages: conversationMessages,
            model: "gpt-4o",
            actual_answer: contextAnswer,
          };

          let knowledgeGapPayload = {
            messages: conversationMessages,
            model: "gpt-4o",
            actual_answer: contextAnswer,
          }


          console.log("final feedback api");
          const finalRes = await api.post<any>('/genai/user-summary/generate', summaryPayload);
          const knowledgeGap = await api.post<any>('/genai/knowledge-gap/analyze', knowledgeGapPayload);

          let finalFeedback = `User Summary:\n\n${finalRes.data.summary}`;

          finalFeedback += `\n\nKnowledge Gap:\n\n${knowledgeGap.data.knowledge_gap}`;

          setMessages((prev) => [
            ...prev,
            {
              id: messages.length + 1,
              sender: "response",
              content: finalFeedback,
              timestamp: "Just now",
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Error fetching question:", err);
    }
  };




  const processMathImage = async (file: File) => {
    setIsProcessingMath(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/mathpix", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process math image")
      }

      const data = await response.json()

      if (data.latex) {
        // Add the LaTeX to the message input
        setNewMessage((prevMessage) => prevMessage + " " + data.latex)
      }
    } catch (error) {
      console.error("Error processing math image:", error)
      // You might want to show a toast notification here
    } finally {
      setIsProcessingMath(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processMathImage(file)
    }
  }

  // Canvas drawing functions
  const initCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas background to white
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    setLastPos({ x, y })
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos) return

    e.preventDefault() // Add this line to prevent scrolling on touch devices

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(x, y)

    if (currentTool.type === "pen") {
      ctx.strokeStyle = currentTool.color
      ctx.lineWidth = currentTool.size
    } else if (currentTool.type === "eraser") {
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = currentTool.size * 3
    }

    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    setLastPos({ x, y })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setLastPos(null)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const captureCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, "image/png")
      })

      // Create a File object from the blob
      const file = new File([blob], "math-drawing.png", { type: "image/png" })

      // Process the image with Mathpix
      await processMathImage(file)

      // Close the canvas dialog
      setIsCanvasOpen(false)
    } catch (error) {
      console.error("Error capturing canvas:", error)
    }
  }

  useEffect(() => {
    if (isCanvasOpen) {
      initCanvas()
    }
  }, [isCanvasOpen])

  // Generate pagination numbers based on total questions
  const paginationNumbers =
    questionIds.length > 0 ? questionIds : Array.from({ length: totalQuestions }, (_, i) => i + 1)

  // Mock relevant links
  const relevantLinks = [
    { title: "Understanding Algebra Fundamentals", href: "#" },
    { title: "Solving Linear Equations", href: "#" },
    { title: "Mathematical Formulas Reference", href: "#" },
  ]

  const insertMathSymbol = (symbol: string) => {
    setNewMessage((prev) => prev + symbol)
  }

  return (
    <div className="mx-auto bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Question Panel */}
        <div className="bg-white p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="flex justify-between mt-6">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg font-medium text-center">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div>
              <div className="bg-white border-b border-t mb-4 border-gray-200 px-4 pt-2 flex overflow-x-auto">
                {paginationNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentQuestionId(num)}
                    className={`min-w-[36px] h-9 flex items-center justify-center mx-1 ${num === currentQuestionId ? "text-[#3373b5] font-bold border-b border-[#3373b5]" : "text-gray-500"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {/* Question navigation */}
              <div className="bg-[#F7F8FA] rounded-tl-2xl rounded-tr-2xl flex justify-between items-center mb-6 py-4 px-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-[#1E74BB] hover:bg-gray-400 disabled:bg-gray-400 border-none h-12 w-12 flex items-center justify-center"
                  onClick={() => navigateToQuestion("prev")}
                  disabled={currentQuestionId === 1}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </Button>
                <h2 className="text-xl font-bold">
                  {/* {currentQuestionId}. {question?.quiz_question_text || quizTitle} */}
                  <MathRenderer content={currentQuestionId + ". " + question?.quiz_question_text || ""} />
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-[#1E74BB] hover:bg-[#1E74BB84] disabled:bg-gray-400 border-none h-12 w-12 flex items-center justify-center"
                  onClick={() => navigateToQuestion("next")}
                  disabled={currentQuestionId === totalQuestions}
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </Button>
              </div>

              {/* Options */}
              <RadioGroup
                value={selectedOption?.toString()}
                onValueChange={(value) => handleOptionSelect(Number.parseInt(value))}
                className="space-y-2 gap-1 px-4 py-4 justify-center"
              >
                {question?.options.map((option) => {
                  const isSelected = selectedOption === option.quiz_question_option_id
                  const isCorrect = option.is_correct

                  return (
                    <div
                      key={option.quiz_question_option_id}
                      className={`border min-w-[600px] max-w-[750px] rounded-full flex items-center 
                         ${isSelected
                          ? isAnswerChecked
                            ? isCorrect
                              ? "border-green-500 bg-green-50 border-2 "
                              : "border-red-500 bg-red-50 border-2"
                            : "border-[#3373b5] bg-white border-2"
                          : "border-gray-200 bg-[#F1F1F1] hover:border-gray-300"
                        }`}
                    >
                      <div
                        className={`
                              rounded-full flex items-center ml-4 mr-4
                              ${isSelected
                            ? isAnswerChecked
                              ? isCorrect
                                ? "bg-[#C2E6B1]"
                                : "bg-red-100"
                              : "bg-[#3373b5]"
                            : "bg-white"
                          }`}
                      >
                        <RadioGroupItem
                          value={option.quiz_question_option_id.toString()}
                          id={`option-${option.quiz_question_option_id}`}
                          className={`
                                h-5 w-5 
                                ${isSelected
                              ? isAnswerChecked
                                ? isCorrect
                                  ? "border-green-500 ring-2 text-green-700 bg-green-500 ring-green-200"
                                  : "border-red-500 ring-2 text-red-700 ring-red-200"
                                : "border-[#3373b5] text-[#3373b5]"
                              : "border-gray-300"
                            }
            `}
                        />
                      </div>
                      <Label
                        htmlFor={`option-${option.quiz_question_option_id}`}
                        className={`flex-grow cursor-pointer h-16 text-md flex items-center
                          ${isSelected ? (isAnswerChecked ? (isCorrect ? "text-green-600 font-medium " : "text-red-600 font-medium") : "text-[#3373b5] font-medium") : ""}
                        `}
                      >
                        <MathRenderer content={option.option_text} />
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>

              {/* correct wrong answer banner */}
              {isAnswerChecked && (
                <div className="flex flex-col items-center">
                  <div
                    className={` p-4 w-[300px] text-center inline-block rounded-md ${isCorrect ? "bg-[#C2E6B1] text-black" : "bg-[#E87E7B] text-white"}`}
                  >
                    {isCorrect ? (
                      <div className="flex items-center">
                        <ThumbsUp className="mr-4" />
                        <div className="text-center">
                          <span className="font-bold">Correct!</span> Great Job
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <ThumbsDown className="mr-4" />
                        <div className="text-center">
                          <span className="font-bold">Wrong!</span> Better luck next time
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-8 bg-[#F7F8FA] p-4 rounded-bl-2xl rounded-br-2xl flex justify-between">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 bg-white hover:bg-gray-100 rounded-md"
                >
                  Skip
                </Button>
                <Button
                  className="bg-[#3373b5] hover:bg-[#2a5d92] rounded-full px-6"
                  onClick={() => checkAnswer(question)}
                  disabled={selectedOption === null}
                >
                  SUBMIT
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div
          className="bg-white border-l border-gray-200 flex flex-col overflow-auto"
          style={{ height: "calc(100vh - 342px)" }}
        >
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="mb-6">
                {message.sender === "user" ? (
                  <div className="mb-2">
                    <div className="flex items-center mb-2 relative top-4 left-[-6px]">
                      <div className="w-8 h-8 rounded-sm bg-amber-100 flex items-center justify-center overflow-hidden mr-2">
                        <User />
                      </div>
                      <div className="font-medium">You</div>
                      <div className="text-xs text-gray-500 ml-2">{message.timestamp}</div>
                      <button className="ml-auto">
                        <SquarePen size={14} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="text-sm pl-10">
                      <MathRenderer content={message.content} />
                    </div>
                  </div>
                ) : (
                  <div className="mb-2">
                    <div className="flex items-center mb-2 relative top-4 left-[-6px]">
                      <div className="w-8 h-8 rounded-sm bg-green-200 flex items-center justify-center mr-2">
                        <Bot />
                      </div>
                      <div className="font-medium">Response</div>
                      <div className="text-xs text-gray-500 ml-2">{message.timestamp}</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg text-sm whitespace-pre-wrap pl-10 py-4 pr-4">
                      <MathRenderer content={message.content} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="p-4 border-t border-gray-200">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <div className="flex items-center bg-white rounded-full border border-gray-300">
              <button className="p-3 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 19L17.5 17.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="p-3 text-gray-400 hover:text-gray-600"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingMath}
                title="Upload math image"
              >
                {isProcessingMath ? (
                  <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
                ) : (
                  <ImageIcon size={20} />
                )}
              </button>
              <button
                className="p-3 text-gray-400 hover:text-gray-600"
                onClick={() => setIsCanvasOpen(true)}
                disabled={isProcessingMath}
                title="Draw math expression"
              >
                <PencilIcon size={20} />
              </button>
              {speechSupported && (
                <button
                  className={`p-3 ${isListening ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"}`}
                  onClick={toggleListening}
                  title={isListening ? "Stop recording" : "Start recording"}
                >
                  {isListening ? (
                    <div className="relative">
                      <MicOff size={20} />
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </div>
                  ) : (
                    <Mic size={20} />
                  )}
                </button>
              )}
              <MathInputHelper onInsert={insertMathSymbol} />
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isListening ? "Listening..." : "Type math like x^2, sqrt(4), 1/2, or use $ for LaTeX..."}
                className={`flex-1 border-none focus:ring-0 py-3 px-3 text-sm ${isListening ? "bg-red-50" : ""}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              <button
                className={`p-3 ${newMessage.trim() ? "text-[#3373b5] hover:text-[#2a5d92]" : "text-gray-400"}`}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 2L11 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {isListening
                ? "Speak clearly... Click the microphone again to stop."
                : "Upload, draw, or dictate math expressions"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-gray-100 p-8 rounded-md">
        <h3 className="text-lg font-bold mb-4">Relevant links</h3>
        <div className="flex flex-wrap gap-4">
          {relevantLinks.map((link, index) => (
            <Link key={index} href={link.href} className="flex items-center text-sm text-gray-700 hover:text-[#3373b5]">
              <LinkIcon className="h-4 w-4 mr-1" />
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Drawing Canvas Dialog */}
      <Dialog open={isCanvasOpen} onOpenChange={setIsCanvasOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Draw Math Expression</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={550}
                height={300}
                className="touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  variant={currentTool.type === "pen" ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setCurrentTool({ ...currentTool, type: "pen" })}
                >
                  <PencilIcon size={16} />
                  <span>Pen</span>
                </Button>
                <Button
                  variant={currentTool.type === "eraser" ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setCurrentTool({ ...currentTool, type: "eraser" })}
                >
                  <Eraser size={16} />
                  <span>Eraser</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={clearCanvas}>
                  <Trash2 size={16} />
                  <span>Clear</span>
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsCanvasOpen(false)}
                >
                  <X size={16} />
                  <span>Cancel</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1 bg-[#3373b5] hover:bg-[#2a5d92]"
                  onClick={captureCanvas}
                  disabled={isProcessingMath}
                >
                  {isProcessingMath ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                  ) : (
                    <Check size={16} />
                  )}
                  <span>Recognize</span>
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Line Size:</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentTool.size}
                  onChange={(e) => setCurrentTool({ ...currentTool, size: Number.parseInt(e.target.value) })}
                  className="w-24"
                />
              </div>
              {currentTool.type === "pen" && (
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm">Color:</span>
                  <input
                    type="color"
                    value={currentTool.color}
                    onChange={(e) => setCurrentTool({ ...currentTool, color: e.target.value })}
                    className="w-8 h-8 p-0 border-0"
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

