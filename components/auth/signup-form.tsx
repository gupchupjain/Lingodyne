"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, User, Mail, Lock, Calendar, CheckCircle, AlertCircle } from "lucide-react"

interface SignupFormProps {
  onStateChange: (state: "login" | "otp-verification", email?: string) => void
}

export default function SignupForm({ onStateChange }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    } else {
      const today = new Date()
      const birthDate = new Date(formData.dateOfBirth)
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 16) {
        newErrors.dateOfBirth = "You must be at least 16 years old"
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Signup failed" })
        return
      }

      // Success - proceed to OTP verification
      onStateChange("otp-verification", formData.email)
    } catch (error) {
      console.error("Signup error:", error)
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700 font-medium">
            First Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 ${errors.firstName ? "border-red-500" : ""}`}
            />
          </div>
          {errors.firstName && (
            <div className="flex items-center space-x-1 text-red-500">
              <AlertCircle className="w-3 h-3" />
              <p className="text-xs">{errors.firstName}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700 font-medium">
            Last Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 ${errors.lastName ? "border-red-500" : ""}`}
            />
          </div>
          {errors.lastName && (
            <div className="flex items-center space-x-1 text-red-500">
              <AlertCircle className="w-3 h-3" />
              <p className="text-xs">{errors.lastName}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
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
        <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
          Date of Birth
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className={`pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 ${errors.dateOfBirth ? "border-red-500" : ""}`}
          />
        </div>
        {errors.dateOfBirth && (
          <div className="flex items-center space-x-1 text-red-500">
            <AlertCircle className="w-3 h-3" />
            <p className="text-sm">{errors.dateOfBirth}</p>
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
            placeholder="Create a strong password"
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={`pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 ${errors.confirmPassword ? "border-red-500" : ""}`}
          />
        </div>
        {errors.confirmPassword && (
          <div className="flex items-center space-x-1 text-red-500">
            <AlertCircle className="w-3 h-3" />
            <p className="text-sm">{errors.confirmPassword}</p>
          </div>
        )}
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="terms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
          className="mt-1 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
        />
        <div className="space-y-1">
          <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
            I agree to the{" "}
            <a href="#" className="text-green-600 hover:text-green-700 underline font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-600 hover:text-green-700 underline font-medium">
              Privacy Policy
            </a>
          </Label>
          {errors.agreeToTerms && (
            <div className="flex items-center space-x-1 text-red-500">
              <AlertCircle className="w-3 h-3" />
              <p className="text-xs">{errors.agreeToTerms}</p>
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Creating Account...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Create Account</span>
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
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onStateChange("login")}
            className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  )
}
