import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAdminUser } from "@/lib/admin-middleware"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const authResult = await getAdminUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const supabase = createServerClient()

    // Get test details with user and template info
    const { data: testDetails, error: testError } = await supabase
      .from("user_tests")
      .select(`
        id,
        status,
        submitted_at,
        final_score,
        max_possible_score,
        is_passed,
        created_at,
        users (
          id,
          email,
          first_name,
          last_name
        ),
        test_templates (
          id,
          title,
          language,
          test_type,
          duration_minutes
        )
      `)
      .eq("id", params.id)
      .single()

    if (testError || !testDetails) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Get all answers for this test with question details
    const { data: answers, error: answersError } = await supabase
      .from("test_answers")
      .select(`
        id,
        question_id,
        section,
        answer_text,
        audio_url,
        is_correct,
        auto_score,
        submitted_at,
        questions (
          id,
          section,
          subsection,
          prompt,
          options,
          correct_answer,
          audio_url,
          image_url,
          is_auto_gradable,
          max_score,
          instructions
        )
      `)
      .eq("user_test_id", params.id)
      .order("submitted_at", { ascending: true })

    if (answersError) {
      console.error("Error fetching answers:", answersError)
      return NextResponse.json({ error: "Failed to fetch test answers" }, { status: 500 })
    }

    return NextResponse.json({
      test: testDetails,
      answers: answers || []
    })
  } catch (error) {
    console.error("Error in test review API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
