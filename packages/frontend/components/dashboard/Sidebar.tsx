"use client"

import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, Package, Settings, LogOut, Ship } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const items = [
    { href: "/", label: "Dashboard", Icon: LayoutDashboard },
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
                  {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[#1f1c17]" />}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <Link href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-500 transition-all hover:text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
        </Link>
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
