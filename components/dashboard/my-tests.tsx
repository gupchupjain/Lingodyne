"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Award, Clock, FileText, Play, CheckCircle, AlertCircle, Pause, XCircle } from "lucide-react"
import Link from "next/link"

interface UserTest {
  id: string
  test_template_id: string
  status: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'reviewed' | 'cancelled'
  started_at: string | null
  submitted_at: string | null
  reviewed_at: string | null
  final_score: number | null
  max_possible_score: number | null
  is_passed: boolean | null
  certificate_url: string | null
  current_section: string | null
  current_question_index: number
  time_remaining_seconds: number | null
  created_at: string
  test_templates: {
    id: string
    title: string
    language: string
    test_type: string
    duration_minutes: number
    description: string
  } | null
}

export default function MyTests() {
  const [userTests, setUserTests] = useState<UserTest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUserTests()
  }, [])

  const fetchUserTests = async () => {
    try {
      const response = await fetch("/api/user-tests")
      if (!response.ok) {
        throw new Error("Failed to fetch user tests")
      }
      const data = await response.json()
      setUserTests(data.userTests || [])
    } catch (err) {
      setError("Failed to load your tests")
      console.error("Error fetching user tests:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started':
        return <FileText className="w-4 h-4" />
      case 'in_progress':
        return <Play className="w-4 h-4" />
      case 'submitted':
        return <Clock className="w-4 h-4" />
      case 'under_review':
        return <AlertCircle className="w-4 h-4" />
      case 'reviewed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return "bg-gray-100 text-gray-700 border-gray-200"
      case 'in_progress':
        return "bg-blue-100 text-blue-700 border-blue-200"
      case 'submitted':
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case 'under_review':
        return "bg-orange-100 text-orange-700 border-orange-200"
      case 'reviewed':
        return "bg-green-100 text-green-700 border-green-200"
      case 'cancelled':
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started':
        return "Not Started"
      case 'in_progress':
        return "In Progress"
      case 'submitted':
        return "Submitted"
      case 'under_review':
        return "Under Review"
      case 'reviewed':
        return "Reviewed"
      case 'cancelled':
        return "Cancelled"
      default:
        return status
    }
  }

  const getActionButton = (test: UserTest) => {
    switch (test.status) {
      case 'not_started':
        return (
          <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
            <Link href={`/test/${test.id}`}>
              <Play className="w-4 h-4 mr-2" />
              Start Test
            </Link>
          </Button>
        )
      case 'in_progress':
        return (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href={`/test/${test.id}`}>
              <Play className="w-4 h-4 mr-2" />
              Continue Test
            </Link>
          </Button>
        )
      case 'submitted':
      case 'under_review':
        return (
          <Button size="sm" variant="outline" disabled>
            <Clock className="w-4 h-4 mr-2" />
            Under Review
          </Button>
        )
      case 'reviewed':
        return (
          <Button size="sm" variant="outline" asChild>
            <Link href={`/test-results/${test.id}`}>
              <FileText className="w-4 h-4 mr-2" />
              View Results
            </Link>
          </Button>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your tests...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* My Tests Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span>My Tests</span>
          </CardTitle>
          <CardDescription>Tests you've purchased and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchUserTests} variant="outline">
                Try Again
              </Button>
            </div>
          ) : userTests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No tests purchased yet</p>
              <p className="text-sm text-gray-500 mb-4">Purchase a test to get started</p>
              <Button asChild>
                <Link href="/select-test">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Browse Tests
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userTests.map((test) => (
                <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {test.test_templates?.title || "Unknown Test"}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {test.test_templates?.language || "Unknown"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {test.test_templates?.test_type || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{test.test_templates?.duration_minutes || 0} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(test.status)}
                          <span>{getStatusText(test.status)}</span>
                        </div>
                        {test.final_score !== null && (
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>{test.final_score}/{test.max_possible_score}</span>
                          </div>
                        )}
                      </div>
                      {test.status === 'in_progress' && test.current_section && (
                        <div className="mt-2 text-sm text-blue-600">
                          Current: {test.current_section} (Question {test.current_question_index + 1})
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      {getActionButton(test)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificates Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-green-600" />
            <span>My Certificates</span>
          </CardTitle>
          <CardDescription>Your earned certificates from completed tests</CardDescription>
        </CardHeader>
        <CardContent>
          {userTests.filter(test => test.status === 'reviewed' && test.is_passed).length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No certificates yet</p>
              <p className="text-sm text-gray-500">Complete and pass a test to earn your certificate</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userTests
                .filter(test => test.status === 'reviewed' && test.is_passed)
                .map((test) => (
                  <div key={test.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Award className="w-8 h-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-green-900">
                            {test.test_templates?.title || "Unknown Test"}
                          </h4>
                          <p className="text-sm text-green-700">
                            Score: {test.final_score}/{test.max_possible_score} - Passed
                          </p>
                        </div>
                      </div>
                      {test.certificate_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={test.certificate_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4 mr-2" />
                            View Certificate
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
