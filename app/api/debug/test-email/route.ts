import { type NextRequest, NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json()

    if (!email || !firstName) {
      return NextResponse.json({ error: "Email and firstName are required" }, { status: 400 })
    }

    // Test email sending
    const testOtp = "123456"
    const emailResult = await sendVerificationEmail(email, testOtp, firstName)

    if (!emailResult.success) {
      console.error("Email test failed:", emailResult.error)
      return NextResponse.json({ 
        error: "Email sending failed", 
        details: emailResult.error,
        success: false 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully",
      data: emailResult.data 
    })

  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error",
      success: false 
    }, { status: 500 })
  }
} 