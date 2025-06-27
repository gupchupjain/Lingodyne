import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Fetch active test templates ordered by language and version_code
    const { data: testTemplates, error } = await supabase
      .from("test_templates")
      .select(`
        id,
        language,
        test_type,
        title,
        description,
        duration_minutes
      `)
      .eq("is_active", true)
      .order("language", { ascending: true })
      .order("version_code", { ascending: true })

    if (error) {
      console.error("Error fetching test templates:", error)
      return NextResponse.json({ error: "Failed to fetch test templates" }, { status: 500 })
    }

    // Group tests by language for easier frontend handling
    const groupedTests = testTemplates.reduce(
      (acc, test) => {
        if (!acc[test.language]) {
          acc[test.language] = {
            language: test.language,
            full: [],
            practice: [],
            demo: [],
          }
        }
        acc[test.language][test.test_type].push(test)
        return acc
      },
      {} as Record<string, any>,
    )

    return NextResponse.json({
      testTemplates,
      groupedTests,
    })
  } catch (error) {
    console.error("Test templates API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
