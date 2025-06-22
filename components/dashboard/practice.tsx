"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, BookOpen, Headphones, Mic, PenTool, ChevronDown, Star, Clock, Users } from "lucide-react"
import Link from "next/link"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", popular: true },
  { code: "de", name: "German", flag: "🇩🇪", popular: true },
  { code: "es", name: "Spanish", flag: "🇪🇸", popular: true },
  { code: "fr", name: "French", flag: "🇫🇷", popular: false },
  { code: "it", name: "Italian", flag: "🇮🇹", popular: false },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", popular: false },
]

const practiceFeatures = [
  {
    icon: BookOpen,
    title: "Reading Comprehension",
    description: "2-3 sample passages with multiple choice questions",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: PenTool,
    title: "Writing Skills",
    description: "Short writing prompt with instant feedback",
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Play className="w-5 h-5" />
            <span>Practice Tests</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Try our free practice tests to get familiar with the format and question types.
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
              <span>Sample feedback included</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Language Selection */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Select Language</CardTitle>
            <CardDescription>Choose the language you want to practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedLang?.flag}</span>
                  <span className="font-medium">{selectedLang?.name}</span>
                  {selectedLang?.popular && <Badge className="bg-green-100 text-green-700 text-xs">Popular</Badge>}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code)
                        setIsDropdownOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {lang.popular && <Badge className="bg-green-100 text-green-700 text-xs">Popular</Badge>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Start Practice Button */}
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              asChild
            >
              <Link href={`/practice-test/${selectedLanguage}`}>
                <Play className="w-4 h-4 mr-2" />
                Start Practice Test
              </Link>
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Practice tests are free and don't count towards your official score
            </p>
          </CardContent>
        </Card>

        {/* What's Included */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">What's Included in Practice</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {practiceFeatures.map((feature, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
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

          {/* Practice vs Full Test */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-amber-800 mb-2">Practice vs Full Test</h4>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-amber-700 mb-1">Practice Test (Free)</h5>
                  <ul className="text-amber-600 space-y-1">
                    <li>• 2-4 questions per section</li>
                    <li>• 15-20 minutes total</li>
                    <li>• Sample feedback only</li>
                    <li>• No certificate</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-amber-700 mb-1">Full Test ($49)</h5>
                  <ul className="text-amber-600 space-y-1">
                    <li>• Complete 4-section assessment</li>
                    <li>• 2 hours total</li>
                    <li>• Expert human evaluation</li>
                    <li>• Official certificate</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
