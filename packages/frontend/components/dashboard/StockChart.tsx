/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ReferenceArea } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO, addDays } from "date-fns"
import { de } from "date-fns/locale"

interface StockChartProps {
  currentStock: number
  minStock: number
  deliveryTimeDays: number
  forecast: {
    date: string
    stock: number
  }[]
}

interface TooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload
    const dateObj = typeof label === "string" ? parseISO(label) : new Date(label || "")
    return (
      <div className="bg-white border-none p-3 rounded-xl shadow-xl text-[#1f1c17]">
        <p className="font-bold text-sm mb-1">{format(dateObj, "dd. MMM", { locale: de })}</p>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[#9eb782]"></div>
           <p className="text-sm font-medium">Bestand: {Math.round(dataPoint.stock)}</p>
        </div>
      </div>
    )
  }
  return null
}

export function StockChart({ currentStock, minStock, deliveryTimeDays, forecast }: StockChartProps) {
  const chartData = forecast.map((p) => ({ date: p.date, stock: p.stock }))

  const intersectionIndex = chartData.findIndex((d) => d.stock <= minStock)

  let dangerZone: { x1: string; x2: string } | null = null
  if (intersectionIndex !== -1) {
    const intersectionDate = parseISO(chartData[intersectionIndex].date)
    const dangerStartDate = addDays(intersectionDate, -deliveryTimeDays)
    dangerZone = {
      x1: format(dangerStartDate, "yyyy-MM-dd"),
      x2: chartData[intersectionIndex].date,
    }
  }

  const domainStartDate = chartData.length ? parseISO(chartData[0].date) : null
  const domainEndDate = chartData.length ? parseISO(chartData[chartData.length - 1].date) : null
  let clippedDangerZone: { x1: string; x2: string } | null = null
  if (dangerZone && domainStartDate && domainEndDate) {
    const dzStart = parseISO(dangerZone.x1)
    const dzEnd = parseISO(dangerZone.x2)
    const start = dzStart < domainStartDate ? domainStartDate : dzStart
    const end = dzEnd > domainEndDate ? domainEndDate : dzEnd
    if (start <= end) {
      clippedDangerZone = {
        x1: format(start, "yyyy-MM-dd"),
        x2: format(end, "yyyy-MM-dd"),
      }
    }
  }

  const maxStock = Math.max(currentStock, ...chartData.map(d => d.stock)) * 1.1

  return (
    <Card className="bg-[#95cfd9] border border-gray-200 shadow-sm rounded-3xl overflow-hidden relative h-full">
      <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-0">
        <div className="space-y-1">
            <CardTitle className="text-lg font-medium text-black flex items-center gap-2">
                Lagerbestandsprognose
            </CardTitle>
            <span className="text-sm font-normal text-gray-500">Entwicklung basierend auf Verkaufsdaten, Wetter, ...</span>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-0 h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0.1} />
                </linearGradient>
                <pattern id="hatched" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="4" height="8" transform="translate(0,0)" fill="#ff6b6b" opacity="0.3" />
                </pattern>
              </defs>
              
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#ffffff", opacity: 0.7, fontSize: 10 }}
                tickMargin={8}
                interval="preserveStartEnd"
                tickFormatter={(d) => format(parseISO(d), "dd.MM")}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#ffffff", opacity: 0.7, fontSize: 10 }}
                allowDecimals={false}
                tickFormatter={(v) => Math.round(v).toString()}
                domain={[0, Math.ceil(maxStock)]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'white', strokeWidth: 1 }} />
              
              {/* Min Stock Line */}
              <ReferenceLine
                y={minStock}
                stroke="#ff6b6b"
                strokeDasharray="3 3"
                label={{ position: 'top', value: `Mindestbestand (${minStock})`, fill: '#ff6b6b', fontSize: 10 }}
              />

              {/* Danger Zone */}
              {clippedDangerZone && (
                <>
                  <ReferenceArea 
                    x1={clippedDangerZone.x1} 
                    x2={clippedDangerZone.x2} 
                    fill="url(#hatched)" 
                    ifOverflow="visible"
                  />
                  <ReferenceLine
                    x={clippedDangerZone.x1}
                    stroke="#ff6b6b8c"
                    strokeDasharray="2 2"
                    ifOverflow="visible"
                    label={{ position: 'top', value: 'Gefahrenzone', fill: '#ff6b6b', fontSize: 10 }}
                  />
                  <ReferenceLine
                    x={clippedDangerZone.x2}
                    stroke="#ff6b6b8c"
                    strokeDasharray="2 2"
                    ifOverflow="visible"
                  />
                </>
              )}

              <Area
                type="monotone"
                dataKey="stock"
                stroke="#ffffff"
                strokeWidth={3}
                fill="url(#stockGradient)"
                dot={{ fill: "white", r: 4 }}
                activeDot={{ r: 6, fill: "#ffffff" }}
              />
            </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
