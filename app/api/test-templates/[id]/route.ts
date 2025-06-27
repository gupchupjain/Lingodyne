import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = createServerClient()

    // Fetch test template details
    const { data: testTemplate, error: templateError } = await supabase
      .from("test_templates")
      .select(`
        id,
        language,
        test_type,
        title,
        description,
        duration_minutes,
        is_active,
        created_at
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (templateError || !testTemplate) {
      return NextResponse.json({ error: "Test template not found" }, { status: 404 })
    }

    // Count total questions for this test template
    const { count: totalQuestions, error: countError } = await supabase
      .from("template_questions")
      .select("*", { count: "exact", head: true })
      .eq("test_template_id", id)

    if (countError) {
      console.error("Error counting questions:", countError)
      return NextResponse.json({ error: "Failed to count questions" }, { status: 500 })
    }

    // Get question breakdown by section
    const { data: sectionBreakdown, error: sectionError } = await supabase
      .from("template_questions")
      .select("section")
      .eq("test_template_id", id)

    if (sectionError) {
      console.error("Error fetching section breakdown:", sectionError)
      return NextResponse.json({ error: "Failed to fetch section breakdown" }, { status: 500 })
    }

    // Count questions by section
    const sectionCounts = sectionBreakdown.reduce(
      (acc, item) => {
        acc[item.section] = (acc[item.section] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Define pricing based on test type
    const pricing = {
      full: { price: "$49", priceInCents: 4900 },
      practice: { price: "Free", priceInCents: 0 },
      demo: { price: "Free", priceInCents: 0 },
    }

    const testDetails = {
      ...testTemplate,
      totalQuestions: totalQuestions || 0,
      sectionBreakdown: sectionCounts,
      pricing: pricing[testTemplate.test_type as keyof typeof pricing],
    }

    return NextResponse.json({ testDetails })
  } catch (error) {
    console.error("Test template details API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
