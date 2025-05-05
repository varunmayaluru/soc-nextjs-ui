import type React from "react"
import type { Metadata } from "next"
import Sidebar from "@/components/sidebar"
import { AuthProvider } from "@/components/auth-provider"
// Comment out the ProtectedRoute import and usage
// import ProtectedRoute from "@/components/protected-route"
import Header from "@/components/header"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Change the return statement to remove the ProtectedRoute wrapper
  return (
    <AuthProvider>
      {/* <ProtectedRoute> */}
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      {/* </ProtectedRoute> */}
    </AuthProvider>
  )
}
