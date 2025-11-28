"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Article {
  article_id: string
  article_name: string
  category: string
  stock_current: number
  unit: string
  delivery_time_days: number
}

interface ArticleTableProps {
  articles: Article[]
}

export function ArticleTable({ articles }: ArticleTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
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

  const filteredArticles = articles.filter((article) =>
    article.article_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.article_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="border-none shadow-none rounded-3xl p-6">
      <CardHeader className="p-0 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1f1c17] text-xl font-bold">Artikelübersicht</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#1f1c17]/40" />
              <Input
                placeholder="Suche nach Artikel..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" aria-label="Filter">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Export">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>Artikel-Nr.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead className="text-right">Bestand</TableHead>
              <TableHead className="text-right">Lieferzeit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.map((article) => (
              <TableRow
                key={article.article_id}
                onClick={() => router.push(`/articles/${article.article_id}`)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell className="font-medium">{article.article_id}</TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-4">
                    {getCategoryIcon(article.article_name) && (
                      <Image
                        src={`/assets/${getCategoryIcon(article.article_name)}`}
                        alt={article.category}
                        width={20}
                        height={20}
                      />
                    )}
                    <span>{article.article_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{article.category}</Badge>
                </TableCell>
                <TableCell className="text-right">{article.stock_current} {article.unit}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">{article.delivery_time_days} Tage</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
