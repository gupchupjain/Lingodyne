import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await getAuthenticatedUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { user } = authResult
    const supabase = createServerClient()

    // Fetch user tests with test template details
    const { data: userTests, error } = await supabase
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
        test_templates(
          id,
          title,
          language,
          test_type,
          duration_minutes,
          description
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user tests:", error)
      return NextResponse.json({ error: "Failed to fetch user tests" }, { status: 500 })
    }

    // Debug: Log the data to see what we're getting
    console.log("User tests data:", JSON.stringify(userTests, null, 2))

    return NextResponse.json({
      userTests: userTests || [],
    })
  } catch (error) {
    console.error("User tests API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 