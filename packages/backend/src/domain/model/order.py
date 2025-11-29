from datetime import date
from domain.model.article import Article
from pydantic import BaseModel

class Order(BaseModel):
    article: Article
    quantity: int
    recommended_order_date: date
    critical_min_stock_date: date
    current_stock: int

    def __str__(self):
        return (f"Order("
                f"article: {self.article} |"
                f" quantity: {self.quantity} |"
                f" deadline: {self.recommended_order_date} |"
                f" critical_min_stock_date: {self.critical_min_stock_date} |"
                f" current_stock: {self.current_stock})")


class StockDevelopmentForecast(BaseModel):
    date: date
    stock_forecast_for_date: int

class OrderWithForecast(BaseModel):
    order: Order
    forecast: list[StockDevelopmentForecast]