"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
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
  onOpenDetails?: (alert: Alert) => void
  limit?: number
  showHeaderLink?: boolean
}

export function AlertSection({ alerts, onOpenDetails, limit, showHeaderLink }: AlertSectionProps) {
  const router = useRouter()
  const getCategoryIcon = (name: string) => {
    const k = name.toLowerCase()
    if (k.includes("zäune") || k.includes("zaun")) return "1_zäune.svg"
    if (k.includes("geländer") && !k.includes("sichtschutz")) return "2_geländer.svg"
    if (k.includes("hoftor")) return "3_hoftore.svg"
    if (k.includes("balkon") && !k.includes("sichtschutz")) return "4_franz_balkone.svg"
    if (k.includes("sichtschutz") && k.includes("zaun")) return "5_sichtschutz_zaun.svg"
    if (k.includes("geländer") && k.includes("sichtschutz")) return "6_geländer_mit_sichtschutz.svg"
    if (k.includes("sichtschutz") && (k.includes("tor") || k.includes("tore"))) return "7_schichtschutz_tore.svg"
    if (k.includes("sichtschutz") && (k.includes("tür") || k.includes("türen"))) return "9_sichtschutz_türen.svg"
    if (k.includes("franz") && k.includes("sichtschutz")) return "10_franz_balkone_sichtschutz.svg"
    return null
  }
  const sortedAlerts = [...alerts]
    .sort((a, b) => new Date(a.critical_date_min_stock_breach).getTime() - new Date(b.critical_date_min_stock_breach).getTime())
    .slice(0, limit ?? alerts.length)

  const getSeverity = (alert: Alert) => {
    const daysToOrder = differenceInDays(parseISO(alert.recommended_order_date), new Date())
    if (daysToOrder <= 1) return { label: "Kritisch", badgeClass: "bg-red-50 text-red-700 border border-red-200", barClass: "bg-black/80", valueClass: "text-red-600" }
    if (daysToOrder > 1 && daysToOrder <= 5) return { label: "Bald fällig", badgeClass: "bg-white text-[#1f1c17] border border-gray-200", barClass: "bg-black/80", valueClass: "text-[#1f1c17]" }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
          <TriangleAlert className="w-6 h-6 text-[#1f1c17] mr-2" />
          <CardTitle className="text-[#1f1c17] text-xl font-bold">Handlungsbedarf</CardTitle>
          </div>
          {showHeaderLink && (
            <Link href="/alerts" className="text-xs text-[#1f1c17] hover:underline">Alle Alerts ansehen</Link>
          )}
        </div>
        <p className="text-xs text-[#1f1c17]/60 max-w-xs mt-1">Dringende Artikel und empfohlene Bestellmengen, basierend auf Prognose und Lieferzeit.</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAlerts.map((alert) => {
            const daysToOrder = differenceInDays(parseISO(alert.recommended_order_date), new Date())
            const severity = getSeverity(alert)
            const urgencyBase = 5
            const urgency = Math.min(100, Math.max(0, Math.round(((urgencyBase - Math.min(daysToOrder, urgencyBase)) / urgencyBase) * 100)))
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

                <div className="flex items-center gap-3">
                  {getCategoryIcon(alert.article_name) && (
                    <div className="w-10 h-10 relative">
                      <Image
                        src={`/assets/${getCategoryIcon(alert.article_name)}`}
                        alt={alert.article_name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#1f1c17] truncate" title={alert.article_name}>{alert.article_name}</h4>
                    <p className="text-xs text-gray-500">{alert.article_id}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500">Restbestand</p>
                    <div className="text-lg font-bold text-[#1f1c17]">{alert.stock_current} <span className="text-xs font-normal text-gray-400">Stk.</span></div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500">Bestellzeitpunkt</p>
                    <div className={`text-sm font-semibold ${severity.valueClass}`}>{formatDays(daysToOrder)}</div>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${severity.barClass}`} style={{ width: `${urgency}%` }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500">Bestellvorschlag</p>
                    <div className="text-sm font-medium">{Math.ceil(alert.recommended_order_quantity)} Stk. <span className="text-xs text-gray-500">bis {format(parseISO(alert.recommended_order_date), "dd.MM.yyyy")}</span></div>
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
