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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              title={quiz.title}
              description={quiz.description || "Test your knowledge with this quiz on " + topic.title}
              questions={quiz.totalQuestions || 10}
              minutes={quiz.estimatedTime || 15}
              difficulty={quiz.difficulty || "Beginner"}
              href={`/subjects/${params.subject}/${params.topic}/${quiz.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
