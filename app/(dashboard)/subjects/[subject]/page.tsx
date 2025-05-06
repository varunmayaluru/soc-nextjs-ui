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
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center mb-4 relative">
              <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-green-600 text-lg">📊</span>
              </div>
              <h3 className="text-gray-800 font-semibold text-lg group-hover:text-[#1e74bb] transition-colors duration-300">
                Arithmetic & Number Sense (Foundation)
              </h3>
            </div>

            <div className="flex items-center justify-between relative">
              <p className="text-[#1e74bb] font-medium flex items-center">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs mr-2">10 Quizzes</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/arithmetic-number-sense`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm flex items-center group-hover:bg-[#1a67a7] transition-all duration-300"
              >
                Select a Quiz
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Algebra */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center mb-4 relative">
              <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600 text-lg">📈</span>
              </div>
              <h3 className="text-gray-800 font-semibold text-lg group-hover:text-[#1e74bb] transition-colors duration-300">
                Algebra
              </h3>
            </div>

            <div className="flex items-center justify-between relative">
              <p className="text-[#1e74bb] font-medium flex items-center">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs mr-2">10 Quizzes</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/algebra`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm flex items-center group-hover:bg-[#1a67a7] transition-all duration-300"
              >
                Select a Quiz
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Geometry */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center mb-4 relative">
              <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-orange-600 text-lg">📏</span>
              </div>
              <h3 className="text-gray-800 font-semibold text-lg group-hover:text-[#1e74bb] transition-colors duration-300">
                Geometry
              </h3>
            </div>

            <div className="flex items-center justify-between relative">
              <p className="text-[#1e74bb] font-medium flex items-center">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs mr-2">10 Quizzes</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/geometry`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm flex items-center group-hover:bg-[#1a67a7] transition-all duration-300"
              >
                Select a Quiz
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Trigonometry */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center mb-4 relative">
              <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-green-600 text-lg">📊</span>
              </div>
              <h3 className="text-gray-800 font-semibold text-lg group-hover:text-[#1e74bb] transition-colors duration-300">
                Trigonometry
              </h3>
            </div>

            <div className="flex items-center justify-between relative">
              <p className="text-[#1e74bb] font-medium flex items-center">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs mr-2">10 Quizzes</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/trigonometry`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm flex items-center group-hover:bg-[#1a67a7] transition-all duration-300"
              >
                Select a Quiz
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Statistics and Probability */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center mb-4 relative">
              <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600 text-lg">📈</span>
              </div>
              <h3 className="text-gray-800 font-semibold text-lg group-hover:text-[#1e74bb] transition-colors duration-300">
                Statistics and Probability
              </h3>
            </div>

            <div className="flex items-center justify-between relative">
              <p className="text-[#1e74bb] font-medium flex items-center">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs mr-2">10 Quizzes</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/statistics-probability`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm flex items-center group-hover:bg-[#1a67a7] transition-all duration-300"
              >
                Select a Quiz
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Measurement */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:translate-y-[-4px] relative group">
            <div className="flex items-center mb-4 relative">
              <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-orange-600 text-lg">📏</span>
              </div>
              <h3 className="text-gray-800 font-semibold text-lg group-hover:text-[#1e74bb] transition-colors duration-300">
                Measurement
              </h3>
            </div>

            <div className="flex items-center justify-between relative">
              <p className="text-[#1e74bb] font-medium flex items-center">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs mr-2">10 Quizzes</span>
              </p>
              <Link
                href={`/subjects/${params.subject}/measurement`}
                className="bg-[#1e74bb] text-white py-2 px-4 rounded-md text-sm flex items-center group-hover:bg-[#1a67a7] transition-all duration-300"
              >
                Select a Quiz
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
