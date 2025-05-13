import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, BookPlus, FileText, Settings } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used administrative actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 hover:bg-blue-50 hover:text-[#1e74bb] hover:border-[#1e74bb] transition-colors"
          >
            <UserPlus className="h-6 w-6 mb-2" />
            <span className="text-sm">Add User</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 hover:bg-blue-50 hover:text-[#1e74bb] hover:border-[#1e74bb] transition-colors"
          >
            <BookPlus className="h-6 w-6 mb-2" />
            <span className="text-sm">New Subject</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 hover:bg-blue-50 hover:text-[#1e74bb] hover:border-[#1e74bb] transition-colors"
          >
            <FileText className="h-6 w-6 mb-2" />
            <span className="text-sm">Reports</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 hover:bg-blue-50 hover:text-[#1e74bb] hover:border-[#1e74bb] transition-colors"
          >
            <Settings className="h-6 w-6 mb-2" />
            <span className="text-sm">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
