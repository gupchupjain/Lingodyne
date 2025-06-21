import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { isOTPExpired } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Find the OTP record
    const { data: otpRecord, error: otpError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otp)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (otpError || !otpRecord) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expires_at)) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 })
    }

    // Mark OTP as verified
    await supabase.from("email_verifications").update({ verified: true }).eq("id", otpRecord.id)

    // Mark user as email verified
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        email_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)

    if (userUpdateError) {
      console.error("User update error:", userUpdateError)
      return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
