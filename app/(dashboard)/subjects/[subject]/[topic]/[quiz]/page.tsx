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

  return (
    <div>
      <div className="bg-[#1e74bb] text-white py-6 px-8 relative">
        <h1 className="text-xl font-medium">Mathematics / Athematic / Counting and Number Recognition</h1>

        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-white text-sm">
          Quiz: Counting and Number Recognition (Quiz 1 of 10)
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
