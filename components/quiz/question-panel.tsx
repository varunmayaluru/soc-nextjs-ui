"use client"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronLeft,
  ChevronRight,
  ThumbsDown,
  ThumbsUp,
  RotateCcw,
  Loader2,
  Circle,
  XCircle,
  CheckCircle,
  ImageIcon,
  PencilIcon,
} from "lucide-react"
import { MathRenderer } from "@/components/math-renderer"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "../ui/breadcrumb"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { MathInputHelper } from "@/components/math-input-helper"
import SpeechToTextInput from "@/components/speech-to-text-input"
import TextToSpeech from "@/components/TextToSpeech"
import { DrawingCanvas } from "@/components/quiz/drawing-canvas"
import { useMathInput } from "@/hooks/use-math-input"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Option {
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
  correct_answer?: string // For fill in the blank questions
  created_by: number
  create_date_time: string
  update_date_time: string | null
  options: Option[]
  short_answer_text?: string // For short answer questions
}

interface QuizProgress {
  attempts_count: number
  latest_score: number
  best_score: number
  is_complete: boolean
}

interface QuestionPanelProps {
  isTyping: boolean
  topicSlug: string
  subjectSlug: string
  subjectName: string
  topicName: string
  quizName: string
  subjectId: string
  topicId: string
  quizId: string
  quizStatus: boolean
  question: Question
  currentQuestionId: number | null
  totalQuestions: number
  paginationNumbers: number[]
  selectedOption: number | null
  textAnswer: string
  isAnswerChecked: boolean
  isCorrect: boolean
  onOptionSelect: (optionId: number) => void
  onTextAnswerChange: (answer: string) => void
  onNavigate: (direction: "prev" | "next") => void
  onSubmit: () => void
  onQuestionSelect: (questionId: number) => void
  showRetakeDialog: boolean
  setShowRetakeDialog: (show: boolean) => void
  isRetaking: boolean
  quizProgress: QuizProgress | null
  onRetakeQuiz?: () => void | Promise<void>
  onFinalSubmit?: () => void | Promise<void>
  isSubmitting?: boolean
  isLoading?: boolean
  allSelectedOptions?: { [questionNumber: string]: { selected: string; is_correct: boolean } }
  attemptNumber?: number | null
  answeredQuestionsCount?: number
  totalQuestionsCount?: number
  enableRetakeAndFinalSubmit?: boolean
}

export function QuestionPanel({
  isTyping,
  topicSlug,
  subjectSlug,
  subjectName,
  topicName,
  quizName,
  subjectId,
  topicId,
  quizId,
  quizStatus,
  question,
  currentQuestionId,
  totalQuestions,
  paginationNumbers,
  selectedOption,
  textAnswer,
  isAnswerChecked,
  isCorrect,
  onOptionSelect,
  onTextAnswerChange,
  onNavigate,
  onSubmit,
  onQuestionSelect,
  showRetakeDialog,
  setShowRetakeDialog,
  isRetaking,
  quizProgress,
  onRetakeQuiz,
  onFinalSubmit,
  isSubmitting = false,
  isLoading = false,
  allSelectedOptions = {},
  attemptNumber = null,
  answeredQuestionsCount = 0,
  totalQuestionsCount = 0,
  enableRetakeAndFinalSubmit = false,
}: QuestionPanelProps) {
  const searchParams = useSearchParams()
  const mode: string | null = searchParams.get("mode")
  const isReviewMode = mode === "review"

  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isProcessing: isProcessingMath, processImage: processMathImage } = useMathInput({
    onResult: (latex) => onTextAnswerChange(latex),
  })
  const [speechTranscript, setSpeechTranscript] = useState("")
  const [isUserTyping, setIsUserTyping] = useState(false)
  const speechResetRef = useRef<() => void>(() => { })
  const [isListening, setIsListening] = useState(false)

  // Clear selections when navigating to a different question
  useEffect(() => {
    // Check if current question has been answered before
    const currentQuestionAnswered = allSelectedOptions && allSelectedOptions[currentQuestionId?.toString() || ""]

    if (!currentQuestionAnswered) {
      // Only clear selections if this question hasn't been answered before
      if (selectedOption !== null) {
        onOptionSelect(-1) // Use -1 or null to indicate no selection
      }
      if (textAnswer !== "") {
        onTextAnswerChange("")
      }
    }
  }, [currentQuestionId]) // Only run when currentQuestionId changes

  // Handler for Mathpix image upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processMathImage(file)
    }
  }

  // Handler for drawing save
  const handleDrawingSave = (imageData: string) => {
    setShowDrawingCanvas(false)
    // Convert dataURL to File and process
    fetch(imageData)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "drawing.png", { type: "image/png" })
        processMathImage(file)
      })
  }

  // Handler for math symbol insert
  const handleInsertMathSymbol = (symbol: string) => {
    onTextAnswerChange(textAnswer + symbol)
  }

  // Handler for speech transcript
  const handleSpeechTranscript = (transcript: string, listening?: boolean) => {
    if (!isUserTyping) {
      if (transcript === "") {
        onTextAnswerChange("")
      } else {
        onTextAnswerChange(transcript)
      }
    }
    setSpeechTranscript(transcript)
    if (typeof listening === "boolean") setIsListening(listening)
  }

  if (isLoading || !question) {
    return (
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <Skeleton className=" bg-gray-200 h-8 w-1/2 mb-2" />
          <Skeleton className=" bg-gray-200 h-6 w-1/3 mb-4" />
          <Skeleton className=" bg-gray-200 h-16 w-full mb-2" />
          <Skeleton className=" bg-gray-200 h-16 w-full mb-2" />
          <div className="flex gap-2">
            <Skeleton className="bg-gray-200 h-10 w-24" />
            <Skeleton className="bg-gray-200 h-10 w-24" />
          </div>
        </div>
      </div>
    )
  }

  // Determine question type - if no options or question_type is fill_blank, treat as fill in the blank
  const isMultipleChoice = question.question_type === "mcq" && question.options && question.options.length > 0
  const isFillBlank = question.question_type === "sa" || !question.options || question.options.length === 0

  const renderQuestionInput = () => {
    if (isMultipleChoice) {
      // Render Multiple Choice Options
      return (
        <RadioGroup
          value={selectedOption !== null && selectedOption !== -1 ? selectedOption.toString() : ""}
          onValueChange={(value) => onOptionSelect(Number.parseInt(value))}
          className="space-y-2 gap-1 px-4 py-4 justify-center"
          disabled={isAnswerChecked}
        >
          {question.options.map((option) => {
            const isSelected = selectedOption === option.option_index
            const isCorrectOption = option.is_correct

            return (
              <div
                key={option.id}
                className={`border min-w-[600px] max-w-[750px] rounded-full flex items-center transition-all duration-200 ${isAnswerChecked ? "opacity-75" : ""
                  } ${isSelected
                    ? isAnswerChecked
                      ? isCorrectOption
                        ? "border-green-500 bg-green-50 border-2"
                        : "border-red-500 bg-red-50 border-2"
                      : "border-[#3373b5] bg-white border-2"
                    : "border-gray-200 bg-[#F1F1F1] hover:border-gray-300 hover:bg-white"
                  }`}
              >
                <div
                  className={`rounded-full flex items-center ml-4 mr-4 ${isSelected
                    ? isAnswerChecked
                      ? isCorrectOption
                        ? "bg-[#C2E6B1]"
                        : "bg-red-100"
                      : "bg-[#3373b5]"
                    : "bg-white"
                    }`}
                >
                  <RadioGroupItem
                    value={option.option_index.toString()}
                    id={`option-${option.option_index}`}
                    disabled={isAnswerChecked}
                    className={`h-5 w-5 ${isSelected
                      ? isAnswerChecked
                        ? isCorrectOption
                          ? "border-green-500 ring-2 text-green-700 bg-green-500 ring-green-200"
                          : "border-red-500 ring-2 text-red-700 ring-red-200"
                        : "border-[#3373b5] text-[#3373b5]"
                      : "border-gray-300"
                      } ${isAnswerChecked ? "cursor-not-allowed" : ""}`}
                  />
                </div>
                <Label
                  htmlFor={`option-${option.option_index}`}
                  className={`flex-grow h-16 text-md flex items-center transition-colors ${isAnswerChecked ? "cursor-not-allowed" : "cursor-pointer"
                    } ${isSelected
                      ? isAnswerChecked
                        ? isCorrectOption
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                        : "text-[#3373b5] font-medium"
                      : "hover:text-[#3373b5]"
                    }`}
                  onClick={isAnswerChecked ? (e) => e.preventDefault() : undefined}
                >
                  <MathRenderer content={option.option_text} />
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      )
    } else if (isFillBlank) {
      // Render Fill in the Blank Text Area with chat panel controls
      return (
        <div className="px-2 py-2 flex justify-center">
          <div className="min-w-[600px] max-w-[750px] w-full">
            <div className="mb-2 mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Fill in your answer below:</label>
              {/* Controls and input merged row - now styled like chat panel */}
              <div
                className={cn(
                  "flex items-center bg-white rounded-full border transition-all duration-200 gap-1",
                  isAnswerChecked && "pointer-events-none",
                  isListening && "ring-2 ring-violet-200 border-violet-300 shadow-lg",
                  isAnswerChecked && isCorrect && "border-green-500 bg-green-50",
                  isAnswerChecked && !isCorrect && "border-red-500 bg-red-50",
                  (!isAnswerChecked || isCorrect === undefined) && "border-gray-300 bg-white"
                )}
              >
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingMath || isAnswerChecked}
                  title="Upload math image"
                  type="button"
                >
                  {isProcessingMath ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon size={20} />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessingMath || isAnswerChecked}
                />
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                  onClick={() => setShowDrawingCanvas(true)}
                  disabled={isAnswerChecked}
                  title="Draw math expression"
                  type="button"
                >
                  <PencilIcon size={20} />
                </button>
                <div className="p-0.5">
                  <SpeechToTextInput
                    onTranscriptChange={(transcript) => handleSpeechTranscript(transcript, true)}
                    placeholder="Speak your answer..."
                    resetRef={speechResetRef}
                    disabled={isAnswerChecked}
                    variant="ghost"
                    className="border-none"
                  />
                </div>
                <MathInputHelper onInsert={handleInsertMathSymbol} disabled={isAnswerChecked} />
                <Textarea
                  placeholder="Type your answer here..."
                  value={textAnswer}
                  onChange={(e) => {
                    setIsUserTyping(true)
                    onTextAnswerChange(e.target.value)
                    setSpeechTranscript("")
                    if (speechResetRef.current) speechResetRef.current()
                  }}
                  onBlur={() => {
                    setIsUserTyping(false)
                    if (textAnswer === "") {
                      setSpeechTranscript("")
                      if (speechResetRef.current) speechResetRef.current()
                    }
                  }}
                  className={cn(
                    "flex-1 min-h-[32px] resize-none outline-none border-none focus:ring-0 py-2 px-2 text-sm transition-all duration-200 bg-transparent text-black placeholder-gray-400",
                    isListening && "bg-violet-50 text-violet-700 placeholder-violet-400"
                  )}
                  disabled={isAnswerChecked}
                />
              </div>
              {/* Show correct answer after submission for fill in the blank */}
              {isAnswerChecked && question.correct_answer && (
                <div className="mt-2 p-2 bg-gray-50 rounded border text-xs">
                  <span className="text-xs font-medium text-gray-700">Correct Answer: </span>
                  <MathRenderer content={question.correct_answer} />
                </div>
              )}
            </div>
            {showDrawingCanvas && (
              <DrawingCanvas
                onClose={() => setShowDrawingCanvas(false)}
                onSave={handleDrawingSave}
              />
            )}
          </div>
        </div>
      )
    }

    return null
  }

  const canSubmit = () => {
    if (isMultipleChoice) {
      return selectedOption !== null && selectedOption !== -1
    } else if (isFillBlank) {
      return textAnswer.trim() !== ""
    }
    return false
  }

  const getQuestionTypeLabel = () => {
    if (isMultipleChoice) return "Multiple Choice"
    if (isFillBlank) return "Short Answer"
    return "Question"
  }

  // Helper: determine correctness for a question
  const getQuestionStatus = (num: number) => {
    if (!allSelectedOptions || allSelectedOptions[num] === undefined) return null
    const q = question && question.quiz_id ? undefined : undefined // placeholder for type
    // Try to get the question object from the questions array if available
    // We'll assume the parent passes a questions array or you can get it from context if needed
    // For now, rely on question if it's the current one
    if (currentQuestionId === num && question) {
      if (question.question_type === "mcq") {
        const opt = question.options.find((o: any) => o.option_index === allSelectedOptions[num])
        if (opt) return opt.is_correct ? "correct" : "wrong"
      }
      // For short answer, you could add logic if correctness is tracked
    }
    // Otherwise, just show answered
    return "answered"
  }

  return (
    <div>
      {/* Restore original breadcrumb/banner at the top */}
      <div className="flex items-center justify-between bg-[#1e74bb] text-white px-8 py-6 relative">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link className="text-white text-md font-semibold" href="/">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  className="text-white text-md font-semibold"
                  href={`/topics?subjectId=${subjectId}&subjectSlug=${subjectSlug}&subjectName=${subjectName}`}
                >
                  {subjectName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white text-md font-semibold"
                href={`/quizzes?topicId=${topicId}&subjectId=${subjectId}&topicSlug=${topicSlug}&subjectSlug=${subjectSlug}&subjectName=${subjectName}&topicName=${topicName}`}
              >
                {topicName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-white text-md font-semibold">{quizName}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <span className="text-md font-semibold">
            [Quiz {currentQuestionId} of {totalQuestions} ]
          </span>
        </div>
      </div>
      {/* Main compact panel below breadcrumb */}
      <div className="flex flex-col min-h-[calc(100vh-224px)] bg-white">
        <div className="flex-1 flex flex-col">
          <div className="bg-white p-4 flex-1 flex flex-col overflow-y-auto">
            {/* Question pagination */}
            <div className="bg-white border-b border-t mb-4 border-gray-200 px-2 py-1">
              <div className="flex flex-wrap gap-1 overflow-x-auto pb-1">
                {paginationNumbers.map((num) => {
                  const status = getQuestionStatus(num)
                  const isCurrent = num === currentQuestionId
                  const isAnswered = allSelectedOptions[num] !== undefined
                  let btnClass =
                    "relative min-w-[36px] h-8 flex items-center justify-center transition-all duration-200 rounded-lg border-2 font-medium text-xs "
                  let icon = null
                  let tooltip = ""
                  if (isCurrent) {
                    btnClass += "text-white bg-[#3373b5] border-[#3373b5] shadow-lg transform scale-105 "
                    tooltip = "Current question"
                  } else if (isAnswered && isAnswerChecked) {
                    // Only show correct/wrong status after submit
                    if (status === "correct") {
                      btnClass += "text-green-800 border-green-500 bg-green-100 hover:bg-green-200 "
                      icon = <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-green-600" />
                      tooltip = "Correct answer"
                    } else if (status === "wrong") {
                      btnClass += "text-red-800 border-red-500 bg-red-100 hover:bg-red-200 "
                      icon = <XCircle className="w-4 h-4 absolute -top-1 -right-1 text-red-600" />
                      tooltip = "Incorrect answer"
                    } else {
                      btnClass += "text-blue-800 border-blue-400 bg-blue-100 hover:bg-blue-200 "
                      icon = <Circle className="w-3 h-3 absolute -top-1 -right-1 text-blue-600" />
                      tooltip = "Answered"
                    }
                  } else if (isAnswered) {
                    // Show answered status before submit
                    btnClass += "text-blue-800 border-blue-400 bg-blue-100 hover:bg-blue-200 "
                    icon = <Circle className="w-3 h-3 absolute -top-1 -right-1 text-blue-600" />
                    tooltip = "Answered"
                  } else {
                    btnClass +=
                      "text-gray-600 border-gray-300 bg-white hover:bg-gray-50 hover:border-[#3373b5] hover:text-[#3373b5] "
                    tooltip = "Unanswered"
                  }
                  return (
                    <div key={num} className="relative group">
                      <button
                        onClick={() => onQuestionSelect(num)}
                        className={btnClass}
                        aria-label={`Go to question ${num}${tooltip ? " - " + tooltip : ""}`}
                        title={tooltip}
                      >
                        {num}
                      </button>
                      {icon}
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {tooltip}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Question navigation header */}
            <div className="bg-[#F7F8FA] rounded-tl-2xl rounded-tr-2xl flex justify-between items-center mb-3 py-2 px-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#1E74BB] hover:bg-gray-400 disabled:bg-gray-400 border-none h-12 w-12 flex items-center justify-center"
                onClick={() => onNavigate("prev")}
                disabled={currentQuestionId === 1 || isTyping}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </Button>
              <div className="text-center flex-1 px-2">
                <h2 className="text-lg font-semibold mb-1">
                  <MathRenderer content={`${currentQuestionId}. ${question.quiz_question_text}`} />
                </h2>
                <div className="text-xs text-gray-600">{getQuestionTypeLabel()}</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#1E74BB] hover:bg-[#1E74BB84] disabled:bg-gray-400 border-none h-12 w-12 flex items-center justify-center"
                onClick={() => onNavigate("next")}
                disabled={currentQuestionId === totalQuestions || isTyping}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </Button>
            </div>
            {/* Dynamic Question Input */}
            <div className="mt-2 flex-1">{renderQuestionInput()}</div>
            {/* Answer feedback */}
            {isAnswerChecked && (
              <div className="flex flex-col items-center mt-2">
                <div
                  className={`p-2 w-[220px] text-center inline-block rounded-md transition-all duration-300 text-sm ${isCorrect ? "bg-[#C2E6B1] text-black" : "bg-[#E87E7B] text-white"
                    }`}
                >
                  {isCorrect ? (
                    <div className="flex items-center justify-center">
                      <ThumbsUp className="mr-4" />
                      <div className="text-center">
                        <span className="font-bold">Correct!</span> Great Job
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <ThumbsDown className="mr-4" />
                      <div className="text-center">
                        <span className="font-bold">Wrong!</span> Let's learn together
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Action buttons pinned to bottom */}
          <div className="bg-[#F7F8FA] p-8 rounded-bl-2xl rounded-br-2xl flex justify-between border-t border-gray-200">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-600 bg-white hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => onNavigate("next")}
              disabled={currentQuestionId === totalQuestions || isTyping}
            >
              Skip
            </Button>
            {/* Show SUBMIT for MCQ if not checked */}
            {isMultipleChoice && !isAnswerChecked && (
              <Button
                className="ml-2 bg-[#3373b5] hover:bg-[#2a5d92] rounded-full px-6 disabled:opacity-50"
                onClick={onSubmit}
                disabled={!canSubmit() || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Submitting...
                  </span>
                ) : (
                  "SUBMIT"
                )}
              </Button>
            )}
            {/* Only show Retake and Final Submit when all questions are answered */}
            {enableRetakeAndFinalSubmit && onRetakeQuiz && (
              <Button
                className="bg-[#3373b5] hover:bg-[#2a5d92] rounded-full px-6 flex items-center gap-2"
                onClick={onRetakeQuiz}
              >
                <RotateCcw className="h-4 w-4" />
                Re Take
              </Button>
            )}
            {enableRetakeAndFinalSubmit && onFinalSubmit && !isReviewMode && (
              <Button
                className="bg-green-600 hover:bg-green-700 rounded-full px-6 ml-4 text-white"
                onClick={onFinalSubmit}
              >
                Final Submit
              </Button>
            )}
            {/* Show review-specific actions if in review mode */}
            {isReviewMode && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md"
                  onClick={() => window.history.back()}
                >
                  Back to Quizzes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
