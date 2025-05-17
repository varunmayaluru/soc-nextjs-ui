import type React from "react"
import type { Metadata } from "next"
import AdminLayoutClient from "./AdminLayoutClient"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing the learning platform.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient children={children} />
}
