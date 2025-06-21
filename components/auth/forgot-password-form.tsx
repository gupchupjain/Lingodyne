"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"

interface ForgotPasswordFormProps {
  onStateChange: (state: "login" | "otp-verification", email?: string) => void
}

export default function ForgotPasswordForm({ onStateChange }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send reset email")
        return
      }

      setIsSuccess(true)
    } catch (error) {
      console.error("Forgot password error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setEmail(value)
    if (error) setError("")
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
          <p className="text-sm text-gray-600">
            We've sent a password reset link to <span className="font-medium">{email}</span>
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            {"Didn't receive the email? Check your spam folder or "}
            <button onClick={() => setIsSuccess(false)} className="text-blue-600 hover:underline">
              try again
            </button>
          </p>
          <Button variant="outline" onClick={() => onStateChange("login")} className="w-full bg-white text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`pl-10 ${error ? "border-red-500" : ""}`}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="space-y-3">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => onStateChange("login")}
          className="w-full bg-white text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Remember your password?{" "}
          <button type="button" onClick={() => onStateChange("login")} className="text-blue-600 hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </form>
  )
}
