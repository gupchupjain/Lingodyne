"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Award,
  Download,
  Eye,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Hourglass,
} from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API calls
const mockCertificates = [
  {
    id: "cert-001",
    language: "English",
    issueDate: "2024-01-15",
    score: 32,
    status: "graded",
  },
  {
    id: "cert-002",
    language: "German",
    issueDate: "2024-01-10",
    score: 28,
    status: "graded",
  },
]

const mockTestHistory = [
  {
    id: "test-001",
    language: "English",
    date: "2024-01-15",
    score: 32,
    status: "graded",
  },
  {
    id: "test-002",
    language: "German",
    date: "2024-01-10",
    score: 28,
    status: "graded",
  },
  {
    id: "test-003",
    language: "French",
    date: "2024-01-05",
    score: null,
    status: "pending",
  },
  {
    id: "test-004",
    language: "Spanish",
    date: "2023-12-20",
    score: 22,
    status: "failed",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "graded":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "pending":
      return <Hourglass className="w-4 h-4 text-yellow-600" />
    case "failed":
      return <AlertCircle className="w-4 h-4 text-red-600" />
    default:
      return <Clock className="w-4 h-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string, score?: number) => {
  switch (status) {
    case "graded":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Passed ({score}/40)</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Under Review</Badge>
    case "failed":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Failed ({score}/40)</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export default function MyTests() {
  return (
    <div className="space-y-6">
      {/* Buy Test Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <ShoppingCart className="w-5 h-5" />
            <span>Ready for Your Next Test?</span>
          </CardTitle>
          <CardDescription className="text-green-100">
            Take a comprehensive English proficiency test and get certified by our expert evaluators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-2">
              <p className="text-green-100 text-sm">
                ✓ Human-evaluated by certified experts
                <br />✓ Official certificate with QR verification
                <br />✓ Results within 3-5 business days
              </p>
            </div>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6" asChild>
              <Link href="/purchase-test">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy New Test
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
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
            {mockCertificates.length > 0 ? (
              <div className="space-y-4">
                {mockCertificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{cert.language}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/certificate/${cert.id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No certificates yet</p>
                <Button variant="outline" asChild>
                  <Link href="/purchase-test">Take Your First Test</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test History Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Test History</span>
            </CardTitle>
            <CardDescription>All your submitted tests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {mockTestHistory.length > 0 ? (
              <div className="space-y-3">
                {mockTestHistory.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{test.language}</h4>
                        <p className="text-sm text-gray-600">{new Date(test.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(test.status, test.score)}
                      {(test.status === "failed" || test.status === "graded") && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/purchase-test">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Retake
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No test history yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
