import { type NextRequest, NextResponse } from "next/server"
import { getAdminUser } from "@/lib/admin-middleware"

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAdminUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    return NextResponse.json({ user: authResult })
  } catch (error) {
    console.error("Error in admin auth check:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
