import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      nodeEnv: process.env.NODE_ENV,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyLength: process.env.RESEND_API_KEY?.length || 0,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...',
      customDomain: process.env.CUSTOM_DOMAIN,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      hasDebugSecret: !!process.env.DEBUG_SECRET,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      environment: envCheck,
      message: "Environment check completed"
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 