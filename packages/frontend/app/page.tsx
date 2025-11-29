"use client"
import { useEffect, useMemo, useState } from 'react'
import { KPICards } from '@/components/dashboard/KPICards'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { AlertSection } from '@/components/dashboard/AlertSection'
import { ArticleTable } from '@/components/dashboard/ArticleTable'
import Image from 'next/image'
import { getArticles, postAlerts, getGlobalForecast } from '@/api/requests'
import type { ArticleDTO, GlobalForecastResponseDTO, OrderPredictionResponseDTO } from '@/api/interfaces'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getInitialStock, getMinimumStock } from '@/lib/settings'

 

export default function Home() {
  const [articles, setArticles] = useState<ArticleDTO[] | null>(null)
  const [alerts, setAlerts] = useState<OrderPredictionResponseDTO[] | null>(null)
  const [globalForecast, setGlobalForecast] = useState<GlobalForecastResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorArticles, setErrorArticles] = useState<string | null>(null)
  const [errorAlerts, setErrorAlerts] = useState<string | null>(null)
  const [errorForecast, setErrorForecast] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const arts = await getArticles()
        if (!mounted) return
        setArticles(arts.map(a => ({
          ...a,
          article_name: a.article_name ?? 'Unbenannter Artikel',
          category: a.category ?? 'Allgemein',
          unit: a.unit ?? 'Stück',
        })))
        setErrorArticles(null)
        const initialStock = getInitialStock()
        const minimumStock = getMinimumStock()
        const globalCurrentStock = initialStock ?? arts.reduce((sum, a) => sum + (a.stock_current ?? 0), 0)
        const globalMinStock = minimumStock ?? Math.max(1, Math.floor(globalCurrentStock * 0.1))
        const [alertsRes, forecastRes] = await Promise.all([
          postAlerts({ global_current_stock: globalCurrentStock, global_min_stock: globalMinStock }),
          getGlobalForecast(),
        ])
        if (!mounted) return
        setAlerts(alertsRes)
        setErrorAlerts(null)
        setGlobalForecast(forecastRes)
        setErrorForecast(null)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unbekannter Fehler'
        if (!articles) setErrorArticles(msg)
        if (!alerts) setErrorAlerts(msg)
        if (!globalForecast) setErrorForecast(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const forecastChangePercent = useMemo(() => {
    if (!globalForecast) return 0
    const prev = globalForecast.sales_last_month || 1
    return Math.round(((globalForecast.sales_forecast - prev) / prev) * 100)
  }, [globalForecast])

  const [topMovers, setTopMovers] = useState<{ id: string; name: string; percent: number }[]>([])

  

  const historyData = useMemo(() => {
    return [] as { date: string; amount: number; weather_condition: string; weather_temperature: number; is_sale: boolean; sale_type: string | null }[]
  }, [])

  const forecastData = useMemo(() => {
    if (!globalForecast) return [] as { date: string; amount: number; weather_condition: string; weather_temperature: number; is_sale: boolean; sale_type: string | null }[]
    return globalForecast.forecast.map(p => ({
      date: p.date,
      amount: p.amount,
      weather_condition: p.weather_condition,
      weather_temperature: p.weather_temperature,
      is_sale: p.is_sale,
      sale_type: p.sale_type,
    }))
  }, [globalForecast])

  useEffect(() => {
    let mounted = true
    const loadMockTopMovers = async () => {
      try {
        const res = await fetch('/data/mock_articles.json', { cache: 'no-store' })
        const mockArticles = await res.json() as { article_id: string; article_name: string; stock_current: number }[]
        if (!mounted) return
        const avgStock = mockArticles.length ? mockArticles.reduce((sum, a) => sum + (a.stock_current || 0), 0) / mockArticles.length : 0
        const movers = mockArticles
          .map((a) => ({ id: a.article_id, name: a.article_name, percent: avgStock ? Math.round(((a.stock_current - avgStock) / avgStock) * 100) : 0 }))
          .sort((a, b) => Math.abs(b.percent) - Math.abs(a.percent))
          .slice(0, 4)
        setTopMovers(movers)
      } catch {
        if (!mounted) return
        setTopMovers([])
      }
    }
    loadMockTopMovers()
    return () => { mounted = false }
  }, [])

  const KPICardsSkeleton = () => (
    <Card className="bg-[#101322] border-none text-white h-full shadow-sm rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-white">Performance</CardTitle>
        <div className="h-5 w-5 rounded-full bg-white/20 animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-center mt-4">
          <div className="text-center">
            <div className="h-10 w-32 bg-white/20 rounded-md mx-auto animate-pulse" />
            <div className="h-3 w-40 bg-white/10 rounded-md mx-auto mt-2 animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-white/20 animate-pulse" />
                <div className="h-3 w-40 bg-white/20 rounded-md animate-pulse" />
              </div>
              <div className="h-3 w-10 bg-white/20 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const TrendChartSkeleton = () => (
    <Card className="bg-[#95cfd9] border border-gray-200 shadow-sm rounded-3xl overflow-hidden relative h-full">
      <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-0">
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium text-black">Vorhersage</CardTitle>
          <div className="h-3 w-40 bg-black/10 rounded-md animate-pulse" />
        </div>
        <div className="h-6 w-32 bg-white/40 rounded-full animate-pulse" />
      </CardHeader>
      <CardContent className="relative z-10 p-0 h-[300px] mt-4">
        <div className="w-full h-full bg-white/40 animate-pulse" />
      </CardContent>
    </Card>
  )

  const AlertSectionSkeleton = () => (
    <Card className="border-none shadow-none p-6 rounded-3xl">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-[#1f1c17] text-xl font-bold">Handlungsbedarf</CardTitle>
        <div className="h-3 w-56 bg-gray-200 rounded-md mt-2 animate-pulse" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
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

  const ErrorCard = ({ title, message, dark }: { title: string; message: string; dark?: boolean }) => (
    <Card className={`${dark ? 'bg-[#101322] text-white' : ''} border-none shadow-none rounded-3xl p-6`}>
      <CardHeader className="p-0 mb-2">
        <CardTitle className={`${dark ? 'text-white' : 'text-[#1f1c17]'} text-xl font-bold`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`${dark ? 'bg-white/10 text-white' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
          <p className={`${dark ? 'text-white' : 'text-[#1f1c17]'} text-sm`}>{message}</p>
        </div>
      </CardContent>
    </Card>
  )

  const AlertsSection = () => {
    if (loading) return <AlertSectionSkeleton />
    if (errorAlerts) return <ErrorCard title="Handlungsbedarf" message={errorAlerts} />
    if (!alerts) return <ErrorCard title="Handlungsbedarf" message="Keine Daten" />
    const safeAlerts = alerts.map(a => ({
      article_id: a.article_id,
      article_name: a.article_name ?? 'Unbenannter Artikel',
      producer_id: a.producer_id,
      stock_current: a.stock_current,
      delivery_time_days: a.delivery_time_in_days,
      recommended_order_quantity: a.recommended_order_quantity,
      recommended_order_date: a.recommended_order_date,
      critical_date_min_stock_breach: a.critical_date_min_stock_breach,
    }))
    return <AlertSection alerts={safeAlerts} showHeaderLink />
  }

  const KPIsSection = () => {
    if (loading) return <KPICardsSkeleton />
    if (errorForecast) return <ErrorCard dark title="Performance" message={errorForecast} />
    return <KPICards forecastChangePercent={forecastChangePercent} topMovers={topMovers} />
  }

  const TrendSection = () => {
    if (loading) return <TrendChartSkeleton />
    if (errorForecast) return <ErrorCard title="Vorhersage" message={errorForecast} />
    return <TrendChart history={historyData} forecast={forecastData} />
  }

  return (
    <div className="space-y-6">
          
          <header className="md:hidden flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 relative">
                  <Image 
                    src="/eleo_logo.png" 
                    alt="ELEO Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-[#1f1c17]">ELEO Mind</h1>
             </div>
          </header>

          {/* Top Section: KPIs (Dark Card) and Trend Chart (Light Card) */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* KPIs - Takes up 4 columns */}
            <div className="md:col-span-4 lg:col-span-4">
               <KPIsSection />
            </div>
            
            {/* Trend Chart - Takes up 8 columns */}
            <div className="md:col-span-8 lg:col-span-8">
              <TrendSection />
            </div>
          </div>

          {/* Middle Section: Alerts (Engagement Style) */}
          <section>
            <AlertsSection />
          </section>
    </div>
  );
}
