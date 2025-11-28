/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { loadSettings, saveSettings, updateSettings, type Settings } from "@/lib/settings"

export default function SettingsPage() {
  const [initialStock, setInitialStock] = useState<number>(0)
  const [minimumStock, setMinimumStock] = useState<number>(0)
  const [saved, setSaved] = useState<boolean>(false)

  useEffect(() => {
    const s = loadSettings()
    if (s) {
      setInitialStock(s.initialStock)
      setMinimumStock(s.minimumStock)
    }
  }, [])

  const onSave = () => {
    const next: Settings = {
      initialStock: Number.isFinite(initialStock) ? initialStock : 0,
      minimumStock: Number.isFinite(minimumStock) ? minimumStock : 0,
    }
    saveSettings(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const onReset = () => {
    const next = updateSettings({ initialStock: 0, minimumStock: 0 })
    setInitialStock(next.initialStock)
    setMinimumStock(next.minimumStock)
  }

  return (
    <div className="p-6">
      <Card className="border-none shadow-none rounded-3xl">
        <CardHeader className="p-0 mb-6 flex justify-between">
          <div>
            <CardTitle className="text-[#1f1c17] text-xl font-bold">Einstellungen</CardTitle>
            <p className="text-xs text-[#1f1c17]/60 mt-1">Bestandsgrenzen festlegen und lokal speichern.</p>
          </div>
          {saved && <Badge className="text-[10px] bg-green-100 text-green-700">Gespeichert</Badge>}
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-1 gap-6 max-w-xl">
            <div>
              <label className="text-xs text-[#1f1c17]/60">Anfangsbestand</label>
              <Input
                type="number"
                min={0}
                value={initialStock}
                onChange={(e) => setInitialStock(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-xs text-[#1f1c17]/60">Mindestbestand</label>
              <Input
                type="number"
                min={0}
                value={minimumStock}
                onChange={(e) => setMinimumStock(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={onSave}>Speichern</Button>
              <Button variant="ghost" onClick={onReset}>Zurücksetzen</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

