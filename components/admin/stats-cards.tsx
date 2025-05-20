"use client"

import type React from "react"

import { useState } from "react"
import { Users, BookOpen, GraduationCap, BarChart2, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
  description: string
  color: string
}

function StatCard({ title, value, change, trend, icon, description, color }: StatCardProps) {
  const trendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className={`pb-2 ${color}`}>
          <CardTitle className="text-lg font-semibold text-white flex justify-between items-center">
            {title}
            <div className="p-2 bg-white/20 rounded-full">{icon}</div>
          </CardTitle>
          <CardDescription className="text-white/80">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold">{value}</div>
          <div className="flex items-center mt-2">
            {/* <trendIcon className={`h-4 w-4 mr-1 ${trendColor}`} /> */}
            <span className={`text-sm font-medium ${trendColor}`}>{change}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 py-2 px-6">
          <span className="text-xs text-gray-500">Last updated: Today at 9:41 AM</span>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function StatsCards() {
  const [timeRange, setTimeRange] = useState("weekly")

  // Data for different time ranges
  const data = {
    weekly: [
      {
        title: "Total Users",
        value: "2,543",
        change: "+12.5%",
        trend: "up" as const,
        icon: <Users className="h-5 w-5 text-white" />,
        description: "Active registered users",
        color: "bg-gradient-to-r from-blue-600 to-blue-400",
      },
      {
        title: "Active Subjects",
        value: "18",
        change: "+3 new",
        trend: "up" as const,
        icon: <BookOpen className="h-5 w-5 text-white" />,
        description: "Subjects with active students",
        color: "bg-gradient-to-r from-purple-600 to-purple-400",
      },
      {
        title: "Completion Rate",
        value: "78.5%",
        change: "-2.3%",
        trend: "down" as const,
        icon: <GraduationCap className="h-5 w-5 text-white" />,
        description: "Average quiz completion",
        color: "bg-gradient-to-r from-amber-600 to-amber-400",
      },
      {
        title: "Avg. Engagement",
        value: "24 min",
        change: "No change",
        trend: "neutral" as const,
        icon: <BarChart2 className="h-5 w-5 text-white" />,
        description: "Time spent per session",
        color: "bg-gradient-to-r from-green-600 to-green-400",
      },
    ],
    monthly: [
      {
        title: "Total Users",
        value: "10,872",
        change: "+8.2%",
        trend: "up" as const,
        icon: <Users className="h-5 w-5 text-white" />,
        description: "Active registered users",
        color: "bg-gradient-to-r from-blue-600 to-blue-400",
      },
      {
        title: "Active Subjects",
        value: "24",
        change: "+5 new",
        trend: "up" as const,
        icon: <BookOpen className="h-5 w-5 text-white" />,
        description: "Subjects with active students",
        color: "bg-gradient-to-r from-purple-600 to-purple-400",
      },
      {
        title: "Completion Rate",
        value: "81.2%",
        change: "+3.7%",
        trend: "up" as const,
        icon: <GraduationCap className="h-5 w-5 text-white" />,
        description: "Average quiz completion",
        color: "bg-gradient-to-r from-amber-600 to-amber-400",
      },
      {
        title: "Avg. Engagement",
        value: "22 min",
        change: "-2 min",
        trend: "down" as const,
        icon: <BarChart2 className="h-5 w-5 text-white" />,
        description: "Time spent per session",
        color: "bg-gradient-to-r from-green-600 to-green-400",
      },
    ],
    yearly: [
      {
        title: "Total Users",
        value: "42,198",
        change: "+32.5%",
        trend: "up" as const,
        icon: <Users className="h-5 w-5 text-white" />,
        description: "Active registered users",
        color: "bg-gradient-to-r from-blue-600 to-blue-400",
      },
      {
        title: "Active Subjects",
        value: "36",
        change: "+12 new",
        trend: "up" as const,
        icon: <BookOpen className="h-5 w-5 text-white" />,
        description: "Subjects with active students",
        color: "bg-gradient-to-r from-purple-600 to-purple-400",
      },
      {
        title: "Completion Rate",
        value: "76.8%",
        change: "+5.2%",
        trend: "up" as const,
        icon: <GraduationCap className="h-5 w-5 text-white" />,
        description: "Average quiz completion",
        color: "bg-gradient-to-r from-amber-600 to-amber-400",
      },
      {
        title: "Avg. Engagement",
        value: "28 min",
        change: "+4 min",
        trend: "up" as const,
        icon: <BarChart2 className="h-5 w-5 text-white" />,
        description: "Time spent per session",
        color: "bg-gradient-to-r from-green-600 to-green-400",
      },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Key Metrics</h2>
        <Tabs defaultValue="weekly" value={timeRange} onValueChange={setTimeRange}>
          <TabsList className="grid grid-cols-3 w-[240px]">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data[timeRange as keyof typeof data].map((stat, index) => (
          <StatCard
            key={`${timeRange}-${stat.title}`}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  )
}
