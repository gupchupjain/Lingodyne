import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Only allow in development or with a secret key
    const authHeader = request.headers.get('authorization')
    const isAuthorized = process.env.NODE_ENV === 'development' || 
                        authHeader === `Bearer ${process.env.DEBUG_SECRET}`

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const envCheck = {
      nodeEnv: process.env.NODE_ENV,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...',
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      customDomain: process.env.CUSTOM_DOMAIN,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      environment: envCheck,
      message: "Environment variables check completed"
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 