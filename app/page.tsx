"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, CheckCircle, XCircle, User, MapPin, Calendar, Hash, Info, Moon, Sun, Monitor } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import { BatteryStatus } from "@/components/battery-status"
import { Clock } from "@/components/clock"
import { VisitorCounter } from "@/components/visitor-counter"

interface NIKResult {
  status: string
  pesan: string
  data?: {
    nik: string
    kelamin: string
    lahir: string
    provinsi: string
    kotakab: string
    kecamatan: string
    uniqcode: string
    tambahan: {
      kodepos: string
      pasaran: string
      usia: string
      ultah: string
      zodiak: string
      tahunLahir: string
      tempatLahir: string
    }
  }
}

export default function NIKParsePage() {
  const [nik, setNik] = useState("")
  const [result, setResult] = useState<NIKResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/nik/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nik }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        status: "error",
        pesan: "Terjadi kesalahan saat memproses NIK",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatNIK = (value: string) => {
    // Hapus semua karakter non-digit
    const digits = value.replace(/\D/g, "")
    // Batasi maksimal 16 digit
    return digits.slice(0, 16)
  }

  const handleNIKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNIK(e.target.value)
    setNik(formatted)
  }

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="w-4 h-4" />

    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />
      case "dark":
        return <Moon className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header dengan Status Bar */}
        <div className="flex flex-col space-y-4">
          {/* Status Bar */}
          <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Clock />
              <BatteryStatus />
            </div>
            <div className="flex items-center gap-4">
              <VisitorCounter />
              <Button variant="ghost" size="sm" onClick={cycleTheme} className="p-2">
                {getThemeIcon()}
              </Button>
            </div>
          </div>

          {/* Main Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">NIK PARSE BY RAVXY1337</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Parse dan validasi Nomor Induk Kependudukan (NIK) Indonesia
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Catatan Penting:</strong> NIK tidak menyimpan informasi nama. API ini hanya dapat mengekstrak
            informasi demografis seperti jenis kelamin, tanggal lahir, dan wilayah dari struktur NIK. Database lengkap
            dengan ribuan kecamatan telah diintegrasikan.
          </AlertDescription>
        </Alert>

        {/* Demo Form */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <User className="w-5 h-5" />
              NIK Parse
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              Masukkan NIK 16 digit untuk melihat informasi yang dapat diekstrak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nik" className="dark:text-white">
                  Nomor Induk Kependudukan (NIK)
                </Label>
                <Input
                  id="nik"
                  type="text"
                  placeholder="Masukkan 16 digit NIK"
                  value={nik}
                  onChange={handleNIKChange}
                  maxLength={16}
                  className="font-mono dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || nik.length !== 16}
                className="dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {loading ? "Memproses..." : "Parse NIK"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                {result.status === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                Hasil Parse NIK
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.status === "success" && result.data ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">NIK</Label>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono dark:text-white">
                          {result.data.nik}
                        </code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.data!.nik)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Jenis Kelamin</Label>
                      <Badge variant={result.data.kelamin === "LAKI-LAKI" ? "default" : "secondary"}>
                        {result.data.kelamin}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="dark:bg-gray-700" />

                  {/* Location Info */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold dark:text-white">
                      <MapPin className="w-4 h-4" />
                      Informasi Wilayah
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Provinsi</Label>
                        <p className="font-medium dark:text-white">{result.data.provinsi}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kabupaten/Kota</Label>
                        <p className="font-medium dark:text-white">{result.data.kotakab}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kecamatan</Label>
                        <p className="font-medium dark:text-white">{result.data.kecamatan}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode Pos</Label>
                        <p className="font-medium dark:text-white">{result.data.tambahan.kodepos}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="dark:bg-gray-700" />

                  {/* Birth Info */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold dark:text-white">
                      <Calendar className="w-4 h-4" />
                      Informasi Kelahiran
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Lahir</Label>
                        <p className="font-medium dark:text-white">{result.data.lahir}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tahun Lahir</Label>
                        <p className="font-medium dark:text-white">{result.data.tambahan.tahunLahir}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Usia</Label>
                        <p className="font-medium dark:text-white">{result.data.tambahan.usia}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Ulang Tahun</Label>
                        <p className="font-medium dark:text-white">{result.data.tambahan.ultah}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Hari Pasaran</Label>
                        <p className="font-medium dark:text-white">{result.data.tambahan.pasaran}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Zodiak</Label>
                        <Badge variant="outline">{result.data.tambahan.zodiak}</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator className="dark:bg-gray-700" />

                  {/* Additional Info */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold dark:text-white">
                      <Hash className="w-4 h-4" />
                      Informasi Tambahan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode Unik</Label>
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono dark:text-white">
                          {result.data.uniqcode}
                        </code>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm+ font-medium text-gray-500 dark:text-gray-400">
                          Tempat Lahir (Provinsi)
                        </Label>
                        <p className="font-medium dark:text-white">{result.data.tambahan.tempatLahir}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 font-medium dark:text-red-400">{result.pesan}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* API Documentation */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">API Documentation</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Cara menggunakan NIK Parse API dalam aplikasi Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Endpoint */}
            <div className="space-y-2">
              <h3 className="font-semibold dark:text-white">Endpoint</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <code className="text-sm dark:text-gray-300">
                  POST /api/nik/parse
                  <br />
                  GET /api/nik/parse?nik=3201234567890001
                </code>
              </div>
            </div>

            {/* Request Examples */}
            <div className="space-y-4">
              <h3 className="font-semibold dark:text-white">Contoh Request</h3>

              <div className="space-y-2">
                <h4 className="font-medium dark:text-gray-200">POST Request</h4>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                  <pre className="text-sm dark:text-gray-300">
                    {`curl -X POST https://parse1337.vercel.app/api/nik/parse \\
  -H "Content-Type: application/json" \\
  -d '{"nik": "3201234567890001"}'`}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium dark:text-gray-200">GET Request</h4>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                  <pre className="text-sm dark:text-gray-300">{`curl https://parse1337.verve.app/api/nik/parse?nik=3201234567890001`}</pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium dark:text-gray-200">JavaScript/Fetch</h4>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                  <pre className="text-sm dark:text-gray-300">
                    {`const response = await fetch('/api/nik/parse', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ nik: '3201234567890001' })
});

const result = await response.json();
console.log(result);`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Response Format */}
            <div className="space-y-2">
              <h3 className="font-semibold dark:text-white">Format Response (Success)</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                <pre className="text-sm dark:text-gray-300">
                  {`{
  "status": "success",
  "pesan": "NIK valid",
  "data": {
    "nik": "3201234567890001",
    "kelamin": "LAKI-LAKI",
    "lahir": "23/45/1990",
    "provinsi": "JAWA BARAT",
    "kotakab": "KAB. BOGOR",
    "kecamatan": "CIBINONG",
    "uniqcode": "0001",
    "tambahan": {
      "kodepos": "43271",
      "pasaran": "Senin Legi",
      "usia": "34 Tahun 2 Bulan 15 Hari",
      "ultah": "10 bulan 15 hari lagi",
      "zodiak": "Capricorn",
      "tahunLahir": "1990",
      "tempatLahir": "JAWA BARAT"
    }
  }
}`}
                </pre>
              </div>
            </div>

            {/* Error Response */}
            <div className="space-y-2">
              <h3 className="font-semibold dark:text-white">Format Response (Error)</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                <pre className="text-sm dark:text-gray-300">
                  {`{
  "status": "error",
  "pesan": "NIK harus 16 digit"
}`}
                </pre>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h3 className="font-semibold dark:text-white">Fitur</h3>
              <ul className="list-disc list-inside space-y-1 text-sm dark:text-gray-300">
                <li>✅ Validasi format NIK 16 digit</li>
                <li>✅ Database lengkap ribuan kecamatan Indonesia</li>
                <li>✅ Ekstraksi jenis kelamin dari tanggal lahir</li>
                <li>✅ Identifikasi provinsi, kabupaten/kota, dan kecamatan</li>
                <li>✅ Informasi kode pos wilayah</li>
                <li>✅ Perhitungan usia real-time</li>
                <li>✅ Konversi ke hari pasaran Jawa</li>
                <li>✅ Penentuan zodiak berdasarkan tanggal lahir</li>
                <li>✅ Countdown ulang tahun</li>
                <li>✅ Support GET dan POST request</li>
                <li>✅ Dark/Light mode toggle</li>
                <li>✅ Battery status indicator</li>
                <li>✅ Real-time clock</li>
                <li>✅ Visitor tracking by IP</li>
                <li>❌ Nama tidak tersedia (NIK tidak menyimpan nama)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}