"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, BookPlus, FileText, Settings, Plus, BarChart2, Download, Upload } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const quickActions = [
  { icon: UserPlus, label: "Add User", href: "/admin/users", color: "bg-blue-50 text-blue-600" },
  { icon: BookPlus, label: "New Subject", href: "/admin/subjects", color: "bg-green-50 text-green-600" },
  { icon: FileText, label: "Reports", href: "/admin/reports", color: "bg-purple-50 text-purple-600" },
  { icon: BarChart2, label: "Analytics", href: "/admin/analytics", color: "bg-amber-50 text-amber-600" },
  { icon: Download, label: "Export Data", href: "/admin/export", color: "bg-indigo-50 text-indigo-600" },
  { icon: Upload, label: "Import Data", href: "/admin/import", color: "bg-rose-50 text-rose-600" },
  { icon: Settings, label: "Settings", href: "/admin/settings", color: "bg-gray-50 text-gray-600" },
  { icon: Plus, label: "More Actions", href: "/admin/actions", color: "bg-teal-50 text-teal-600" },
]

export function QuickActions() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used administrative actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link href={action.href} key={index}>
              <motion.div
                className="h-full"
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outline"
                  className="h-full w-full flex flex-col items-center justify-center p-4 border border-gray-200 hover:border-[#1e74bb] transition-colors"
                >
                  <div className={`p-2 rounded-full mb-2 ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </motion.div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
