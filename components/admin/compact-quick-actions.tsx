"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { UserPlus, BookPlus, FileText, BarChart, Upload, Mail } from "lucide-react"

const actions = [
  {
    icon: UserPlus,
    label: "Add User",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: BookPlus,
    label: "New Subject",
    color: "bg-purple-100 text-purple-700",
  },
  {
    icon: FileText,
    label: "Create Quiz",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: BarChart,
    label: "Reports",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Upload,
    label: "Upload",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: Mail,
    label: "Email",
    color: "bg-red-100 text-red-700",
  },
]

export function CompactQuickActions() {
  return (
    <Card className="shadow-sm border overflow-hidden">
      <CardHeader className="py-3 px-4 border-b bg-gray-50">
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center py-2 px-1 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <div className={`p-1.5 rounded-full mb-1 ${action.color}`}>
                  <action.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-medium">{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
