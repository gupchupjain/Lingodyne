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

    // Fetch specific user test with template details
    const { data: userTest, error } = await supabase
      .from("user_tests")
      .select(`
        id,
        test_template_id,
        status,
        started_at,
        submitted_at,
        reviewed_at,
        final_score,
        max_possible_score,
        is_passed,
        certificate_url,
        current_section,
        current_question_index,
        time_remaining_seconds,
        created_at,
        test_templates (
          id,
          title,
          language,
          test_type,
          duration_minutes,
          description
        )
      `)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching user test:", error)
      return NextResponse.json({ error: "Failed to fetch test" }, { status: 500 })
    }

    if (!userTest) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    return NextResponse.json({ userTest })
  } catch (error) {
    console.error("Error in user test API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 