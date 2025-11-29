import logging

import pandas as pd
from datetime import date, datetime, timedelta

from domain.model.order import Order, OrderWithForecast
from domain.model.stock import Stock

from domain.model.article import get_articles_from_df, Article, get_specific_article_from_df
from domain.service.determin_reorder import get_deadline_and_quantity, DeadlineAndQuantityModel, get_forecast_for_article_stock_development

class Service:

    stock_service: Stock
    logger: logging.Logger


    def __init__(self, stock_service: Stock):
        self.stock_service = stock_service
        self.logger = logging.getLogger(__name__)

    def get_articles(self) -> list[Article]:
        all_articles_df = self.stock_service.get_all_articles()
        return get_articles_from_df(all_articles_df)

    def get_orders(self, current_stock: int, min_stock: int) -> list[Order]:
        orders: list[Order] = []
        current_stock_df: pd.DataFrame = self.stock_service.get_current_stock()

        for _, row in current_stock_df.iterrows():
            sku: str = self.stock_service.get_sku_from_series(row)
            duration: int = self.stock_service.get_duration_from_series(row)

            # current_stock and min_stock are set globaly and are given
            # current_in_stock: int = self.stock_service.get_current_stock_for_article(sku)
            # min_stock: int = self.stock_service.get_min_stock_for_article(sku)

            deadline_and_quantity: DeadlineAndQuantityModel = get_deadline_and_quantity(
                sku=sku,
                duration=duration,
                current_in_stock=current_stock,
                min_stock=min_stock
            )

            article: Article = get_specific_article_from_df(self.stock_service.get_article(sku))

            order = Order(
                article=article,
                quantity=deadline_and_quantity.quantity,
                recommended_order_date=deadline_and_quantity.deadline,
                critical_min_stock_date=deadline_and_quantity.min_stock_date,
                current_stock=current_stock
            )
            orders.append(order)

            self.logger.debug(f"appended order: {order}")

        return orders

    def get_forecast_for_article(self, sku: str, current_stock_for_article: int, min_stock_for_article) -> OrderWithForecast:

        article: Article = get_specific_article_from_df(self.stock_service.get_article(sku))

        deadline_and_quantity: DeadlineAndQuantityModel = get_deadline_and_quantity(
            sku=sku,
            duration=article.delivery_time,
            current_in_stock=current_stock_for_article,
            min_stock=min_stock_for_article
        )

        order: Order = Order(
            article=article,
            quantity=deadline_and_quantity.quantity,
            recommended_order_date=deadline_and_quantity.deadline,
            critical_min_stock_date=deadline_and_quantity.min_stock_date,
            current_stock=current_stock_for_article
        )

        forecast = get_forecast_for_article_stock_development(sku, current_stock_for_article)

        return OrderWithForecast(
            order=order,
            forecast=forecast
        )

    def get_critical_alerts(self, current_stock: int, min_stock: int, amount_of_orders: int) -> list[Order]:
        global_order_forecast = self.get_orders(current_stock, min_stock)

        today: date = datetime.today().date()

        sorted_orders: list[Order] = sorted(
            global_order_forecast,
            key=lambda order: (today - order.recommended_order_date).days
        )

        # Only return the amount_of_orders most critical
        return sorted_orders[:amount_of_orders]







