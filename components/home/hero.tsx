"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star, Users, Award, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-16 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
              🎯 Job-Ready Language Certificates
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Get Certified in{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Multiple Languages
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Take professional language proficiency tests and earn certificates recognized by employers worldwide.
              Human-evaluated for maximum credibility.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">50,000+ Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">Industry Recognized</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
                asChild
              >
                <Link href="/demo">
                  Start Free Demo
                  <Play className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3" asChild>
                <Link href="/languages">View Languages</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Trusted by professionals at:</p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 opacity-60">
                <div className="text-lg font-semibold text-gray-400">Google</div>
                <div className="text-lg font-semibold text-gray-400">Microsoft</div>
                <div className="text-lg font-semibold text-gray-400">Amazon</div>
                <div className="text-lg font-semibold text-gray-400">Meta</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="space-y-6">
                {/* Mock test interface */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">English Proficiency Test</h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Certified
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-900">Reading Comprehension</span>
                    <span className="text-sm text-green-600">9.2/10</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm font-medium text-emerald-900">Writing Skills</span>
                    <span className="text-sm text-emerald-600">8.8/10</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                    <span className="text-sm font-medium text-teal-900">Speaking Fluency</span>
                    <span className="text-sm text-teal-600">9.0/10</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-lime-50 rounded-lg">
                    <span className="text-sm font-medium text-lime-900">Listening Skills</span>
                    <span className="text-sm text-lime-600">8.9/10</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Overall Score</span>
                    <span className="text-2xl font-bold text-green-600">8.97/10</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Professional Level - Job Ready</p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              🏆 Certificate Ready
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              ✨ Human Evaluated
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
