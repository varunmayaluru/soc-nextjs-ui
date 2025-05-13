import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  // Mock user data
  const user = {
    id: params.id,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    status: "Active",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, CA 12345",
    joinDate: "January 15, 2023",
    lastActive: "2 hours ago",
    avatar: "/stylized-jd-initials.png",
    subjects: [
      { id: "1", name: "Mathematics", progress: "75%" },
      { id: "2", name: "Science", progress: "60%" },
      { id: "3", name: "English", progress: "90%" },
    ],
    recentActivity: [
      { id: "1", action: "Completed quiz", subject: "Mathematics", date: "Today, 10:30 AM" },
      { id: "2", action: "Started lesson", subject: "Science", date: "Yesterday, 3:45 PM" },
      { id: "3", action: "Submitted assignment", subject: "English", date: "May 10, 2023" },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-gray-100 lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-3xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 mb-2">{user.email}</p>
              <Badge
                variant="outline"
                className={`
                  ${user.role === "Admin" ? "border-purple-200 bg-purple-50 text-purple-700" : ""}
                  ${user.role === "Teacher" ? "border-blue-200 bg-blue-50 text-blue-700" : ""}
                  ${user.role === "Student" ? "border-green-200 bg-green-50 text-green-700" : ""}
                  mb-4
                `}
              >
                {user.role}
              </Badge>

              <div className="w-full space-y-3 mt-4">
                <div className="flex items-start gap-3 text-left">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-gray-500">{user.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-gray-500">{user.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 lg:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="activity">
              <TabsList className="mb-4 bg-gray-100">
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="space-y-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.recentActivity.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{activity.action}</TableCell>
                          <TableCell>{activity.subject}</TableCell>
                          <TableCell>{activity.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="subjects" className="space-y-4">
                <h3 className="text-lg font-medium">Enrolled Subjects</h3>
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell>{subject.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-[#1e74bb] h-2.5 rounded-full"
                                  style={{ width: subject.progress }}
                                ></div>
                              </div>
                              <span className="text-sm">{subject.progress}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
