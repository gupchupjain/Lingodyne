"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "@/components/auth/login-form"
import SignupForm from "@/components/auth/signup-form"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import OtpVerificationForm from "@/components/auth/otp-verification-form"

type AuthState = "login" | "signup" | "forgot-password" | "otp-verification" | "reset-password"

export default function AuthPage() {
  const [authState, setAuthState] = useState<AuthState>("login")
  const [userEmail, setUserEmail] = useState("")

  const handleStateChange = (newState: AuthState, email?: string) => {
    setAuthState(newState)
    if (email) setUserEmail(email)
  }

  const getTitle = () => {
    switch (authState) {
      case "login":
        return "Welcome Back"
      case "signup":
        return "Create Account"
      case "forgot-password":
        return "Reset Password"
      case "otp-verification":
        return "Verify Email"
      case "reset-password":
        return "Set New Password"
      default:
        return "Authentication"
    }
  }

  const getDescription = () => {
    switch (authState) {
      case "login":
        return "Sign in to access your English proficiency tests"
      case "signup":
        return "Join thousands of professionals improving their English skills"
      case "forgot-password":
        return "Enter your email to receive a password reset link"
      case "otp-verification":
        return `We've sent a verification code to ${userEmail}`
      case "reset-password":
        return "Enter your new password"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EnglishPro Test</h1>
          <p className="text-gray-600">Professional English Certification Platform</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            {authState === "login" && <LoginForm onStateChange={handleStateChange} />}
            {authState === "signup" && <SignupForm onStateChange={handleStateChange} />}
            {authState === "forgot-password" && <ForgotPasswordForm onStateChange={handleStateChange} />}
            {authState === "otp-verification" && (
              <OtpVerificationForm email={userEmail} onStateChange={handleStateChange} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
