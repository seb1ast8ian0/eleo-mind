from pydantic import BaseModel
from datetime import date

class OrderAlertForArticleRequest(BaseModel):
    article_id: str
    current_stock_for_article: int
    min_stock_for_article: int

class ForecastResponse(BaseModel):
    ## liste von key value pairs date und stock zu dem date bis 30 Tage lang
    date: date
    stock_forecast_for_date: float

class OrderAlertForArticleResponse(BaseModel):
    article_id: str
    coating: str
    producer_id: int
    division_id: int
    delivery_time_days: int
    stock_current: int
    unit: str = "Stück"
    recommended_order_date: date
    recommended_order_quantity: float
    critical_date_min_stock_breach: date
    forecast: list[ForecastResponse]
