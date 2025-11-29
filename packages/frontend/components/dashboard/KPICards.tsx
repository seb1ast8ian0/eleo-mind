import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

interface KPICardsProps {
  forecastChangePercent: number
  topMovers?: { id: string; name: string; percent: number }[]
}

export function KPICards({ forecastChangePercent, topMovers = [] }: KPICardsProps) {
  return (
    <Card className="bg-[#101322] border-none text-white h-full shadow-sm rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-white">
          Performance
        </CardTitle>
        <button className="text-white hover:text-white/80">
            <MoreVertical className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-center mt-4">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {forecastChangePercent >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-white" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-white" />
                  )}
                  <div className="text-4xl font-bold text-white">
                    {forecastChangePercent >= 0 ? '+' : ''}{forecastChangePercent}%
                  </div>
                </div>
                <div className="text-xs text-white uppercase tracking-wider mt-1">Trend zum Vormonat</div>
            </div>
        </div>

        <div className="space-y-3">
          {topMovers.length === 0 ? (
            <div className="text-sm text-white/70">Keine Top Movers verfügbar</div>
          ) : (
            topMovers.slice(0, 4).map((mover, idx) => (
              <Link key={`${mover.id}-${idx}`} href={`/articles/${mover.id}`} className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    {mover.percent >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-[#1f1c17]" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-[#1f1c17]" />
                    )}
                  </div>
                  <span className="text-sm text-white truncate group-hover:underline" title={mover.name}>{mover.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {mover.percent >= 0 ? '+' : ''}{mover.percent}%
                </span>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
