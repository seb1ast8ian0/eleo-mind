/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from "fs"
import path from "path"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, differenceInDays } from "date-fns"
import { OrderButton } from "@/components/dashboard/OrderButton"
import { StockChart } from "@/components/dashboard/StockChart"

async function readJson(file: string) {
  const dataDir = path.join(process.cwd(), "public/data")
  const raw = await fs.readFile(path.join(dataDir, file), "utf8")
  return JSON.parse(raw)
}

export default async function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const articles = await readJson("mock_articles.json")
  const alerts = await readJson("mock_alerts.json")
  const forecastData = await readJson("mock_general_forecast.json")

  const article = articles.find((a: any) => String(a.article_id) === String(id))
  const alert = alerts.find((a: any) => String(a.article_id) === String(id))

  if (!article) {
    return (
      <div className="p-6">
        <Card className="border-none shadow-none rounded-3xl">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-[#1f1c17] text-xl font-bold">Artikel nicht gefunden</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm">Die Artikel-ID {id} ist nicht vorhanden.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const daysToBreach = alert ? differenceInDays(parseISO(alert.critical_date_min_stock_breach), new Date()) : null
  const severity = (() => {
    if (daysToBreach === null) return null
    if (daysToBreach <= 0) return { label: "Kritisch", className: "bg-red-50 text-red-700 border border-red-200" }
    if (daysToBreach <= article.delivery_time_days) return { label: "Bald fällig", className: "bg-amber-50 text-amber-700 border border-amber-200" }
    return { label: "Beobachten", className: "bg-slate-50 text-slate-700 border border-slate-200" }
  })()

  // Mock Min Stock if not present (using alert data or heuristic)
  const minStock = 2

  return (
    <div className="p-6 space-y-6">
      <Card className="border-none shadow-none rounded-3xl">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image src={article.image_path} alt={article.image_alt ?? article.article_name} fill className="object-contain" />
              </div>
              <CardTitle className="text-[#1f1c17] text-xl font-bold">{article.article_name}</CardTitle>
            </div>
            {severity && <Badge className={`text-[10px] ${severity.className}`}>{severity.label}</Badge>}
          </div>
          <p className="text-xs text-[#1f1c17]/60 mt-1">ID {article.article_id} • {article.category}</p>
        </CardHeader>
        
        <CardContent className="p-0 space-y-6">
          {/* Stock Chart Section */}
          <div className="h-[350px] w-full">
            <StockChart 
                currentStock={article.stock_current} 
                minStock={minStock} 
                deliveryTimeDays={article.delivery_time_days} 
                forecast={forecastData.forecast} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500">Bestand</p>
                  <div className="text-lg font-bold text-[#1f1c17]">{article.stock_current} {article.unit}</div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">Lieferzeit</p>
                  <div className="text-sm font-semibold">{article.delivery_time_days} Tage</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {alert ? (
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500">Bestellvorschlag</p>
                  <div className="text-sm font-medium">Vorgeschlagene Bestellmenge: {alert.recommended_order_quantity} {article.unit}</div>
                  <div className="text-sm font-medium">Vorgeschlagener Bestellzeitpunkt: {format(parseISO(alert.recommended_order_date), "dd.MM.yyyy")}</div>
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
