export interface ArticleDTO {
  article_id: string
  article_name?: string | null
  coating: string
  category?: string | null
  image_path?: string | null
  image_alt?: string | null
  stock_current: number
  unit: string
  delivery_time_days: number
  producer_id: number
  division_id: number
}

export interface ArticlesResponseDTO {
  articles: ArticleDTO[]
}

export interface ForecastPointDTO {
  date: string
  amount: number
  weather_condition?: string
  weather_temperature?: number
  is_sale?: boolean
  sale_type?: string | null
}

export interface GlobalForecastPointDTO {
  date: string
  amount: number
  weather_condition: string
  weather_temperature: number
  is_sale: boolean
  sale_type: string | null
}

export interface GlobalForecastResponseDTO {
  sales_forecast: number
  sales_last_month: number
  forecast: GlobalForecastPointDTO[]
}

export interface ForecastRequestDTO {
  article_id: string
  current_stock_for_article: number
  min_stock_for_article: number
}

export interface ForecastResponseDTO {
  date: string
  stock_forecast_for_date: number
}

export interface OrderAlertForArticleResponseDTO {
  article_id: string
  article_name?: string | null
  category?: string | null
  image_path?: string | null
  image_alt?: string | null
  coating: string
  producer_id: number
  division_id: number
  delivery_time_days: number
  stock_current: number
  unit: string
  recommended_order_date: string
  recommended_order_quantity: number
  critical_date_min_stock_breach: string
  forecast: ForecastResponseDTO[]
}

export interface AlertsRequestDTO {
  global_current_stock: number
  global_min_stock: number
  amount_of_alerts?: number
}

export interface OrderPredictionRequestDTO {
  global_current_stock: number
  global_min_stock: number
}

export interface OrderPredictionResponseDTO {
  article_id: string
  coating: string
  article_name?: string | null
  category?: string | null
  image_path?: string | null
  image_alt?: string | null
  stock_current: number
  unit: string
  delivery_time_in_days: number
  producer_id: number
  division_id: number
  recommended_order_quantity: number
  recommended_order_date: string
  critical_date_min_stock_breach: string
}

export interface OrderAlertsResponseDTO {
  alerts: OrderPredictionResponseDTO[]
}
