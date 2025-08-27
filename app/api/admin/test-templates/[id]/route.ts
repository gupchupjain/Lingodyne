import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getAdminUser } from "@/lib/admin-middleware"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update test template
    const { data: template, error } = await supabase
      .from("test_templates")
      .update({
        title,
        description,
        language,
        test_type,
        duration_minutes,
        price: price || 0,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating template:", error)
      return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error("Error in update template API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const authResult = await getAdminUser(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const supabase = createServerClient()

    // Check if template exists
    const { data: existingTemplate, error: fetchError } = await supabase
      .from("test_templates")
      .select("id")
      .eq("id", params.id)
      .single()

    if (fetchError || !existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Delete test template
    const { error } = await supabase
      .from("test_templates")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("Error deleting template:", error)
      return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete template API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
