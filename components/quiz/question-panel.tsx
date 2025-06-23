"use client"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, ThumbsDown, ThumbsUp, RotateCcw } from "lucide-react"
import { MathRenderer } from "@/components/math-renderer"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "../ui/breadcrumb"
import Link from "next/link"

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
}: QuestionPanelProps) {
  // Guard: if question is undefined, show loading
  if (!question) {
    return <div className="p-6 text-center text-gray-500">Loading question...</div>;
  }

  // Determine question type - if no options or question_type is fill_blank, treat as fill in the blank
  const isMultipleChoice =
    question.question_type === "mcq" && question.options && question.options.length > 0
  const isFillBlank = question.question_type === "sa" || !question.options || question.options.length === 0

  const renderQuestionInput = () => {
    if (isMultipleChoice) {
      // Render Multiple Choice Options
      return (
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => onOptionSelect(Number.parseInt(value))}
          className="space-y-2 gap-1 px-4 py-4 justify-center"
        >
          {question.options.map((option) => {
            const isSelected = selectedOption === option.option_index
            const isCorrectOption = option.is_correct

            return (
              <div
                key={option.id}
                className={`border min-w-[600px] max-w-[750px] rounded-full flex items-center transition-all duration-200 ${isSelected
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
                    className={`h-5 w-5 ${isSelected
                      ? isAnswerChecked
                        ? isCorrectOption
                          ? "border-green-500 ring-2 text-green-700 bg-green-500 ring-green-200"
                          : "border-red-500 ring-2 text-red-700 ring-red-200"
                        : "border-[#3373b5] text-[#3373b5]"
                      : "border-gray-300"
                      }`}
                  />
                </div>
                <Label
                  htmlFor={`option-${option.option_index}`}
                  className={`flex-grow cursor-pointer h-16 text-md flex items-center transition-colors ${isSelected
                    ? isAnswerChecked
                      ? isCorrectOption
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                      : "text-[#3373b5] font-medium"
                    : "hover:text-[#3373b5]"
                    }`}
                >
                  <MathRenderer content={option.option_text} />
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      )
    } else if (isFillBlank) {
      // Render Fill in the Blank Text Area
      return (
        <div className="px-4 py-4 flex justify-center">
          <div className="min-w-[600px] max-w-[750px] w-full">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fill in your answer below:</label>

              <Textarea
                placeholder="Type your answer here..."
                value={textAnswer}
                onChange={(e) => {
                  onTextAnswerChange(e.target.value)
                  //textAnswer = e.target.value
                }}
                className={`w-full min-h-[120px] text-lg px-4 py-3 border-2 rounded-lg transition-all duration-200 resize-y ${isAnswerChecked
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : textAnswer
                    ? "border-[#3373b5] bg-white"
                    : "border-gray-200 bg-[#F1F1F1] focus:border-[#3373b5] focus:bg-white"
                  }`}
                disabled={isAnswerChecked}
              />

              {/* Show correct answer after submission for fill in the blank */}
              {isAnswerChecked && question.correct_answer && (
                <div className="mt-3 p-3 bg-gray-50 rounded border">
                  <span className="text-sm font-medium text-gray-700">Correct Answer: </span>
                  <MathRenderer content={question.correct_answer} />
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  const canSubmit = () => {
    if (isMultipleChoice) {
      return selectedOption !== null
    } else if (isFillBlank) {
      return textAnswer !== ""
    }
    return false
  }

  const getQuestionTypeLabel = () => {
    if (isMultipleChoice) return "Multiple Choice"
    if (isFillBlank) return "Short Answer"
    return "Question"
  }

  return (
    <div>
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

      <div className="bg-white p-6">
        {/* Question pagination */}
        <div className="bg-white border-b border-t mb-4 border-gray-200 px-4 pt-2 flex overflow-x-auto">
          {paginationNumbers.map((num) => (
            <button
              key={num}
              onClick={() => onQuestionSelect(num)}
              className={`min-w-[36px] h-9 flex items-center justify-center mx-1 transition-colors ${num === currentQuestionId
                ? "text-[#3373b5] font-bold border-b border-[#3373b5]"
                : "text-gray-500 hover:text-[#3373b5]"
                }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Question navigation header */}
        <div className="bg-[#F7F8FA] rounded-tl-2xl rounded-tr-2xl flex justify-between items-center mb-6 py-4 px-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-[#1E74BB] hover:bg-gray-400 disabled:bg-gray-400 border-none h-12 w-12 flex items-center justify-center"
            onClick={() => onNavigate("prev")}
            disabled={currentQuestionId === 1 || isTyping}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </Button>

          <div className="text-center flex-1 px-4">
            <h2 className="text-xl font-bold mb-2">
              <MathRenderer content={`${currentQuestionId}. ${question.quiz_question_text}`} />
            </h2>
            <div className="text-sm text-gray-600">{getQuestionTypeLabel()}</div>
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
        {renderQuestionInput()}

        {/* Answer feedback */}
        {isAnswerChecked && (
          <div className="flex flex-col items-center mt-6">
            <div
              className={`p-4 w-[300px] text-center inline-block rounded-md transition-all duration-300 ${isCorrect ? "bg-[#C2E6B1] text-black" : "bg-[#E87E7B] text-white"
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

        {/* Action buttons */}
        <div className="mt-8 bg-[#F7F8FA] p-4 rounded-bl-2xl rounded-br-2xl flex justify-between">
          <Button variant="outline" className="border-gray-300 text-gray-600 bg-white hover:bg-gray-100 rounded-md">
            Skip
          </Button>

          {!isAnswerChecked && (
            <Button
              className="bg-[#3373b5] hover:bg-[#2a5d92] rounded-full px-6 disabled:opacity-50"
              onClick={onSubmit}
              disabled={!canSubmit()}
            >
              SUBMIT
            </Button>
          )}

          {onRetakeQuiz && (
            <Button
              className="bg-[#3373b5] hover:bg-[#2a5d92] rounded-full px-6 flex items-center gap-2"
              onClick={onRetakeQuiz}
            >
              <RotateCcw className="h-4 w-4" />
              Re Take
            </Button>
          )}

          {/* Final Submit button: show only if all questions are answered and not completed */}
          {onFinalSubmit && !isAnswerChecked && (
            <Button
              className="bg-green-600 hover:bg-green-700 rounded-full px-6 ml-4 text-white"
              onClick={onFinalSubmit}
              disabled={false /* You can add logic to disable if not all questions answered */}
            >
              Final Submit
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}
