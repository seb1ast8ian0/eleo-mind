import { SupplierTable } from "@/components/dashboard/SupplierTable"

export default function CustomersPage() {
  const suppliers = [
    {
        id: 1,
        name: "Metallbau Müller",
        contact: "Hans Müller (h.mueller@metallbau.de)",
        status: "active" as const,
        next_delivery: "2025-12-05",
        article_count: 12
    },
    {
        id: 2,
        name: "Eisenhandel Schmidt",
        contact: "Petra Schmidt (p.schmidt@eisen-schmidt.de)",
        status: "active" as const,
        next_delivery: "2025-12-12",
        article_count: 8
    },
    {
        id: 3,
        name: "Tor-Profi GmbH",
        contact: "info@tor-profi.de",
        status: "active" as const,
        next_delivery: "2025-12-08",
        article_count: 5
    },
    {
        id: 4,
        name: "Zaun-König AG",
        contact: "vertrieb@zaun-koenig.ag",
        status: "inactive" as const,
        next_delivery: "-",
        article_count: 0
    }
  ]

  return (
    <div className="p-6">
      <SupplierTable suppliers={suppliers} />
    </div>
  )
}
