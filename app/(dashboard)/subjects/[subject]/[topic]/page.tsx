import { notFound } from "next/navigation"
import SchoolHeader from "@/components/school-header"
import QuizList from "@/components/quiz-list"
import { getSubject, getTopic } from "@/lib/data"

export default function TopicPage({
  params,
}: {
  params: { subject: string; topic: string }
}) {
  const subject = getSubject(params.subject)
  const topic = getTopic(params.subject, params.topic)

  if (!subject || !topic) {
    notFound()
  }

  return (
    <div>
      <div className="bg-[#1e74bb] text-white p-8">
        <h1 className="text-2xl font-medium mb-2">Welcome to the {subject.name}.</h1>
        <p>Select a topic below to explore concepts, examples, and practice quizzes.</p>

        <div className="absolute top-8 right-8 text-white">
          <span>
            {subject.category} / {subject.name}
          </span>
        </div>
      </div>

      <div className="p-6">
        <SchoolHeader title="School Name" />

        <h2 className="text-xl font-medium mt-6 mb-4">Quiz</h2>
        <QuizList topicId={params.topic} />
      </div>
    </div>
  )
}
