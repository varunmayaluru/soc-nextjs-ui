import { notFound } from "next/navigation"
import SchoolHeader from "@/components/school-header"
import TopicsList from "@/components/topics-list"
import { getSubject } from "@/lib/data"

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = getSubject(params.subject)

  if (!subject) {
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

        <h2 className="text-xl font-medium mt-6 mb-4">Topics</h2>
        <TopicsList subjectId={params.subject} />
      </div>
    </div>
  )
}
