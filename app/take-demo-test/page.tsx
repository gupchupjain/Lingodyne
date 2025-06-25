"use client"

import { AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import TestTimer from "@/components/test/test-timer"
import QuestionRenderer from "@/components/test/question-renderer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Send, AlertTriangle, Loader2, PartyPopper } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

interface Question {
  id: string
  section: string
  subsection?: string
  prompt: string
  options?: string[]
  question_type: "mcq" | "fill_blank" | "essay" | "speaking" | "listening_mcq" | "select_word"
  audio_url?: string
  image_url?: string
}

interface Answer {
  question_id: string
  answer_text?: string
  selected_option?: string
  audio_url?: string
}

const SECTIONS = ["Reading", "Writing", "Listening", "Speaking"]

export default function TakeDemoTestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const language = searchParams.get("lang") || "English"
  const testType = searchParams.get("type") || "demo"

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, Answer>>({}) // Still track answers for UI, but won't save
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionInSectionIndex, setCurrentQuestionInSectionIndex] = useState(0)
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false) // For UI purposes
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isTestCompleted, setIsTestCompleted] = useState(false)

  const currentSectionQuestions = questions.filter(
    (q) => q.section.toLowerCase() === SECTIONS[currentSectionIndex].toLowerCase(),
  )
  const currentQuestion = currentSectionQuestions[currentQuestionInSectionIndex]

  const fetchDemoQuestions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/demo-test/questions?lang=${language}&type=${testType}&version=DEMO`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to fetch demo questions (status: ${response.status})`)
      }
      const data = await response.json()
      setQuestions(data.questions || [])
      setDurationMinutes(data.duration_minutes || 15) // Default to 15 mins if not provided
      setTimeLeft((data.duration_minutes || 15) * 60)
    } catch (err) {
      console.error("Error fetching demo questions:", err)
      setError((err as Error).message)
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [language, testType])

  useEffect(() => {
    fetchDemoQuestions()
  }, [fetchDemoQuestions])

  const handleAnswerChange = (questionId: string, answer: Partial<Answer>) => {
    // Update UI state for answers, but don't send to backend
    setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], question_id: questionId, ...answer } }))
    // console.log("Demo answer changed (not saved):", questionId, answer)
  }

  const navigateQuestion = (direction: "next" | "prev") => {
    if (direction === "next") {
      if (currentQuestionInSectionIndex < currentSectionQuestions.length - 1) {
        setCurrentQuestionInSectionIndex((prev) => prev + 1)
      } else if (currentSectionIndex < SECTIONS.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1)
        setCurrentQuestionInSectionIndex(0)
      } else {
        toast({
          title: "End of Demo",
          description: "You are at the last question. Click 'Finish Demo' to complete.",
        })
      }
    } else {
      if (currentQuestionInSectionIndex > 0) {
        setCurrentQuestionInSectionIndex((prev) => prev - 1)
      } else if (currentSectionIndex > 0) {
        const prevSectionName = SECTIONS[currentSectionIndex - 1].toLowerCase()
        const prevSectionQuestions = questions.filter((q) => q.section.toLowerCase() === prevSectionName)
        setCurrentSectionIndex((prev) => prev - 1)
        setCurrentQuestionInSectionIndex(prevSectionQuestions.length - 1)
      }
    }
  }

  const navigateToSection = (sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < SECTIONS.length) {
      setCurrentSectionIndex(sectionIndex)
      setCurrentQuestionInSectionIndex(0)
    }
  }

  const finishDemo = (reason: "manual" | "auto" = "manual") => {
    setIsSubmitting(true) // For UI feedback
    // No actual submission to backend
    toast({
      title: "Demo Finished!",
      description: `You've completed the demo test. Your answers were not saved.`,
    })
    setIsTestCompleted(true)
    // No router.push to a results page unless we make a generic one
    setIsSubmitting(false)
  }

  const handleTimeUp = () => {
    toast({ title: "Time's Up!", description: "The demo time has finished.", variant: "warning" })
    finishDemo("auto")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-emerald-700 text-lg">Loading Demo Test...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Error Loading Demo</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.push("/demo-english-test")} className="bg-red-600 hover:bg-red-700">
          Back to Demo Info
        </Button>
      </div>
    )
  }

  if (isTestCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 text-center">
        <PartyPopper className="w-20 h-20 text-emerald-500 mb-6" />
        <h1 className="text-4xl font-bold text-emerald-700 mb-4">Demo Test Completed!</h1>
        <p className="text-slate-600 text-lg mb-8 max-w-md">
          Thank you for trying our English demo test. We hope you got a good feel for our platform. Your answers in this
          demo were not saved or graded.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            size="lg"
            onClick={() => router.push("/demo-english-test")}
            variant="outline"
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            Try Demo Again
          </Button>
          <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/pricing">Explore Full Tests</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!currentQuestion && questions.length > 0) {
    // This can happen if currentSectionIndex or currentQuestionInSectionIndex is out of bounds
    // after questions load. Reset to first question of first available section.
    let firstAvailableSectionIndex = 0
    for (let i = 0; i < SECTIONS.length; i++) {
      if (questions.some((q) => q.section.toLowerCase() === SECTIONS[i].toLowerCase())) {
        firstAvailableSectionIndex = i
        break
      }
    }
    setCurrentSectionIndex(firstAvailableSectionIndex)
    setCurrentQuestionInSectionIndex(0)
    // This will cause a re-render, and currentQuestion should be defined then.
    // Return a temporary loader or null.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-emerald-700 text-lg">Initializing questions...</p>
      </div>
    )
  }

  if (!currentQuestion && questions.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-semibold text-amber-700 mb-2">No Questions Found</h2>
        <p className="text-amber-600 mb-4">
          We couldn't find any questions for this demo test. Please try again later or contact support.
        </p>
        <Button onClick={() => router.push("/demo-english-test")} className="bg-amber-600 hover:bg-amber-700">
          Back to Demo Info
        </Button>
      </div>
    )
  }

  const totalQuestions = questions.length
  const answeredQuestionsCount = Object.keys(answers).filter((qid) => {
    const ans = answers[qid]
    return (ans.answer_text && ans.answer_text.trim() !== "") || ans.selected_option || ans.audio_url
  }).length
  const progressPercentage = totalQuestions > 0 ? (answeredQuestionsCount / totalQuestions) * 100 : 0

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-emerald-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">English Demo Test</h1>
          {timeLeft !== null && durationMinutes !== null && (
            <TestTimer initialTime={timeLeft} onTimeUp={handleTimeUp} />
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-1/4 space-y-6">
          <div className="p-4 bg-white rounded-lg shadow border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-700 mb-3">Sections</h3>
            <ul className="space-y-1">
              {SECTIONS.map((section, index) => {
                const sectionHasQuestions = questions.some((q) => q.section.toLowerCase() === section.toLowerCase())
                if (!sectionHasQuestions) return null // Don't show section if no questions for it
                return (
                  <li key={section}>
                    <Button
                      variant={currentSectionIndex === index ? "default" : "ghost"}
                      onClick={() => navigateToSection(index)}
                      className={`w-full justify-start ${currentSectionIndex === index ? "bg-emerald-600 text-white hover:bg-emerald-700" : "text-slate-700 hover:bg-emerald-100"}`}
                    >
                      {section}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="p-4 bg-white rounded-lg shadow border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">Progress</h3>
            <Progress value={progressPercentage} className="w-full [&>*]:bg-emerald-500" />
            <p className="text-sm text-slate-500 mt-1">
              {answeredQuestionsCount} of {totalQuestions} questions answered (demo only)
            </p>
          </div>
        </aside>

        <section className="lg:w-3/4 bg-white p-6 rounded-lg shadow-lg border border-emerald-200 flex flex-col">
          {currentQuestion ? (
            <>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-emerald-700 mb-1">
                  {SECTIONS[currentSectionIndex]}: Question {currentQuestionInSectionIndex + 1} of{" "}
                  {currentSectionQuestions.length}
                </h2>
                <p className="text-sm text-slate-500">{currentQuestion.subsection || "General"}</p>
              </div>

              <div className="flex-grow mb-6 min-h-[300px]">
                <QuestionRenderer
                  question={currentQuestion}
                  currentAnswer={answers[currentQuestion.id] || { question_id: currentQuestion.id }}
                  onAnswerChange={handleAnswerChange}
                  isDemo={true} // Indicate it's a demo, so QuestionRenderer might disable saving if it had such logic
                />
              </div>

              <div className="mt-auto pt-6 border-t border-slate-200 flex justify-between items-center">
                <Button
                  onClick={() => navigateQuestion("prev")}
                  disabled={currentSectionIndex === 0 && currentQuestionInSectionIndex === 0}
                  variant="outline"
                  className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {currentSectionIndex === SECTIONS.length - 1 &&
                currentQuestionInSectionIndex === currentSectionQuestions.length - 1 ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-green-500 hover:bg-green-600 text-white" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        Finish Demo
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Finish Demo Test?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You've reached the end of the demo. Your answers will not be saved.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Practicing</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => finishDemo("manual")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Yes, Finish Demo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button
                    onClick={() => navigateQuestion("next")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
              <p className="text-slate-600">Loading question...</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
