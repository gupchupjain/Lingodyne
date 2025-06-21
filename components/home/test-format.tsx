import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, PenTool, Mic, Headphones, Clock, User } from "lucide-react"

const testSections = [
  {
    icon: BookOpen,
    title: "Reading Comprehension",
    duration: "30 minutes",
    format: "Multiple Choice Questions",
    description: "Test your ability to understand written texts, articles, and professional documents.",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: PenTool,
    title: "Writing Skills",
    duration: "45 minutes",
    format: "Essay Writing",
    description: "Demonstrate your writing abilities through structured essays and professional communication.",
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    icon: Mic,
    title: "Speaking Assessment",
    duration: "20 minutes",
    format: "Audio Recording",
    description: "Record your responses to speaking prompts to showcase your oral communication skills.",
    color: "text-teal-600 bg-teal-100",
  },
  {
    icon: Headphones,
    title: "Listening Comprehension",
    duration: "25 minutes",
    format: "Audio + Written Response",
    description: "Listen to conversations and lectures, then provide written responses to demonstrate understanding.",
    color: "text-lime-600 bg-lime-100",
  },
]

export default function TestFormat() {
  return (
    <section id="tests" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Comprehensive Test Format</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our tests evaluate all four essential language skills through a structured, professionally designed
            assessment that takes approximately 2 hours to complete.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testSections.map((section, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{section.duration}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{section.format}</p>
                    <p className="text-gray-600 leading-relaxed">{section.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Process */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Purchase Test</h4>
              <p className="text-sm text-gray-600">Choose your language and complete secure payment</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Take Test</h4>
              <p className="text-sm text-gray-600">Complete all four sections at your own pace</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Human Review</h4>
              <p className="text-sm text-gray-600">Expert evaluators manually score your test</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Certificate</h4>
              <p className="text-sm text-gray-600">Download your verified certificate with QR code</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
