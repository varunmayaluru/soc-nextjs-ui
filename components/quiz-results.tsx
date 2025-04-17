import { CheckCircle, XCircle, FileQuestion, HelpCircle, GraduationCap } from "lucide-react"

export default function QuizResults({ quiz }: { quiz: any }) {
  return (
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <nav className="flex flex-wrap">
          {Array.from({ length: 20 }, (_, i) => {
            let color = "text-gray-600 hover:bg-gray-100"

            if (i < 12)
              color = "bg-green-500 text-white" // Correct
            else if (i >= 12 && i < 15)
              color = "bg-red-500 text-white" // Incorrect
            else if (i >= 15 && i < 17)
              color = "bg-gray-500 text-white" // No answer
            else if (i >= 17 && i < 19) color = "bg-amber-500 text-white" // AI helped

            return (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center mx-1 mb-2 rounded-md text-sm ${color}`}
              >
                {i + 1}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Corrected</h4>
            <p className="text-xl font-medium">13</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Incorrect</h4>
            <p className="text-xl font-medium">3</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <FileQuestion className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h4 className="text-sm text-gray-500">No Answer</h4>
            <p className="text-xl font-medium">2</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
            <HelpCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm text-gray-500">AI Helped</h4>
            <p className="text-xl font-medium">2</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center col-span-full">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Rank</h4>
            <p className="text-xl font-medium">13 / 20</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-6">
        <h2 className="text-2xl font-medium text-center mb-6">Algebra Fundamentals Quiz ?</h2>

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
          <button className="bg-[#1e74bb] text-white py-2 px-6 rounded-md">PREV</button>
          <button className="bg-[#1e74bb] text-white py-2 px-6 rounded-md">SUBMIT</button>
        </div>
      </div>
    </div>
  )
}
