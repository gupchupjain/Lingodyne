import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { generateResetToken } from "@/lib/auth-utils"
import { sendPasswordResetEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, first_name, email_verified")
      .eq("email", email)
      .single()

    if (userError || !user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, we have sent a password reset link.",
      })
    }

    if (!user.email_verified) {
      return NextResponse.json({ error: "Please verify your email first" }, { status: 400 })
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete existing reset tokens for this user
    await supabase.from("password_resets").delete().eq("user_id", user.id)

    // Insert new reset token
    const { error: tokenError } = await supabase.from("password_resets").insert({
      user_id: user.id,
      email,
      reset_token: resetToken,
      expires_at: expiresAt.toISOString(),
    })

    if (tokenError) {
      console.error("Reset token creation error:", tokenError)
      return NextResponse.json({ error: "Failed to generate reset token" }, { status: 500 })
    }

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.first_name)

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error)
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
    }

    return NextResponse.json({
      message: "If an account with that email exists, we have sent a password reset link.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
