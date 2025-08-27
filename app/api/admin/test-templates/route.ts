import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAdminUser } from "@/lib/admin-middleware"

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await getAdminUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const supabase = createServerClient()

    // Get all test templates
    const { data: templates, error } = await supabase
      .from("test_templates")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching templates:", error)
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
    }

    return NextResponse.json({ templates: templates || [] })
  } catch (error) {
    console.error("Error in test templates API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await getAdminUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { title, description, language, test_type, duration_minutes, price, is_active } = await request.json()

    // Validate required fields
    if (!title || !language || !test_type || !duration_minutes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Create test template
    const { data: template, error } = await supabase
      .from("test_templates")
      .insert({
        title,
        description,
        language,
        test_type,
        duration_minutes,
        price: price || 0,
        is_active: is_active !== undefined ? is_active : true,
        version_code: "v1" // Default version
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating template:", error)
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error("Error in create template API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
