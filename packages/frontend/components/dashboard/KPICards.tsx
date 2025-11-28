import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MoreVertical } from "lucide-react"

interface KPICardsProps {
  criticalArticlesCount: number
  forecastChangePercent: number
}

export function KPICards({ criticalArticlesCount, forecastChangePercent }: KPICardsProps) {
  return (
    <Card className="bg-[#1f1c17] border-none text-white h-full shadow-lg rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-white">
          Performance
        </CardTitle>
        <button className="text-gray-400 hover:text-white">
            <MoreVertical className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-between mt-4">
            <div className="text-center">
                <div className="text-4xl font-bold">{criticalArticlesCount}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Kritisch</div>
            </div>
            <div className="h-12 w-px bg-gray-700"></div>
            <div className="text-center">
                <div className={`text-4xl font-bold ${forecastChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {forecastChangePercent >= 0 ? '+' : ''}{forecastChangePercent}%
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Trend zum Vormonat</div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 bg-[#ff6b6b] rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">Kritische Bestände identifiziert</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 bg-[#4ecdc4] rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">Wetterdaten aktualisiert</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 bg-[#ffe66d] rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">Bestellvorschläge generiert</span>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
