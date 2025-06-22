"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Clock, BookOpen, PenTool, Mic, Headphones, Target, Calendar, HelpCircle } from "lucide-react"

const testSections = [
  {
    icon: BookOpen,
    title: "Reading Comprehension",
    duration: "30 minutes",
    questions: "15-20 questions",
    description: "Multiple choice questions based on business articles, reports, and professional documents.",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: PenTool,
    title: "Writing Skills",
    duration: "45 minutes",
    questions: "2 writing tasks",
    description: "Business email writing and essay composition on professional topics.",
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    icon: Mic,
    title: "Speaking Assessment",
    duration: "20 minutes",
    questions: "4-6 speaking tasks",
    description: "Record responses to workplace scenarios and professional discussions.",
    color: "text-teal-600 bg-teal-100",
  },
  {
    icon: Headphones,
    title: "Listening Comprehension",
    duration: "25 minutes",
    questions: "20-25 questions",
    description: "Business conversations, presentations, and workplace communications.",
    color: "text-lime-600 bg-lime-100",
  },
]

const faqs = [
  {
    question: "How is the test scored?",
    answer:
      "Each section is scored 0-10 points by certified human evaluators. Total score is 0-40 points. A score of 25+ is considered passing for most professional purposes.",
  },
  {
    question: "How long are results valid?",
    answer:
      "Test results and certificates are valid for 1 year from the issue date. Many employers prefer certificates issued within the last 2 years.",
  },
  {
    question: "Can I retake the test?",
    answer:
      "Yes, you can retake any test after a 30-day waiting period. Retakes are offered at a 50% discount from the original price.",
  },
  {
    question: "What happens if I don't pass?",
    answer:
      "You'll receive detailed feedback on areas for improvement. You can retake the test after 30 days with personalized study recommendations.",
  },
  {
    question: "Is the certificate recognized internationally?",
    answer:
      "Yes, our certificates include QR verification and are recognized by employers worldwide. Each certificate has a unique ID for instant verification.",
  },
]

export default function TestInfo() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Award className="w-5 h-5" />
            <span>Test Information</span>
          </CardTitle>
          <CardDescription className="text-purple-100">
            Everything you need to know about our English proficiency tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1 text-purple-100">
                <Users className="w-4 h-4" />
                <span className="text-sm">Human Evaluated</span>
              </div>
              <p className="text-white font-semibold">Expert Review</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1 text-purple-100">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Total Duration</span>
              </div>
              <p className="text-white font-semibold">2 Hours</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1 text-purple-100">
                <Target className="w-4 h-4" />
                <span className="text-sm">Pass Score</span>
              </div>
              <p className="text-white font-semibold">25/40 Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Sections */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Test Sections</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {testSections.map((section, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {section.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{section.questions}</p>
                    <p className="text-sm text-gray-700">{section.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Scoring Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span>Scoring & Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Score Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Reading Comprehension</span>
                  <Badge variant="outline">0-10 points</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Writing Skills</span>
                  <Badge variant="outline">0-10 points</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Speaking Assessment</span>
                  <Badge variant="outline">0-10 points</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Listening Comprehension</span>
                  <Badge variant="outline">0-10 points</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                  <span className="text-sm font-semibold">Total Score</span>
                  <Badge className="bg-green-100 text-green-700">0-40 points</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Performance Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">0-15: Needs Improvement</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">16-24: Developing</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">25-32: Proficient</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">33-40: Advanced</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-green-600" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Validity */}
      <Card className="bg-green-50 border-green-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Calendar className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Certificate Validity</h4>
              <p className="text-green-700 text-sm leading-relaxed">
                Your certificate is valid for <strong>1 year</strong> from the issue date and includes QR verification
                for instant authenticity checking. Employers can verify your certificate anytime using the unique
                certificate ID provided.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
