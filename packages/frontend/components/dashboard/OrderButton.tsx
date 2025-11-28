"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"

interface OrderButtonProps {
  href: string
  label?: string
  size?: "sm" | "default" | "lg"
  className?: string
}

export function OrderButton({ href, label = "Bestellen", size = "lg", className }: OrderButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onClick = () => {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      router.push(href)
    }, 2000)
  }

  return (
    <Button
      size={size}
      className={`gap-2 ${className ?? ""}`}
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          {label}…
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {label}
        </>
      )}
    </Button>
  )
}

