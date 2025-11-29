import logging

import pandas as pd
from datetime import date, datetime, timedelta

from domain.model.global_sales_forecast import GlobalSalesForecast
from domain.model.order import Order, OrderWithForecast
from domain.model.stock import Stock

from domain.model.article import get_articles_from_df, Article, get_specific_article_from_df
from domain.service.determin_reorder import get_stock_development_forecast, DeadlineAndQuantityModel

from domain.service.get_forecast import get_weather_sale_and_sales_forecast


class Service:

    stock_service: Stock
    logger: logging.Logger


    def __init__(self, stock_service: Stock):
        self.stock_service = stock_service
        self.logger = logging.getLogger(__name__)

    def get_articles(self) -> list[Article]:
        all_articles_df = self.stock_service.get_all_articles()
        return get_articles_from_df(all_articles_df)

    def get_orders(self, current_stock: int, min_stock: int, amount_of_forecast_members: int) -> list[OrderWithForecast]:
        orders_with_forecasts: list[OrderWithForecast] = []
        current_stock_df: pd.DataFrame = self.stock_service.get_current_stock()

        for _, row in current_stock_df.iterrows():
            sku: str = self.stock_service.get_sku_from_series(row)

            article: Article = get_specific_article_from_df(self.stock_service.get_article(sku))

            # current_stock and min_stock are set globaly and are given
            # current_in_stock: int = self.stock_service.get_current_stock_for_article(sku)
            # min_stock: int = self.stock_service.get_min_stock_for_article(sku)

            order_with_forecast: OrderWithForecast = get_stock_development_forecast(
                article=article,
                current_in_stock=current_stock,
                min_stock=min_stock,
                amount_forecast_members=amount_of_forecast_members,
            )


            orders_with_forecasts.append(order_with_forecast)

        return orders_with_forecasts

    def get_forecast_for_article(self, sku: str, current_stock_for_article: int, min_stock_for_article) -> OrderWithForecast:

        article: Article = get_specific_article_from_df(self.stock_service.get_article(sku))

        order_with_forecast: OrderWithForecast = get_stock_development_forecast(
            article=article,
            current_in_stock=current_stock_for_article,
            min_stock=min_stock_for_article,
            amount_forecast_members=30,
        )

        self.logger.info(f"Got deadline_and_quantity for sku: {sku}: {order_with_forecast}")

        return order_with_forecast

    def get_critical_alerts(self, current_stock: int, min_stock: int, amount_of_orders: int) -> list[Order]:
        global_order_forecast = self.get_orders(current_stock, min_stock, 90)

        today: date = datetime.today().date()

        critical_orders: list[Order] = []
        for order_with_forecast in global_order_forecast:
            critical_orders.append(order_with_forecast.order)

        # Sortieren auf Basis des inneren order-Objekts.
        sorted_orders: list[Order] = sorted(
            critical_orders,
            key=lambda critical_o: (today - critical_o.recommended_order_date).days
        )

        # Only return the amount_of_orders most critical
        return sorted_orders[:amount_of_orders]

    def get_global_forecast(self) -> GlobalSalesForecast:
        # Determine amount of sold articles in the last 30 days
        end_date: date = datetime.today().date() - timedelta(days=1)
        start_date: date = end_date - timedelta(days=30)
        weather_sale_and_sales_history = get_weather_sale_and_sales_forecast(start_date, end_date)
        total_sales_history = 0
        for history in weather_sale_and_sales_history:
            total_sales_history += history.amount

        # Determine amount of sold articles in the next 30 days
        start_date: date = datetime.today().date()
        end_date: date = start_date + timedelta(days=30)
        weather_sale_and_sales_forecasts = get_weather_sale_and_sales_forecast(start_date, end_date)
        total_sales_forecast = 0
        for forcast in weather_sale_and_sales_forecasts:
            total_sales_forecast += forcast.amount

        return GlobalSalesForecast(
            sales_last_month=total_sales_history,
            sales_forecast=total_sales_forecast,
            forecast=weather_sale_and_sales_forecasts
        )







