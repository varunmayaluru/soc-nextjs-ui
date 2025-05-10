"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface UserInfo {
  first_name?: string
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
    const base64Url = token.split(" ")[1].split(".")[1]
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsLoggedIn(true)
      // Decode and set user info
      const decodedToken = decodeJWT(token)
      setUserInfo(decodedToken)
    }
    setLoading(false)
  }, [])

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
