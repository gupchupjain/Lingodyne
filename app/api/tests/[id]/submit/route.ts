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
    const { answers } = await request.json()

    // First, verify the user owns this test and it's not already submitted
    const { data: userTest, error: testError } = await supabase
      .from("user_tests")
      .select(`
        id,
        test_template_id,
        status,
        test_templates (
          id,
          title
        )
      `)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (testError || !userTest) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    if (userTest.status === 'submitted' || userTest.status === 'under_review' || userTest.status === 'reviewed') {
      return NextResponse.json({ error: "Test already submitted" }, { status: 400 })
    }

    // Get all questions for this test
    const { data: templateQuestions, error: questionsError } = await supabase
      .from("template_questions")
      .select(`
        question_id,
        section
      `)
      .eq("test_template_id", userTest.test_template_id)

    if (questionsError) {
      console.error("Error fetching questions:", questionsError)
      return NextResponse.json({ error: "Failed to process test submission" }, { status: 500 })
    }

    // Create a map of question_id to section for answers insertion
    const questionSectionMap = templateQuestions.reduce((acc, tq) => {
      acc[tq.question_id] = tq.section
      return acc
    }, {} as Record<string, string>)

    // Prepare answers for insertion
    const answersToInsert = Object.entries(answers).map(([questionId, answerText]) => ({
      user_test_id: params.id,
      question_id: questionId,
      section: questionSectionMap[questionId] || 'reading',
      answer_text: answerText as string,
      audio_url: null, // TODO: Handle audio upload for speaking questions
      is_correct: null,
      auto_score: null
    }))

    // Insert all answers
    const { error: answersError } = await supabase
      .from("test_answers")
      .insert(answersToInsert)

    if (answersError) {
      console.error("Error inserting answers:", answersError)
      return NextResponse.json({ error: "Failed to save answers" }, { status: 500 })
    }

    // Auto-grade reading and listening questions
    const { data: autoGradableQuestions, error: autoGradeError } = await supabase
      .from("template_questions")
      .select(`
        question_id,
        questions (
          id,
          is_auto_gradable,
          correct_answer,
          max_score
        )
      `)
      .eq("test_template_id", userTest.test_template_id)
      .eq("questions.is_auto_gradable", true)

    if (!autoGradeError && autoGradableQuestions) {
      // Update auto-graded answers
      const autoGradeUpdates = autoGradableQuestions.map(tq => {
        const question = tq.questions as any
        const userAnswer = answers[question.id]
        const isCorrect = userAnswer && userAnswer.trim().toLowerCase() === question.correct_answer?.trim().toLowerCase()
        
        return {
          user_test_id: params.id,
          question_id: question.id,
          is_correct: isCorrect,
          auto_score: isCorrect ? question.max_score : 0
        }
      })

      // Update auto-graded scores
      for (const update of autoGradeUpdates) {
        const { error: updateError } = await supabase
          .from("test_answers")
          .update({
            is_correct: update.is_correct,
            auto_score: update.auto_score
          })
          .eq("user_test_id", update.user_test_id)
          .eq("question_id", update.question_id)

        if (updateError) {
          console.error("Error updating auto-grade for question:", update.question_id, updateError)
        }
      }
    }

    // Update test status to under_review for manual review
    const { error: updateError } = await supabase
      .from("user_tests")
      .update({
        status: 'under_review',
        submitted_at: new Date().toISOString()
      })
      .eq("id", params.id)

    if (updateError) {
      console.error("Error updating test status:", updateError)
      return NextResponse.json({ error: "Failed to update test status" }, { status: 500 })
    }

    console.log("Test submitted for manual review")

    return NextResponse.json({ 
      success: true, 
      message: "Test submitted successfully. Your test will be reviewed by our team and you'll be notified of the results." 
    })

  } catch (error) {
    console.error("Error in test submission API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 