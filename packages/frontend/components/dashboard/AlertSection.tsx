"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TriangleAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { differenceInDays, parseISO, format } from "date-fns"

interface Alert {
  article_id: string
  article_name: string
  producer_id: number
  stock_current: number
  delivery_time_days: number
  recommended_order_quantity: number
  recommended_order_date: string
  critical_date_min_stock_breach: string
}

interface AlertSectionProps {
  alerts: Alert[]
  onAcceptSuggestion?: (alert: Alert) => void
  onOpenDetails?: (alert: Alert) => void
}

export function AlertSection({ alerts, onAcceptSuggestion, onOpenDetails }: AlertSectionProps) {
  const router = useRouter()
  const sortedAlerts = [...alerts]
    .sort((a, b) => new Date(a.critical_date_min_stock_breach).getTime() - new Date(b.critical_date_min_stock_breach).getTime())
    .slice(0, 4)

  const getSeverity = (alert: Alert) => {
    const daysToBreach = differenceInDays(parseISO(alert.critical_date_min_stock_breach), new Date())
    if (daysToBreach <= 0) return { label: "Kritisch", badgeClass: "bg-red-50 text-red-700 border border-red-200", barClass: "bg-black/80", valueClass: "text-red-600" }
    if (daysToBreach <= alert.delivery_time_days) return { label: "Bald fällig", badgeClass: "bg-white text-[#1f1c17] border border-gray-200", barClass: "bg-black/80", valueClass: "text-[#1f1c17]" }
    return { label: "Beobachten", badgeClass: "bg-white text-[#1f1c17] border border-gray-200", barClass: "bg-black/80", valueClass: "text-[#1f1c17]" }
  }

  const formatDays = (days: number) => {
    if (days < 0) return "überfällig"
    if (days === 0) return "heute"
    return `${days} Tage`
  }

  if (!sortedAlerts.length) {
    return (
      <Card className="border-none shadow-none p-6 rounded-3xl">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-[#1f1c17] text-xl font-bold">Handlungsbedarf</CardTitle>
          <p className="text-xs text-[#1f1c17]/60 max-w-xs mt-1">Keine akuten Artikel. Empfehlungen folgen bei neuen Prognosen.</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-[#1f1c17]/70">Alles stabil.</p>
              <p className="text-xs text-gray-500">Bestände sind im grünen Bereich.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-none p-6 rounded-3xl">
      <CardHeader className="p-0 mb-6">
        <div className="flex items-center">
          <TriangleAlert className="w-6 h-6 text-[#1f1c17] mr-2" />
          <CardTitle className="text-[#1f1c17] text-xl font-bold">Handlungsbedarf</CardTitle>
        </div>
        <p className="text-xs text-[#1f1c17]/60 max-w-xs mt-1">Dringende Artikel und empfohlene Bestellmengen, basierend auf Prognose und Lieferzeit.</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAlerts.map((alert) => {
            const daysToBreach = differenceInDays(parseISO(alert.critical_date_min_stock_breach), new Date())
            const severity = getSeverity(alert)
            const urgency = Math.min(100, Math.max(0, Math.round((1 - daysToBreach / Math.max(alert.delivery_time_days, 1)) * 100)))
            return (
              <div
                key={alert.article_id}
                className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3 group hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/articles/${alert.article_id}`)}
              >
                <div className="flex items-center justify-between">
                  <Badge className={`text-[10px] ${severity.badgeClass}`}>{severity.label}</Badge>
                  <span className="text-xs text-[#1f1c17]/60">Lieferzeit {alert.delivery_time_days} Tage</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1f1c17] truncate" title={alert.article_name}>{alert.article_name}</h4>
                  <p className="text-xs text-gray-500">{alert.article_id}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500">Restbestand</p>
                    <div className="text-lg font-bold text-[#1f1c17]">{alert.stock_current} <span className="text-xs font-normal text-gray-400">Stk.</span></div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500">Kritischer Punkt</p>
                    <div className={`text-sm font-semibold ${severity.valueClass}`}>{formatDays(daysToBreach)}</div>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${severity.barClass}`} style={{ width: `${urgency}%` }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500">Bestellvorschlag</p>
                    <div className="text-sm font-medium">{alert.recommended_order_quantity} Stk. <span className="text-xs text-gray-500">bis {format(parseISO(alert.recommended_order_date), "dd.MM.yyyy")}</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onOpenDetails) onOpenDetails(alert)
                        else router.push(`/articles/${alert.article_id}`)
                      }}
                    >
                      Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
