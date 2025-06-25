"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import TestTimer from "@/components/test/test-timer"
import QuestionRenderer from "@/components/test/question-renderer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Send, AlertTriangle, Loader2 } from "lucide-react"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Define types for better code management
interface Question {
  id: string
  section: string
  subsection?: string
  prompt: string
  options?: string[]
  question_type: "mcq" | "fill_blank" | "essay" | "speaking" | "listening_mcq" | "select_word"
  audio_url?: string
  image_url?: string // Added for potential image-based questions
  // Add other relevant fields from your 'questions' table
}

interface Answer {
  question_id: string
  answer_text?: string
  selected_option?: string // For MCQ
  audio_url?: string // For speaking
}

interface TestDetails {
  id: string
  language: string
  status: string
  duration_minutes: number
  started_at: string | null
  test_template_id: string
}

const SECTIONS = ["Reading", "Writing", "Listening", "Speaking"] // Ensure this order matches your test flow

export default function TakeTestPage() {
  const params = useParams()
  const testId = params.testId as string
  const router = useRouter()

  const [testDetails, setTestDetails] = useState<TestDetails | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionInSectionIndex, setCurrentQuestionInSectionIndex] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const currentSectionQuestions = questions.filter(
    (q) => q.section.toLowerCase() === SECTIONS[currentSectionIndex].toLowerCase(),
  )
  const currentQuestion = currentSectionQuestions[currentQuestionInSectionIndex]

  const fetchTestAndQuestions = useCallback(async () => {
    if (!testId) return
    setIsLoading(true)
    setError(null)

    try {
      // Fetch test details
      const { data: testData, error: testError } = await supabase
        .from("tests")
        .select(`
          id, language, status, started_at, test_template_id,
          test_templates ( duration_minutes )
        `)
        .eq("id", testId)
        .single()

      if (testError || !testData) {
        throw new Error(testError?.message || "Failed to fetch test details.")
      }

      const typedTestData = testData as any // Cast to any to access nested property
      const details: TestDetails = {
        id: typedTestData.id,
        language: typedTestData.language,
        status: typedTestData.status,
        duration_minutes: typedTestData.test_templates.duration_minutes,
        started_at: typedTestData.started_at,
        test_template_id: typedTestData.test_template_id,
      }
      setTestDetails(details)

      if (details.status === "submitted" || details.status === "completed" || details.status === "reviewed") {
        router.replace(`/test-completed/${testId}?message=Test already completed.`)
        return
      }

      // Mark test as 'in_progress' and set 'started_at' if not already set
      if (details.status === "not_started" || !details.started_at) {
        const currentTime = new Date().toISOString()
        const { error: updateError } = await supabase
          .from("tests")
          .update({ status: "in_progress", started_at: currentTime })
          .eq("id", testId)
        if (updateError) throw new Error("Failed to update test status.")
        setTestDetails((prev) => (prev ? { ...prev, status: "in_progress", started_at: currentTime } : null))
        setTimeLeft(details.duration_minutes * 60)
      } else if (details.started_at) {
        const startTime = new Date(details.started_at).getTime()
        const now = new Date().getTime()
        const elapsedSeconds = Math.floor((now - startTime) / 1000)
        const remaining = details.duration_minutes * 60 - elapsedSeconds
        setTimeLeft(remaining > 0 ? remaining : 0)
      }

      // Fetch questions for the test template
      const { data: questionData, error: questionError } = await supabase.rpc("get_questions_for_test", {
        p_test_id: testId,
      })

      if (questionError || !questionData) {
        throw new Error(questionError?.message || "Failed to fetch questions.")
      }
      setQuestions(questionData as Question[])

      // Fetch existing answers (if any, e.g., user refreshing page)
      const { data: existingAnswersData, error: answersError } = await supabase
        .from("answers")
        .select("question_id, answer_text, selected_option, audio_url")
        .eq("test_id", testId)

      if (answersError) {
        console.warn("Could not fetch existing answers:", answersError.message)
      } else if (existingAnswersData) {
        const loadedAnswers: Record<string, Answer> = {}
        existingAnswersData.forEach((ans) => {
          loadedAnswers[ans.question_id] = {
            question_id: ans.question_id,
            answer_text: ans.answer_text,
            selected_option: ans.selected_option,
            audio_url: ans.audio_url,
          }
        })
        setAnswers(loadedAnswers)
      }
    } catch (err) {
      console.error("Error in fetchTestAndQuestions:", err)
      setError((err as Error).message)
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [testId, router])

  useEffect(() => {
    fetchTestAndQuestions()
  }, [fetchTestAndQuestions])

  const handleAnswerChange = async (questionId: string, answer: Partial<Answer>) => {
    const newAnswer = { ...answers[questionId], question_id: questionId, ...answer }
    setAnswers((prev) => ({ ...prev, [questionId]: newAnswer }))

    try {
      const { error: upsertError } = await supabase.from("answers").upsert(
        {
          test_id: testId,
          question_id: questionId,
          section: currentQuestion?.section, // Make sure currentQuestion is defined
          answer_text: newAnswer.answer_text,
          selected_option: newAnswer.selected_option,
          audio_url: newAnswer.audio_url,
        },
        { onConflict: "test_id, question_id" },
      )
      if (upsertError) {
        throw upsertError
      }
    } catch (err) {
      console.error("Failed to save answer:", err)
      toast({
        title: "Save Error",
        description: "Could not save your answer. Please check your connection.",
        variant: "destructive",
      })
    }
  }

  const navigateQuestion = (direction: "next" | "prev") => {
    if (direction === "next") {
      if (currentQuestionInSectionIndex < currentSectionQuestions.length - 1) {
        setCurrentQuestionInSectionIndex((prev) => prev + 1)
      } else if (currentSectionIndex < SECTIONS.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1)
        setCurrentQuestionInSectionIndex(0)
      } else {
        // Last question of last section, consider submitting or showing review
        toast({
          title: "End of Test",
          description: "You are at the last question. Please review your answers before submitting.",
        })
      }
    } else {
      // prev
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

  const submitTest = async (reason: "manual" | "auto" = "manual") => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("tests")
        .update({ status: "submitted", submitted_at: new Date().toISOString() })
        .eq("id", testId)

      if (error) throw error

      // Optionally, could submit all answers in a batch here if not done individually
      // For now, assuming answers are saved as they are made.

      toast({
        title: "Test Submitted",
        description: `Your test was ${reason === "auto" ? "automatically" : "successfully"} submitted.`,
      })
      router.push(`/test-completed/${testId}?reason=${reason}`)
    } catch (err) {
      console.error("Failed to submit test:", err)
      toast({
        title: "Submission Error",
        description: "Could not submit your test. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTimeUp = () => {
    toast({ title: "Time's Up!", description: "Your test will be submitted automatically.", variant: "warning" })
    submitTest("auto")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-emerald-700 text-lg">Loading your test, please wait...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Error Loading Test</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.push("/dashboard")} className="bg-red-600 hover:bg-red-700">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  if (!testDetails || !currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <p className="text-amber-700 text-lg">Test data is not available. Please try again later.</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-4 bg-amber-600 hover:bg-amber-700">
          Go to Dashboard
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Bar */}
      <header className="bg-emerald-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">English Demo Test</h1>
          {timeLeft !== null && <TestTimer initialTime={timeLeft} onTimeUp={handleTimeUp} />}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Section Navigation & Progress */}
        <aside className="lg:w-1/4 space-y-6">
          <div className="p-4 bg-white rounded-lg shadow border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-700 mb-3">Sections</h3>
            <ul className="space-y-1">
              {SECTIONS.map((section, index) => (
                <li key={section}>
                  <Button
                    variant={currentSectionIndex === index ? "default" : "ghost"}
                    onClick={() => navigateToSection(index)}
                    className={`w-full justify-start ${currentSectionIndex === index ? "bg-emerald-600 text-white hover:bg-emerald-700" : "text-slate-700 hover:bg-emerald-100"}`}
                  >
                    {section}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-white rounded-lg shadow border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">Progress</h3>
            <Progress value={progressPercentage} className="w-full [&>*]:bg-emerald-500" />
            <p className="text-sm text-slate-500 mt-1">
              {answeredQuestionsCount} of {totalQuestions} questions answered
            </p>
          </div>
        </aside>

        {/* Right Panel: Question Area */}
        <section className="lg:w-3/4 bg-white p-6 rounded-lg shadow-lg border border-emerald-200 flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-1">
              {SECTIONS[currentSectionIndex]}: Question {currentQuestionInSectionIndex + 1} of{" "}
              {currentSectionQuestions.length}
            </h2>
            <p className="text-sm text-slate-500">{currentQuestion.subsection || "General"}</p>
          </div>

          <div className="flex-grow mb-6 min-h-[300px]">
            {" "}
            {/* Ensure question area has min height */}
            <QuestionRenderer
              question={currentQuestion}
              currentAnswer={answers[currentQuestion.id] || { question_id: currentQuestion.id }}
              onAnswerChange={handleAnswerChange}
            />
          </div>

          {/* Navigation Buttons */}
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
                    Submit Test
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Once submitted, you cannot change your answers. Please review your test before submitting.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => submitTest("manual")} className="bg-green-600 hover:bg-green-700">
                      Yes, Submit Test
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
        </section>
      </main>
    </div>
  )
}
