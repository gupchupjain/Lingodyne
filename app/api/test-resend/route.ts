import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function GET(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Test Resend API connection
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["test@example.com"],
      subject: "Test Email",
      html: "<p>This is a test email</p>",
    })

    return NextResponse.json({
      success: !error,
      error: error?.message,
      data,
      environment: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...',
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Resend test error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
      environment: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...',
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
} 