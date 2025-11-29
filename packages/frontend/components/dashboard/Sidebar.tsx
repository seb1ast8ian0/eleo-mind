"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Package, Settings, LogOut, Ship, AlertTriangle, Gauge, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const countries = [
    { code: "DE", name: "Deutschland", flag: "🇩🇪" },
    { code: "FR", name: "Frankreich", flag: "🇫🇷" },
    { code: "IT", name: "Italien", flag: "🇮🇹" },
    { code: "UK", name: "UK", flag: "🇬🇧" },
    { code: "AT", name: "Österreich", flag: "🇦🇹" },
    { code: "CH", name: "Schweiz", flag: "🇨🇭" },
  ]
  const [country, setCountry] = useState<string>("DE")
  const [countryOpen, setCountryOpen] = useState<boolean>(false)
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("eleo-country") : null
    if (saved) setCountry(saved)
  }, [])
  const handleSelectCountry = (c: string) => {
    setCountry(c)
    if (typeof window !== "undefined") window.localStorage.setItem("eleo-country", c)
  }
  const items = [
    { href: "/", label: "Dashboard", Icon: Gauge },
    { href: "/alerts", label: "Handlungsbedarf", Icon: AlertTriangle },
    { href: "/suppliers", label: "Lieferanten", Icon: Ship },
    { href: "/articles", label: "Artikel", Icon: Package },
    { href: "/settings", label: "Einstellungen", Icon: Settings },
  ]

  return (
    <div className={cn("pb-0 min-h-screen w-64 flex flex-col bg-white border-r border-gray-100", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-6 py-6 flex items-center gap-2">
            <div className="w-[180px] h-12 relative">
                <Image 
                  src="/eleo_mind_logo.png" 
                  alt="ELEO Logo" 
                  fill
                  className="object-contain"
                />
            </div>
        </div>

        <div className="px-4 py-2">
          <div className="space-y-1">
            {items.map(({ href, label, Icon }) => {
              const active = pathname === href || (href !== "/" && pathname?.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                    active ? "bg-gray-100 text-[#1f1c17]" : "text-gray-500 hover:text-[#1f1c17] hover:bg-gray-50"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-[#1f1c17]" : "text-gray-500")} />
                  <span className="font-medium">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="mt-3">
          <div className="relative">
            <button
              onClick={() => setCountryOpen((v) => !v)}
              className="mt-2 w-full flex items-center justify-between rounded-xl px-4 py-2 text-[#1f1c17] hover:bg-gray-50"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg leading-none">{countries.find((c) => c.code === country)?.flag}</span>
                <span className="text-sm">{countries.find((c) => c.code === country)?.name}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            {countryOpen && (
              <div className="absolute left-0 right-0 bottom-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-20">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      handleSelectCountry(c.code)
                      setCountryOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2 text-[#1f1c17] hover:bg-gray-50",
                      country === c.code ? "bg-gray-50" : ""
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="text-sm">{c.name}</span>
                    </span>
                    {country === c.code && <Check className="h-4 w-4 text-gray-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

        <div className="px-6 pb-6 mb-6">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold">JD</div>
                </div>
                <div>
                    <p className="text-sm font-bold text-[#1f1c17]">John Doe</p>
                    <p className="text-xs text-gray-500">Sachbearbeiter</p>
                </div>
            </div>
        </div>
    </div>
  )
}
