import { type NextRequest, NextResponse } from "next/server"

// Simulasi database visitor (dalam implementasi nyata gunakan database)
const visitors: Array<{
  ip: string
  userAgent: string
  timestamp: string
  page: string
}> = []

export async function GET() {
  // Hitung statistik visitor
  const totalVisitors = visitors.length
  const uniqueIPs = new Set(visitors.map((v) => v.ip)).size
  const todayVisitors = visitors.filter((v) => {
    const today = new Date().toDateString()
    const visitorDate = new Date(v.timestamp).toDateString()
    return today === visitorDate
  }).length

  return NextResponse.json({
    total: totalVisitors,
    unique: uniqueIPs,
    today: todayVisitors,
    recent: visitors.slice(-10).reverse(), // 10 visitor terakhir
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page } = body

    const ip = request.ip || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const timestamp = new Date().toISOString()

    visitors.push({
      ip,
      userAgent,
      timestamp,
      page: page || "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
