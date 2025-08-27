import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Hardcoded admin credentials for now
    const ADMIN_EMAIL = "admin@admin.com"
    const ADMIN_PASSWORD = "12345678"

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token with hardcoded admin data
    const adminUserId = "550e8400-e29b-41d4-a716-446655440000" // Valid UUID format
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")
    const token = await new SignJWT({
      userId: adminUserId,
      email: ADMIN_EMAIL,
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret)

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUserId,
        email: ADMIN_EMAIL,
        firstName: "Admin",
        lastName: "User",
        role: "admin"
      }
    })

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response

  } catch (error) {
    console.error("Error in admin login:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
