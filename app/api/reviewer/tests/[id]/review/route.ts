import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await getAuthenticatedUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { user } = authResult
    const supabase = createServerClient()

    // Check if user has reviewer role
    const { data: userRoles, error: roleError } = await supabase
      .from("user_roles")
      .select(`
        roles (
          name
        )
      `)
      .eq("user_id", user.id)

    if (roleError) {
      console.error("Error fetching user roles:", roleError)
      return NextResponse.json({ error: "Failed to verify permissions" }, { status: 500 })
    }

    const hasReviewerRole = userRoles?.some(ur => 
      ur.roles && (ur.roles as any).name === 'reviewer' || 
      (ur.roles as any).name === 'admin' || 
      (ur.roles as any).name === 'super_admin'
    ) || false

    if (!hasReviewerRole) {
      return NextResponse.json({ error: "Access denied. Reviewer role required." }, { status: 403 })
    }

    const { reviews } = await request.json()

    // Verify the test exists
    const { data: userTest, error: testError } = await supabase
      .from("user_tests")
      .select("id, test_template_id")
      .eq("id", params.id)
      .single()

    if (testError || !userTest) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Prepare reviews for insertion
    const reviewsToInsert = Object.values(reviews).map((review: any) => ({
      user_test_id: params.id,
      question_id: review.questionId,
      reviewer_id: user.id,
      score: review.score,
      max_score: review.maxScore,
      feedback: review.feedback,
      reviewed_at: new Date().toISOString()
    }))

    // Insert reviews
    const { error: reviewsError } = await supabase
      .from("admin_reviews")
      .upsert(reviewsToInsert, { onConflict: 'user_test_id,question_id' })

    if (reviewsError) {
      console.error("Error inserting reviews:", reviewsError)
      return NextResponse.json({ error: "Failed to save reviews" }, { status: 500 })
    }

    // Calculate final score
    // First, get all questions and their scores
    const { data: templateQuestions, error: questionsError } = await supabase
      .from("template_questions")
      .select(`
        question_id,
        questions (
          id,
          is_auto_gradable,
          max_score
        )
      `)
      .eq("test_template_id", userTest.test_template_id)

    if (questionsError) {
      console.error("Error fetching questions for scoring:", questionsError)
      return NextResponse.json({ error: "Failed to calculate final score" }, { status: 500 })
    }

    // Get auto-graded scores from test_answers
    const { data: autoScores, error: autoScoresError } = await supabase
      .from("test_answers")
      .select("question_id, auto_score")
      .eq("user_test_id", params.id)
      .not("auto_score", "is", null)

    if (autoScoresError) {
      console.error("Error fetching auto scores:", autoScoresError)
      return NextResponse.json({ error: "Failed to calculate final score" }, { status: 500 })
    }

    // Get manual review scores
    const { data: manualScores, error: manualScoresError } = await supabase
      .from("admin_reviews")
      .select("question_id, score")
      .eq("user_test_id", params.id)

    if (manualScoresError) {
      console.error("Error fetching manual scores:", manualScoresError)
      return NextResponse.json({ error: "Failed to calculate final score" }, { status: 500 })
    }

    // Calculate total score
    let totalScore = 0
    let maxPossibleScore = 0

    templateQuestions.forEach(tq => {
      const question = tq.questions as any
      maxPossibleScore += question.max_score

      if (question.is_auto_gradable) {
        // Use auto score
        const autoScore = autoScores.find(s => s.question_id === question.id)
        totalScore += autoScore?.auto_score || 0
      } else {
        // Use manual score
        const manualScore = manualScores.find(s => s.question_id === question.id)
        totalScore += manualScore?.score || 0
      }
    })

    // Calculate percentage and determine if passed
    const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0
    const isPassed = percentage >= 60 // 60% threshold

    // Update test status and final score
    const { error: updateError } = await supabase
      .from("user_tests")
      .update({
        status: 'reviewed',
        reviewed_at: new Date().toISOString(),
        final_score: totalScore,
        max_possible_score: maxPossibleScore,
        is_passed: isPassed
      })
      .eq("id", params.id)

    if (updateError) {
      console.error("Error updating test status:", updateError)
      return NextResponse.json({ error: "Failed to update test status" }, { status: 500 })
    }

    console.log("Test review completed successfully")

    return NextResponse.json({ 
      success: true, 
      message: "Review submitted successfully",
      finalScore: totalScore,
      maxPossibleScore,
      percentage: Math.round(percentage),
      isPassed
    })

  } catch (error) {
    console.error("Error in review submission API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 