"use client"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { format, parseISO, differenceInDays } from "date-fns"
import { OrderButton } from "@/components/dashboard/OrderButton"
import { StockChart } from "@/components/dashboard/StockChart"
import { getArticles, getGlobalForecast, postForecast } from "@/api/requests"
import type { ArticleDTO, OrderAlertForArticleResponseDTO } from "@/api/interfaces"
import { getInitialStock, getMinimumStock } from "@/lib/settings"

export default function ArticleDetail() {
  const params = useParams()
  const id = String(params.id)
  const [article, setArticle] = useState<ArticleDTO | null>(null)
  const [detail, setDetail] = useState<OrderAlertForArticleResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const arts = await getArticles()
        const found = arts.find(a => String(a.article_id) === id) || null
        if (!mounted) return
        setArticle(found)
        if (found) {
          const initialStock = getInitialStock()
          const minimumStock = getMinimumStock()
          const dto = await postForecast({
            article_id: found.article_id,
            current_stock_for_article: initialStock ?? found.stock_current,
            min_stock_for_article: minimumStock ?? Math.max(1, Math.floor((found.stock_current || 0) * 0.2)),
          })
          if (!mounted) return
          setDetail(dto)
        }
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
  }, [id])
  console.log(detail)

  const daysToBreach = useMemo(() => {
    if (!detail) return null as number | null
    return differenceInDays(parseISO(detail.critical_date_min_stock_breach), new Date())
  }, [detail])

  const severity = useMemo(() => {
    if (!detail || !article) return null as null | { label: string; className: string }
    const daysToOrder = differenceInDays(parseISO(detail.recommended_order_date), new Date())
    if (daysToOrder <= 1) return { label: "Kritisch", className: "bg-red-50 text-red-700 border border-red-200" }
    if (daysToOrder > 1 && daysToOrder <= 5) return { label: "Bald fällig", className: "bg-amber-50 text-amber-700 border border-amber-200" }
    return { label: "Beobachten", className: "bg-slate-50 text-slate-700 border border-slate-200" }
  }, [detail, article])

  const forecastForChart = useMemo(() => {
    if (!detail) return [] as { date: string; stock: number }[]
    return detail.forecast.map(p => ({ date: p.date, stock: p.stock_forecast_for_date }))
  }, [detail])

  const HeaderSkeleton = () => (
    <Card className="border-none shadow-none rounded-3xl">
      <CardHeader className="p-0 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="h-3 w-56 bg-gray-200 rounded-md mt-2 animate-pulse" />
      </CardHeader>
    </Card>
  )

  const ChartSkeleton = () => (
    <div className="h-[350px] w-full">
      <Card className="bg-[#95cfd9] border border-gray-200 shadow-sm rounded-3xl overflow-hidden relative h-full">
        <CardContent className="relative z-10 p-0 h-[300px] mt-4">
          <div className="w-full h-full bg-white/40 animate-pulse" />
        </CardContent>
      </Card>
    </div>
  )

  const CardsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-3 w-16 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse mt-2" />
          </div>
          <div className="text-right">
            <div className="h-3 w-16 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse mt-2" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-8 w-28 bg-gray-200 rounded-md animate-pulse mt-2" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <HeaderSkeleton />
        <ChartSkeleton />
        <CardsSkeleton />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="p-6">
        <Card className="border-none shadow-none rounded-3xl">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-[#1f1c17] text-xl font-bold">Artikel</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm">{error ?? `Die Artikel-ID ${id} ist nicht vorhanden.`}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const minStock = getMinimumStock() ?? 2

  return (
    <div className="p-6 space-y-6">
      <Card className="border-none shadow-none rounded-3xl">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image src={article.image_path ?? "/assets/1_zäune.svg"} alt={article.image_alt ?? article.article_name ?? "Unbekannter Artikel"} fill className="object-contain" />
              </div>
              <CardTitle className="text-[#1f1c17] text-xl font-bold">{article.article_name ?? "Unbenannter Artikel"}</CardTitle>
              {severity && <Badge className={`text-[10px] ${severity.className}`}>{severity.label}</Badge>}
            </div>
          </div>
          <p className="text-xs text-[#1f1c17]/60 mt-1">SKU {article.article_id} • {article.category ?? "Allgemein"}</p>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          <div className="h-[350px] w-full">
            <StockChart 
              currentStock={article.stock_current} 
              minStock={minStock} 
              deliveryTimeDays={article.delivery_time_days} 
              forecast={forecastForChart} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500">Bestand</p>
                  <div className={`text-lg font-bold ${daysToBreach !== null && daysToBreach <= 0 ? 'text-red-600' : 'text-[#1f1c17]'}`}>{detail?.stock_current ?? article.stock_current} {article.unit}</div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">Lieferzeit</p>
                  <div className="text-sm font-semibold">{article.delivery_time_days} Tage</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {detail ? (
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500">Bestellvorschlag</p>
                  <div className="text-sm font-medium">Vorgeschlagene Bestellmenge: {detail.recommended_order_quantity} {article.unit}</div>
                  <div className="text-sm font-medium flex flex-row">Vorgeschlagener Bestellzeitpunkt: {format(parseISO(detail.recommended_order_date), "dd.MM.yyyy")} <AlertTriangle className="inline-block h-4 w-4 ml-1 text-gray-500" /></div>
                  <div className="text-xs text-gray-500">Kritischer Punkt {daysToBreach !== null ? (daysToBreach <= 0 ? "heute/überfällig" : `${daysToBreach} Tage`) : "–"}</div>
                  <div className="pt-3">
                    <OrderButton href="/order-completed" />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-[#1f1c17]/70">Keine aktuellen Warnungen für diesen Artikel.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
