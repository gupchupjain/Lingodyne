import { type NextRequest } from "next/server"
import { jwtVerify } from "jose"

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export async function getAdminUser(request: NextRequest): Promise<AdminUser | { error: string; status: number }> {
  try {
    const adminToken = request.cookies.get("admin-token")?.value

    if (!adminToken) {
      return { error: "Admin token not found", status: 401 }
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")
    
    const { payload } = await jwtVerify(adminToken, secret)
    
    if (!payload.userId || !payload.email || payload.role !== "admin") {
      return { error: "Invalid admin token", status: 401 }
    }

    return {
      id: payload.userId as string,
      email: payload.email as string,
      firstName: payload.firstName as string || "Admin",
      lastName: payload.lastName as string || "User",
      role: payload.role as string
    }
  } catch (error) {
    console.error("Error verifying admin token:", error)
    return { error: "Invalid admin token", status: 401 }
  }
}
