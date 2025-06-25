"use client"

import { useState, useEffect, useRef } from "react"
import { Clock } from "lucide-react"

interface TestTimerProps {
  initialTime: number // in seconds
  onTimeUp: () => void
}

export default function TestTimer({ initialTime, onTimeUp }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTimeLeft(initialTime) // Reset time if initialTime changes (e.g. on page load)
  }, [initialTime])

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current)
      onTimeUp()
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeLeft, onTimeUp])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const timeColor = timeLeft <= 60 ? "text-red-400" : timeLeft <= 300 ? "text-yellow-300" : "text-white"

  return (
    <div className={`flex items-center space-x-2 font-medium ${timeColor} tabular-nums`}>
      <Clock className="h-5 w-5" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  )
}
