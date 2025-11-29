import { promises as fs } from "fs"
import path from "path"
import { ArticleTable } from "@/components/dashboard/ArticleTable"

async function readJson(file: string) {
  const dataDir = path.join(process.cwd(), "public/data")
  const raw = await fs.readFile(path.join(dataDir, file), "utf8")
  return JSON.parse(raw)
}

export default async function ArticlesPage() {
  const articles = await readJson("mock_articles.json")

  return (
    <div className="p-6">
      <ArticleTable articles={articles} />
    </div>
  )
}
