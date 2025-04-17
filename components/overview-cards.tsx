import { BookOpen, CheckSquare, Clock } from "lucide-react"

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
            <BookOpen className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-gray-600">Courses</h3>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[#1e74bb] font-medium">6 Subjects</p>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-sm">View Details</span>
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
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
            <CheckSquare className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-gray-600">Tasks Complete</h3>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[#1e74bb] font-medium">
            8 Tasks <span className="text-gray-400 text-sm">/12 Tasks</span>
          </p>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-sm">View Details</span>
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
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="text-gray-600">Spend Hours</h3>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[#1e74bb] font-medium">
            8 Hours <span className="text-gray-400 text-sm">In a week</span>
          </p>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-sm">View Details</span>
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
          </button>
        </div>
      </div>
    </div>
  )
}
