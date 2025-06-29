import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { createServerClient } from "@/lib/supabase"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    // Try to get token from cookies
    const token = request.cookies.get("auth-token")?.value

    console.log("Auth middleware - Token found:", !!token)

    if (!token) {
      console.log("Auth middleware - No token in cookies")
      return { error: "No authentication token found", status: 401 }
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    console.log("Auth middleware - Token verified, userId:", payload.userId)

    if (!payload.userId) {
      console.log("Auth middleware - No userId in token payload")
      return { error: "Invalid token", status: 401 }
    }

    // Get user details from database
    const supabase = createServerClient()
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, email_verified")
      .eq("id", payload.userId)
      .single()

    if (userError || !user) {
      console.log("Auth middleware - User not found in database:", userError)
      return { error: "User not found", status: 404 }
    }

    if (!user.email_verified) {
      console.log("Auth middleware - User email not verified")
      return { error: "Email not verified", status: 403 }
    }

    console.log("Auth middleware - User authenticated successfully:", user.email)
    return { user }
  } catch (error) {
    console.error("Auth middleware error:", error)
    return { error: "Invalid or expired token", status: 401 }
  }
}

export async function getUserRoles(userId: string) {
  try {
    const supabase = createServerClient()
    const { data: userRoles, error: roleError } = await supabase
      .from("user_roles")
      .select(`
        roles (
          name
        )
      `)
      .eq("user_id", userId)

    if (roleError) {
      console.error("Error fetching user roles:", roleError)
      return []
    }

    return userRoles?.map(ur => (ur.roles as any)?.name).filter(Boolean) || []
  } catch (error) {
    console.error("Error getting user roles:", error)
    return []
  }
}

export async function hasRole(userId: string, role: string) {
  const roles = await getUserRoles(userId)
  return roles.includes(role)
}
