"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Award, Play, Briefcase, User, LogOut, GraduationCap, FileText, Eye } from "lucide-react"
import Link from "next/link"
import MyTests from "@/components/dashboard/my-tests"
import Practice from "@/components/dashboard/practice"
import TestInfo from "@/components/dashboard/test-info"
import Jobs from "@/components/dashboard/jobs"
import { useUserRoles } from "@/hooks/useUserRoles"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("my-tests")
  const { hasAnyRole } = useUserRoles()

  // Mock user data - replace with actual auth context
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
  }

  const handleLogout = async () => {
    // Add logout logic here
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EnglishPro</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </div>

            {/* Give Test Button */}
            <div className="flex items-center space-x-4">
              <Button
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
                asChild
              >
                <Link href="/select-test">
                  <FileText className="w-4 h-4 mr-2" />
                  Give Test
                </Link>
              </Button>

              {/* Reviewer Link - Only show for reviewers */}
              {hasAnyRole(['reviewer', 'admin', 'super_admin']) && (
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  asChild
                >
                  <Link href="/reviewer">
                    <Eye className="w-4 h-4 mr-2" />
                    Review Tests
                  </Link>
                </Button>
              )}

              {/* User Menu */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}! 👋</h2>
          <p className="text-gray-600">
            Ready to advance your English skills? Choose from the options below to get started.
          </p>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex bg-white border border-gray-200 p-1 rounded-lg">
            <TabsTrigger
              value="my-tests"
              className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">My Tests</span>
            </TabsTrigger>
            <TabsTrigger
              value="practice"
              className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
            <TabsTrigger
              value="test-info"
              className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Test Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Jobs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-tests" className="space-y-6">
            <MyTests />
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            <Practice />
          </TabsContent>

          <TabsContent value="test-info" className="space-y-6">
            <TestInfo />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Jobs />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
