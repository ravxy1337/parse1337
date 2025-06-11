"use client"

import { useState, useEffect } from "react"
import { ClockIcon } from "lucide-react"

export function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <ClockIcon className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="font-mono font-bold">{formatTime(time)}</span>
        <span className="text-xs text-gray-500">{formatDate(time)}</span>
      </div>
    </div>
  )
}
