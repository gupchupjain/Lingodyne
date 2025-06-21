import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { hashPassword, generateOTP } from "@/lib/auth-utils"
import { sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, dateOfBirth, password } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !dateOfBirth || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Validate age (minimum 16 years)
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 16) {
      return NextResponse.json({ error: "You must be at least 16 years old" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id, email_verified").eq("email", email).single()

    if (existingUser) {
      if (existingUser.email_verified) {
        return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
      } else {
        // User exists but not verified, we'll update their info and resend OTP
        const hashedPassword = await hashPassword(password)

        await supabase
          .from("users")
          .update({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            password_hash: hashedPassword,
            updated_at: new Date().toISOString(),
          })
          .eq("email", email)
      }
    } else {
      // Create new user
      const hashedPassword = await hashPassword(password)

      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          date_of_birth: dateOfBirth,
          password_hash: hashedPassword,
        })
        .select()
        .single()

      if (userError) {
        console.error("User creation error:", userError)
        return NextResponse.json({ error: "Failed to create user account" }, { status: 500 })
      }
    }

    // Generate and store OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Delete any existing OTP for this email
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
    const emailResult = await sendVerificationEmail(email, otp, firstName)

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error)
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Account created successfully. Please check your email for verification code.",
      email,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
