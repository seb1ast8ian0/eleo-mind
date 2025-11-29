from pydantic import BaseModel
from datetime import date as datetime_date

class GlobalForecast(BaseModel):
    date: datetime_date
    amount: int
    weather_condition: str
    weather_temperature: int
    is_sale: bool
    sale_type: str | None

class GlobalForecastResponse(BaseModel):
    sales_forecast: int # Summierte sales von allen artikeln in den nächsten 30 Tagen
    sales_last_month: int # Summierte sales von allen artikeln in den letzten 30 Tagen
    forecast: list[GlobalForecast]