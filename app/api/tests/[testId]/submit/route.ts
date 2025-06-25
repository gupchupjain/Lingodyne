// This file might already exist. Ensure it updates test status.
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { testId: string } }) {
  const testId = params.testId
  if (!testId) {
    return NextResponse.json({ message: "Test ID is required" }, { status: 400 })
  }

  try {
    // Potentially, you could also calculate scores for auto-gradable sections here
    // using a Supabase function or by fetching answers and questions.
    // For now, just updating status.

    const { data, error } = await supabase
      .from("tests")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", testId)
      .select("id, status")
      .single()

    if (error) {
      console.error("Error submitting test:", error)
      throw error
    }

    if (!data) {
      return NextResponse.json({ message: "Test not found or could not be updated." }, { status: 404 })
    }

    return NextResponse.json({ message: "Test submitted successfully", testStatus: data.status }, { status: 200 })
  } catch (error: any) {
    console.error(`Error submitting test ${testId}:`, error)
    return NextResponse.json({ message: error.message || "Failed to submit test" }, { status: 500 })
  }
}
