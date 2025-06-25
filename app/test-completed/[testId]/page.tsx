"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, PartyPopper } from "lucide-react"
import Link from "next/link"

export default function TestCompletedPage() {
  const params = useParams()
  const testId = params.testId as string
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason") // 'manual' or 'auto'
  const message = searchParams.get("message")

  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader className="bg-emerald-600 text-white p-6 rounded-t-lg">
          <PartyPopper className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
          <CardTitle className="text-3xl font-bold">Demo Test Completed!</CardTitle>
          {reason === "auto" && (
            <CardDescription className="text-emerald-100 mt-1">
              Your time was up, and the test was submitted automatically.
            </CardDescription>
          )}
          {reason === "manual" && (
            <CardDescription className="text-emerald-100 mt-1">
              You have successfully submitted the demo test.
            </CardDescription>
          )}
          {message && <CardDescription className="text-emerald-100 mt-1">{message}</CardDescription>}
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <CheckCircle2 className="w-20 h-20 mx-auto text-emerald-500" />
          <p className="text-slate-700 text-lg">Thank you for trying out our English Demo Test.</p>
          <p className="text-sm text-slate-500">
            This was a sample experience. For official tests, results will be available after review. Your test ID for
            this demo was: <span className="font-mono bg-slate-100 p-1 rounded text-xs">{testId}</span>
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/demo-english-test")}
              variant="outline"
              className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            >
              Try Demo Again
            </Button>
            <Link href="/pricing" passHref>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Explore Full Tests</Button>
            </Link>
            <Link href="/" passHref>
              <Button variant="ghost" className="w-full text-slate-600 hover:bg-slate-100">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
