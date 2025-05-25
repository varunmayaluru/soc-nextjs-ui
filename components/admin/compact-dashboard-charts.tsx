"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { api } from "@/lib/api-client"

const userActivityData = {
  weekly: [
    { name: "Mon", users: 120, newUsers: 20, completions: 45 },
    { name: "Tue", users: 150, newUsers: 25, completions: 52 },
    { name: "Wed", users: 180, newUsers: 30, completions: 65 },
    { name: "Thu", users: 170, newUsers: 22, completions: 58 },
    { name: "Fri", users: 190, newUsers: 28, completions: 70 },
    { name: "Sat", users: 110, newUsers: 15, completions: 40 },
    { name: "Sun", users: 85, newUsers: 10, completions: 30 },
  ],
  monthly: [
    { name: "Week 1", users: 850, newUsers: 120, completions: 320 },
    { name: "Week 2", users: 920, newUsers: 150, completions: 380 },
    { name: "Week 3", users: 880, newUsers: 130, completions: 350 },
    { name: "Week 4", users: 950, newUsers: 160, completions: 410 },
  ],
  yearly: [
    { name: "Jan", users: 3200, newUsers: 520, completions: 1200 },
    { name: "Feb", users: 3500, newUsers: 580, completions: 1350 },
    { name: "Mar", users: 3800, newUsers: 620, completions: 1450 },
    { name: "Apr", users: 3600, newUsers: 550, completions: 1380 },
    { name: "May", users: 3900, newUsers: 630, completions: 1500 },
    { name: "Jun", users: 4100, newUsers: 670, completions: 1620 },
  ],
}

const subjectCompletionData = [
  { name: "Mathematics", completed: 85, target: 90, students: 320 },
  { name: "Science", completed: 72, target: 80, students: 280 },
  { name: "English", completed: 90, target: 85, students: 350 },
  { name: "History", completed: 65, target: 75, students: 220 },
  { name: "Geography", completed: 58, target: 70, students: 180 },
]
type User = {
  email: string
  first_name: string
  last_name: string
  organization_id: number
  role: string
  is_active: boolean
  user_id: number
}

export function CompactDashboardCharts() {
  const [activityPeriod, setActivityPeriod] = useState("weekly")
  const [chartType, setChartType] = useState("area")
  const [subjectView, setSubjectView] = useState("chart")

  const getChartColors = () => {
    return {
      users: "#1e74bb",
      newUsers: "#38bdf8",
      completions: "#4ade80",
      completed: "#1e74bb",
      target: "#f59e0b",
    }
  }

  useEffect(() => {
    async function fetchUserInfo() {
      try {


        // Fetch user info
        const userResponse = await api.get<User>("users/me")
        if (!userResponse.ok) {
          throw new Error(`API error: ${userResponse.status}`)
        }

        const user = userResponse.data
        console.log(user)
        const userId = user.user_id.toString()


        localStorage.setItem("organizationId", user.organization_id.toString())
        localStorage.setItem("userId", userId)
      }
      catch (error) {
        console.error("Error fetching user info:", error)
      }
    }


    fetchUserInfo()
  }, [])

  const colors = getChartColors()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow-md text-xs">
          <p className="font-medium">{label}</p>
          <div className="mt-1 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`} className="flex items-center">
                <span
                  className="inline-block w-2 h-2 mr-1 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="text-gray-600">{entry.name}: </span>
                <span className="font-medium ml-1">{entry.value}</span>
                {entry.name === "Completed" && <span className="text-xs ml-1">%</span>}
              </p>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <Card className="shadow-sm border overflow-hidden">
        <CardHeader className="py-3 px-4 flex flex-row justify-between items-center border-b bg-gray-50">
          <CardTitle className="text-sm font-medium">User Activity</CardTitle>
          <div className="flex gap-2">
            <Select value={activityPeriod} onValueChange={setActivityPeriod}>
              <SelectTrigger className="w-[90px] h-7 text-xs">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[90px] h-7 text-xs">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-2 flex justify-between items-center border-b bg-gray-50">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.users }}></div>
                <span>Active Users</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.newUsers }}></div>
                <span>New Users</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.completions }}></div>
                <span>Completions</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <Download className="h-3 w-3 mr-1" /> Export
            </Button>
          </div>
          <div className="h-[220px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart
                  data={userActivityData[activityPeriod as keyof typeof userActivityData]}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke={colors.users}
                    strokeWidth={2}
                    dot={{ r: 2, strokeWidth: 1 }}
                    activeDot={{ r: 4, strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke={colors.newUsers}
                    strokeWidth={2}
                    dot={{ r: 2, strokeWidth: 1 }}
                    activeDot={{ r: 4, strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completions"
                    stroke={colors.completions}
                    strokeWidth={2}
                    dot={{ r: 2, strokeWidth: 1 }}
                    activeDot={{ r: 4, strokeWidth: 1 }}
                  />
                </LineChart>
              ) : chartType === "bar" ? (
                <BarChart
                  data={userActivityData[activityPeriod as keyof typeof userActivityData]}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="users" fill={colors.users} radius={[2, 2, 0, 0]} barSize={6} />
                  <Bar dataKey="newUsers" fill={colors.newUsers} radius={[2, 2, 0, 0]} barSize={6} />
                  <Bar dataKey="completions" fill={colors.completions} radius={[2, 2, 0, 0]} barSize={6} />
                </BarChart>
              ) : (
                <AreaChart
                  data={userActivityData[activityPeriod as keyof typeof userActivityData]}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke={colors.users}
                    fill={`${colors.users}20`}
                    strokeWidth={2}
                    activeDot={{ r: 4, strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="newUsers"
                    stroke={colors.newUsers}
                    fill={`${colors.newUsers}20`}
                    strokeWidth={2}
                    activeDot={{ r: 4, strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    stroke={colors.completions}
                    fill={`${colors.completions}20`}
                    strokeWidth={2}
                    activeDot={{ r: 4, strokeWidth: 1 }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border overflow-hidden">
        <Tabs defaultValue="chart" value={subjectView} onValueChange={setSubjectView} className="w-full">
          <CardHeader className="py-3 px-4 flex flex-row justify-between items-center border-b bg-gray-50">
            <CardTitle className="text-sm font-medium">Subject Performance</CardTitle>
            <TabsList className="h-7">
              <TabsTrigger value="chart" className="text-xs px-2 py-0">
                Chart
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-xs px-2 py-0">
                Progress
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="chart" className="pt-2 px-2 m-0">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subjectCompletionData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#888888"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={70}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="completed"
                      name="Completed"
                      fill={colors.completed}
                      radius={[0, 2, 2, 0]}
                      barSize={8}
                    />
                    <Bar dataKey="target" name="Target" fill={colors.target} radius={[0, 2, 2, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="progress" className="pt-2 px-3 m-0">
              <div className="space-y-3">
                {subjectCompletionData.map((subject) => (
                  <div key={subject.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-medium">{subject.name}</span>
                        <span className="text-[10px] text-gray-500 ml-1">({subject.students})</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></div>
                          <span>{subject.completed}%</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></div>
                          <span className="text-gray-600">Target: {subject.target}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-[#1e74bb] h-1.5 rounded-full" style={{ width: `${subject.completed}%` }}></div>
                      <div
                        className="absolute top-0 h-1.5 w-0.5 bg-amber-500"
                        style={{ left: `${subject.target}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
