"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/stylized-jd-initials.png",
    },
    action: "completed",
    subject: "Mathematics - Algebra",
    time: "2 hours ago",
    type: "quiz",
  },
  {
    id: 2,
    user: {
      name: "Emily Johnson",
      avatar: "/ed-initials-abstract.png",
    },
    action: "enrolled",
    subject: "Science - Physics",
    time: "3 hours ago",
    type: "course",
  },
  {
    id: 3,
    user: {
      name: "Robert Jackson",
      avatar: "/abstract-rj.png",
    },
    action: "submitted",
    subject: "English - Essay Writing",
    time: "5 hours ago",
    type: "assignment",
  },
  {
    id: 4,
    user: {
      name: "Sarah Brown",
      avatar: "/stylized-letter-sb.png",
    },
    action: "started",
    subject: "History - World War II",
    time: "6 hours ago",
    type: "lesson",
  },
  {
    id: 5,
    user: {
      name: "James Davis",
      avatar: "/javascript-code.png",
    },
    action: "completed",
    subject: "Computer Science - JavaScript",
    time: "8 hours ago",
    type: "quiz",
  },
]

const notifications = [
  {
    id: 1,
    title: "New User Registration",
    description: "5 new users registered today",
    time: "1 hour ago",
    type: "info",
  },
  {
    id: 2,
    title: "System Update",
    description: "Platform will be updated tonight at 2 AM",
    time: "3 hours ago",
    type: "warning",
  },
  {
    id: 3,
    title: "Quiz Results Available",
    description: "Mathematics quiz results are now available",
    time: "5 hours ago",
    type: "success",
  },
  {
    id: 4,
    title: "Storage Limit Warning",
    description: "You're approaching your storage limit",
    time: "1 day ago",
    type: "error",
  },
]

function getActivityBadge(type: string) {
  switch (type) {
    case "quiz":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Quiz</Badge>
    case "course":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Course</Badge>
    case "assignment":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Assignment</Badge>
    case "lesson":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Lesson</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{type}</Badge>
  }
}

function getNotificationBadge(type: string) {
  switch (type) {
    case "info":
      return <Badge className="bg-blue-100 text-blue-800">Info</Badge>
    case "warning":
      return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>
    case "success":
      return <Badge className="bg-green-100 text-green-800">Success</Badge>
    case "error":
      return <Badge className="bg-red-100 text-red-800">Error</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>
  }
}

export function RecentActivity() {
  const [activeTab, setActiveTab] = useState("activity")

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activities across the platform</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity">User Activity</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="pt-4">
            <div className="space-y-5">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-[#1e74bb] text-white">
                      {activity.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.user.name}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{activity.action}</span> {activity.subject}
                    </p>
                    <div className="pt-1">{getActivityBadge(activity.type)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="pt-4">
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        {getNotificationBadge(notification.type)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
