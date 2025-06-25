"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Volume2, Mic, AlertCircle } from "lucide-react"
import { type ChangeEvent, useState } from "react"

interface Question {
  id: string
  section: string
  subsection?: string
  prompt: string
  options?: string[]
  question_type: "mcq" | "fill_blank" | "essay" | "speaking" | "listening_mcq" | "select_word"
  audio_url?: string
  image_url?: string
}

interface Answer {
  question_id: string
  answer_text?: string
  selected_option?: string
  audio_url?: string
}

interface QuestionRendererProps {
  question: Question
  currentAnswer: Answer
  onAnswerChange: (questionId: string, answer: Partial<Answer>) => void
}

export default function QuestionRenderer({ question, currentAnswer, onAnswerChange }: QuestionRendererProps) {
  const [localEssayText, setLocalEssayText] = useState(currentAnswer.answer_text || "")

  const handleEssayChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLocalEssayText(e.target.value)
  }

  const handleEssayBlur = () => {
    onAnswerChange(question.id, { answer_text: localEssayText })
  }

  const renderMCQ = () => (
    <RadioGroup
      value={currentAnswer.selected_option}
      onValueChange={(value) => onAnswerChange(question.id, { selected_option: value })}
      className="space-y-3"
    >
      {question.options?.map((option, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 p-3 border rounded-md hover:bg-emerald-50 transition-colors"
        >
          <RadioGroupItem
            value={option}
            id={`${question.id}-option-${index}`}
            className="border-emerald-500 text-emerald-600 focus:ring-emerald-500"
          />
          <Label htmlFor={`${question.id}-option-${index}`} className="text-slate-700 flex-1 cursor-pointer text-base">
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )

  const renderFillBlank = () => {
    // Assuming prompt contains placeholders like "___" or "[blank]"
    // This is a simplified version. A more robust solution might parse the prompt.
    const parts = question.prompt.split(/(___)|(\[blank\])/gi).filter(Boolean)
    let blankCount = 0

    // For multiple blanks, we'd need to store answers in an array or object.
    // For simplicity, this example assumes one blank or that answer_text stores all combined.
    return (
      <div>
        {parts.map((part, index) => {
          if (part === "___" || part === "[blank]") {
            blankCount++
            return (
              <Input
                key={`blank-${index}`}
                type="text"
                value={currentAnswer.answer_text || ""} // Simplified: assumes single blank
                onChange={(e) => onAnswerChange(question.id, { answer_text: e.target.value })}
                className="inline-block w-auto mx-1 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder={`Answer ${blankCount}`}
              />
            )
          }
          return (
            <span key={`text-${index}`} className="text-slate-700 text-base leading-relaxed">
              {part}
            </span>
          )
        })}
      </div>
    )
  }

  const renderEssay = () => (
    <Textarea
      value={localEssayText}
      onChange={handleEssayChange}
      onBlur={handleEssayBlur}
      placeholder="Type your essay here..."
      rows={10}
      className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 text-base"
    />
  )

  const renderSpeaking = () => (
    <div className="p-4 border border-dashed border-emerald-400 rounded-lg bg-emerald-50 text-center">
      <Mic className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
      <p className="text-slate-600 mb-3">Speaking questions require audio recording.</p>
      <Button disabled className="bg-emerald-300 cursor-not-allowed">
        Start Recording (Feature Coming Soon)
      </Button>
      {currentAnswer.audio_url && <p className="mt-2 text-sm text-green-600">Audio previously recorded.</p>}
      <div className="mt-3 text-xs text-slate-500 flex items-center justify-center">
        <AlertCircle className="w-3 h-3 mr-1" /> Audio recording is a placeholder for this demo.
      </div>
    </div>
  )

  const renderListeningMCQ = () => (
    <div className="space-y-4">
      {question.audio_url ? (
        <div className="flex items-center space-x-3 p-3 bg-slate-100 rounded-md">
          <Button variant="outline" size="icon" className="border-emerald-500 text-emerald-600 hover:bg-emerald-100">
            <Volume2 className="h-5 w-5" />
          </Button>
          <audio controls src={question.audio_url} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <p className="text-sm text-red-500">Audio file is missing for this question.</p>
      )}
      {renderMCQ()}
    </div>
  )

  const renderSelectWord = () => renderMCQ() // Same UI as MCQ for now

  let content
  switch (question.question_type) {
    case "mcq":
      content = renderMCQ()
      break
    case "fill_blank":
      content = renderFillBlank()
      break
    case "essay":
      content = renderEssay()
      break
    case "speaking":
      content = renderSpeaking()
      break
    case "listening_mcq":
      content = renderListeningMCQ()
      break
    case "select_word":
      content = renderSelectWord()
      break
    default:
      content = <p className="text-red-500">Unsupported question type: {question.question_type}</p>
  }

  return (
    <div className="space-y-4">
      {question.question_type !== "fill_blank" && ( // Prompt is part of fill_blank rendering
        <p className="text-slate-800 text-lg font-medium leading-relaxed whitespace-pre-wrap">{question.prompt}</p>
      )}
      {question.image_url && (
        <div className="my-4">
          <img
            src={question.image_url || "/placeholder.svg"}
            alt="Question visual aid"
            className="max-w-full h-auto rounded-md border"
          />
        </div>
      )}
      <div>{content}</div>
    </div>
  )
}
