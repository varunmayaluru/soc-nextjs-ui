import { notFound } from "next/navigation"
import Link from "next/link"
import { getSubject, getTopic, getQuizzes } from "@/lib/data"

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

  const quizzes = getQuizzes(params.topic)

  return (
    <div>
      <div className="bg-[#1e74bb] text-white p-8">
        <h1 className="text-2xl font-medium mb-2">Welcome to the {subject.name}</h1>
        <p>Select a topic below to explore concepts, examples, and practice quizzes.</p>

        <div className="absolute top-8 right-8 text-white">
          <span>
            {subject.category} / {subject.name}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-medium mt-6 mb-4">Quiz</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-md ${quiz.iconBg} flex items-center justify-center mr-3`}>
                  <span className={`${quiz.iconColor}`}>{quiz.icon}</span>
                </div>
                <h3 className="text-gray-800 font-medium">{quiz.title}</h3>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[#1e74bb] font-medium">
                  10 Quizs
                  {quiz.completedQuestions && (
                    <span className="text-gray-400 text-sm"> /{quiz.completedQuestions} Completed</span>
                  )}
                </p>
                <Link
                  href={`/subjects/${params.subject}/${params.topic}/${quiz.id}`}
                  className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm"
                >
                  Select a Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
