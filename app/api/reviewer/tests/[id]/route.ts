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

    // Fetch test details
    const { data: test, error: testError } = await supabase
      .from("user_tests")
      .select(`
        id,
        user_id,
        test_template_id,
        status,
        started_at,
        submitted_at,
        created_at,
        users (
          email,
          first_name,
          last_name
        ),
        test_templates (
          id,
          title,
          language,
          test_type
        )
      `)
      .eq("id", params.id)
      .single()

    if (testError || !test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    return NextResponse.json({ test })
  } catch (error) {
    console.error("Error in reviewer test API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 