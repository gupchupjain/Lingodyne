"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  Clock, 
  User, 
  FileText, 
  Volume2,
  Play,
  Pause,
  Star,
  Shield,
  AlertTriangle
} from "lucide-react"
import { useUserRoles } from "@/hooks/useUserRoles"

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

interface Answer {
  id: string
  question_id: string
  section: string
  answer_text: string
  audio_url?: string
  is_correct?: boolean
  auto_score?: number
}

interface TestForReview {
  id: string
  user_id: string
  test_template_id: string
  status: string
  started_at: string | null
  submitted_at: string | null
  users: {
    email: string
    first_name: string
    last_name: string
  }
  test_templates: {
    id: string
    title: string
    language: string
    test_type: string
  }
}

interface ReviewData {
  questionId: string
  score: number
  maxScore: number
  feedback: string
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string
  const { roles, loading: rolesLoading, hasAnyRole } = useUserRoles()

  const [test, setTest] = useState<TestForReview | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [reviews, setReviews] = useState<Record<string, ReviewData>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if user has reviewer role
  const hasReviewerAccess = hasAnyRole(['reviewer', 'admin', 'super_admin'])

  useEffect(() => {
    // If roles are loaded and user doesn't have access, redirect
    if (!rolesLoading && !hasReviewerAccess) {
      router.push('/dashboard?error=unauthorized')
      return
    }

    // Only fetch test data if user has access
    if (hasReviewerAccess) {
      fetchTestData()
    }
  }, [testId, rolesLoading, hasReviewerAccess, router])

  const fetchTestData = async () => {
    try {
      setError(null)
      // Fetch test details
      const testResponse = await fetch(`/api/reviewer/tests/${testId}`)
      
      if (testResponse.status === 403) {
        setError("Access denied. You don't have permission to review this test.")
        return
      }
      
      if (!testResponse.ok) {
        throw new Error('Failed to fetch test')
      }
      
      const testData = await testResponse.json()
      setTest(testData.test)

      // Fetch questions and answers
      const questionsResponse = await fetch(`/api/reviewer/tests/${testId}/questions`)
      
      if (questionsResponse.status === 403) {
        setError("Access denied. You don't have permission to review this test.")
        return
      }
      
      if (!questionsResponse.ok) {
        throw new Error('Failed to fetch questions')
      }
      
      const questionsData = await questionsResponse.json()
      setQuestions(questionsData.questions)
      setAnswers(questionsData.answers)

      // Initialize reviews for manual questions
      const manualQuestions = questionsData.questions.filter((q: Question) => !q.is_auto_gradable)
      const initialReviews: Record<string, ReviewData> = {}
      manualQuestions.forEach((q: Question) => {
        initialReviews[q.id] = {
          questionId: q.id,
          score: 0,
          maxScore: q.max_score,
          feedback: ''
        }
      })
      setReviews(initialReviews)
    } catch (error) {
      console.error("Error fetching test data:", error)
      setError('Failed to load test data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleScoreChange = (questionId: string, score: number) => {
    setReviews(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        score: Math.max(0, Math.min(score, prev[questionId]?.maxScore || 0))
      }
    }))
  }

  const handleFeedbackChange = (questionId: string, feedback: string) => {
    setReviews(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        feedback
      }
    }))
  }

  const handleAudioPlay = (audioUrl: string) => {
    setAudioPlaying(audioUrl)
  }

  const handleAudioPause = () => {
    setAudioPlaying(null)
  }

  const handleSubmitReview = async () => {
    try {
      setSubmitting(true)
      const response = await fetch(`/api/reviewer/tests/${testId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews }),
      })

      if (response.ok) {
        router.push('/reviewer?success=true')
      } else {
        throw new Error('Failed to submit review')
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // Show loading while checking roles
  if (rolesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Checking permissions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show access denied if user doesn't have reviewer role
  if (!hasReviewerAccess) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to review tests.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex space-x-2 justify-center">
                <Button onClick={fetchTestData}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push('/reviewer')}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading test for review...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!test || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-red-600">Test not found or no questions available</p>
          </div>
        </div>
      </div>
    )
  }

  const manualQuestions = questions.filter(q => !q.is_auto_gradable)
  const currentQuestion = manualQuestions[currentQuestionIndex]
  const currentAnswer = answers.find(a => a.question_id === currentQuestion?.id)
  const currentReview = reviews[currentQuestion?.id || '']

  const totalManualQuestions = manualQuestions.length
  const reviewedQuestions = Object.keys(reviews).filter(qId => 
    reviews[qId].score > 0 || reviews[qId].feedback.trim() !== ''
  ).length
  const progress = totalManualQuestions > 0 ? (reviewedQuestions / totalManualQuestions) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/reviewer')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Test</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {test.users.first_name} {test.users.last_name} ({test.users.email})
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {test.test_templates.title} ({test.test_templates.language})
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Submitted: {new Date(test.submitted_at || '').toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                {roles.join(', ')}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {test.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Review Progress: {reviewedQuestions}/{totalManualQuestions} questions
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Navigation */}
        {totalManualQuestions > 1 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Question:</span>
                  <span className="text-sm text-gray-600">
                    {currentQuestionIndex + 1} of {totalManualQuestions}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(totalManualQuestions - 1, prev + 1))}
                    disabled={currentQuestionIndex === totalManualQuestions - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Question */}
        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize">{currentQuestion.section}</CardTitle>
                <Badge variant="outline">
                  Max Score: {currentQuestion.max_score}
                </Badge>
              </div>
              {currentQuestion.subsection && (
                <CardDescription>{currentQuestion.subsection}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Prompt */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentQuestion.prompt}
                </h3>
                {currentQuestion.instructions && (
                  <p className="text-sm text-gray-600">{currentQuestion.instructions}</p>
                )}
              </div>

              {/* Audio Player (for speaking questions) */}
              {currentQuestion.audio_url && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Volume2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Question Audio</span>
                  </div>
                  <audio 
                    controls 
                    className="w-full"
                    onPlay={() => handleAudioPlay(currentQuestion.audio_url!)}
                    onPause={handleAudioPause}
                  >
                    <source src={currentQuestion.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Student's Answer */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Student's Answer:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {currentQuestion.section === 'speaking' && currentAnswer?.audio_url ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Audio Response</span>
                      </div>
                      <audio controls className="w-full">
                        <source src={currentAnswer.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {currentAnswer?.answer_text || 'No answer provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Review Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="score" className="text-sm font-medium text-gray-700">
                    Score (0 - {currentQuestion.max_score})
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max={currentQuestion.max_score}
                      value={currentReview?.score || 0}
                      onChange={(e) => handleScoreChange(currentQuestion.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-500">/ {currentQuestion.max_score}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(currentQuestion.max_score)].map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleScoreChange(currentQuestion.id, i + 1)}
                          className={`p-1 rounded ${
                            i < (currentReview?.score || 0) 
                              ? 'text-yellow-500' 
                              : 'text-gray-300'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="feedback" className="text-sm font-medium text-gray-700">
                    Feedback (Optional)
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Provide constructive feedback for the student..."
                    value={currentReview?.feedback || ''}
                    onChange={(e) => handleFeedbackChange(currentQuestion.id, e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/reviewer')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            disabled={submitting || reviewedQuestions === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 