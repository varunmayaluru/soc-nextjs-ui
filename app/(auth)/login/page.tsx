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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate and authenticate here
    // For now, we'll just redirect to the dashboard
    router.push("/")
  }

  return (
    <div className="flex h-screen">
      {/* Left side - Login Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-6 md:px-12 lg:px-24">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-[#eeedf1] rounded-md"></div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-medium text-center mb-2">
            Welcome <span className="text-[#1e74bb]">ProbEd</span>
          </h1>
          <p className="text-center text-[#5b5772] mb-8">Login to your account</p>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#16151a]">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-[#706d8a]" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#d8d7e0] rounded-md"
                  placeholder="Enter your email"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    className="text-[#706d8a]"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#1e74bb] text-white font-medium rounded-md hover:bg-[#1a67a7]"
            >
              Login
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <span className="text-[#5b5772]">Forget password? </span>
            <Link href="#" className="text-[#1e74bb] hover:underline">
              Click here
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Blue Background with Text */}
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
