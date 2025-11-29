from pydantic import BaseModel
from datetime import date
import random

class OrderPredictionRequest(BaseModel):
    global_current_stock: int
    global_min_stock: int

class GetOrderAlertsRequest(BaseModel):
    global_current_stock: int
    global_min_stock: int
    amount_of_alerts: int = 3

class OrderPredictionResponse(BaseModel):
    article_id: str
    coating: str
    article_name: str | None = None
    category: str | None = None
    image_path: str | None = None
    image_alt: str | None = None
    stock_current: int
    unit: str = "Stück"
    delivery_time_in_days: int
    producer_id: int
    division_id: int
    recommended_order_quantity: int
    recommended_order_date: date
    critical_date_min_stock_breach: date

class OrderAlertsResponse(BaseModel):
    alerts: list[OrderPredictionResponse]