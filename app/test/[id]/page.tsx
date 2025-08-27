"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  FileText, 
  Mic, 
  Play, 
  Pause,
  Volume2,
  Send,
  AlertTriangle
} from "lucide-react"

interface Question {
  id: string
  section: string
  subsection: string
  prompt: string
  options?: string[]
  correct_answer?: string
  audio_url?: string
  image_url?: string
  is_auto_gradable: boolean
  max_score: number
  time_limit_seconds?: number
  instructions?: string
}

interface TestSection {
  section: string
  questions: Question[]
}

interface UserTest {
  id: string
  status: string
  test_templates: {
    title: string
    language: string
    duration_minutes: number
  }
}

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [userTest, setUserTest] = useState<UserTest | null>(null)
  const [sections, setSections] = useState<TestSection[]>([])
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState("")
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false)
  const [autoSubmitting, setAutoSubmitting] = useState(false)

  const sectionOrder = ['reading', 'writing', 'speaking', 'listening']

  useEffect(() => {
    if (testId) {
      fetchTestData()
    }
  }, [testId])

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Show time up dialog and auto-submit
            setShowTimeUpDialog(true)
            setAutoSubmitting(true)
            handleAutoSubmit()
            return 0
          }
          // Show warning when 5 minutes remaining
          if (prev === 300) {
            alert("⚠️ Warning: You have 5 minutes remaining!")
          }
          // Show warning when 1 minute remaining
          if (prev === 60) {
            alert("⚠️ Warning: You have 1 minute remaining!")
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const fetchTestData = async () => {
    try {
      // Fetch user test details
      const testResponse = await fetch(`/api/user-tests/${testId}`)
      const testData = await testResponse.json()
      setUserTest(testData.userTest)
      setTimeRemaining(testData.userTest.test_templates.duration_minutes * 60)

      // Fetch questions for this test
      const questionsResponse = await fetch(`/api/tests/${testId}/questions`)
      const questionsData = await questionsResponse.json()
      
      // Group questions by section
      const groupedSections = sectionOrder.map(section => ({
        section,
        questions: questionsData.questions.filter((q: Question) => q.section === section)
      })).filter(section => section.questions.length > 0)

      setSections(groupedSections)
    } catch (error) {
      console.error("Error fetching test data:", error)
    } finally {
      setLoading(false)
    }
  }

  const currentSection = sections[currentSectionIndex]
  const currentQuestion = currentSection?.questions[currentQuestionIndex]

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1)
      setCurrentQuestionIndex(sections[currentSectionIndex - 1].questions.length - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1)
      setCurrentQuestionIndex(0)
    }
  }

  const handleSkip = () => {
    // Mark the current question as skipped (empty answer)
    handleAnswerChange(currentQuestion.id, '')
    // Move to next question
    handleNext()
  }

  const handleAutoSubmit = async () => {
    if (submitting || autoSubmitting) return;
    setAutoSubmitting(true);
    try {
      const response = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => router.push('/dashboard'), 3000);
      } else if (data?.error === "Test already submitted") {
        setError("This test has already been submitted.");
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(data?.error || "Failed to submit test. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setAutoSubmitting(false);
    }
  };

  const handleSubmitTest = async () => {
    if (submitting) return; // Prevent double submit
    setError("");
    
    // Show confirmation dialog
    setShowSubmitDialog(true);
  };

  const confirmSubmit = async () => {
    setShowSubmitDialog(false);
    setSubmitting(true);
    try {
      const response = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => router.push('/dashboard'), 3000);
      } else if (data?.error === "Test already submitted") {
        setError("This test has already been submitted.");
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(data?.error || "Failed to submit test. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Test Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">Your test has been submitted and is now under review.</p>
          <p className="text-sm text-gray-500">You'll be notified when the review is complete.</p>
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
          <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  if (!currentSection || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Test not found or no questions available</p>
        </div>
      </div>
    )
  }

  const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0)
  const answeredQuestions = Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length
  const attemptedQuestions = Object.keys(answers).length
  const progress = (answeredQuestions / totalQuestions) * 100

  const canGoNext = answers[currentQuestion.id] && answers[currentQuestion.id].trim() !== ''
  const isLastQuestion = currentSectionIndex === sections.length - 1 && 
                        currentQuestionIndex === currentSection.questions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {userTest?.test_templates.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentSection.section.charAt(0).toUpperCase() + currentSection.section.slice(1)} Section
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-600">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Badge variant="outline">
                {answeredQuestions}/{totalQuestions} Answered ({attemptedQuestions} Attempted)
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <FileText className="w-6 h-6 text-green-600" />
                <span className="capitalize">{currentSection.section}</span>
              </CardTitle>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Question {currentQuestionIndex + 1} of {currentSection.questions.length}
              </Badge>
            </div>
            {currentQuestion.subsection && (
              <p className="text-lg text-gray-600 mt-2">{currentQuestion.subsection}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-8 px-8">
            {/* Question Prompt */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
                  {currentQuestion.prompt}
                </h3>
                {answers[currentQuestion.id] && answers[currentQuestion.id].trim() !== '' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-base px-3 py-1">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Answered
                  </Badge>
                ) : answers[currentQuestion.id] !== undefined ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-base px-3 py-1">
                    Skipped
                  </Badge>
                ) : null}
              </div>
              {currentQuestion.instructions && (
                <p className="text-base text-gray-600 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">{currentQuestion.instructions}</p>
              )}
            </div>

            {/* Audio Player (for listening questions) */}
            {currentQuestion.audio_url && (
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center space-x-2 mb-4">
                  <Volume2 className="w-6 h-6 text-green-600" />
                  <span className="font-medium text-lg">Audio</span>
                </div>
                <audio controls className="w-full">
                  <source src={currentQuestion.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Answer Input */}
            <div className="space-y-6">
              {/* Show radio buttons for any question that has options */}
              {currentQuestion.options && (
                (() => {
                  let parsedOptions: Record<string, string> = {}
                  try {
                    // Try to parse as JSON first
                    if (typeof currentQuestion.options === 'string') {
                      parsedOptions = JSON.parse(currentQuestion.options)
                    } else if (Array.isArray(currentQuestion.options)) {
                      // If it's already an array, convert to object format
                      parsedOptions = currentQuestion.options.reduce((acc, option, index) => {
                        acc[`option ${String.fromCharCode(97 + index)}`] = option
                        return acc
                      }, {} as Record<string, string>)
                    } else {
                      parsedOptions = currentQuestion.options
                    }
                  } catch (error) {
                    console.error('Error parsing options:', error)
                    // Fallback to array format
                    if (Array.isArray(currentQuestion.options)) {
                      parsedOptions = currentQuestion.options.reduce((acc, option, index) => {
                        acc[`option ${String.fromCharCode(97 + index)}`] = option
                        return acc
                      }, {} as Record<string, string>)
                    }
                  }

                  return (
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Select your answer:</h4>
                      <RadioGroup
                        value={answers[currentQuestion.id] || ''}
                        onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                        className="space-y-4"
                      >
                        {Object.entries(parsedOptions).map(([optionKey, optionValue], index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <RadioGroupItem value={optionKey} id={`option-${index}`} className="mt-1" />
                            <Label htmlFor={`option-${index}`} className="text-base leading-relaxed cursor-pointer flex-1">
                              {optionValue}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )
                })()
              )}

              {/* Writing questions */}
              {currentQuestion.section === 'writing' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Write your answer:</h4>
                  <Textarea
                    placeholder="Write your answer here (minimum 100 words, maximum 400 words)..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="min-h-[300px] text-base p-4"
                    maxLength={400}
                  />
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Minimum 100 words recommended</span>
                    <span>{answers[currentQuestion.id]?.length || 0}/400 characters</span>
                  </div>
                </div>
              )}

              {/* Speaking questions */}
              {currentQuestion.section === 'speaking' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900">Record or type your answer:</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        className="px-6 py-3"
                      >
                        {isRecording ? (
                          <>
                            <Pause className="w-5 h-5 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                      {audioBlob && (
                        <audio controls className="h-12">
                          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                        </audio>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="speaking-answer" className="text-base font-medium">Or type your answer:</Label>
                      <Input
                        id="speaking-answer"
                        placeholder="Type your answer here..."
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="text-base p-3"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Text input for questions without options and not writing/speaking */}
              {!currentQuestion.options && currentQuestion.section !== 'writing' && currentQuestion.section !== 'speaking' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Enter your answer:</h4>
                  <Input
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="text-base p-3"
                  />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
                size="lg"
                className="px-6 py-3"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-3">
                {isLastQuestion ? (
                  <Button
                    onClick={handleSubmitTest}
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit for Review
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSkip}
                      variant="outline"
                      size="lg"
                      className="px-6 py-3"
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!canGoNext}
                      size="lg"
                      className="px-6 py-3"
                    >
                      Next
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {error && (
          <div className="text-red-600 mb-2 text-center">{error}</div>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Confirm Test Submission</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? This action cannot be undone.
              {timeRemaining > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⏰ You still have <strong>{formatTime(timeRemaining)}</strong> remaining.
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    You can continue reviewing your answers if needed.
                  </p>
                </div>
              )}
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>Progress:</strong> {answeredQuestions}/{totalQuestions} questions answered
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {totalQuestions - answeredQuestions} questions remaining
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continue Test
            </Button>
            <Button 
              onClick={confirmSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Test
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Up Dialog */}
      <Dialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-red-500" />
              <span>Time's Up!</span>
            </DialogTitle>
            <DialogDescription>
              Your test time has expired. Your test will be automatically submitted with your current answers.
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Final Progress:</strong> {answeredQuestions}/{totalQuestions} questions answered
                </p>
                {totalQuestions - answeredQuestions > 0 && (
                  <p className="text-xs text-blue-700 mt-1">
                    {totalQuestions - answeredQuestions} questions were not answered
                  </p>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              disabled={autoSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {autoSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Auto-submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Test Submitted
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 