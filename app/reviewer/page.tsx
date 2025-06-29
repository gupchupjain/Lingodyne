"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Clock, 
  User, 
  FileText, 
  Eye,
  RefreshCw,
  Shield,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { useUserRoles } from "@/hooks/useUserRoles"

interface TestForReview {
  id: string
  user_id: string
  test_template_id: string
  status: string
  started_at: string | null
  submitted_at: string | null
  created_at: string
  users: {
    email: string
    first_name: string
    last_name: string
  }
  test_templates: {
    id: string
    title: string
    language: string
    test_type: string
  }
}

export default function ReviewerDashboard() {
  const router = useRouter()
  const { roles, loading: rolesLoading, hasAnyRole } = useUserRoles()
  const [tests, setTests] = useState<TestForReview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user has reviewer role
  const hasReviewerAccess = hasAnyRole(['reviewer', 'admin', 'super_admin'])

  useEffect(() => {
    // If roles are loaded and user doesn't have access, redirect
    if (!rolesLoading && !hasReviewerAccess) {
      router.push('/dashboard?error=unauthorized')
      return
    }

    // Only fetch tests if user has access
    if (hasReviewerAccess) {
      fetchTestsForReview()
    }
  }, [rolesLoading, hasReviewerAccess, router])

  const fetchTestsForReview = async () => {
    try {
      setRefreshing(true)
      setError(null)
      const response = await fetch('/api/reviewer/tests')
      
      if (response.status === 403) {
        setError("Access denied. You don't have permission to view this page.")
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch tests for review')
      }
      
      const data = await response.json()
      setTests(data.tests)
    } catch (error) {
      console.error('Error fetching tests:', error)
      setError('Failed to load tests. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const filteredTests = tests.filter(test => 
    test.users.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.test_templates.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.test_templates.language.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Show loading while checking roles
  if (rolesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Checking permissions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show access denied if user doesn't have reviewer role
  if (!hasReviewerAccess) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to access the reviewer dashboard.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchTestsForReview} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tests for review...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviewer Dashboard</h1>
              <p className="text-gray-600">Review and score submitted language tests</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                {roles.join(', ')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tests.filter(t => t.status === 'under_review').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(tests.map(t => t.user_id)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Languages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(tests.map(t => t.test_templates.language)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by email, test title, or language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={fetchTestsForReview}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Tests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tests for Review</CardTitle>
            <CardDescription>
              {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms.' : 'All tests have been reviewed.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Test ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Test</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Language</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Started</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((test) => (
                      <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                          {test.id.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {test.users.first_name} {test.users.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{test.users.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-gray-900">
                            {test.test_templates.title}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {test.test_templates.test_type}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize">
                            {test.test_templates.language}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(test.started_at)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(test.submitted_at)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={test.status === 'under_review' ? 'default' : 'secondary'}
                            className={test.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' : ''}
                          >
                            {test.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            asChild
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Link href={`/reviewer/review/${test.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 