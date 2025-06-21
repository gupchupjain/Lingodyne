"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, KeyRound } from "lucide-react"

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
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">Check Your Email</h3>
          <p className="text-gray-600">We've sent a password reset link to</p>
          <p className="font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-lg inline-block">{email}</p>
          <p className="text-sm text-gray-500">The link will expire in 1 hour for security reasons.</p>
        </div>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">
              <strong>Didn't receive the email?</strong> Check your spam folder or{" "}
              <button
                onClick={() => setIsSuccess(false)}
                className="text-green-600 hover:text-green-700 underline font-medium"
              >
                try again
              </button>
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => onStateChange("login")}
            className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <KeyRound className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Reset Your Password</h3>
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors ${
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
          />
        </div>
        {error && (
          <div className="flex items-center space-x-1 text-red-500">
            <AlertCircle className="w-3 h-3" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending Reset Link...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send Reset Link</span>
            </div>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => onStateChange("login")}
          className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => onStateChange("login")}
            className="text-green-600 hover:text-green-700 underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  )
}
