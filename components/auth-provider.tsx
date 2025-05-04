"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

type AuthContextType = {
  isLoggedIn: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)
      setLoading(false)

      // Redirect logic
      const isAuthPage = pathname === "/login"

      if (!authenticated && !isAuthPage && pathname !== "/") {
        // Redirect to login if not authenticated and not on login page
        router.push("/login")
      } else if (authenticated && isAuthPage) {
        // Redirect to dashboard if already authenticated and on login page
        router.push("/")
      }
    }

    checkAuth()
  }, [pathname, router])

  return <AuthContext.Provider value={{ isLoggedIn, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
