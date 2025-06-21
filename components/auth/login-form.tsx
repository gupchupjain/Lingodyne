"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react"

interface LoginFormProps {
  onStateChange: (state: "signup" | "forgot-password", email?: string) => void
}

export default function LoginForm({ onStateChange }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === "Please verify your email before logging in") {
          setErrors({ email: data.error })
        } else {
          setErrors({ general: data.error || "Login failed" })
        }
        return
      }

      // Success - redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 ${errors.email ? "border-red-500" : ""}`}
          />
        </div>
        {errors.email && (
          <div className="flex items-center space-x-1 text-red-500">
            <AlertCircle className="w-3 h-3" />
            <p className="text-sm">{errors.email}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500 ${errors.password ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <div className="flex items-center space-x-1 text-red-500">
            <AlertCircle className="w-3 h-3" />
            <p className="text-sm">{errors.password}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => onStateChange("forgot-password")}
          className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </div>
        )}
      </Button>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        </div>
      )}

      <Separator className="my-6" />

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {"Don't have an account? "}
          <button
            type="button"
            onClick={() => onStateChange("signup")}
            className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  )
}
