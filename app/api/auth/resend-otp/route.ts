import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { generateOTP } from "@/lib/auth-utils"
import { sendVerificationEmail } from "@/lib/email-service"

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
      .select("first_name, email_verified")
      .eq("email", email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.email_verified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
    }

    // Generate new OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Delete existing OTPs for this email
    await supabase.from("email_verifications").delete().eq("email", email)

    // Insert new OTP
    const { error: otpError } = await supabase.from("email_verifications").insert({
      email,
      otp_code: otp,
      expires_at: expiresAt.toISOString(),
    })

    if (otpError) {
      console.error("OTP creation error:", otpError)
      return NextResponse.json({ error: "Failed to generate verification code" }, { status: 500 })
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(email, otp, user.first_name)

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error)
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Verification code sent successfully",
    })
  } catch (error) {
    console.error("Resend OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
