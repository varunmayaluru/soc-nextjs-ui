import { CalendarDateRangePicker } from "@/components/admin/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import CompactStatsCards from "@/components/admin/compact-stats-cards"
import { CompactDashboardCharts } from "@/components/admin/compact-dashboard-charts"
import { CompactActivity } from "@/components/admin/compact-activity"
import { CompactQuickActions } from "@/components/admin/compact-quick-actions"

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
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
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <CompactStatsCards />
      </div>

      {/* Charts */}
      <CompactDashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Recent Activity */}
          <CompactActivity />
        </div>
        <div>
          {/* Quick Actions */}
          <CompactQuickActions />
        </div>
      </div>
    </div>
  )
}
