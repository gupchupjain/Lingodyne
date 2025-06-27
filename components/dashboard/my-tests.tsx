"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Award, Clock } from "lucide-react"

export default function MyTests() {
  return (
    <div className="space-y-6">
      {/* Coming Soon Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <ShoppingCart className="w-5 h-5" />
            <span>Test System Coming Soon</span>
          </CardTitle>
          <CardDescription className="text-green-100">
            We're building a comprehensive English proficiency test system with expert evaluation.
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
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6" disabled>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Coming Soon
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
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No certificates yet</p>
              <p className="text-sm text-gray-500">Test system coming soon</p>
            </div>
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
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No test history yet</p>
              <p className="text-sm text-gray-500">Test system coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
