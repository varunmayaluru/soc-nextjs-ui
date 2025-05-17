"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const userActivityData = {
  weekly: [
    { name: "Mon", users: 120 },
    { name: "Tue", users: 150 },
    { name: "Wed", users: 180 },
    { name: "Thu", users: 170 },
    { name: "Fri", users: 190 },
    { name: "Sat", users: 110 },
    { name: "Sun", users: 85 },
  ],
  monthly: [
    { name: "Week 1", users: 850 },
    { name: "Week 2", users: 920 },
    { name: "Week 3", users: 880 },
    { name: "Week 4", users: 950 },
  ],
  yearly: [
    { name: "Jan", users: 3200 },
    { name: "Feb", users: 3500 },
    { name: "Mar", users: 3800 },
    { name: "Apr", users: 3600 },
    { name: "May", users: 3900 },
    { name: "Jun", users: 4100 },
    { name: "Jul", users: 4000 },
    { name: "Aug", users: 4200 },
    { name: "Sep", users: 4300 },
    { name: "Oct", users: 4500 },
    { name: "Nov", users: 4700 },
    { name: "Dec", users: 4800 },
  ],
}

const subjectCompletionData = [
  { name: "Math", completed: 85 },
  { name: "Science", completed: 72 },
  { name: "English", completed: 90 },
  { name: "History", completed: 65 },
  { name: "Geography", completed: 58 },
  { name: "Physics", completed: 70 },
]

export function DashboardCharts() {
  const [activityPeriod, setActivityPeriod] = useState("weekly")
  const [chartType, setChartType] = useState("line")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Number of active users over time</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={activityPeriod} onValueChange={setActivityPeriod}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>

              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #f0f0f0",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#1e74bb"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #f0f0f0",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                  />
                  <Bar dataKey="users" fill="#1e74bb" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle>Subject Completion Rate</CardTitle>
              <CardDescription>Percentage of students completing each subject</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="progress">Progress Bars</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="pt-4">
              <div className="h-[300px]">
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
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                      formatter={(value) => [`${value}%`, "Completion Rate"]}
                    />
                    <Bar dataKey="completed" fill="#1e74bb" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="progress" className="pt-4">
              <div className="space-y-6">
                {subjectCompletionData.map((subject) => (
                  <div key={subject.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{subject.name}</span>
                      <span className="text-sm text-gray-500">{subject.completed}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-[#1e74bb] h-2.5 rounded-full" style={{ width: `${subject.completed}%` }}></div>
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
