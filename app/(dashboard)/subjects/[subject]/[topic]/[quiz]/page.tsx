import { notFound } from "next/navigation"
import QuizInterface from "@/components/quiz-interface"
import { getSubject, getTopic, getQuiz, getTopics, getQuizzes } from "@/lib/data"

export default function QuizPage({
  params,
}: {
  params: { subject: string; topic: string; quiz: string }
}) {
  console.log("Quiz page params:", params)

  const subject = getSubject(params.subject)

  // Try to find topic by ID first, then by title
  let topic = getTopic(params.subject, params.topic)

  if (!topic && params.subject === "arthematic") {
    const allTopics = getTopics(params.subject)
    topic = allTopics.find((t) => t.title === decodeURIComponent(params.topic) || t.id === params.topic)
  }

  // Try to find quiz by ID or title
  let quiz = getQuiz(topic?.id || params.topic, params.quiz)

  if (!quiz && topic) {
    const allQuizzes = getQuizzes(topic.id)
    quiz = allQuizzes.find((q) => q.title === params.quiz || q.id === params.quiz)
  }

  if (!subject || !topic || !quiz) {
    console.error("Not found:", { subject, topic, quiz, params })
    notFound()
  }

  return (
    <div>
      <div className="bg-[#1e74bb] text-white py-6 px-8 relative">
        <h1 className="text-xl font-medium">
          Quiz:- {quiz.title} ({quiz.currentQuestion} / {quiz.totalQuestions})
        </h1>

        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-white text-sm">
          {subject.category} / {subject.name} / {topic.title}
        </div>
      </div>

      <QuizInterface
        quiz={quiz}
        breadcrumb={{
          category: subject.category,
          subject: subject.name,
          topic: topic.title,
        }}
      />
    </div>
  )
}
