"use client"
import { useEffect, useState } from "react"
import { AlertSection } from "@/components/dashboard/AlertSection"
import { getArticles, postAlerts } from "@/api/requests"
import type { OrderPredictionResponseDTO } from "@/api/interfaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInitialStock, getMinimumStock } from "@/lib/settings"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<OrderPredictionResponseDTO[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const arts = await getArticles()
        const initialStock = getInitialStock()
        const minimumStock = getMinimumStock()
        const globalCurrentStock = initialStock ?? arts.reduce((sum, a) => sum + (a.stock_current || 0), 0)
        const globalMinStock = minimumStock ?? Math.max(1, Math.floor(globalCurrentStock * 0.1))
        const res = await postAlerts({ global_current_stock: globalCurrentStock, global_min_stock: globalMinStock, amount_of_alerts: 9 })
        if (!mounted) return
        setAlerts(res)
        setError(null)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unbekannter Fehler"
        if (!mounted) return
        setError(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const AlertSectionSkeleton = () => (
    <Card className="border-none shadow-none p-6 rounded-3xl">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-[#1f1c17] text-xl font-bold">Handlungsbedarf</CardTitle>
        <div className="h-3 w-56 bg-gray-200 rounded-md mt-2 animate-pulse" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-40 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-3 w-24 bg-gray-100 rounded-md animate-pulse" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gray-300 animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 w-32 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const ErrorCard = ({ message }: { message: string }) => (
    <Card className="border-none shadow-none rounded-3xl p-6">
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-[#1f1c17] text-xl font-bold">Handlungsbedarf</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-[#1f1c17]">{message}</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6">
      {loading && <AlertSectionSkeleton />}
      {!loading && error && <ErrorCard message={error} />}
      {!loading && !error && alerts && (
        <AlertSection alerts={alerts.map(a => ({
          article_id: a.article_id,
          article_name: a.article_name ?? "Unbenannter Artikel",
          producer_id: a.producer_id,
          stock_current: a.stock_current,
          delivery_time_days: a.delivery_time_in_days,
          recommended_order_quantity: a.recommended_order_quantity,
          recommended_order_date: a.recommended_order_date,
          critical_date_min_stock_breach: a.critical_date_min_stock_breach,
        }))} limit={12} />
      )}
    </div>
  )
}
