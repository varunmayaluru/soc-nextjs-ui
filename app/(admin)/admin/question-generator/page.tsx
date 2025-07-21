import type { Metadata } from "next"
import QuestionGenerator from "@/components/admin/question-generator"
import AdminProtectedRoute from "@/components/admin-protected-route"

export const metadata: Metadata = {
  title: "Question Generator | Admin Dashboard",
  description: "Generate quiz questions from educational content using AI",
}

export default function QuestionGeneratorPage() {
  return (
    <AdminProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Question Generator</h1>
          <p className="text-muted-foreground mt-2">
            Upload educational content and generate quiz questions automatically using AI
          </p>
        </div>
        <QuestionGenerator />
      </div>
    </AdminProtectedRoute>
  )
}
