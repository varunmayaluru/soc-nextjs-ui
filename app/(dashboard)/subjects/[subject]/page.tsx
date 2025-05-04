import Link from "next/link"

export default function SubjectPage({ params }: { params: { subject: string } }) {
  // Get subject name from the URL parameter
  const subjectName =
    params.subject === "arthematic"
      ? "Mathematics"
      : params.subject === "science"
        ? "Science"
        : params.subject === "english"
          ? "English"
          : params.subject === "social-studies"
            ? "Social Studies"
            : params.subject === "computer-science"
              ? "Computer Science"
              : params.subject === "hindhi"
                ? "Hindi"
                : params.subject

  return (
    <div>
      {/* Blue header banner */}
      <div className="bg-[#1e74bb] text-white p-8">
        <h1 className="text-2xl font-medium mb-2">Welcome to the {subjectName}</h1>
        <p>Select a topic below to explore concepts, examples, and practice quizzes.</p>
      </div>

      {/* Topics section */}
      <div className="p-6">
        <h2 className="text-xl font-medium mb-6">Topics</h2>

        {/* Topics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Arithmetic & Number Sense */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                <span className="text-green-600">📊</span>
              </div>
              <h3 className="text-gray-800 font-medium">Arithmetic & Number Sense (Foundation)</h3>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[#1e74bb] font-medium">10 Quizs</p>
              <Link
                href={`/subjects/${params.subject}/arithmetic-number-sense`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm"
              >
                Select a Quiz
              </Link>
            </div>
          </div>

          {/* Algebra */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600">📈</span>
              </div>
              <h3 className="text-gray-800 font-medium">Algebra</h3>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[#1e74bb] font-medium">
                10 Quizs <span className="text-gray-400 text-sm">/01 Completed</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/algebra`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm"
              >
                Select a Quiz
              </Link>
            </div>
          </div>

          {/* Geometry */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                <span className="text-orange-600">📏</span>
              </div>
              <h3 className="text-gray-800 font-medium">Geometry</h3>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[#1e74bb] font-medium">
                10 Quizs <span className="text-gray-400 text-sm">In a week</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/geometry`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm"
              >
                Select a Quiz
              </Link>
            </div>
          </div>

          {/* Trigonometry */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                <span className="text-green-600">📊</span>
              </div>
              <h3 className="text-gray-800 font-medium">Trigonometry</h3>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[#1e74bb] font-medium">10 Quizs</p>
              <Link
                href={`/subjects/${params.subject}/trigonometry`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm"
              >
                Select a Quiz
              </Link>
            </div>
          </div>

          {/* Statistics and Probability */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600">📈</span>
              </div>
              <h3 className="text-gray-800 font-medium">Statistics and Probability</h3>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[#1e74bb] font-medium">
                10 Quizs <span className="text-gray-400 text-sm">/12 Tasks</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/statistics-probability`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm"
              >
                Select a Quiz
              </Link>
            </div>
          </div>

          {/* Measurement */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                <span className="text-orange-600">📏</span>
              </div>
              <h3 className="text-gray-800 font-medium">Measurement</h3>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[#1e74bb] font-medium">
                10 Quizs <span className="text-gray-400 text-sm">In a week</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/measurement`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm"
              >
                Select a Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
