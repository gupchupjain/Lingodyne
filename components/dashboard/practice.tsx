"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, BookOpen, Headphones, Mic, PenTool, Clock, Users, Star } from "lucide-react"

const practiceFeatures = [
  {
    icon: BookOpen,
    title: "Reading Comprehension",
    description: "Sample passages with multiple choice questions",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: PenTool,
    title: "Writing Skills",
    description: "Writing prompts with feedback",
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    icon: Mic,
    title: "Speaking Assessment",
    description: "Record responses to speaking prompts",
    color: "text-teal-600 bg-teal-100",
  },
  {
    icon: Headphones,
    title: "Listening Comprehension",
    description: "Audio clips with comprehension questions",
    color: "text-lime-600 bg-lime-100",
  },
]

export default function Practice() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Play className="w-5 h-5" />
            <span>Practice Tests - Coming Soon</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            We're developing interactive practice tests to help you prepare for the full assessment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-blue-100 text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>15-20 minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Free for all users</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Instant feedback</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* What's Coming */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">What's Coming in Practice Tests</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {practiceFeatures.map((feature, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6 text-center">
            <h4 className="font-semibold text-amber-800 mb-2">Practice Tests in Development</h4>
            <p className="text-amber-700 text-sm">
              We're working hard to bring you comprehensive practice tests. Stay tuned for updates!
            </p>
            <Button disabled className="mt-4 bg-amber-300 cursor-not-allowed">
              <Play className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
