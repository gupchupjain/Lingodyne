import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function POST(request: NextRequest) {
  try {
    console.log("Assign test - Starting authentication check")

    // Authenticate user
    const authResult = await getAuthenticatedUser(request)
    if ("error" in authResult) {
      console.log("Assign test - Authentication failed:", authResult.error)
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { user } = authResult
    console.log("Assign test - User authenticated:", user.email)

    const { test_template_id } = await request.json()

    if (!test_template_id) {
      return NextResponse.json({ error: "Test template ID is required" }, { status: 400 })
    }

    console.log("Assign test - Template ID:", test_template_id)

    const supabase = createServerClient()

    // Verify test template exists and is active
    const { data: testTemplate, error: templateError } = await supabase
      .from("test_templates")
      .select("id, language, test_type, title")
      .eq("id", test_template_id)
      .eq("is_active", true)
      .single()

    if (templateError || !testTemplate) {
      return NextResponse.json({ error: "Test template not found or inactive" }, { status: 404 })
    }

    // Check if user already has this test assigned
    const { data: existingTest, error: existingError } = await supabase
      .from("user_tests")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("test_template_id", test_template_id)
      .single()

    if (existingTest) {
      return NextResponse.json(
        {
          error: "Test already assigned to user",
          existingTest: {
            id: existingTest.id,
            status: existingTest.status,
          },
        },
        { status: 409 },
      )
    }

    // Create new user test assignment
    const { data: newUserTest, error: insertError } = await supabase
      .from("user_tests")
      .insert({
        user_id: user.id,
        test_template_id: test_template_id,
        status: "not_started",
        started_at: null,
        current_section: null,
        current_question_index: 0,
        time_remaining_seconds: testTemplate.test_type === "full" ? 7200 : 3600, // 2 hours for full, 1 hour for others
      })
      .select(`
        id,
        status,
        created_at,
        test_templates!inner(
          id,
          language,
          test_type,
          title,
          description,
          duration_minutes
        )
      `)
      .single()

    if (insertError) {
      console.error("Error creating user test:", insertError)
      return NextResponse.json({ error: "Failed to assign test to user" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Test successfully assigned to user",
      userTest: newUserTest,
    })
  } catch (error) {
    console.error("Assign test API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
