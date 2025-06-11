"use client"

import { useState, useEffect } from "react"
import { Battery, BatteryLow, Plug } from "lucide-react"

interface BatteryInfo {
  level: number
  charging: boolean
  supported: boolean
}

export function BatteryStatus() {
  const [battery, setBattery] = useState<BatteryInfo>({
    level: 0,
    charging: false,
    supported: false,
  })

  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        // @ts-ignore - Battery API belum fully supported di TypeScript
        if ("getBattery" in navigator) {
          // @ts-ignore
          const batteryManager = await navigator.getBattery()

          const updateBattery = () => {
            setBattery({
              level: Math.round(batteryManager.level * 100),
              charging: batteryManager.charging,
              supported: true,
            })
          }

          updateBattery()

          batteryManager.addEventListener("chargingchange", updateBattery)
          batteryManager.addEventListener("levelchange", updateBattery)

          return () => {
            batteryManager.removeEventListener("chargingchange", updateBattery)
            batteryManager.removeEventListener("levelchange", updateBattery)
          }
        } else {
          setBattery((prev) => ({ ...prev, supported: false }))
        }
      } catch (error) {
        setBattery((prev) => ({ ...prev, supported: false }))
      }
    }

    getBatteryInfo()
  }, [])

  if (!battery.supported) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Battery className="w-4 h-4" />
        <span>N/A</span>
      </div>
    )
  }

  const getBatteryIcon = () => {
    if (battery.charging) return <Plug className="w-4 h-4" />
    if (battery.level <= 20) return <BatteryLow className="w-4 h-4 text-red-500" />
    return <Battery className="w-4 h-4" />
  }

  const getBatteryColor = () => {
    if (battery.charging) return "text-green-500"
    if (battery.level <= 20) return "text-red-500"
    if (battery.level <= 50) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${getBatteryColor()}`}>
      {getBatteryIcon()}
      <span>{battery.level}%</span>
      {battery.charging && <span className="text-xs">(Charging)</span>}
    </div>
  )
}
