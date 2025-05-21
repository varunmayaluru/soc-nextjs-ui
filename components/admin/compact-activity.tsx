"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Bell, CheckCircle, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/stylized-jd-initials.png",
      role: "Student",
    },
    action: "completed",
    subject: "Mathematics - Algebra",
    time: "2h ago",
    type: "quiz",
    score: "92%",
  },
  {
    id: 2,
    user: {
      name: "Emily Johnson",
      avatar: "/abstract-ej-typography.png",
      role: "Student",
    },
    action: "enrolled",
    subject: "Science - Physics",
    time: "3h ago",
    type: "course",
  },
  {
    id: 3,
    user: {
      name: "Robert Jackson",
      avatar: "/abstract-rj.png",
      role: "Teacher",
    },
    action: "submitted",
    subject: "English - Essay Writing",
    time: "5h ago",
    type: "assignment",
  },
]

const notifications = [
  {
    id: 1,
    title: "New User Registration",
    description: "5 new users registered today",
    time: "1h ago",
    type: "info",
  },
  {
    id: 2,
    title: "System Update",
    description: "Platform will be updated tonight at 2 AM",
    time: "3h ago",
    type: "warning",
  },
  {
    id: 3,
    title: "Quiz Results Available",
    description: "Mathematics quiz results are now available",
    time: "5h ago",
    type: "success",
  },
]

function getActivityBadge(type: string) {
  switch (type) {
    case "quiz":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-[10px] px-1.5 py-0">Quiz</Badge>
    case "course":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-[10px] px-1.5 py-0">Course</Badge>
    case "assignment":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 text-[10px] px-1.5 py-0">Assignment</Badge>
      )
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-[10px] px-1.5 py-0">{type}</Badge>
  }
}

function getNotificationBadge(type: string) {
  switch (type) {
    case "info":
      return <Badge className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0">Info</Badge>
    case "warning":
      return <Badge className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0">Warning</Badge>
    case "success":
      return <Badge className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0">Success</Badge>
    case "error":
      return <Badge className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0">Error</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800 text-[10px] px-1.5 py-0">{type}</Badge>
  }
}

export function CompactActivity() {
  const [activeTab, setActiveTab] = useState("activity")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredActivities = activities.filter(
    (activity) =>
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="shadow-sm border overflow-hidden">
      <CardHeader className="py-3 px-4 flex flex-row justify-between items-center border-b bg-gray-50">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="h-7">
            <TabsTrigger value="activity" className="text-xs px-2 py-0">
              Activity
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs px-2 py-0">
              Notifications
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-3 py-2 border-b">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Search activities..."
              className="pl-7 h-7 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="activity" className="mt-4">
          <TabsContent value="activity" className="p-0 m-0">
            <div className="divide-y max-h-[300px] overflow-auto">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Avatar className="h-7 w-7 border">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                      <AvatarFallback className="bg-[#1e74bb] text-white text-xs">
                        {activity.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-xs font-medium">{activity.user.name}</p>
                          <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 h-4">
                            {activity.user.role}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-gray-500 flex items-center">
                          <Clock className="h-2.5 w-2.5 mr-0.5" />
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">{activity.action}</span> {activity.subject}
                        {activity.score && (
                          <span className="ml-1 text-green-600 font-medium flex items-center inline-flex">
                            <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                            {activity.score}
                          </span>
                        )}
                      </p>
                      <div className="pt-0.5">{getActivityBadge(activity.type)}</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-500">No activities match your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="p-0 m-0">
            <div className="divide-y max-h-[300px] overflow-auto">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <Bell className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-medium">{notification.title}</h4>
                          {getNotificationBadge(notification.type)}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{notification.description}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 flex items-center">
                      <Clock className="h-2.5 w-2.5 mr-0.5" />
                      {notification.time}
                    </span>
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
