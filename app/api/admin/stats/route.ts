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

    // Get total tests
    const { count: totalTests } = await supabase
      .from("user_tests")
      .select("*", { count: "exact", head: true })

    // Get pending reviews
    const { count: pendingReviews } = await supabase
      .from("user_tests")
      .select("*", { count: "exact", head: true })
      .eq("status", "under_review")

    // Get total users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    // Get total questions
    const { count: totalQuestions } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })

    return NextResponse.json({
      totalTests: totalTests || 0,
      pendingReviews: pendingReviews || 0,
      totalUsers: totalUsers || 0,
      totalQuestions: totalQuestions || 0
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
