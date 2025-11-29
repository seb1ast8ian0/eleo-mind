from pydantic import BaseModel
from datetime import date

class OrderPredictionResponse(BaseModel):
    article_id: str
    article_name: str = "NaN"
    category: str = "NaN"
    image_path: str = "NaN"
    image_alt: str = "NaN"
    stock_current: int
    unit: str = "Stück"
    delivery_time_in_days: int
    producer_id: int
    division_id: int
    recommended_order_quantity: int
    recommended_order_date: date
    critical_date_min_stock_breach: date

class OrderAlerts(BaseModel):
    alerts: list[OrderPredictionResponse]