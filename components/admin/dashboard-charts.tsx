"use client"

import { useState } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, Info } from "lucide-react"

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
    { name: "Jul", users: 4000, newUsers: 650, completions: 1580 },
    { name: "Aug", users: 4200, newUsers: 680, completions: 1650 },
    { name: "Sep", users: 4300, newUsers: 700, completions: 1700 },
    { name: "Oct", users: 4500, newUsers: 730, completions: 1780 },
    { name: "Nov", users: 4700, newUsers: 760, completions: 1850 },
    { name: "Dec", users: 4800, newUsers: 780, completions: 1900 },
  ],
}

const subjectCompletionData = [
  { name: "Mathematics", completed: 85, target: 90, students: 320 },
  { name: "Science", completed: 72, target: 80, students: 280 },
  { name: "English", completed: 90, target: 85, students: 350 },
  { name: "History", completed: 65, target: 75, students: 220 },
  { name: "Geography", completed: 58, target: 70, students: 180 },
  { name: "Physics", completed: 70, target: 80, students: 240 },
]

export function DashboardCharts() {
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

  const colors = getChartColors()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`} className="text-sm flex items-center">
                <span
                  className="inline-block w-3 h-3 mr-2 rounded-full"
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <Card className="shadow-md border-none overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-blue-900">User Activity</CardTitle>
              <CardDescription className="text-blue-700">Platform engagement metrics</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={activityPeriod} onValueChange={setActivityPeriod}>
                <SelectTrigger className="w-[120px] h-8 bg-white">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>

              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[120px] h-8 bg-white">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.users }}></div>
                <span className="text-sm">Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.newUsers }}></div>
                <span className="text-sm">New Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.completions }}></div>
                <span className="text-sm">Completions</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
          <div className="h-[320px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart
                  data={userActivityData[activityPeriod as keyof typeof userActivityData]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke={colors.users}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke={colors.newUsers}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completions"
                    stroke={colors.completions}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              ) : chartType === "bar" ? (
                <BarChart
                  data={userActivityData[activityPeriod as keyof typeof userActivityData]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="users" fill={colors.users} radius={[4, 4, 0, 0]} barSize={8} />
                  <Bar dataKey="newUsers" fill={colors.newUsers} radius={[4, 4, 0, 0]} barSize={8} />
                  <Bar dataKey="completions" fill={colors.completions} radius={[4, 4, 0, 0]} barSize={8} />
                </BarChart>
              ) : (
                <AreaChart
                  data={userActivityData[activityPeriod as keyof typeof userActivityData]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke={colors.users}
                    fill={`${colors.users}20`}
                    strokeWidth={2}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="newUsers"
                    stroke={colors.newUsers}
                    fill={`${colors.newUsers}20`}
                    strokeWidth={2}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    stroke={colors.completions}
                    fill={`${colors.completions}20`}
                    strokeWidth={2}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-none overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100 border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-amber-900">Subject Performance</CardTitle>
              <CardDescription className="text-amber-700">Completion rates vs targets</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8">
                <Info className="h-4 w-4 mr-1" /> Details
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="chart" value={subjectView} onValueChange={setSubjectView} className="w-full">
            <div className="px-4 pt-4 border-b">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="chart">Chart View</TabsTrigger>
                <TabsTrigger value="progress">Progress View</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="chart" className="pt-4 px-4">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subjectCompletionData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={90}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="completed"
                      name="Completed"
                      fill={colors.completed}
                      radius={[0, 4, 4, 0]}
                      barSize={12}
                    />
                    <Bar dataKey="target" name="Target" fill={colors.target} radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="progress" className="pt-4 px-4">
              <div className="space-y-6">
                {subjectCompletionData.map((subject) => (
                  <div key={subject.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium">{subject.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({subject.students} students)</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                          <span className="text-sm">{subject.completed}%</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
                          <span className="text-sm text-gray-600">Target: {subject.target}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-[#1e74bb] h-2.5 rounded-full" style={{ width: `${subject.completed}%` }}></div>
                      <div
                        className="absolute top-0 h-2.5 w-1 bg-amber-500"
                        style={{ left: `${subject.target}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
