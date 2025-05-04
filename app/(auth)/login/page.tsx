"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Create a JSON object with email and password
      const credentials = JSON.stringify({ email, password })

      // Convert to base64
      const base64Credentials = btoa(credentials)

      // Send request to the server
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          data: base64Credentials,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Login failed")
      }

      const data = await response.json()

      // Store the JWT token in localStorage
      localStorage.setItem("authToken", data.token)

      // Redirect to dashboard
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left side - Login Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-6 md:px-12 lg:px-24 relative bg-pattern">
        {/* Logo at top left */}
        <div className="absolute top-10 left-10">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#1e74bb] flex items-center justify-center mr-2">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-[#1e74bb] text-xl font-medium">ProbED</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Center Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#1e74bb] flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-medium text-center mb-2">
            Welcome <span className="text-[#1e74bb]">ProbED</span>
          </h1>
          <p className="text-center text-[#5b5772] mb-8">Login to your account</p>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#16151a]">
                User ID / Email / Student ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-[#706d8a]" />
                </div>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#d8d7e0] rounded-md"
                  placeholder="Enter your User ID / Email / Student ID"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#16151a]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-[#706d8a]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-[#d8d7e0] rounded-md"
                  placeholder="******"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#706d8a]"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#1e74bb] text-white font-medium rounded-md hover:bg-[#1a67a7] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <span className="text-[#5b5772]">Forget password? </span>
            <Link href="#" className="text-[#1e74bb] hover:underline">
              Click here
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Blue Background with Online Exam Image */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-[#1e74bb] z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20 px-12">
          <h2 className="text-white text-4xl font-medium max-w-md">
            Please enter your credentials to access your online examination.
          </h2>
        </div>
      </div>
    </div>
  )
}
