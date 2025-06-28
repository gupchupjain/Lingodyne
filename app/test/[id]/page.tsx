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
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  FileText, 
  Mic, 
  Play, 
  Pause,
  Volume2,
  Send
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
            handleSubmitTest()
            return 0
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

  const handleSubmitTest = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      })

      if (response.ok) {
        setSubmitted(true)
        // Show success message for 2 seconds before redirecting
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        throw new Error('Failed to submit test')
      }
    } catch (error) {
      console.error("Error submitting test:", error)
    } finally {
      setSubmitting(false)
    }
  }

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
    <div className="min-h-screen bg-gray-50">
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="capitalize">{currentSection.section}</span>
              </CardTitle>
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {currentSection.questions.length}
              </Badge>
            </div>
            {currentQuestion.subsection && (
              <p className="text-sm text-gray-600">{currentQuestion.subsection}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Prompt */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentQuestion.prompt}
                </h3>
                {answers[currentQuestion.id] && answers[currentQuestion.id].trim() !== '' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Answered
                  </Badge>
                ) : answers[currentQuestion.id] !== undefined ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Skipped
                  </Badge>
                ) : null}
              </div>
              {currentQuestion.instructions && (
                <p className="text-sm text-gray-600 mb-4">{currentQuestion.instructions}</p>
              )}
            </div>

            {/* Audio Player (for listening questions) */}
            {currentQuestion.audio_url && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Audio</span>
                </div>
                <audio controls className="w-full mt-2">
                  <source src={currentQuestion.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Answer Input */}
            <div className="space-y-4">
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
                    <RadioGroup
                      value={answers[currentQuestion.id] || ''}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      {Object.entries(parsedOptions).map(([optionKey, optionValue], index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionKey} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="text-sm">
                            {optionValue}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )
                })()
              )}

              {/* Writing questions */}
              {currentQuestion.section === 'writing' && (
                <div>
                  <Textarea
                    placeholder="Write your answer here (minimum 100 words, maximum 400 words)..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="min-h-[200px]"
                    maxLength={400}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {answers[currentQuestion.id]?.length || 0}/400 characters
                  </p>
                </div>
              )}

              {/* Speaking questions */}
              {currentQuestion.section === 'speaking' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      variant={isRecording ? "destructive" : "default"}
                    >
                      {isRecording ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                    {audioBlob && (
                      <audio controls>
                        <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                      </audio>
                    )}
                  </div>
                  <Input
                    placeholder="Or type your answer here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  />
                </div>
              )}

              {/* Text input for questions without options and not writing/speaking */}
              {!currentQuestion.options && currentQuestion.section !== 'writing' && currentQuestion.section !== 'speaking' && (
                <Input
                  placeholder="Enter your answer..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {isLastQuestion ? (
                  <Button
                    onClick={handleSubmitTest}
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
                        Submit for Review
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSkip}
                      variant="outline"
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!canGoNext}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 