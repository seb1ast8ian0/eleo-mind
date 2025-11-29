import type {
  ArticleDTO,
  ArticlesResponseDTO,
  ForecastRequestDTO,
  OrderAlertForArticleResponseDTO,
  AlertsRequestDTO,
  OrderPredictionRequestDTO,
  OrderAlertsResponseDTO,
  OrderPredictionResponseDTO,
  GlobalForecastResponseDTO,
} from "./interfaces"
import { mapIdToArticleInfo } from "@/lib/utils"

export const API_BASE_URL = "http://localhost:8080"

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function getArticles(): Promise<ArticleDTO[]> {
  // Namen, Image-Path, Kategegorie etc nochmal manuell setzen (null überschreiben)
  const res = await apiFetch<ArticlesResponseDTO>("/article")
  return res.articles.map((a) => {
    const info = mapIdToArticleInfo(a.article_id)
    return {
      ...a,
      article_name: a.article_name ?? info.article_name,
      category: a.category ?? info.category,
      image_path: a.image_path ?? info.image_path,
      image_alt: a.image_alt ?? info.image_alt,
      unit: a.unit ?? "Stück",
    }
  })
}

export async function postForecast(payload: ForecastRequestDTO): Promise<OrderAlertForArticleResponseDTO> {
    const dto = await apiFetch<OrderAlertForArticleResponseDTO>("/forecast", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const info = mapIdToArticleInfo(dto.article_id)
  return {
    ...dto,
    article_name: dto.article_name ?? info.article_name,
    category: dto.category ?? info.category,
    image_path: dto.image_path ?? info.image_path,
    image_alt: dto.image_alt ?? info.image_alt,
    unit: dto.unit ?? "Stück",
  }
}

export async function postAlerts(payload: AlertsRequestDTO): Promise<OrderPredictionResponseDTO[]> {
  const body = { amount_of_alerts: 3, ...payload }
  // Namen, Image-Path, Kategegorie etc nochmal manuell setzen (null überschreiben)
  const res = await apiFetch<OrderAlertsResponseDTO>("/alerts", {
    method: "POST",
    body: JSON.stringify(body),
  })
  return res.alerts.map((a) => {
    const info = mapIdToArticleInfo(a.article_id)
    return {
      ...a,
      article_name: a.article_name ?? info.article_name,
      category: a.category ?? info.category,
      image_path: a.image_path ?? info.image_path,
      image_alt: a.image_alt ?? info.image_alt,
      unit: a.unit ?? "Stück",
    }
  })
}

export async function getGlobalForecast(): Promise<GlobalForecastResponseDTO> {
  return apiFetch<GlobalForecastResponseDTO>("/global-forecast")
}

/**  Deprecated, but do not remove */
export async function postOrderAlerts(payload: OrderPredictionRequestDTO): Promise<OrderPredictionResponseDTO[]> {
    const res = await apiFetch<OrderAlertsResponseDTO>("/order_alerts", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return res.alerts.map((a) => {
    const info = mapIdToArticleInfo(a.article_id)
    return {
      ...a,
      article_name: a.article_name ?? info.article_name,
      category: a.category ?? info.category,
      image_path: a.image_path ?? info.image_path,
      image_alt: a.image_alt ?? info.image_alt,
      unit: a.unit ?? "Stück",
    }
  })
}
