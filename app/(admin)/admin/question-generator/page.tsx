import QuestionGenerator from '@/components/admin/question-generator';

export default function QuestionGeneratorPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Question Generator</h1>
        <p className="text-muted-foreground mt-1">
          Generate quiz questions automatically from uploaded educational content
        </p>
      </div>

      <QuestionGenerator />
    </div>
  )
}
