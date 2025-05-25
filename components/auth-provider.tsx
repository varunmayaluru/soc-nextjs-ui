"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface UserInfo {
  first_name?: string
  last_name?: string
  sub?: string
  exp?: number
  [key: string]: any
}

interface AuthContextType {
  isLoggedIn: boolean
  loading: boolean
  userInfo: UserInfo | null
  isAdmin: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  checkAdminStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Function to decode JWT token
function decodeJWT(token: string): UserInfo {
  try {
    // Extract the payload part (second part) of the JWT
    const tokenParts = token.split(" ")
    const actualToken = tokenParts.length > 1 ? tokenParts[1] : token
    const base64Url = actualToken.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding JWT:", error)
    return {}
  }
}

// Function to check if token is expired
function isTokenExpired(decodedToken: UserInfo): boolean {
  if (!decodedToken.exp) return false

  // Convert exp to milliseconds and compare with current time
  return Date.now() >= decodedToken.exp * 1000
}

// Function to set a cookie with proper attributes
function setCookie(name: string, value: string, days = 1) {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `; expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  // Function to check admin status via API
  const checkAdminStatus = async (): Promise<boolean> => {
    const token = localStorage.getItem("authToken")
    if (!token) return false

    try {
      console.log("Checking admin status with token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const userData = await response.json()
        const isAdminUser = userData.role === "admin"
        console.log("Admin status checked, isAdmin:", isAdminUser)

        // Update state
        setIsAdmin(isAdminUser)
        return isAdminUser
      } else {
        console.error("Failed to check admin status:", response.status)
        return false
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
      return false
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken")

    if (token) {
      // Decode and set user info
      const decodedToken = decodeJWT(token)

      // Check if token is expired
      if (isTokenExpired(decodedToken)) {
        // Token is expired, log out
        logout()
      } else {
        setIsLoggedIn(true)
        setUserInfo(decodedToken)

        // Check admin status
        checkAdminStatus().catch(console.error)
      }
    }
    setLoading(false)
  }, [])

  // Periodically check if token is expired
  useEffect(() => {
    if (!isLoggedIn || !userInfo) return

    const checkTokenExpiration = () => {
      if (isTokenExpired(userInfo)) {
        logout()
      }
    }

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000)

    return () => clearInterval(interval)
  }, [isLoggedIn, userInfo])

  const login = async (token: string) => {
    localStorage.setItem("authToken", token)

    // Set cookie for server-side access with proper attributes
    setCookie("authToken", token)

    // Decode and set user info
    const decodedToken = decodeJWT(token)
    setUserInfo(decodedToken)
    setIsLoggedIn(true)

    // Check admin status with API
    const isAdminUser = await checkAdminStatus()

    // Redirect based on admin status
    if (isAdminUser) {
      router.push("/admin") // Redirect to admin dashboard
    } else {
      router.push("/") // Redirect to regular dashboard
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")

    // Clear cookies
    document.cookie = "authToken=; path=/; max-age=0"

    setIsLoggedIn(false)
    setUserInfo(null)
    setIsAdmin(false)
    localStorage.removeItem("userId")
    localStorage.removeItem("organizationId")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, userInfo, isAdmin, login, logout, checkAdminStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
