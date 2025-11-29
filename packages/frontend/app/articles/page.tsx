"use client"
import { useEffect, useState } from "react"
import { ArticleTable } from "@/components/dashboard/ArticleTable"
import { getArticles } from "@/api/requests"
import type { ArticleDTO } from "@/api/interfaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleDTO[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await getArticles()
        if (!mounted) return
        setArticles(res.map(a => ({
          ...a,
          article_name: a.article_name ?? "Unbenannter Artikel",
          category: a.category ?? "Allgemein",
          unit: a.unit ?? "Stück",
        })))
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

  const ArticleTableSkeleton = () => (
    <Card className="border-none shadow-none rounded-3xl p-6">
      <CardHeader className="p-0 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1f1c17] text-xl font-bold">Artikelübersicht</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 py-4">
              <div className="col-span-2 h-3 bg-gray-200 rounded-md animate-pulse" />
              <div className="col-span-4 h-3 bg-gray-200 rounded-md animate-pulse ml-4" />
              <div className="col-span-3 h-3 bg-gray-200 rounded-md animate-pulse ml-4" />
              <div className="col-span-1 h-3 bg-gray-200 rounded-md animate-pulse ml-4" />
              <div className="col-span-2 h-3 bg-gray-200 rounded-md animate-pulse ml-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const ErrorCard = ({ message }: { message: string }) => (
    <Card className="border-none shadow-none rounded-3xl p-6">
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-[#1f1c17] text-xl font-bold">Artikelübersicht</CardTitle>
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
      {loading && <ArticleTableSkeleton />}
      {!loading && error && <ErrorCard message={error} />}
      {!loading && !error && articles && (
        <ArticleTable articles={articles.map(a => ({
          article_id: a.article_id,
          article_name: a.article_name ?? "Unbenannter Artikel",
          category: a.category ?? "Allgemein",
          stock_current: a.stock_current,
          unit: a.unit,
          delivery_time_days: a.delivery_time_days,
        }))} />
      )}
    </div>
  )
}
