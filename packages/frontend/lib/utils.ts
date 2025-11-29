import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ArticleInfo = {
  article_id: string
  article_name: string
  category: string
  image_path: string
  image_alt: string
}

const ARTICLE_CATALOG: ArticleInfo[] = [
  {
    article_id: "ART-001",
    article_name: "Zaun Classic",
    category: "Zaun",
    image_path: "/assets/1_zäune.svg",
    image_alt: "Produktbild: Zaun Classic",
  },
  {
    article_id: "ART-002",
    article_name: "Geländer Modern",
    category: "Geländer",
    image_path: "/assets/2_geländer.svg",
    image_alt: "Produktbild: Geländer Modern",
  },
  {
    article_id: "ART-003",
    article_name: "Hoftor Premium",
    category: "Hoftor",
    image_path: "/assets/3_hoftore.svg",
    image_alt: "Produktbild: Hoftor Premium",
  },
  {
    article_id: "ART-004",
    article_name: "Franz Balkon Standard",
    category: "Balkon",
    image_path: "/assets/4_franz_balkone.svg",
    image_alt: "Produktbild: Franz Balkon Standard",
  },
  {
    article_id: "ART-005",
    article_name: "Sichtschutz Zaun",
    category: "Sichtschutz",
    image_path: "/assets/5_sichtschutz_zaun.svg",
    image_alt: "Produktbild: Sichtschutz Zaun",
  },
  {
    article_id: "ART-006",
    article_name: "Geländer mit Sichtschutz",
    category: "Geländer",
    image_path: "/assets/6_geländer_mit_sichtschutz.svg",
    image_alt: "Produktbild: Geländer mit Sichtschutz",
  },
  {
    article_id: "ART-007",
    article_name: "Sichtschutz Tore Robust",
    category: "Tore",
    image_path: "/assets/7_schichtschutz_tore.svg",
    image_alt: "Produktbild: Sichtschutz Tore Robust",
  },
  {
    article_id: "ART-008",
    article_name: "Sichtschutz Tore Flex",
    category: "Tore",
    image_path: "/assets/8_sichschutz_tore.svg",
    image_alt: "Produktbild: Sichtschutz Tore Flex",
  },
  {
    article_id: "ART-009",
    article_name: "Sichtschutz Tür",
    category: "Türen",
    image_path: "/assets/9_sichtschutz_türen.svg",
    image_alt: "Produktbild: Sichtschutz Tür",
  },
  {
    article_id: "ART-010",
    article_name: "Franz Balkon mit Sichtschutz",
    category: "Balkon",
    image_path: "/assets/10_franz_balkone_sichtschutz.svg",
    image_alt: "Produktbild: Franz Balkon mit Sichtschutz",
  },
]

function normalizeId(id: string): string {
  const s = id.toUpperCase().replace(/\s+/g, "")
  const stripped = s.replace(/(UB|FZ|SF)$/i, "")
  const prefixMatch = stripped.match(/^[A-Z]+/)
  const prefix = prefixMatch ? prefixMatch[0] : ""
  const digitsMatch = stripped.match(/\d+/)
  const digits = digitsMatch ? digitsMatch[0] : ""
  if (digits) {
    const d = digits.slice(0, Math.min(4, digits.length))
    return `${prefix}${d}`
  }
  return stripped.slice(0, 4)
}

function hashToIndex(s: string): number {
  const key = normalizeId(s)
  let h = 2166136261 >>> 0
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h % ARTICLE_CATALOG.length
}

export function mapIdToArticleInfo(id: string): Pick<ArticleInfo, "article_name" | "image_path" | "image_alt" | "category"> {
  const idx = hashToIndex(id)
  const a = ARTICLE_CATALOG[idx]
  return {
    article_name: a.article_name,
    image_path: a.image_path,
    image_alt: a.image_alt,
    category: a.category,
  }
}

export function mapIdToArticle(id: string): ArticleInfo {
  return ARTICLE_CATALOG[hashToIndex(id)]
}
