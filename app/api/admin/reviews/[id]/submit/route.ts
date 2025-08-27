import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAdminUser } from "@/lib/admin-middleware"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const authResult = await getAdminUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { reviews, finalScore, maxPossibleScore, isPassed, reviewerNotes } = await request.json()

    const supabase = createServerClient()

    // Start a transaction by updating the test status first
    const { error: testUpdateError } = await supabase
      .from("user_tests")
      .update({
        status: 'reviewed',
        final_score: finalScore,
        max_possible_score: maxPossibleScore,
        is_passed: isPassed,
        reviewer_notes: reviewerNotes,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", params.id)

    if (testUpdateError) {
      console.error("Error updating test status:", testUpdateError)
      return NextResponse.json({ error: "Failed to update test status" }, { status: 500 })
    }

    // Update test_answers with manual scores and feedback
    if (reviews && reviews.length > 0) {
      for (const review of reviews) {
        const { error: answerUpdateError } = await supabase
          .from("test_answers")
          .update({
            is_correct: review.score > 0,
            auto_score: review.score
          })
          .eq("user_test_id", params.id)
          .eq("question_id", review.questionId)

        if (answerUpdateError) {
          console.error("Error updating answer score:", answerUpdateError)
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "Test review submitted successfully"
    })
  } catch (error) {
    console.error("Error in submit review API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
