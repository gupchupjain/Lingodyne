"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Info, Loader2, AlertTriangle, BookOpen, Edit3, MicVocal, Headphones } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function DemoEnglishTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleStartDemo = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // No need to create a test instance. We'll pass a flag or use a specific route
      // for the demo test taking interface that fetches questions directly.
      // For now, let's assume the take-test page can handle a special 'demo' testId
      // or we create a new page like /demo-test/take.
      // Let's redirect to a conceptual /take-demo-test page which will handle fetching demo questions.
      router.push("/take-demo-test?lang=English&type=demo")
    } catch (err) {
      console.error("Error initiating demo test (client-side):", err)
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      setError(message)
      toast({
        title: "Error",
        description: `Failed to start demo test: ${message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl overflow-hidden bg-white">
          <CardHeader className="bg-emerald-600 p-8 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <BookOpen size={32} />
              <CardTitle className="text-4xl font-bold">Free English Demo Test</CardTitle>
            </div>
            <CardDescription className="text-emerald-100 text-lg">
              Experience our interactive English proficiency assessment. No account needed!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-700 mb-3">What to Expect</h2>
              <p className="text-slate-600 leading-relaxed">
                This demo provides a glimpse into our full English test format. You'll encounter various question types
                across Reading, Writing, Listening, and Speaking sections. It's designed to be quick and informative.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <div className="flex items-center text-emerald-700 mb-2">
                  <Clock size={20} className="mr-2" />
                  <h3 className="font-semibold text-lg">Duration</h3>
                </div>
                <p className="text-slate-600">
                  Approximately <span className="font-bold">15 minutes</span>.
                </p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <div className="flex items-center text-emerald-700 mb-2">
                  <CheckCircle size={20} className="mr-2" />
                  <h3 className="font-semibold text-lg">Sections Covered</h3>
                </div>
                <ul className="text-slate-600 list-disc list-inside space-y-1">
                  <li>Reading Comprehension</li>
                  <li>Basic Writing Task</li>
                  <li>Listening Snippet</li>
                  <li>Short Speaking Prompt</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-3">Test Sections Overview:</h3>
              <div className="space-y-3">
                {[
                  { name: "Reading", icon: BookOpen, desc: "Understand short texts and answer questions." },
                  { name: "Writing", icon: Edit3, desc: "Compose a short paragraph on a given topic." },
                  {
                    name: "Listening",
                    icon: Headphones,
                    desc: "Listen to an audio clip and answer related questions.",
                  },
                  { name: "Speaking", icon: MicVocal, desc: "Record a short response to a prompt." },
                ].map((section) => (
                  <div key={section.name} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-md">
                    <section.icon className="w-6 h-6 text-emerald-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-slate-800">{section.name}</h4>
                      <p className="text-sm text-slate-500">{section.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                <AlertTriangle size={20} className="mr-3 mt-0.5 text-red-500" />
                <div>
                  <h4 className="font-semibold">Could not start demo:</h4>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-sky-50 border border-sky-200 p-6 rounded-lg">
              <div className="flex items-start">
                <Info size={24} className="mr-3 text-sky-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-sky-700 mb-1">Important Notes:</h3>
                  <ul className="text-sky-600 text-sm list-disc list-inside space-y-1">
                    <li>
                      Your answers in this demo will <span className="font-semibold">not</span> be saved or graded.
                    </li>
                    <li>This is for experience purposes only.</li>
                    <li>Ensure your microphone is enabled for the speaking section.</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 p-8">
            <Button
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-3 shadow-lg transition-transform duration-150 hover:scale-105"
              onClick={handleStartDemo}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Starting Demo...
                </>
              ) : (
                "Start Free Demo Test Now"
              )}
            </Button>
          </CardFooter>
        </Card>
        <p className="text-center text-sm text-slate-500 mt-8">
          Ready for the full experience?{" "}
          <a href="/signup" className="font-medium text-emerald-600 hover:text-emerald-700">
            Sign up
          </a>{" "}
          or{" "}
          <a href="/pricing" className="font-medium text-emerald-600 hover:text-emerald-700">
            view pricing
          </a>
          .
        </p>
      </div>
    </div>
  )
}
