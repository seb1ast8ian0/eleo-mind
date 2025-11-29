"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea } from "recharts"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO, addDays, differenceInCalendarDays } from "date-fns"
import { de } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Sun, Tag, Activity } from "lucide-react"

interface TrendChartProps {
  history: {
    date: string
    amount: number
    weather_condition: string
    weather_temperature: number
    is_sale: boolean
    sale_type: string | null
  }[]
  forecast: {
    date: string
    amount: number
    weather_condition: string
    weather_temperature: number
    is_sale: boolean
    sale_type: string | null
  }[]
}

interface TooltipProps {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload
    const rawDate = dataPoint?.date
    const dateObj = typeof rawDate === "string" ? parseISO(rawDate) : new Date(rawDate)
    return (
      <div className="bg-white border-none p-3 rounded-xl shadow-xl text-[#1f1c17]">
        <p className="font-bold text-sm mb-1">{format(dateObj, "dd. MMM", { locale: de })}</p>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[#9eb782]"></div>
           <p className="text-sm font-medium">{Math.ceil(dataPoint.amount)} Einheiten</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
           {dataPoint.weather_condition}, {dataPoint.weather_temperature}°C
        </p>
        {dataPoint.is_sale && (
          <Badge variant="secondary" className="mt-2 text-[10px] bg-red-100 text-red-600 hover:bg-red-100">
              {dataPoint.sale_type}
          </Badge>
        )}
      </div>
    )
  }
  return null
}

export function TrendChart({ history, forecast }: TrendChartProps) {
  const [overlay, setOverlay] = useState<"none" | "sale" | "weather" | "peaks">("none")
  // Combine history and forecast for the chart
  const data = [
    ...history.map((item) => ({ ...item, type: "history" })),
    ...forecast.map((item) => ({ ...item, type: "forecast" })),
  ]
  const maxAmount = Math.max(...data.map((d) => d.amount))

  const saleRanges = (() => {
    const dates = data
      .filter((d) => d.is_sale)
      .map((d) => parseISO(d.date))
      .sort((a, b) => a.getTime() - b.getTime())

    const ranges: { x1: string; x2: string }[] = []
    if (dates.length === 0) return ranges

    let start = dates[0]
    let prev = dates[0]

    for (let i = 1; i < dates.length; i++) {
      const cur = dates[i]
      const diff = cur.getTime() - prev.getTime()
      if (diff === 24 * 60 * 60 * 1000) {
        prev = cur
      } else {
        ranges.push({ x1: format(start, "yyyy-MM-dd"), x2: format(addDays(prev, 1), "yyyy-MM-dd") })
        start = cur
        prev = cur
      }
    }
    ranges.push({ x1: format(start, "yyyy-MM-dd"), x2: format(addDays(prev, 1), "yyyy-MM-dd") })
    return ranges
  })()

  const weatherRanges = (() => {
    const arr = data
      .map((d) => ({
        date: parseISO(d.date),
        kind: (d.weather_condition === "sun" ? "good" : d.weather_condition === "rain" ? "bad" : null) as "good" | "bad" | null,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    const ranges: { x1: string; x2: string; kind: "good" | "bad" }[] = []
    let start: Date | null = null
    let prev: Date | null = null
    let currentKind: "good" | "bad" | null = null

    for (const item of arr) {
      if (!item.kind) {
        if (currentKind && start && prev) {
          ranges.push({ x1: format(start, "yyyy-MM-dd"), x2: format(addDays(prev, 1), "yyyy-MM-dd"), kind: currentKind })
        }
        start = null
        prev = null
        currentKind = null
        continue
      }

      if (!currentKind) {
        currentKind = item.kind
        start = item.date
        prev = item.date
        continue
      }

      if (item.kind === currentKind && prev && item.date.getTime() - prev.getTime() === 24 * 60 * 60 * 1000) {
        prev = item.date
      } else {
        if (start && prev) {
          ranges.push({ x1: format(start, "yyyy-MM-dd"), x2: format(addDays(prev, 1), "yyyy-MM-dd"), kind: currentKind })
        }
        currentKind = item.kind
        start = item.date
        prev = item.date
      }
    }

    if (currentKind && start && prev) {
      ranges.push({ x1: format(start, "yyyy-MM-dd"), x2: format(addDays(prev, 1), "yyyy-MM-dd"), kind: currentKind })
    }

    return ranges
  })()

  const peakRanges = (() => {
    const arr = data
      .map((d) => ({ date: parseISO(d.date), amount: d.amount }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    const flags = arr.map((item, i) => {
      const start = Math.max(0, i - 7)
      const window = arr.slice(start, i)
      const avg = window.length ? window.reduce((s, w) => s + w.amount, 0) / window.length : null
      const spike = avg ? item.amount >= avg * 1.3 && item.amount - avg >= 5 : false
      return { date: item.date, spike }
    })

    const ranges: { x1: string; x2: string }[] = []
    let start: Date | null = null
    let prev: Date | null = null

    for (const f of flags) {
      if (!f.spike) {
        if (start && prev) {
          ranges.push({ x1: format(start, "yyyy-MM-dd"), x2: format(addDays(prev, 1), "yyyy-MM-dd") })
        }
        start = null
        prev = null
        continue
      }
      if (!start) {
        start = f.date
        prev = f.date
        continue
      }
      if (prev && f.date.getTime() - prev.getTime() === 24 * 60 * 60 * 1000) {
        prev = f.date
      } else {
        if (start && prev) {
          ranges.push({ x1: format(start, "yyyy-MM-dd"), x2: format(addDays(prev, 1), "yyyy-MM-dd") })
        }
        start = f.date
        prev = f.date
      }
    }
    if (start && prev) {
      ranges.push({ x1: format(start, "yyyy-MM-dd"), x2: format(addDays(prev, 1), "yyyy-MM-dd") })
    }
    return ranges
  })()

  const saleDays = saleRanges.reduce((acc, r) => acc + differenceInCalendarDays(parseISO(r.x2), parseISO(r.x1)), 0)
  const weatherDays = weatherRanges.reduce((acc, r) => acc + differenceInCalendarDays(parseISO(r.x2), parseISO(r.x1)), 0)
  const peakDays = peakRanges.reduce((acc, r) => acc + differenceInCalendarDays(parseISO(r.x2), parseISO(r.x1)), 0)

  return (
    <Card className="bg-[#95cfd9] border border-gray-200 shadow-sm rounded-3xl overflow-hidden relative h-full">
      <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-0">
        <div className="space-y-1">
            <CardTitle className="text-lg font-medium text-black flex items-center gap-2">
                Vorhersage
                <span className="text-sm font-normal text-gray-500"></span>
            </CardTitle>
            <span className="text-sm font-normal text-gray-500">von Artikelverkäufen</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/40 bg-white/30 p-1">
            <button
              onClick={() => setOverlay("none")}
              className={`px-3 py-1 rounded-full text-xs ${overlay === "none" ? "bg-white/60 text-[#1f1c17]" : "text-white/80"}`}
            >
              Kein Overlay
            </button>
            <button
              onClick={() => setOverlay("sale")}
              className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${overlay === "sale" ? "bg-white/60 text-[#1f1c17]" : "text-white/80"}`}
            >
              <Tag className="h-3 w-3" /> Sale
            </button>
            <button
              onClick={() => setOverlay("weather")}
              className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${overlay === "weather" ? "bg-white/60 text-[#1f1c17]" : "text-white/80"}`}
            >
              <Sun className="h-3 w-3" /> Wetter
            </button>
            <button
              onClick={() => setOverlay("peaks")}
              className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${overlay === "peaks" ? "bg-white/60 text-[#1f1c17]" : "text-white/80"}`}
            >
              <Activity className="h-3 w-3" /> Spitzen
            </button>
          </div>
          {overlay !== "none" && false && (
            <Badge variant="outline" className="text-xs">
              {overlay === "sale" && `${saleDays} Tage`}
              {overlay === "weather" && `${weatherDays} Tage`}
              {overlay === "peaks" && `${peakDays} Tage`}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-0 h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.28} />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0.06} />
                </linearGradient>
                <linearGradient id="saleRangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#458cf6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3669ab" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="goodWeatherGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9eb782" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#9eb782" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="badWeatherGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#ffffff", opacity: 0.7, fontSize: 10 }}
                tickFormatter={(d) => {
                  const dateObj = typeof d === "string" ? parseISO(d) : new Date(d)
                  return format(dateObj, "dd.MM")
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#ffffff", opacity: 0.7, fontSize: 10 }}
                allowDecimals={false}
                tickFormatter={(v) => Math.round(v).toString()}
                domain={[0, Math.ceil(maxAmount)]}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="url(#lineGradient)"
                strokeWidth={2}
                strokeOpacity={1}
                fill="url(#colorAmount)"
                dot={false}
                activeDot={{ r: 4, fill: "#ffffff" }}
              />
              {overlay === "sale" && saleRanges.map(({ x1, x2 }) => (
                <ReferenceArea key={`${x1}-${x2}`} x1={x1} x2={x2} fill="url(#saleRangeGradient)" stroke="#e0c3a5" strokeWidth={0} ifOverflow="extendDomain" />
              ))}
              {overlay === "weather" && weatherRanges.map(({ x1, x2, kind }) => (
                <ReferenceArea
                  key={`${x1}-${x2}-${kind}`}
                  x1={x1}
                  x2={x2}
                  fill={kind === "good" ? "url(#goodWeatherGradient)" : "url(#badWeatherGradient)"}
                  stroke="#000000"
                  strokeWidth={0}
                  ifOverflow="extendDomain"
                />
              ))}
              {overlay === "peaks" && peakRanges.map(({ x1, x2 }) => (
                <ReferenceArea key={`${x1}-${x2}-peak`} x1={x1} x2={x2} fill="url(#peakGradient)" strokeWidth={0} ifOverflow="extendDomain" />
              ))}
            </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
