import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

export function RecentActivity() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest student activities across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-10 w-10 border">
                <img src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
