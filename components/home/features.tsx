import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Award, Clock, Globe, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Human-Evaluated Tests",
    description: "Every test is manually reviewed by certified language experts for maximum accuracy and credibility.",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: Award,
    title: "Job-Ready Certificates",
    description: "Earn certificates recognized by employers worldwide with QR verification and unique certificate IDs.",
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    icon: Globe,
    title: "Multiple Languages",
    description: "Get certified in English, German, Spanish, French, and more languages with standardized testing.",
    color: "text-teal-600 bg-teal-100",
  },
  {
    icon: Clock,
    title: "Flexible Testing",
    description: "Take tests at your own pace with progress saving and the ability to resume where you left off.",
    color: "text-lime-600 bg-lime-100",
  },
  {
    icon: Users,
    title: "Expert Feedback",
    description: "Receive detailed feedback from language professionals to help improve your skills.",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: CheckCircle,
    title: "Instant Verification",
    description: "Employers can instantly verify your certificates using QR codes and our online verification system.",
    color: "text-emerald-600 bg-emerald-100",
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Lingodyne?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide the most credible and comprehensive language certification platform designed specifically for job
            seekers and professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
