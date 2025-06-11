"use client"

import { useState, useEffect } from "react"
import { Users, Eye } from "lucide-react"

interface VisitorStats {
  total: number
  unique: number
  today: number
}

export function VisitorCounter() {
  const [stats, setStats] = useState<VisitorStats>({
    total: 0,
    unique: 0,
    today: 0,
  })

  useEffect(() => {
    // Track current visit
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: window.location.pathname }),
    })

    // Get visitor stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/visitors")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch visitor stats:", error)
      }
    }

    fetchStats()

    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4" />
        <span>Hari ini: {stats.today}</span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        <span>Total: {stats.total}</span>
      </div>
    </div>
  )
}
