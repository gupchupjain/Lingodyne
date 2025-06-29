import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await getAuthenticatedUser(request)
    if ("error" in authResult) {
      console.log("Reviewer API - Authentication failed:", authResult.error)
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { user } = authResult
    console.log("Reviewer API - User authenticated:", user.email)
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

    const userRoleNames = userRoles?.map(ur => (ur.roles as any)?.name).filter(Boolean) || []
    console.log("Reviewer API - User roles:", userRoleNames)

    const hasReviewerRole = userRoleNames.some(role => 
      role === 'reviewer' || role === 'admin' || role === 'super_admin'
    )

    console.log("Reviewer API - Has reviewer role:", hasReviewerRole)

    if (!hasReviewerRole) {
      console.log("Reviewer API - Access denied for user:", user.email)
      return NextResponse.json({ error: "Access denied. Reviewer role required." }, { status: 403 })
    }

    // Fetch tests that need review (status = 'submitted' or 'under_review')
    const { data: tests, error: testsError } = await supabase
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
      .in("status", ["submitted", "under_review"])
      .order("submitted_at", { ascending: false })

    if (testsError) {
      console.error("Error fetching tests for review:", testsError)
      return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 })
    }

    const statusBreakdown = tests?.reduce((acc, test) => {
      acc[test.status] = (acc[test.status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    console.log(`Reviewer API - Fetched ${tests?.length || 0} tests for review. Status breakdown:`, statusBreakdown)

    return NextResponse.json({ tests: tests || [] })
  } catch (error) {
    console.error("Error in reviewer tests API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 