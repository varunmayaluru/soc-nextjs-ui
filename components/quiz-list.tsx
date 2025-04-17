import Link from "next/link"
import { getQuizzes } from "@/lib/data"

export default function QuizList({ topicId }: { topicId: string }) {
  const quizzes = getQuizzes(topicId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-md ${quiz.iconBg} flex items-center justify-center mr-3`}>
              <span className={`${quiz.iconColor}`}>{quiz.icon}</span>
            </div>
            <h3 className="text-gray-800 font-medium">{quiz.title}</h3>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{quiz.progress}%</span>
              <span className="text-gray-400 text-sm">
                {quiz.completedQuestions}/{quiz.totalQuestions} Questions
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`${quiz.progressColor} h-2 rounded-full`} style={{ width: `${quiz.progress}%` }}></div>
            </div>
          </div>

          <Link
            href={`/subjects/${quiz.subjectId}/${topicId}/${quiz.id}`}
            className="inline-block bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a67a7] transition-colors"
          >
            Start Quiz
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block ml-1"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
      ))}
    </div>
  )
}
