// This file might already exist from previous iterations.
// Ensure it uses the RPC function `get_questions_for_test` or similar logic.
// For this iteration, I'm providing a version that uses the RPC.

import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { testId: string } }) {
  const testId = params.testId

  if (!testId) {
    return NextResponse.json({ message: "Test ID is required" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.rpc("get_questions_for_test", {
      p_test_id: testId,
    })

    if (error) {
      console.error("Error fetching questions via RPC:", error)
      throw error
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "No questions found for this test or test does not exist." }, { status: 404 })
    }

    // The RPC function should return questions with a question_type field.
    // If not, you might need to join with the questions table here or adjust the RPC.
    // For now, assuming RPC returns all necessary fields including question_type.

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error(`Error fetching questions for test ${testId}:`, error)
    return NextResponse.json({ message: error.message || "Failed to fetch questions" }, { status: 500 })
  }
}
