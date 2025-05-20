"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { UserPlus, BookPlus, FileText, Settings, BarChart, Upload, Mail, Bell } from "lucide-react"

const actions = [
  {
    icon: UserPlus,
    label: "Add User",
    description: "Create a new user account",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: BookPlus,
    label: "New Subject",
    description: "Create a new subject",
    color: "bg-purple-100 text-purple-700",
  },
  {
    icon: FileText,
    label: "Create Quiz",
    description: "Add a new quiz to a subject",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: BarChart,
    label: "View Reports",
    description: "Access detailed analytics",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Upload,
    label: "Upload Content",
    description: "Add learning materials",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: Mail,
    label: "Send Email",
    description: "Contact users or staff",
    color: "bg-red-100 text-red-700",
  },
]

const notifications = [
  {
    title: "System Update",
    description: "Platform update scheduled for tonight",
    time: "Today",
  },
  {
    title: "New Feature",
    description: "Quiz timer feature has been added",
    time: "Yesterday",
  },
]

export function QuickActions() {
  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used admin actions</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center py-4 px-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <div className={`p-2 rounded-full mb-2 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
                <span className="text-xs text-gray-500 mt-1 text-center">{action.description}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Recent Notifications</h3>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <Bell className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">View All</span>
            </Button>
          </div>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                className="p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 + 0.3 }}
              >
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t py-3 px-4 bg-gray-50">
        <Button variant="link" size="sm" className="h-8 px-0 text-[#1e74bb]">
          <Settings className="h-3.5 w-3.5 mr-1" />
          Configure Quick Actions
        </Button>
      </CardFooter>
    </Card>
  )
}
