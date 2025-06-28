import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(
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

    // First, verify the user owns this test
    const { data: userTest, error: testError } = await supabase
      .from("user_tests")
      .select("test_template_id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (testError || !userTest) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Fetch questions for this test template, grouped by section
    const { data: templateQuestions, error: questionsError } = await supabase
      .from("template_questions")
      .select(`
        question_id,
        section,
        question_order,
        questions (
          id,
          section,
          subsection,
          prompt,
          options,
          correct_answer,
          audio_url,
          image_url,
          language,
          difficulty,
          is_auto_gradable,
          max_score,
          time_limit_seconds,
          instructions
        )
      `)
      .eq("test_template_id", userTest.test_template_id)
      .order("question_order")

    if (questionsError) {
      console.error("Error fetching questions:", questionsError)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    // Transform the data to match the expected format
    const questions = templateQuestions
      .map(tq => ({
        ...tq.questions,
        section: tq.section,
        question_order: tq.question_order
      }))
      .sort((a, b) => {
        // Sort by section order: reading → writing → speaking → listening
        const sectionOrder = ['reading', 'writing', 'speaking', 'listening']
        const aIndex = sectionOrder.indexOf(a.section)
        const bIndex = sectionOrder.indexOf(b.section)
        
        if (aIndex !== bIndex) {
          return aIndex - bIndex
        }
        
        // Then sort by question_order within each section
        return a.question_order - b.question_order
      })

    console.log("Questions fetched:", questions.length)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error in questions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 