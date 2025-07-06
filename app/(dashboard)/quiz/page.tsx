"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import QuizCompletion from "@/components/quiz/quiz-completion"
import { useQuizChat } from "@/hooks/use-quiz-chat"
import { secureApi } from "@/lib/secure-api-client"
import { QuestionPanel } from "@/components/quiz/question-panel"
import { ChatPanel } from "@/components/quiz/chat-panel"
import { QuestionPanelSkeleton } from "@/components/quiz/QuestionPanelSkeleton"
import { ChatPanelSkeleton } from "@/components/quiz/ChatPanelSkeleton"

// Define the Question interface
interface Question {
  question_number: number
  quiz_question_text: string
  options: {
    id: number
    option_text: string
    is_correct: boolean
    option_index: number
    organization_id: string
  }[]
  correct_answer?: string
  quiz_id: string
  organization_id: string
  difficulty_level: string
  question_type: string
  short_answer_text?: string | null
  is_active: boolean
  is_maths: boolean
  created_by: string
  create_date_time: string
  update_date_time: string
}

interface SingleQuizProgress {
  user_id: string
  subject_id: string
  topic_id: string
  quiz_id: string
  attempt_number: number
  current_question: number
  total_questions: number
  answered_questions: number
  score: number
  time_spent: number
  completed: boolean
  answers: { [questionId: string]: { selected: string; is_correct: boolean } }
  id: number
  started_at: string
  updated_at: string
}

type QuizProgressResponse = {
  [key: string]: {
    user_id: string
    subject_id: string
    topic_id: string
    quiz_id: string
    attempt_number: number
    current_question: number
    total_questions: number
    answered_questions: number
    score: number
    time_spent: number
    completed: boolean
    answers: {
      [questionId: string]: { selected: string; is_correct: boolean }
    }
    id: number
    started_at: string
    updated_at: string
  }
}

interface FinalSubmissionResponse {
  quiz_id: string
  subject_id: string
  topic_id: string
  answers: { [key: string]: { selected: string; is_correct: boolean } }
  score: number
  total_questions: number
  time_spent: number
  attempt_number: number
  id: number
  user_id: string
  submitted_at: string
}

// Define the Quiz interface
interface Quiz {
  quizId: number
  title: string
  description: string
  total_questions: number
  questions: Question[]
}

interface Subject {
  organization_id: number
  subject_id: number
  subject_name: string
  is_active: boolean
  created_by: number
  create_date_time: number
  update_date_time: number
}

interface Topic {
  organization_id: number
  subject_id: number
  topic_id: number
  topic_name: string
  is_active: boolean
  created_by: number
  create_date_time: number
  update_date_time: number
}

interface quizSummary {
  attempt_id: number
  question_number: number
  question_is_complete: boolean
  quiz_status: string
}

interface answers {
  organization_id: number
  user_id: number
  subject_id: number
  topic_id: number
  quiz_id: number
  question_number: number
  attempt_id: number
  answer_text: string
  answer_choice_id: number
  submitted_at: ""
  is_correct: boolean
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true)
  const [isProgressLoading, setIsProgressLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [currentquestionId, setCurrentquestionId] = useState<number | null>(1)
  const [quizStatus, setQuizStatus] = useState<boolean>(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])

  // Inline state for question/answer/chat logic
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [allSelectedOptions, setAllSelectedOptions] = useState<{
    [questionNumber: string]: { selected: string; is_correct: boolean }
  }>({})
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const [showRetakeDialog, setShowRetakeDialog] = useState(false)
  const [isRetaking, setIsRetaking] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [totalQuizTime, setTotalQuizTime] = useState<number>(0)
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({})
  const [selectedOptionData, setSelectedOptionData] = useState<any>(undefined)
  const [textAnswer, setTextAnswer] = useState<string>("")

  // Add a state to store the original progress.answers from progress/single
  const [progressAnswers, setProgressAnswers] = useState<{
    [questionNumber: string]: { selected: string; is_correct: boolean }
  }>({})

  // Add state to track short answer correctness
  const [shortAnswerCorrectness, setShortAnswerCorrectness] = useState<{ [questionNumber: number]: boolean }>({})

  const [finalSubmissionData, setFinalSubmissionData] = useState<FinalSubmissionResponse | null>(null)

  const searchParams = useSearchParams() // query params
  const subjectId = searchParams.get("subjectId")
  const topicId = searchParams.get("topicId")
  const quizId = searchParams.get("quizId")
  const topicSlug = searchParams.get("topicSlug")
  const subjectSlug = searchParams.get("subjectSlug")
  const quizName = searchParams.get("quizName")
  const totalQuizQuestions = searchParams.get("totalQuizQuestions")
  const subjectName = searchParams.get("subjectName")
  const topicName = searchParams.get("topicName")
  const currentQuestionParam = searchParams.get("currentQuestion")
  const subject = null as unknown as Subject
  const topic = null as unknown as Topic
  const userId = localStorage.getItem("userId")
  const organizationId = localStorage.getItem("organizationId")

  // Get the current question from the questions array
  const currentQuestion =
    questions && currentquestionId ? questions.find((q: any) => q.question_number === currentquestionId) : null

  const { messages, isTyping, sendMessage, initializeChat, resetChat } = useQuizChat({
    currentQuestionId: currentquestionId,
    attemptId,
    selectedOptionData,
    question: currentQuestion,
    selectedOption,
    contextAnswer: "",
    quizId: quizId?.toString() || "",
    subjectId: subjectId?.toString() || "",
    topicId: topicId?.toString() || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [answeredQuestionsCount, setAnsweredQuestionsCount] = useState(0)
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0)

  useEffect(() => {
    // Fetch all questions for the quiz on mount
    const fetchAllQuestions = async () => {
      try {
        setIsQuestionsLoading(true)
        setError(null)
        const response = await api.get<any[]>(
          `questions/questions/quiz-questions?quiz_id=${quizId}&organization_id=${organizationId}`,
        )
        if (response.ok && response.data) {
          setQuestions(response.data)
          // Set current question from param if present
          if (currentQuestionParam) {
            setCurrentquestionId(Number(currentQuestionParam))
          }
        } else {
          throw new Error("Failed to fetch questions")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load questions")
      } finally {
        setIsQuestionsLoading(false)
      }
    }
    fetchAllQuestions()
  }, [quizId, organizationId, subjectId, topicId, currentQuestionParam])

  useEffect(() => {
    const fetchQuizProgress = async () => {
      setIsProgressLoading(true)
      setError(null)
      try {
        const result = await api.get<SingleQuizProgress>(
          `quiz-progress/quiz-progress/single?quiz_id=${quizId}&subject_id=${subjectId}&topic_id=${topicId}&user_id=${userId}`,
        )
        if (result.ok && result.data) {
          const progress = result.data
          setAnsweredQuestionsCount(progress.answered_questions || 0)
          setTotalQuestionsCount(progress.total_questions || 0)

          if (progress.attempt_number) {
            setAttemptId(progress.attempt_number)
          }

          // Find first skipped question
          const answeredNumbers = Object.keys(progress.answers || {}).map(Number)
          let targetQuestion = null
          for (let i = 1; i <= progress.total_questions; i++) {
            if (!answeredNumbers.includes(i)) {
              targetQuestion = i
              break
            }
          }
          if (!targetQuestion) {
            targetQuestion = progress.current_question || 1
          }
          setCurrentquestionId(targetQuestion)

          // Store all answers in state with new format
          if (progress.answers && Object.keys(progress.answers).length > 0) {
            setAllSelectedOptions(progress.answers)
            setProgressAnswers(progress.answers)
            // Set selectedOption for the current question
            const answerForCurrent = progress.answers[targetQuestion.toString()]
            if (answerForCurrent !== undefined) {
              // Find the current question to check its type
              const currentQ = questions.find((q: any) => q.question_number === targetQuestion)
              if (currentQ?.question_type === "sa") {
                setTextAnswer(answerForCurrent.selected)
                setSelectedOption(null) // Not applicable for short answers
              } else {
                setSelectedOption(Number.parseInt(answerForCurrent.selected))
                setTextAnswer("")
              }
            } else {
              setSelectedOption(null)
              setTextAnswer("")
            }
          } else {
            setAllSelectedOptions({})
            setProgressAnswers({})
            setSelectedOption(null)
            setTextAnswer("")
          }
        }
      } catch (err) {
        setError("Failed to load quizzes")
      } finally {
        setIsProgressLoading(false)
      }
    }
    if (userId) fetchQuizProgress()
  }, [userId, quizId, subjectId, topicId, questions])

  useEffect(() => {
    if (currentquestionId && allSelectedOptions && questions.length > 0) {
      const answer = allSelectedOptions[currentquestionId.toString()]
      const q = questions.find((q) => q.question_number === currentquestionId)
      const hasProgressAnswer =
        progressAnswers && Object.prototype.hasOwnProperty.call(progressAnswers, currentquestionId.toString())

      if (answer !== undefined) {
        if (q && q.question_type === "sa") {
          setTextAnswer(answer.selected)
          setSelectedOption(null)
        } else {
          setSelectedOption(Number.parseInt(answer.selected))
          setTextAnswer("")
        }

        if (hasProgressAnswer) {
          setIsAnswerChecked(true)
          setIsCorrect(answer.is_correct)
        } else {
          setIsAnswerChecked(false)
          setIsCorrect(false)
        }
      } else {
        setSelectedOption(null)
        setTextAnswer("")
        setIsAnswerChecked(false)
        setIsCorrect(false)
      }
    }
  }, [currentquestionId, allSelectedOptions, questions, progressAnswers])

  // When user answers a question, update allSelectedOptions
  const handleSelectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    // Don't set is_correct here, wait for submission
    setAllSelectedOptions((prev) => ({
      ...prev,
      [currentquestionId!.toString()]: { selected: optionIndex.toString(), is_correct: false },
    }))
    setIsAnswerChecked(false)
  }

  // Wrapper function for question selection that also resets chat
  const handleQuestionSelect = (questionId: number) => {
    setCurrentquestionId(questionId)
    setIsAnswerChecked(false)
    setIsCorrect(false)
    setSelectedOption(null)
    setTextAnswer("")
    setSelectedOptionData(undefined)
    resetChat()

    // Load the answer for the selected question if it exists
    const answer = allSelectedOptions[questionId.toString()]
    if (answer) {
      const q = questions.find((q) => q.question_number === questionId)
      if (q && q.question_type === "sa") {
        setTextAnswer(answer.selected)
      } else {
        setSelectedOption(Number.parseInt(answer.selected))
      }

      // Check if this answer was from original progress
      const hasProgressAnswer =
        progressAnswers && Object.prototype.hasOwnProperty.call(progressAnswers, questionId.toString())
      if (hasProgressAnswer) {
        setIsAnswerChecked(true)
        setIsCorrect(answer.is_correct)
      }
    }
  }

  // Unified handleSubmit logic (includes chat APIs and quiz progress update)
  const handleSubmit = async () => {
    setIsSubmitting(true)
    let selectedOptionArray: any = undefined
    let isUserAnswer = true
    let correct_answer =
        currentQuestion.question_type === "sa"
          ? currentQuestion.short_answer_text
          : currentQuestion.options.find((option:any) => option.is_correct)?.option_text;
      console.log("Correct answer:", correct_answer);
    if (currentQuestion?.question_type === "sa") {
      const payload = {
        question_text: currentQuestion?.quiz_question_text || "",
        contextual_answer: currentQuestion?.short_answer_text || "",
        correct_answer: correct_answer,
        user_answer: textAnswer,
        model: "gpt-4o",
      }
      const result = await secureApi.post<any>("/genai/answer-evaluation/answer/evaluate", payload)
      if (result.ok) {
        const evaluation = result.data
        setIsCorrect(evaluation.is_correct)
        isUserAnswer = evaluation.is_correct
        setShortAnswerCorrectness((prev) => ({ ...prev, [currentquestionId!]: evaluation.is_correct }))
      } else {
        setIsSubmitting(false)
        return
      }
    } else {
      if (selectedOption === null || !currentQuestion || isAnswerChecked) {
        setIsSubmitting(false)
        return
      }
      selectedOptionArray = currentQuestion.options.find((option: any) => option.option_index === selectedOption)
      setSelectedOptionData(selectedOptionArray)
      setIsCorrect(selectedOptionArray?.is_correct || false)
    }

    const questionCompletionTime = Math.floor((Date.now() - questionStartTime) / 1000)
    setQuestionTimes((prev) => ({ ...prev, [currentquestionId!]: questionCompletionTime }))
    setTotalQuizTime((prev) => prev + questionCompletionTime)

    try {
      // Create the current answer object with new format
      const currentAnswerObj = {
        selected: currentQuestion?.question_type === "sa" ? textAnswer : selectedOption!.toString(),
        is_correct: currentQuestion?.question_type === "sa" ? isUserAnswer : selectedOptionArray?.is_correct || false,
      }

      const mergedAnswers = {
        ...progressAnswers,
        ...allSelectedOptions,
        [currentquestionId!.toString()]: currentAnswerObj,
      }

      const answeredQuestionsCountAfter = Object.keys(mergedAnswers).length
      let score = 0

      // Calculate score using the new format
      for (const [qNum, ansObj] of Object.entries(mergedAnswers)) {
        if (ansObj.is_correct) score++
      }

      const isLastAnswer = totalQuestionsCount > 0 && answeredQuestionsCountAfter === totalQuestionsCount

      const payload = {
        current_question: currentquestionId,
        total_questions: Number(totalQuizQuestions),
        answered_questions: answeredQuestionsCountAfter,
        score: score,
        time_spent: totalQuizTime,
        completed: isLastAnswer,
        answers: mergedAnswers,
        attempt_number: attemptId || 1,
      }

      const result = await api.put<any>(
        `quiz-progress/quiz-progress/?quiz_id=${quizId}&subject_id=${subjectId}&topic_id=${topicId}&user_id=${userId}`,
        payload,
      )
      if (result.ok) {
        console.log("Quiz progress updated successfully")
        setAllSelectedOptions(mergedAnswers)
        setProgressAnswers(mergedAnswers)
        await fetchAndSetQuizProgressCounts()
      } else {
        console.error("Failed to update quiz progress")
      }
    } catch (error) {
      console.error("Error checking answer:", error)
    }

    setIsAnswerChecked(true)
    if (currentQuestion?.question_type === "sa") {
      if (!isUserAnswer) {
        await initializeChat(textAnswer)
      }
    } else {
      if (!selectedOptionArray?.is_correct) {
        await initializeChat(selectedOptionArray?.option_text || "")
      }
    }
    setIsSubmitting(false)
  }

  const handleNavigate = async (dir: "next" | "prev") => {
    let newQuestionId = currentquestionId
    if (dir === "next" && currentquestionId && currentquestionId < Number(totalQuizQuestions)) {
      newQuestionId = currentquestionId + 1
      setCurrentquestionId(newQuestionId)
    }
    if (dir === "prev" && currentquestionId && currentquestionId > 1) {
      newQuestionId = currentquestionId - 1
      setCurrentquestionId(newQuestionId)
    }

    setIsAnswerChecked(false)
    setIsCorrect(false)
    setSelectedOption(null)
    setTextAnswer("")
    setSelectedOptionData(undefined)

    // Reset chat when navigating to a new question
    resetChat()

    // Load the answer for the new question if it exists
    if (newQuestionId !== null) {
      const answer = allSelectedOptions[newQuestionId.toString()]
      if (answer) {
        const q = questions.find((q) => q.question_number === newQuestionId)
        if (q && q.question_type === "sa") {
          setTextAnswer(answer.selected)
        } else {
          setSelectedOption(Number.parseInt(answer.selected))
        }

        // Check if this answer was from original progress
        const hasProgressAnswer =
          progressAnswers && Object.prototype.hasOwnProperty.call(progressAnswers, newQuestionId.toString())
        if (hasProgressAnswer) {
          setIsAnswerChecked(true)
          setIsCorrect(answer.is_correct)
        }
      }
    }
  }

  // Chat input state
  const [chatInput, setChatInput] = useState("")
  const handleSendChat = () => {
    if (chatInput.trim() && isAnswerChecked && !isCorrect) {
      sendMessage(chatInput)
      setChatInput("")
    }
  }

  // Function to start a new quiz attempt (for retake)
  const handleRetakeQuiz = async () => {
    try {
      const payload = {
        quiz_id: quizId,
        subject_id: subjectId,
        topic_id: topicId,
      }
      const response = await api.post<any>(`quiz-attempts/quiz-attempts/start?user_id=${userId}`, payload)
      if (response.ok && response.data && response.data.attempt_number) {
        setAttemptId(response.data.attempt_number)
        setAllSelectedOptions({})
        setProgressAnswers({})
        setSelectedOption(null)
        setIsAnswerChecked(false)
        setIsCorrect(false)
        setTextAnswer("")
        setSelectedOptionData(undefined)
        setCurrentquestionId(1)
        setAnsweredQuestionsCount(0)
        // Re-fetch progress for the new attempt to update counts
        await fetchAndSetQuizProgressCounts()
      }
    } catch (error) {
      console.error("Failed to start new quiz attempt", error)
    }
  }

  const handleFinalSubmit = async () => {
    const mergedAnswers = { ...progressAnswers, ...allSelectedOptions }
    const answeredQuestionsCount = Object.keys(mergedAnswers).length
    let score = 0

    // Calculate score using the new format
    for (const [qNum, ansObj] of Object.entries(mergedAnswers)) {
      if (ansObj.is_correct) score++
    }

    const QuizCompletePayload = {
      current_question: currentquestionId,
      total_questions: Number(totalQuizQuestions),
      answered_questions: answeredQuestionsCount,
      score: score,
      time_spent: totalQuizTime,
      completed: true,
      answers: mergedAnswers,
      attempt_number: attemptId || 1,
    }

    try {
      const result = await api.put<any>(
        `quiz-progress/quiz-progress/?quiz_id=${quizId}&subject_id=${subjectId}&topic_id=${topicId}&user_id=${userId}`,
        QuizCompletePayload,
      )
      if (result.ok) {
        console.log("Quiz final submission successful")
        setAllSelectedOptions(mergedAnswers)
        setProgressAnswers(mergedAnswers)
      } else {
        console.error("Quiz final submission failed")
      }
    } catch (error) {
      console.error("Error in final submission:", error)
    }

    const payload = {
      subject_id: subjectId,
      topic_id: topicId,
      quiz_id: quizId,
      attempt_number: attemptId || 1,
      total_questions: Number(totalQuizQuestions),
      answered_questions: answeredQuestionsCount,
      score: score,
      time_spent: totalQuizTime,
      answers: mergedAnswers,
      id: undefined,
      started_at: undefined,
      updated_at: undefined,
    }

    try {
      const result = await api.post<any>(`quiz-submissions/quiz-submissions/?user_id=${userId}`, payload)
      if (result.ok && result.data) {
        setFinalSubmissionData(result.data)
        setQuizCompleted(true)

      } else {
        console.error("Quiz final submission failed")
      }
    } catch (error) {
      console.error("Error in final submission:", error)
    }
  }

  const fetchAndSetQuizProgressCounts = async () => {
    try {
      const result = await api.get<SingleQuizProgress>(
        `quiz-progress/quiz-progress/single?quiz_id=${quizId}&subject_id=${subjectId}&topic_id=${topicId}&user_id=${userId}`,
      )
      if (result.ok && result.data) {
        setAnsweredQuestionsCount(result.data.answered_questions || 0)
        setTotalQuestionsCount(result.data.total_questions || 0)
      }
    } catch (err) {
      // Optionally handle error
    }
  }

  const handleTextAnswerChange = (value: string) => {
    setTextAnswer(value)
    // Update allSelectedOptions for short answer questions
    if (currentQuestion?.question_type === "sa") {
      setAllSelectedOptions((prev) => ({
        ...prev,
        [currentquestionId!.toString()]: { selected: value, is_correct: false },
      }))
    }
    setIsAnswerChecked(false)
  }

  if (isQuestionsLoading || isProgressLoading) {
    return (
      <div className="mx-auto bg-white " style={{ height: "calc(100vh - 200px)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
          <QuestionPanelSkeleton />
          <ChatPanelSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <button onClick={() => window.location.reload()} className="ml-2 underline hover:no-underline">
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <>
      {quizCompleted && finalSubmissionData && (
        <QuizCompletion
          score={finalSubmissionData.score}
          totalQuestions={finalSubmissionData.total_questions}
          timeSpent={String(finalSubmissionData.time_spent)}
          subject={subjectName || ""}
          quizTitle={quizName || ""}
          attemptNumber={finalSubmissionData.attempt_number}
          submittedAt={finalSubmissionData.submitted_at}
          answers={finalSubmissionData.answers}
          questions={questions}
        />
      )}
      {!quizCompleted && (
        <div className="mx-auto bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left: QuestionPanel */}
            <QuestionPanel
              isTyping={isTyping}
              topicSlug={topicSlug || ""}
              subjectSlug={subjectSlug || ""}
              subjectName={subjectName || ""}
              topicName={topicName || ""}
              quizName={quizName || ""}
              subjectId={subjectId?.toString() || ""}
              topicId={topicId?.toString() || ""}
              quizId={quizId?.toString() || ""}
              quizStatus={quizStatus}
              question={currentQuestion}
              currentQuestionId={currentquestionId}
              totalQuestions={Number(totalQuizQuestions)}
              paginationNumbers={Array.from({ length: Number(totalQuizQuestions) }, (_, i) => i + 1)}
              selectedOption={selectedOption}
              textAnswer={textAnswer}
              isAnswerChecked={isAnswerChecked}
              isCorrect={isCorrect}
              onOptionSelect={handleSelectOption}
              onTextAnswerChange={handleTextAnswerChange}
              onNavigate={handleNavigate}
              onSubmit={handleSubmit}
              onQuestionSelect={handleQuestionSelect}
              showRetakeDialog={showRetakeDialog}
              setShowRetakeDialog={setShowRetakeDialog}
              isRetaking={isRetaking}
              quizProgress={null}
              onRetakeQuiz={handleRetakeQuiz}
              onFinalSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
              isLoading={isQuestionsLoading || isProgressLoading}
              allSelectedOptions={allSelectedOptions}
              attemptNumber={attemptId}
              answeredQuestionsCount={answeredQuestionsCount}
              totalQuestionsCount={totalQuestionsCount}
              enableRetakeAndFinalSubmit={answeredQuestionsCount === totalQuestionsCount && totalQuestionsCount > 0}
            />
            {/* Right: ChatPanel */}
            <ChatPanel
              messages={messages}
              isTyping={isTyping}
              onSendMessage={sendMessage}
              disabled={!isAnswerChecked}
            />
          </div>
        </div>
      )}
    </>
  )
}
