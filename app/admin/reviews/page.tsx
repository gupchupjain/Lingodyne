"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  CheckSquare,
  Clock,
  User,
  FileText,
  Calendar,
  Star
} from "lucide-react"

interface TestToReview {
  id: string
  status: string
  submitted_at: string
  final_score: number | null
  max_possible_score: number | null
  is_passed: boolean | null
  created_at: string
  users: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  test_templates: {
    id: string
    title: string
    language: string
    test_type: string
    duration_minutes: number
  }
}

export default function TestReviewsPage() {
  const router = useRouter()
  const [testsToReview, setTestsToReview] = useState<TestToReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestsToReview()
  }, [])

  const fetchTestsToReview = async () => {
    try {
      const response = await fetch("/api/admin/reviews")
      if (response.ok) {
        const data = await response.json()
        setTestsToReview(data.tests)
      }
    } catch (error) {
      console.error("Error fetching tests to review:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests to review...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Test Reviews</h1>
                <p className="text-sm text-gray-600">Review submitted tests and provide feedback</p>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {testsToReview.length} Pending Reviews
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {testsToReview.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tests to review</h3>
            <p className="text-gray-600">All submitted tests have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testsToReview.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{test.test_templates.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {test.users.first_name} {test.users.last_name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{test.users.email}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Test Type</span>
                      <Badge variant="outline" className="capitalize">{test.test_templates.test_type}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Language</span>
                      <Badge variant="outline">{test.test_templates.language}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duration</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{test.test_templates.duration_minutes} min</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Submitted</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{getTimeAgo(test.submitted_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Submitted At</span>
                      <span className="text-sm text-gray-900">{formatDate(test.submitted_at)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => router.push(`/admin/reviews/${test.id}`)}
                      className="w-full"
                    >
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Review Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
