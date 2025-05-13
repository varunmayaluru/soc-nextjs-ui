"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const userActivityData = [
  { name: "Mon", users: 120 },
  { name: "Tue", users: 150 },
  { name: "Wed", users: 180 },
  { name: "Thu", users: 170 },
  { name: "Fri", users: 190 },
  { name: "Sat", users: 110 },
  { name: "Sun", users: 85 },
]

const subjectCompletionData = [
  { name: "Math", completed: 85 },
  { name: "Science", completed: 72 },
  { name: "English", completed: 90 },
  { name: "History", completed: 65 },
  { name: "Geography", completed: 58 },
  { name: "Physics", completed: 70 },
]

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly User Activity</CardTitle>
          <CardDescription>Number of active users per day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userActivityData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
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
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Completion Rate</CardTitle>
          <CardDescription>Percentage of students completing each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectCompletionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
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
                  formatter={(value) => [`${value}%`, "Completion Rate"]}
                />
                <Bar dataKey="completed" fill="#1e74bb" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
