import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect reviewer routes
  if (request.nextUrl.pathname.startsWith('/reviewer')) {
    // Check if user is authenticated (has auth token)
    const authToken = request.cookies.get('auth-token')
    
    if (!authToken) {
      // Redirect to login if no auth token
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // For reviewer routes, we'll let the API handle role checking
    // The client-side components will handle the UI appropriately
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/reviewer/:path*',
    // Add other protected routes here if needed
  ],
} 