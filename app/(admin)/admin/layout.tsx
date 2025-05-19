import type React from "react"
import type { Metadata } from "next"
import AdminProtectedRoute from "@/components/admin-protected-route"
import AdminLayoutClient from "./AdminLayoutClient"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing the application",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AdminProtectedRoute>
    <AdminLayoutClient children={children} />
  </AdminProtectedRoute>
}
