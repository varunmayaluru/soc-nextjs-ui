import type React from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
