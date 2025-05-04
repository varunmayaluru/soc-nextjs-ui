import { notFound } from "next/navigation"
import QuizInterface from "@/components/quiz-interface"
import { getSubject, getTopic, getQuiz } from "@/lib/data"

export default function QuizPage({
  params,
}: {
  params: { subject: string; topic: string; quiz: string }
}) {
  const subject = getSubject(params.subject)
  const topic = getTopic(params.subject, params.topic)
  const quiz = getQuiz(params.topic, params.quiz)

  if (!subject || !topic || !quiz) {
    notFound()
  }

  // Format the breadcrumb path
  const breadcrumbPath = `${subject.name} / ${topic.title} / ${quiz.title || "Counting and Number Recognition"}`
  const quizInfo = `Quiz: ${quiz.title || "Counting and Number Recognition"} (Quiz ${quiz.currentQuestion || 1} of ${quiz.totalQuestions || 10})`

  return (
    <div>
      <div className="bg-[#1e74bb] text-white py-6 px-8 relative">
        <h1 className="text-xl font-medium">{breadcrumbPath}</h1>

        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-white text-sm">{quizInfo}</div>
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
