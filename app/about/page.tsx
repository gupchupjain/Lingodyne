import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users, Award, Globe, Shield } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Button variant="ghost" className="mb-4" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About LinguaCert</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make professional language certification accessible, credible, and recognized
              worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Recognition</h3>
                <p className="text-gray-600">
                  Our certificates are recognized by employers and institutions worldwide, helping professionals advance
                  their careers internationally.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Evaluators</h3>
                <p className="text-gray-600">
                  Every test is manually reviewed by certified language professionals with years of experience in
                  language assessment.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Standards</h3>
                <p className="text-gray-600">
                  Our tests follow international language proficiency frameworks and are designed to meet industry
                  requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-lime-100 text-lime-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Verified</h3>
                <p className="text-gray-600">
                  Each certificate includes unique QR codes and verification systems to ensure authenticity and prevent
                  fraud.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who have advanced their careers with LinguaCert.
            </p>
            <div className="space-x-4">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600" asChild>
                <Link href="/demo">Try Free Demo</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/languages">View Languages</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
