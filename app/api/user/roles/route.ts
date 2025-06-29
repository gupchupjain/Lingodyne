import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAuthenticatedUser, getUserRoles } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await getAuthenticatedUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { user } = authResult

    // Get user roles
    const roles = await getUserRoles(user.id)

    return NextResponse.json({ roles })
  } catch (error) {
    console.error("Error in user roles API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 