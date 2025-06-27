"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Play,
  ShoppingCart,
  Award,
  FileText,
  Headphones,
  Mic,
  PenTool,
  CheckCircle,
  Users,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface TestDetails {
  id: string
  language: string
  test_type: "full" | "practice" | "demo"
  title: string
  description: string
  duration_minutes: number
  is_active: boolean
  created_at: string
  totalQuestions: number
  sectionBreakdown: Record<string, number>
  pricing: {
    price: string
    priceInCents: number
  }
}

const languageFlags: Record<string, string> = {
  English: "🇺🇸",
  German: "🇩🇪",
  Spanish: "🇪🇸",
  French: "🇫🇷",
  Italian: "🇮🇹",
  Portuguese: "🇵🇹",
}

const sectionIcons: Record<string, any> = {
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
  listening: Headphones,
}

const sectionNames: Record<string, string> = {
  reading: "Reading Comprehension",
  writing: "Writing Skills",
  speaking: "Speaking Assessment",
  listening: "Listening Comprehension",
}

export default function TestDetailsPage() {
  const params = useParams()
  const testId = params.id as string

  const [testDetails, setTestDetails] = useState<TestDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (testId) {
      fetchTestDetails()
    }
  }, [testId])

  const fetchTestDetails = async () => {
    try {
      const response = await fetch(`/api/test-templates/${testId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch test details")
      }

      setTestDetails(data.testDetails)
    } catch (error) {
      console.error("Error fetching test details:", error)
      setError("Failed to load test details")
    } finally {
      setIsLoading(false)
    }
  }

  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case "full":
        return <Award className="w-5 h-5" />
      case "practice":
        return <BookOpen className="w-5 h-5" />
      case "demo":
        return <Play className="w-5 h-5" />
      default:
        return <BookOpen className="w-5 h-5" />
    }
  }

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case "full":
        return "bg-green-100 text-green-700 border-green-200"
      case "practice":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "demo":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getActionButton = () => {
    if (!testDetails) return null

    if (testDetails.test_type === "full") {
      return (
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
          asChild
        >
          <Link href={`/purchase/${testDetails.id}`}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Buy Test - {testDetails.pricing.price}
          </Link>
        </Button>
      )
    } else {
      return (
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
          asChild
        >
          <Link href={`/take-test/${testDetails.id}`}>
            <Play className="w-5 h-5 mr-2" />
            Start {testDetails.test_type === "demo" ? "Demo" : "Practice"} Test - Free
          </Link>
        </Button>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test details...</p>
        </div>
      </div>
    )
  }

  if (error || !testDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error || "Test not found"}</p>
            <Button asChild>
              <Link href="/select-test">Back to Test Selection</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" asChild>
              <Link href="/select-test">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Test Selection
              </Link>
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Test Details</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Test Header */}
          <Card className="shadow-xl border-2 border-green-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{languageFlags[testDetails.language] || "🌐"}</span>
                  <div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">{testDetails.title}</CardTitle>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getTestTypeColor(testDetails.test_type)} font-medium`}>
                        {getTestTypeIcon(testDetails.test_type)}
                        <span className="ml-1 capitalize">{testDetails.test_type} Test</span>
                      </Badge>
                      <Badge variant="outline">{testDetails.language}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{testDetails.pricing.price}</div>
                  {testDetails.test_type === "full" && <div className="text-sm text-gray-500">per test</div>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <CardDescription className="text-base leading-relaxed">{testDetails.description}</CardDescription>

              {/* Key Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{testDetails.duration_minutes} minutes</div>
                  <div className="text-sm text-gray-600">Total Duration</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{testDetails.totalQuestions} questions</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Human Reviewed</div>
                  <div className="text-sm text-gray-600">Expert Evaluation</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">{getActionButton()}</div>
            </CardContent>
          </Card>

          {/* Section Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span>Test Sections</span>
              </CardTitle>
              <CardDescription>Breakdown of questions by section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(testDetails.sectionBreakdown).map(([section, count]) => {
                  const IconComponent = sectionIcons[section] || BookOpen
                  return (
                    <div key={section} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{sectionNames[section] || section}</div>
                        <div className="text-sm text-gray-600">
                          {count} question{count !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Test Features */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>What's Included</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Human evaluation by certified experts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Detailed performance feedback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Section-wise score breakdown</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {testDetails.test_type === "full" && (
                    <>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Official certificate with QR verification</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Results within 3-5 business days</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Save progress and resume anytime</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          {testDetails.test_type === "full" && (
            <Card className="bg-green-50 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Globally Recognized Certificate</h4>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Your certificate will be recognized by employers worldwide and includes a unique QR code for
                      instant verification. Perfect for job applications, visa requirements, and academic purposes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
