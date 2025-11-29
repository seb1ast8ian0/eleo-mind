/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from "fs"
import path from "path"
import { AlertSection } from "@/components/dashboard/AlertSection"

async function readJson(file: string) {
  const dataDir = path.join(process.cwd(), "public/data")
  const raw = await fs.readFile(path.join(dataDir, file), "utf8")
  return JSON.parse(raw)
}

export default async function AlertsPage() {
  const alerts = await readJson("mock_alerts.json")
  return (
    <div className="p-6">
      <AlertSection alerts={alerts} limit={12} />
    </div>
  )
}
