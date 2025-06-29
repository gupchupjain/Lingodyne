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

    // Get user roles
    const { data: userRoles, error: roleError } = await supabase
      .from("user_roles")
      .select(`
        roles (
          id,
          name
        )
      `)
      .eq("user_id", user.id)

    if (roleError) {
      console.error("Error fetching user roles:", roleError)
      return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
    }

    const roles = userRoles?.map(ur => (ur.roles as any)?.name).filter(Boolean) || []
    const hasReviewerRole = roles.some(role => 
      role === 'reviewer' || role === 'admin' || role === 'super_admin'
    )

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      roles,
      hasReviewerRole,
      canAccessReviewer: hasReviewerRole
    })
  } catch (error) {
    console.error("Error in debug roles API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 