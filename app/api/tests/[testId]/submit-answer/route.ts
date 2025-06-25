// This file might already exist. Ensure it handles upserting answers.
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { testId: string } }) {
  const testId = params.testId
  if (!testId) {
    return NextResponse.json({ message: "Test ID is required" }, { status: 400 })
  }

  try {
    const answerData = await request.json()
    // Expected answerData: { question_id: string, section: string, answer_text?: string, selected_option?: string, audio_url?: string }

    if (!answerData.question_id || !answerData.section) {
      return NextResponse.json({ message: "Question ID and section are required." }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("answers")
      .upsert(
        {
          test_id: testId,
          question_id: answerData.question_id,
          section: answerData.section,
          answer_text: answerData.answer_text,
          selected_option: answerData.selected_option,
          audio_url: answerData.audio_url,
          // uploaded_at is default now()
        },
        {
          onConflict: "test_id, question_id", // Composite primary key or unique constraint
        },
      )
      .select("id") // Optionally select some data back
      .single()

    if (error) {
      console.error("Error upserting answer:", error)
      throw error
    }

    return NextResponse.json({ message: "Answer saved successfully", answerId: data?.id }, { status: 200 })
  } catch (error: any) {
    console.error(`Error saving answer for test ${testId}:`, error)
    return NextResponse.json({ message: error.message || "Failed to save answer" }, { status: 500 })
  }
}
