import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })
    
    // Clear admin token cookie
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0
    })

    return response
  } catch (error) {
    console.error("Error in admin logout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
