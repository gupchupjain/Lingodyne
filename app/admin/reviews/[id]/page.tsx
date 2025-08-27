"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft,
  CheckSquare,
  User,
  FileText,
  Clock,
  Star,
  Volume2,
  Save,
  Send
} from "lucide-react"

interface Question {
  id: string
  section: string
  subsection: string
  prompt: string
  options: string
  correct_answer: string
  audio_url: string
  image_url: string
  is_auto_gradable: boolean
  max_score: number
  instructions: string
}

interface Answer {
  id: string
  question_id: string
  section: string
  answer_text: string
  audio_url: string
  is_correct: boolean | null
  auto_score: number | null
  submitted_at: string
  questions: Question
}

interface TestDetails {
  id: string
  status: string
  submitted_at: string
  final_score: number | null
  max_possible_score: number | null
  is_passed: boolean | null
  created_at: string
  users: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  test_templates: {
    id: string
    title: string
    language: string
    test_type: string
    duration_minutes: number
  }
}

interface ReviewData {
  questionId: string
  score: number
  maxScore: number
  feedback: string
  notes: string
}

export default function TestReviewPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [testDetails, setTestDetails] = useState<TestDetails | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [finalScore, setFinalScore] = useState(0)
  const [maxPossibleScore, setMaxPossibleScore] = useState(0)
  const [isPassed, setIsPassed] = useState(false)
  const [reviewerNotes, setReviewerNotes] = useState("")

  useEffect(() => {
    if (testId) {
      fetchTestDetails()
    }
  }, [testId])

  useEffect(() => {
    // Calculate total score and max possible score
    const totalScore = reviews.reduce((sum, review) => sum + review.score, 0)
    const totalMaxScore = reviews.reduce((sum, review) => sum + review.maxScore, 0)
    setFinalScore(totalScore)
    setMaxPossibleScore(totalMaxScore)
    setIsPassed(totalScore >= (totalMaxScore * 0.6)) // 60% pass threshold
  }, [reviews])

  const fetchTestDetails = async () => {
    try {
      const response = await fetch(`/api/admin/reviews/${testId}`)
      if (response.ok) {
        const data = await response.json()
        setTestDetails(data.test)
        setAnswers(data.answers)
        
        // Initialize reviews for each answer
        const initialReviews = data.answers.map((answer: Answer) => ({
          questionId: answer.question_id,
          score: answer.auto_score || 0,
          maxScore: answer.questions.max_score,
          feedback: "",
          notes: ""
        }))
        setReviews(initialReviews)
      }
    } catch (error) {
      console.error("Error fetching test details:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateReview = (questionId: string, field: keyof ReviewData, value: any) => {
    setReviews(prev => prev.map(review => 
      review.questionId === questionId 
        ? { ...review, [field]: value }
        : review
    ))
  }

  const handleSubmitReview = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/admin/reviews/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviews,
          finalScore,
          maxPossibleScore,
          isPassed,
          reviewerNotes
        }),
      })

      if (response.ok) {
        router.push('/admin/reviews')
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test details...</p>
        </div>
      </div>
    )
  }

  if (!testDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Test not found</p>
        </div>
      </div>
    )
  }

  const passPercentage = maxPossibleScore > 0 ? (finalScore / maxPossibleScore) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/reviews")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Reviews</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Review Test</h1>
                <p className="text-sm text-gray-600">
                  {testDetails.test_templates.title} - {testDetails.users.first_name} {testDetails.users.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                <Clock className="w-3 h-3 mr-1" />
                Pending Review
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Test Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium text-gray-900">Student</h4>
                <p className="text-sm text-gray-600">
                  {testDetails.users.first_name} {testDetails.users.last_name}
                </p>
                <p className="text-sm text-gray-500">{testDetails.users.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Test Details</h4>
                <p className="text-sm text-gray-600">{testDetails.test_templates.title}</p>
                <p className="text-sm text-gray-500">
                  {testDetails.test_templates.language} • {testDetails.test_templates.test_type}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Submitted</h4>
                <p className="text-sm text-gray-600">{formatDate(testDetails.submitted_at)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Questions</h4>
                <p className="text-sm text-gray-600">{answers.length} questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span>Score Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{finalScore}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{maxPossibleScore}</div>
                <div className="text-sm text-gray-600">Max Possible</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{passPercentage.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Percentage</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{passPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={passPercentage} className="h-2" />
            </div>
            <div className="mt-4">
              <Badge variant={isPassed ? "default" : "secondary"}>
                {isPassed ? "PASSED" : "FAILED"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Questions Review</h2>
          {answers.map((answer, index) => {
            const review = reviews.find(r => r.questionId === answer.question_id)
            return (
              <Card key={answer.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Question {index + 1} - {answer.questions.section.charAt(0).toUpperCase() + answer.questions.section.slice(1)}
                    </CardTitle>
                    <Badge variant="outline">
                      Max: {answer.questions.max_score} points
                    </Badge>
                  </div>
                  {answer.questions.subsection && (
                    <p className="text-sm text-gray-600">{answer.questions.subsection}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                    <p className="text-gray-700">{answer.questions.prompt}</p>
                    {answer.questions.instructions && (
                      <p className="text-sm text-gray-600 mt-2">{answer.questions.instructions}</p>
                    )}
                  </div>

                  {/* Audio if present */}
                  {answer.questions.audio_url && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Audio:
                      </h4>
                      <audio controls className="w-full">
                        <source src={answer.questions.audio_url} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  {/* Correct Answer (for reference) */}
                  {answer.questions.correct_answer && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Correct Answer:</h4>
                      <p className="text-green-700 bg-green-50 p-3 rounded-lg">
                        {answer.questions.correct_answer}
                      </p>
                    </div>
                  )}

                  {/* Student Answer */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Student Answer:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {answer.audio_url ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Audio Answer:</p>
                          <audio controls>
                            <source src={answer.audio_url} type="audio/wav" />
                          </audio>
                        </div>
                      ) : (
                        <p className="text-gray-700">{answer.answer_text || "No answer provided"}</p>
                      )}
                    </div>
                  </div>

                  {/* Scoring */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`score-${answer.id}`}>Score</Label>
                      <Input
                        id={`score-${answer.id}`}
                        type="number"
                        min="0"
                        max={answer.questions.max_score}
                        value={review?.score || 0}
                        onChange={(e) => updateReview(answer.question_id, 'score', parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`max-score-${answer.id}`}>Max Score</Label>
                      <Input
                        id={`max-score-${answer.id}`}
                        type="number"
                        value={review?.maxScore || answer.questions.max_score}
                        onChange={(e) => updateReview(answer.question_id, 'maxScore', parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <Label htmlFor={`feedback-${answer.id}`}>Feedback</Label>
                    <Textarea
                      id={`feedback-${answer.id}`}
                      value={review?.feedback || ""}
                      onChange={(e) => updateReview(answer.question_id, 'feedback', e.target.value)}
                      placeholder="Provide feedback for this answer..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor={`notes-${answer.id}`}>Review Notes (Internal)</Label>
                    <Textarea
                      id={`notes-${answer.id}`}
                      value={review?.notes || ""}
                      onChange={(e) => updateReview(answer.question_id, 'notes', e.target.value)}
                      placeholder="Internal notes for this review..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Final Review Notes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Final Review Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              placeholder="Add final review notes and feedback for the student..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/reviews")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
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
                Submit Review
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
