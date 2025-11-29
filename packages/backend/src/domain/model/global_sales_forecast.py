from pydantic import BaseModel
from datetime import date

class WeatherSaleAndSalesForecast(BaseModel):
    date: date
    amount: float
    weather_condition: str
    temperature: int
    is_sale: bool
    sale_type: str | None

class GlobalSalesForecast(BaseModel):
    sales_forecast: float
    sales_last_month: float
    forecast: list[WeatherSaleAndSalesForecast]