"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Globe } from "lucide-react"
import SignupForm from "@/components/auth/signup-form"
import LoginForm from "@/components/auth/login-form"
import OtpVerificationForm from "@/components/auth/otp-verification-form"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

type AuthState = "login" | "signup" | "otp-verification" | "forgot-password"

export default function AuthPage() {
  const [currentState, setCurrentState] = useState<AuthState>("login")
  const [email, setEmail] = useState("")

  const handleStateChange = (state: AuthState, userEmail?: string) => {
    setCurrentState(state)
    if (userEmail) {
      setEmail(userEmail)
    }
  }

  const getTitle = () => {
    switch (currentState) {
      case "login":
        return "Welcome Back"
      case "signup":
        return "Create Your Account"
      case "otp-verification":
        return "Verify Your Email"
      case "forgot-password":
        return "Reset Password"
      default:
        return "Welcome"
    }
  }

  const getSubtitle = () => {
    switch (currentState) {
      case "login":
        return "Sign in to access your language certification dashboard"
      case "signup":
        return "Join thousands of professionals advancing their careers"
      case "otp-verification":
        return "We've sent a verification code to your email"
      case "forgot-password":
        return "Enter your email to receive a password reset link"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Lingodyne
            </h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
            <p className="text-gray-600">{getSubtitle()}</p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {currentState === "login" && <LoginForm onStateChange={handleStateChange} />}
            {currentState === "signup" && <SignupForm onStateChange={handleStateChange} />}
            {currentState === "otp-verification" && (
              <OtpVerificationForm email={email} onStateChange={handleStateChange} />
            )}
            {currentState === "forgot-password" && <ForgotPasswordForm onStateChange={handleStateChange} />}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Lingodyne. Professional Language Certification Platform.</p>
        </div>
      </div>
    </div>
  )
}
