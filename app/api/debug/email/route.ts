import { type NextRequest, NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with a secret key
    const authHeader = request.headers.get('authorization')
    const isAuthorized = process.env.NODE_ENV === 'development' || 
                        authHeader === `Bearer ${process.env.DEBUG_SECRET}`

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, firstName } = await request.json()
    
    if (!email || !firstName) {
      return NextResponse.json({ error: "Email and firstName are required" }, { status: 400 })
    }

    // Test email sending
    const result = await sendVerificationEmail(email, "123456", firstName)
    
    return NextResponse.json({
      success: result.success,
      error: result.error,
      data: result.data,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasResendKey: !!process.env.RESEND_API_KEY,
        resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...',
        customDomain: process.env.CUSTOM_DOMAIN,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Email debug error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 