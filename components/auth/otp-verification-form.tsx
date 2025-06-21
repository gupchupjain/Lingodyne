"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface OtpVerificationFormProps {
  email: string
  onStateChange: (state: "login" | "signup") => void
}

export default function OtpVerificationForm({ email, onStateChange }: OtpVerificationFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (error) setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpString,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Verification failed")
        return
      }

      // Success - redirect to login
      onStateChange("login")
    } catch (error) {
      console.error("Verification error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return

    setIsResending(true)

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setCanResend(false)
        setTimeLeft(300)
        setOtp(["", "", "", "", "", ""])
        setError("")
      } else {
        setError(data.error || "Failed to resend code")
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-gray-700 font-medium">Verification Code</Label>
        <div className="flex gap-3 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-12 text-center text-lg font-semibold border-gray-200 focus:border-green-500 focus:ring-green-500 ${error ? "border-red-500" : ""}`}
            />
          ))}
        </div>
        {error && (
          <div className="flex items-center justify-center space-x-1 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="text-center space-y-3">
        {timeLeft > 0 ? (
          <p className="text-sm text-gray-500">
            Code expires in <span className="font-medium text-green-600">{formatTime(timeLeft)}</span>
          </p>
        ) : (
          <p className="text-sm text-red-500 font-medium">Code has expired</p>
        )}

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={!canResend || isResending}
          className={`text-sm font-medium transition-colors ${
            canResend && !isResending
              ? "text-green-600 hover:text-green-700 hover:underline"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {isResending ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            "Resend verification code"
          )}
        </button>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Verify Email</span>
            </div>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => onStateChange("signup")}
          className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 py-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign Up
        </Button>
      </div>
    </form>
  )
}
