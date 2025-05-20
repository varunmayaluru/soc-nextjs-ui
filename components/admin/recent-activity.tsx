"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Bell, CheckCircle, Clock, Filter, MoreHorizontal, Search } from "lucide-react"
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
    time: "2 hours ago",
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
    time: "3 hours ago",
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
    time: "5 hours ago",
    type: "assignment",
  },
  {
    id: 4,
    user: {
      name: "Sarah Brown",
      avatar: "/stylized-letter-sb.png",
      role: "Student",
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
      avatar: "/stylized-jd-initials.png",
      role: "Student",
    },
    action: "completed",
    subject: "Computer Science - JavaScript",
    time: "8 hours ago",
    type: "quiz",
    score: "88%",
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
  const [searchQuery, setSearchQuery] = useState("")

  const filteredActivities = activities.filter(
    (activity) =>
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activities across the platform</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3.5 w-3.5 mr-1" /> Filter
            </Button>
            <Button variant="default" size="sm" className="h-8">
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="activity">User Activity</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="activity" className="p-0 m-0">
            <div className="divide-y">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                      <AvatarFallback className="bg-[#1e74bb] text-white">
                        {activity.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium">{activity.user.name}</p>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {activity.user.role}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {activity.time}
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{activity.action}</span> {activity.subject}
                        {activity.score && (
                          <span className="ml-2 text-green-600 font-medium flex items-center inline-flex">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {activity.score}
                          </span>
                        )}
                      </p>
                      <div className="pt-1">{getActivityBadge(activity.type)}</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No activities match your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="p-0 m-0">
            <div className="divide-y">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Bell className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          {getNotificationBadge(notification.type)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {notification.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t py-3 px-4 bg-gray-50">
        <div className="w-full flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Showing {filteredActivities.length} of {activities.length} activities
          </span>
          <Button variant="link" size="sm" className="h-8 px-0">
            View all activity
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
