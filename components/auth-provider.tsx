"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isLoggedIn: boolean
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)
    setLoading(false)
  }, [])

  const login = (token: string) => {
    localStorage.setItem("authToken", token)
    // Also set the token as a cookie for server-side access
    document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Strict`
    setIsLoggedIn(true)
    router.push("/")
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    // Clear the cookie as well
    document.cookie = "authToken=; path=/; max-age=0; SameSite=Strict"
    setIsLoggedIn(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
