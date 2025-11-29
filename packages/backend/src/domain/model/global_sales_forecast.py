from pydantic import BaseModel
from datetime import date

class WeatherSaleAndSalesForecast(BaseModel):
    date: date
    amount: int
    weather_condition: str
    temperature: int
    is_sale: bool
    sale_type: str | None

class GlobalSalesForecast(BaseModel):
    sales_forecast: int
    sales_last_month: int
    forecast: list[WeatherSaleAndSalesForecast]