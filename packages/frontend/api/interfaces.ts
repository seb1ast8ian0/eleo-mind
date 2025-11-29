export interface ArticleDTO {
  article_id: string
  article_name: string
  category: string
  image_path: string
  image_alt: string
  stock_current: number
  unit: string
  delivery_time_days: number
  producer_id?: number
  division_id?: number
  critical_date_min_stock_breach?: string
}

export interface ForecastPointDTO {
  date: string
  amount: number
  weather_condition?: string
  weather_temperature?: number
  is_sale?: boolean
  sale_type?: string | null
}

export interface GlobalForecastResponseDTO {
  history: ForecastPointDTO[]
  forecast: ForecastPointDTO[]
  sales_forecast?: number
  sales_last_month?: number
}

export interface ForecastRequestDTO {
  article_id: string
  current_stock_for_article: number
  min_stock_for_article: number
}

export interface ArticleForecastResponseDTO {
  forecast: ForecastPointDTO[]
}

export interface AlertsRequestDTO {
  global_current_stock: number
  global_min_stock: number
  amount_of_alerts?: number
}

export interface AlertDTO {
  article_id: string
  article_name: string
  producer_id: number
  stock_current: number
  delivery_time_days: number
  recommended_order_quantity: number
  recommended_order_date: string
  critical_date_min_stock_breach: string
}
