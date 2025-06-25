import { supabase } from "@/lib/supabase"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const language = searchParams.get("lang") || "English"
  const testType = searchParams.get("type") || "demo" // Should be 'demo'
  const versionCode = searchParams.get("version") || "DEMO" // Should be 'DEMO'

  if (testType !== "demo" || language !== "English" || versionCode !== "DEMO") {
    return NextResponse.json(
      { message: "Invalid parameters for demo test questions. Only English DEMO demo is supported." },
      { status: 400 },
    )
  }

  try {
    console.log(`API: Fetching questions for demo template: ${language}, ${versionCode}, ${testType}`)

    // 1. Find the demo test template ID
    const { data: template, error: templateError } = await supabase
      .from("test_templates")
      .select("id, duration_minutes")
      .eq("language", language)
      .eq("version_code", versionCode)
      .eq("test_type", testType)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (templateError) {
      console.error("API: Supabase error fetching demo template:", templateError)
      return NextResponse.json({ message: `Error finding demo template: ${templateError.message}` }, { status: 500 })
    }

    if (!template) {
      console.error(`API: Demo template not found for ${language} ${versionCode} ${testType}.`)
      return NextResponse.json({ message: "Demo test configuration not found." }, { status: 404 })
    }

    console.log("API: Demo template found:", template)

    // 2. Fetch questions associated with this template ID
    // Using the actual column names from the questions table schema
    const { data: questions, error: questionsError } = await supabase
      .from("template_questions")
      .select(`
        question_id,
        section,
        question_order,
        questions (
          id,
          section,
          subsection,
          prompt,
          options,
          correct_answer,
          audio_url,
          image_url,
          language,
          difficulty_level,
          max_score,
          is_auto_gradable
        )
      `)
      .eq("test_template_id", template.id)
      .order("question_order", { ascending: true })

    if (questionsError) {
      console.error("API: Supabase error fetching questions for demo template:", questionsError)
      return NextResponse.json({ message: `Error fetching questions: ${questionsError.message}` }, { status: 500 })
    }

    if (!questions || questions.length === 0) {
      console.error("API: No questions found for demo template ID:", template.id)
      return NextResponse.json({ message: "No questions configured for this demo test." }, { status: 404 })
    }

    // Transform questions to the expected format and derive question_type from subsection
    const formattedQuestions = questions.map((item) => {
      const question = item.questions as any

      // Derive question_type from subsection
      let question_type = "mcq" // default
      if (question.subsection) {
        switch (question.subsection.toLowerCase()) {
          case "mcq":
          case "correct_word":
            question_type = "mcq"
            break
          case "fill_blanks":
            question_type = "fill_blank"
            break
          case "essay":
            question_type = "essay"
            break
          case "topic_discussion":
          case "description":
          case "opinion":
            question_type = "speaking"
            break
          default:
            // For listening section, check if it has options (MCQ) or not
            if (question.section === "listening" && question.options) {
              question_type = "listening_mcq"
            } else {
              question_type = "mcq"
            }
        }
      }

      return {
        ...question,
        question_type,
      }
    })

    console.log(
      `API: Successfully fetched ${formattedQuestions.length} questions for demo. Duration: ${template.duration_minutes} mins.`,
    )
    return NextResponse.json(
      { questions: formattedQuestions, duration_minutes: template.duration_minutes },
      { status: 200 },
    )
  } catch (error) {
    console.error("API: Unexpected error in /api/demo-test/questions:", error)
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    return NextResponse.json({ message }, { status: 500 })
  }
}
