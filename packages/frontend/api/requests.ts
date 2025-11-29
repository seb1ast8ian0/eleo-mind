import type {
  ArticleDTO,
  ForecastRequestDTO,
  ArticleForecastResponseDTO,
  AlertsRequestDTO,
  AlertDTO,
  GlobalForecastResponseDTO,
} from "./interfaces"

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
  return apiFetch<ArticleDTO[]>("/articles")
}

export async function postForecast(payload: ForecastRequestDTO): Promise<ArticleForecastResponseDTO> {
  return apiFetch<ArticleForecastResponseDTO>("/forecast", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function postAlerts(payload: AlertsRequestDTO): Promise<AlertDTO[]> {
  const body = { amount_of_alerts: 3, ...payload }
  return apiFetch<AlertDTO[]>("/alerts", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function getGlobalForecast(): Promise<GlobalForecastResponseDTO> {
  return apiFetch<GlobalForecastResponseDTO>("/global-forecast")
}
