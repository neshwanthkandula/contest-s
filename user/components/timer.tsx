"use client"

import { useEffect, useRef, useState } from "react"
import { calculateEndTime } from "../components/endtime"

interface TimerProps {
  start_date: string
  start_time: string
  start_duration: string
  onTimeUp?: () => void
}

const Timer = ({
  start_date,
  start_time,
  start_duration,
  onTimeUp,
}: TimerProps) => {
  const [remaining, setRemaining] = useState(0)
  const firedRef = useRef(false)

  useEffect(() => {
    const endTime = calculateEndTime(
      start_date,
      start_time,
      start_duration
    )

    const tick = () => {
      const diff = Math.floor((endTime - Date.now()) / 1000)
      const value = diff > 0 ? diff : 0

      setRemaining(value)

      if (value === 0 && !firedRef.current) {
        firedRef.current = true
        onTimeUp?.()
      }
    }

    tick()
    const interval = setInterval(tick, 1000)

    return () => clearInterval(interval)
  }, [start_date, start_time, start_duration, onTimeUp])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  return (
    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-center">
      {remaining === 0
        ? "00:00"
        : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
    </div>
  )
}

export default Timer
