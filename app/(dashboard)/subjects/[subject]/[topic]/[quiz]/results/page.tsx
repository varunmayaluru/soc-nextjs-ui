import { notFound } from "next/navigation"
import QuizResultsPage from "@/components/quiz-results-page"
import { getSubject, getTopic, getQuiz, getTopics, getQuizzes } from "@/lib/data"

export default function QuizResultsPageWrapper({
  params,
}: {
  params: { subject: string; topic: string; quiz: string }
}) {
  // Log the params to help with debugging
  console.log("Results page params:", params)

  const subject = getSubject(params.subject)

  // The topic ID in the URL might be the full title instead of the ID
  // Let's try to find the topic by ID first, then by title if that fails
  let topic = getTopic(params.subject, params.topic)

  // If topic is not found, check if we're using the full title instead of ID
  if (!topic && params.subject === "arthematic") {
    // Get all topics for this subject
    const allTopics = getTopics(params.subject)
    // Try to find by title (decoding URL encoding)
    topic = allTopics.find((t) => t.title === decodeURIComponent(params.topic) || t.id === params.topic)
  }

  // Similarly for quiz, try to find by ID or title
  let quiz = getQuiz(topic?.id || params.topic, params.quiz)

  if (!quiz && topic) {
    const allQuizzes = getQuizzes(topic.id)
    quiz = allQuizzes.find((q) => q.title === params.quiz || q.id === params.quiz)
  }

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
