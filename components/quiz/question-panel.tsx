"use client"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, ThumbsDown, ThumbsUp, RotateCcw } from "lucide-react"
import { MathRenderer } from "@/components/math-renderer"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "../ui/breadcrumb"
import Link from "next/link"

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

interface QuizProgress {
  attempts_count: number
  latest_score: number
  best_score: number
  is_complete: boolean
}

interface QuestionPanelProps {
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
  isAnswerChecked: boolean
  isCorrect: boolean
  onOptionSelect: (optionId: number) => void
  onNavigate: (direction: "prev" | "next") => void
  onSubmit: () => void
  onQuestionSelect: (questionId: number) => void
  onRetakeQuiz: () => void
  showRetakeDialog: boolean
  setShowRetakeDialog: (show: boolean) => void
  isRetaking: boolean
  quizProgress: QuizProgress | null
}

export function QuestionPanel({
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
  isAnswerChecked,
  isCorrect,
  onOptionSelect,
  onNavigate,
  onSubmit,
  onQuestionSelect,
  onRetakeQuiz,
  showRetakeDialog,
  setShowRetakeDialog,
  isRetaking,
  quizProgress,
}: QuestionPanelProps) {
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
                <Link className="text-white text-md font-semibold" href={`/topics?subjectId=${subjectId}`}>
                  {subjectName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-white text-md font-semibold" href={`/quizzes?topicId=${topicId}&subjectId=${subjectId}`}>
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
            disabled={currentQuestionId === 1}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </Button>

          <h2 className="text-xl font-bold text-center flex-1 px-4">
            <MathRenderer content={`${currentQuestionId}. ${question.quiz_question_text}`} />
          </h2>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-[#1E74BB] hover:bg-[#1E74BB84] disabled:bg-gray-400 border-none h-12 w-12 flex items-center justify-center"
            onClick={() => onNavigate("next")}
            disabled={currentQuestionId === totalQuestions}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </Button>
        </div>

        {/* Options */}
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => onOptionSelect(Number.parseInt(value))}
          className="space-y-2 gap-1 px-4 py-4 justify-center"
        >
          {question.options.map((option) => {
            const isSelected = selectedOption === option.quiz_question_option_id
            const isCorrectOption = option.is_correct

            return (
              <div
                key={option.quiz_question_option_id}
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
                    value={option.quiz_question_option_id.toString()}
                    id={`option-${option.quiz_question_option_id}`}
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
                  htmlFor={`option-${option.quiz_question_option_id}`}
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

          {!isAnswerChecked && !isCorrect && !quizStatus && (
            <Button
              className="bg-[#3373b5] hover:bg-[#2a5d92] rounded-full px-6 disabled:opacity-50"
              onClick={onSubmit}
              disabled={selectedOption === null}
            >
              SUBMIT
            </Button>
          )}

          {quizStatus && (
            <Button
              className="bg-[#3373b5] hover:bg-[#2a5d92] rounded-full px-6 flex items-center gap-2"
              onClick={() => setShowRetakeDialog(true)}
            >
              <RotateCcw className="h-4 w-4" />
              Re Take
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
