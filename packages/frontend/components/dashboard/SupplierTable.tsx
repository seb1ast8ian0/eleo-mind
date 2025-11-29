"use client"

import { useState } from "react"
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
import { Search, Filter, Download, Ship } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Supplier {
  id: number
  name: string
  contact: string
  status: "active" | "inactive"
  next_delivery: string
  article_count: number
}

interface SupplierTableProps {
  suppliers: Supplier[]
}

export function SupplierTable({ suppliers }: SupplierTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="border-none shadow-none rounded-3xl p-6">
      <CardHeader className="p-0 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1f1c17] text-xl font-bold">Lieferantenübersicht</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#1f1c17]/40" />
              <Input
                placeholder="Suche nach Lieferant..."
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Artikel</TableHead>
              <TableHead className="text-right">Nächste Lieferung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow
                key={supplier.id}
                className="hover:bg-gray-50"
              >
                <TableCell className="font-medium">SUP-{String(supplier.id).padStart(3, '0')}</TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <Ship className="h-4 w-4 text-black" />
                    </div>
                    <span>{supplier.name}</span>
                  </div>
                </TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>
                  <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                    {supplier.status === "active" ? "Aktiv" : "Inaktiv"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{supplier.article_count}</TableCell>
                <TableCell className="text-right">
                    {supplier.next_delivery}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
