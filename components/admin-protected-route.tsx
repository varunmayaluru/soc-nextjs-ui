"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading, isAdmin, checkAdminStatus } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!loading) {
        // If not logged in, redirect to login
        if (!isLoggedIn) {
          console.log("Not logged in, redirecting to login")
          router.replace("/login")
          return
        }

        // Verify admin status with API call
        try {
          setIsVerifying(true)
          const isAdminUser = await checkAdminStatus()

          if (!isAdminUser) {
            console.log("Not an admin, redirecting to dashboard")
            router.replace("/")
            return
          }

          // User is admin, allow access
          setIsAuthorized(true)
        } catch (error) {
          console.error("Error verifying admin status:", error)
          router.replace("/")
        } finally {
          setIsVerifying(false)
        }
      }
    }

    verifyAdminStatus()
  }, [isLoggedIn, loading, checkAdminStatus, router])

  // Show loading state while checking auth or during verification
  if (loading || isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-xl font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is verified as admin, render the children
  if (isAuthorized) {
    return <>{children}</>
  }

  // Fallback loading state while redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        <p className="text-xl font-medium">Redirecting...</p>
      </div>
    </div>
  )
}
