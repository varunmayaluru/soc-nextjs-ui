import { notFound } from "next/navigation"
import QuizResultsPage from "@/components/quiz-results-page"
import { getSubject, getTopic, getQuiz } from "@/lib/data"

export default function QuizResultsPageWrapper({
  params,
}: {
  params: { subject: string; topic: string; quiz: string }
}) {
  // Log the params to help with debugging
  console.log("Results page params:", params)

  const subject = getSubject(params.subject)
  const topic = getTopic(params.subject, params.topic)
  const quiz = getQuiz(topic?.id || params.topic, params.quiz)

  if (!subject || !topic || !quiz) {
    console.error("Not found:", { subject, topic, quiz, params })
    notFound()
  }

  // Mock results data
  const results = {
    correct: 13,
    incorrect: 3,
    noAnswer: 2,
    aiHelped: 2,
    rank: 13,
  }

  return (
    <QuizResultsPage
      quiz={{
        title: quiz.title,
        totalQuestions: 20,
        subject: subject.category,
        category: subject.name,
        topic: topic.title,
      }}
      results={results}
    />
  )
}
