import SchoolHeader from "@/components/school-header"
import OverviewCards from "@/components/overview-cards"
import SubjectsList from "@/components/subjects-list"

export default function Dashboard() {
  return (
    <div className="p-6">
      <SchoolHeader title="School Name" />

      <h2 className="text-xl font-medium mt-6 mb-4">Learning Overview</h2>
      <OverviewCards />

      <div className="flex justify-between items-center mt-10 mb-4">
        <h2 className="text-xl font-medium">My Subjects</h2>
        <button className="text-[#1e74bb]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
      <SubjectsList />
    </div>
  )
}
