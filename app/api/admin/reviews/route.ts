import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAdminUser } from "@/lib/admin-middleware"

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await getAdminUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const supabase = createServerClient()

    // Get tests that need review (under_review status)
    const { data: testsToReview, error } = await supabase
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
      .eq("status", "under_review")
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("Error fetching tests to review:", error)
      return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 })
    }

    return NextResponse.json({ tests: testsToReview || [] })
  } catch (error) {
    console.error("Error in reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
