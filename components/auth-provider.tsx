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
  login: (token: string) => void
  logout: () => void
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const router = useRouter()

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

  const login = (token: string) => {
    localStorage.setItem("authToken", token)
    // Also set the token as a cookie for server-side access
    document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Strict`

    // Decode and set user info
    const decodedToken = decodeJWT(token)
    setUserInfo(decodedToken)

    setIsLoggedIn(true)
    router.push("/")
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    // Clear the cookie as well
    document.cookie = "authToken=; path=/; max-age=0; SameSite=Strict"
    setIsLoggedIn(false)
    setUserInfo(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, userInfo, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
