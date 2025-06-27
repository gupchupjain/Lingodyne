"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, BookOpen, Play, Award, FileText } from "lucide-react"
import Link from "next/link"

interface TestTemplate {
  id: string
  language: string
  test_type: "full" | "practice" | "demo"
  title: string
  description: string
  duration_minutes: number
}

interface GroupedTests {
  [language: string]: {
    language: string
    full: TestTemplate[]
    practice: TestTemplate[]
    demo: TestTemplate[]
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

const testTypePrices: Record<string, string> = {
  full: "$49",
  practice: "Free",
  demo: "Free",
}

export default function SelectTestPage() {
  const [groupedTests, setGroupedTests] = useState<GroupedTests>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTestTemplates()
  }, [])

  const fetchTestTemplates = async () => {
    try {
      const response = await fetch("/api/test-templates")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tests")
      }

      setGroupedTests(data.groupedTests)
    } catch (error) {
      console.error("Error fetching test templates:", error)
      setError("Failed to load test templates")
    } finally {
      setIsLoading(false)
    }
  }

  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case "full":
        return <Award className="w-4 h-4" />
      case "practice":
        return <BookOpen className="w-4 h-4" />
      case "demo":
        return <Play className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case "full":
        return "bg-green-100 text-green-700"
      case "practice":
        return "bg-blue-100 text-blue-700"
      case "demo":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available tests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchTestTemplates}>Try Again</Button>
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
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Select a Test</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Language Test</h2>
          <p className="text-gray-600">
            Select from our available language proficiency tests. Practice tests are free to help you prepare.
          </p>
        </div>

        {Object.keys(groupedTests).length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tests Available</h3>
              <p className="text-gray-600">There are currently no active tests available. Please check back later.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.values(groupedTests).map((languageGroup) => (
              <div key={languageGroup.language} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{languageFlags[languageGroup.language] || "🌐"}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{languageGroup.language}</h3>
                </div>

                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Full Tests */}
                  {languageGroup.full.map((test) => (
                    <Card
                      key={test.id}
                      className="shadow-lg hover:shadow-xl transition-shadow border-2 border-green-200"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            {getTestTypeIcon(test.test_type)}
                            <span>{test.title}</span>
                          </CardTitle>
                          <Badge className={getTestTypeColor(test.test_type)}>Official Test</Badge>
                        </div>
                        <CardDescription>{test.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{test.duration_minutes} minutes</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            asChild
                          >
                            <Link href={`/test-details/${test.id}`}>
                              <FileText className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>

                          {/* Show practice test if available */}
                          {languageGroup.practice.length > 0 && (
                            <Button variant="outline" className="w-full bg-transparent" asChild>
                              <Link href={`/test-details/${languageGroup.practice[0].id}`}>
                                <BookOpen className="w-4 h-4 mr-2" />
                                Practice Test Details
                              </Link>
                            </Button>
                          )}

                          {/* Show demo test if available */}
                          {languageGroup.demo.length > 0 && (
                            <Button
                              variant="ghost"
                              className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              asChild
                            >
                              <Link href={`/test-details/${languageGroup.demo[0].id}`}>
                                <Play className="w-4 h-4 mr-2" />
                                Demo Test Details
                              </Link>
                            </Button>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 space-y-1">
                          <p>✓ Human-evaluated by certified experts</p>
                          <p>✓ Official certificate with QR verification</p>
                          <p>✓ Results within 3-5 business days</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
