import type React from "react"
import { Users, BookOpen, GraduationCap, BarChart2 } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className="flex items-center mt-2">
            <span
              className={`text-xs font-medium ${
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
              }`}
            >
              {change}
            </span>
            {trend !== "neutral" && (
              <svg
                className={`w-3 h-3 ml-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={trend === "up" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            )}
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-full h-12 w-12 flex items-center justify-center text-[#1e74bb]">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value="2,543"
        change="+12.5% from last month"
        trend="up"
        icon={<Users className="h-6 w-6" />}
      />
      <StatCard
        title="Active Subjects"
        value="18"
        change="+3 new this month"
        trend="up"
        icon={<BookOpen className="h-6 w-6" />}
      />
      <StatCard
        title="Completion Rate"
        value="78.5%"
        change="-2.3% from last month"
        trend="down"
        icon={<GraduationCap className="h-6 w-6" />}
      />
      <StatCard
        title="Avg. Engagement"
        value="24 min"
        change="Same as last month"
        trend="neutral"
        icon={<BarChart2 className="h-6 w-6" />}
      />
    </div>
  )
}
