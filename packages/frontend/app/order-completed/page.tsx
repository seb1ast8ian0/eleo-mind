"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { Player, Controls } from "@lottiefiles/react-lottie-player"

export default function OrderCompleted() {
  return (
    <div className="p-6">
      <Card className="border-none shadow-none rounded-3xl">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1f1c17] text-xl font-bold">Bestellung ausgelöst</CardTitle>
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-xs text-[#1f1c17]/60 mt-1">Ihre Bestellung wurde erfolgreich übermittelt.</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center">
            <div className="w-full max-w-md">
              <Player
                autoplay
                loop
                src="/delivery_truck.json"
                style={{ height: "500px", width: "100%" }}
              >
                <Controls visible={false} />
              </Player>
            </div>
            <div className="mt-6">
              <Button variant="ghost" className="gap-2" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Zur Übersicht
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
