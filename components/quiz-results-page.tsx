import { CheckCircle, XCircle, FileQuestion, HelpCircle, GraduationCap, ArrowLeft, ArrowRight } from "lucide-react"

type QuizResultsPageProps = {
  quiz: {
    title: string
    totalQuestions: number
    subject: string
    category: string
    topic: string
  }
  results: {
    correct: number
    incorrect: number
    noAnswer: number
    aiHelped: number
    rank: number
  }
}

export default function QuizResultsPage({ quiz, results }: QuizResultsPageProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#1e74bb] text-white py-4 px-8">
        <h1 className="text-xl font-medium">
          Quiz:- {quiz.title} ({quiz.totalQuestions} / {quiz.totalQuestions})
        </h1>
        <div className="absolute top-4 right-8 text-white text-sm">
          {quiz.subject} / {quiz.category} / {quiz.topic}
        </div>
      </div>

      {/* Results summary */}
      <div className="bg-gray-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Corrected</h4>
              <p className="text-2xl font-medium text-green-600">{results.correct}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Incorrect</h4>
              <p className="text-2xl font-medium text-red-600">{results.incorrect}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <FileQuestion className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h4 className="text-sm text-gray-500">No Answer</h4>
              <p className="text-2xl font-medium text-gray-600">{results.noAnswer}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-3">
              <HelpCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm text-gray-500">AI Helped</h4>
              <p className="text-2xl font-medium text-amber-600">{results.aiHelped}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Rank</h4>
              <p className="text-2xl font-medium text-blue-600">
                {results.rank} <span className="text-sm text-gray-400">/ {quiz.totalQuestions}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quiz content */}
        <div className="bg-white rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-medium text-center mb-6">Algebra Fundamentals Quiz</h2>

          <div className="flex justify-center mb-8">
            <button className="bg-[#1e74bb] text-white py-2 px-6 rounded-md">QUIZ 20 TO 20</button>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex-shrink-0"></div>
              <span>Identify variables, constants, and coefficients</span>
            </div>

            <div className="bg-white border-2 border-[#1e74bb] rounded-lg p-4 flex items-center">
              <div className="w-6 h-6 rounded-full bg-[#1e74bb] mr-4 flex-shrink-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span>Simplify expressions like 3x + 5 - x + 2.</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex-shrink-0"></div>
              <span>Solve equations like 2y + 5 = 11.</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex-shrink-0"></div>
              <span>Translate word problems into simple algebraic</span>
            </div>
          </div>

          <div className="flex justify-between mt-10 max-w-2xl mx-auto">
            <button className="flex items-center bg-[#1e74bb] text-white py-2 px-6 rounded-md">
              <ArrowLeft className="h-4 w-4 mr-2" />
              PREV
            </button>
            <button className="flex items-center bg-[#1e74bb] text-white py-2 px-6 rounded-md">
              SUBMIT
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
