"use client"

import type React from "react"

import { useState } from "react"
import { Users, BookOpen, GraduationCap, BarChart2, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

interface CompactStatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
  color: string
}

function CompactStatCard({ title, value, change, trend, icon, color }: CompactStatCardProps) {
  const trendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${color}`}>{icon}</div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <div className="text-xl font-bold">{value}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className={`flex items-center ${trendColor}`}>
                {/* <trendIcon className="h-3.5 w-3.5 mr-1" /> */}
                <span className="text-xs font-medium">{change}</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">vs last period</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function CompactStatsCards() {
  const [timeRange, setTimeRange] = useState("weekly")

  // Data for different time ranges
  const data = {
    weekly: [
      {
        title: "Total Users",
        value: "2,543",
        change: "+12.5%",
        trend: "up" as const,
        icon: <Users className="h-4 w-4 text-white" />,
        color: "bg-blue-500",
      },
      {
        title: "Active Subjects",
        value: "18",
        change: "+3 new",
        trend: "up" as const,
        icon: <BookOpen className="h-4 w-4 text-white" />,
        color: "bg-purple-500",
      },
      {
        title: "Completion Rate",
        value: "78.5%",
        change: "-2.3%",
        trend: "down" as const,
        icon: <GraduationCap className="h-4 w-4 text-white" />,
        color: "bg-amber-500",
      },
      {
        title: "Avg. Engagement",
        value: "24 min",
        change: "No change",
        trend: "neutral" as const,
        icon: <BarChart2 className="h-4 w-4 text-white" />,
        color: "bg-green-500",
      },
    ],
    monthly: [
      {
        title: "Total Users",
        value: "10,872",
        change: "+8.2%",
        trend: "up" as const,
        icon: <Users className="h-4 w-4 text-white" />,
        color: "bg-blue-500",
      },
      {
        title: "Active Subjects",
        value: "24",
        change: "+5 new",
        trend: "up" as const,
        icon: <BookOpen className="h-4 w-4 text-white" />,
        color: "bg-purple-500",
      },
      {
        title: "Completion Rate",
        value: "81.2%",
        change: "+3.7%",
        trend: "up" as const,
        icon: <GraduationCap className="h-4 w-4 text-white" />,
        color: "bg-amber-500",
      },
      {
        title: "Avg. Engagement",
        value: "22 min",
        change: "-2 min",
        trend: "down" as const,
        icon: <BarChart2 className="h-4 w-4 text-white" />,
        color: "bg-green-500",
      },
    ],
    yearly: [
      {
        title: "Total Users",
        value: "42,198",
        change: "+32.5%",
        trend: "up" as const,
        icon: <Users className="h-4 w-4 text-white" />,
        color: "bg-blue-500",
      },
      {
        title: "Active Subjects",
        value: "36",
        change: "+12 new",
        trend: "up" as const,
        icon: <BookOpen className="h-4 w-4 text-white" />,
        color: "bg-purple-500",
      },
      {
        title: "Completion Rate",
        value: "76.8%",
        change: "+5.2%",
        trend: "up" as const,
        icon: <GraduationCap className="h-4 w-4 text-white" />,
        color: "bg-amber-500",
      },
      {
        title: "Avg. Engagement",
        value: "28 min",
        change: "+4 min",
        trend: "up" as const,
        icon: <BarChart2 className="h-4 w-4 text-white" />,
        color: "bg-green-500",
      },
    ],
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium">Key Metrics</h2>
        <Tabs defaultValue="weekly" value={timeRange} onValueChange={setTimeRange}>
          <TabsList className="grid grid-cols-3 h-7 w-[200px]">
            <TabsTrigger value="weekly" className="text-xs">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs">
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data[timeRange as keyof typeof data].map((stat, index) => (
          <CompactStatCard
            key={`${timeRange}-${stat.title}`}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  )
}
