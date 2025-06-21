"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SignupForm from "@/components/auth/signup-form"
import LoginForm from "@/components/auth/login-form"
import OtpVerificationForm from "@/components/auth/otp-verification-form"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import { GraduationCap, Globe, Users, Award } from "lucide-react"

type AuthState = "login" | "signup" | "otp-verification" | "forgot-password"

export default function AuthPage() {
  const [currentState, setCurrentState] = useState<AuthState>("login")
  const [userEmail, setUserEmail] = useState("")

  const handleStateChange = (state: AuthState, email?: string) => {
    setCurrentState(state)
    if (email) setUserEmail(email)
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
        return "Authentication"
    }
  }

  const getDescription = () => {
    switch (currentState) {
      case "login":
        return "Sign in to access your English proficiency tests"
      case "signup":
        return "Join thousands of professionals improving their English skills"
      case "otp-verification":
        return "We've sent a verification code to your email"
      case "forgot-password":
        return "Enter your email to receive a password reset link"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">EnglishPro</h1>
                  <p className="text-gray-600">Corporate Language Testing</p>
                </div>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Advance Your Career with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  {" "}
                  Professional English
                </span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Take comprehensive English proficiency tests designed for the modern workplace. Get certified and stand
                out in your professional journey.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Global Standards</h3>
                  <p className="text-sm text-gray-600">
                    Tests aligned with international English proficiency frameworks
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Corporate Focus</h3>
                  <p className="text-sm text-gray-600">Business scenarios and professional communication skills</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Results</h3>
                  <p className="text-sm text-gray-600">Get detailed feedback and certification immediately</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-lime-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Skill Development</h3>
                  <p className="text-sm text-gray-600">Personalized recommendations for improvement</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Tests Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-2 text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">{getTitle()}</CardTitle>
                <CardDescription className="text-gray-600">{getDescription()}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {currentState === "login" && <LoginForm onStateChange={handleStateChange} />}
                {currentState === "signup" && <SignupForm onStateChange={handleStateChange} />}
                {currentState === "otp-verification" && (
                  <OtpVerificationForm email={userEmail} onStateChange={handleStateChange} />
                )}
                {currentState === "forgot-password" && <ForgotPasswordForm onStateChange={handleStateChange} />}
              </CardContent>
            </Card>

            {/* Mobile Branding */}
            <div className="lg:hidden mt-8 text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">EnglishPro</h1>
                  <p className="text-sm text-gray-600">Corporate Language Testing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
