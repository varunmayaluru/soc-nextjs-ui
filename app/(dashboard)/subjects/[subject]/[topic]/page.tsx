import { notFound } from "next/navigation"
import { getSubject, getTopic, getQuizzes } from "@/lib/data"
import QuizCard from "@/components/quiz-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

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

  // Icons for different quiz types
  const quizIcons = ["📊", "📈", "📏", "🧮", "📚", "🔍", "🧩", "🎯"]

  // Background colors for icons
  const iconBgs = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-red-100",
    "bg-orange-100",
  ]

  return (
    <div>
      <div className="bg-[#1e74bb] text-white p-8 relative">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/subjects">Subjects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/subjects/${params.subject}`}>{subject.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>{topic.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-medium text-gray-600 mb-6">Select a quiz to test your knowledge</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              title={quiz.title}
              description={quiz.description || "Test your knowledge with this quiz on " + topic.title}
              questions={quiz.totalQuestions || 10}
              minutes={quiz.estimatedTime || 15}
              difficulty={quiz.difficulty || "Beginner"}
              href={`/subjects/${params.subject}/${params.topic}/${quiz.id}`}
              icon={quiz.icon || quizIcons[index % quizIcons.length]}
              iconBg={quiz.iconBg || iconBgs[index % iconBgs.length]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
