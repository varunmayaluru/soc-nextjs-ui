import StatsCards from "@/components/admin/stats-cards"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { RecentActivity } from "@/components/admin/recent-activity"
import { QuickActions } from "@/components/admin/quick-actions"
import { CalendarDateRangePicker } from "@/components/admin/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Admin. Here's an overview of your learning platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <CalendarDateRangePicker />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts */}
      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Recent Activity */}
          <RecentActivity />
        </div>
        <div>
          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
