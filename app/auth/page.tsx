"use client"

import { useState } from "react"
import SignupForm from "@/components/auth/signup-form"
import LoginForm from "@/components/auth/login-form"
import OTPVerificationForm from "@/components/auth/otp-verification-form"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import { Globe } from "lucide-react"
import Link from "next/link"

type AuthState = "login" | "signup" | "otp" | "forgot-password"

export default function AuthPage() {
  const [authState, setAuthState] = useState<AuthState>("login")
  const [userEmail, setUserEmail] = useState("")

  const handleSignupSuccess = (email: string) => {
    setUserEmail(email)
    setAuthState("otp")
  }

  const handleOTPSuccess = () => {
    setAuthState("login")
  }

  const handleForgotPassword = () => {
    setAuthState("forgot-password")
  }

  const handleBackToLogin = () => {
    setAuthState("login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">Lingodyne</span>
          </Link>
          <p className="text-gray-600">Professional Language Certification</p>
        </div>

        {/* Auth Forms */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          {authState === "login" && (
            <LoginForm onSwitchToSignup={() => setAuthState("signup")} onForgotPassword={handleForgotPassword} />
          )}
          {authState === "signup" && (
            <SignupForm onSwitchToLogin={() => setAuthState("login")} onSignupSuccess={handleSignupSuccess} />
          )}
          {authState === "otp" && (
            <OTPVerificationForm
              email={userEmail}
              onVerificationSuccess={handleOTPSuccess}
              onBackToSignup={() => setAuthState("signup")}
            />
          )}
          {authState === "forgot-password" && <ForgotPasswordForm onBackToLogin={handleBackToLogin} />}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-green-600 hover:text-green-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-600 hover:text-green-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
