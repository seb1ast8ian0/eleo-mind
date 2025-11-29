import logging

import pandas as pd
from datetime import datetime, timedelta, date
from pydantic import BaseModel

from domain.model.article import Article
from domain.model.order import StockDevelopmentForecast, OrderWithForecast, Order

logger = logging.getLogger(__name__)


class DeadlineAndQuantityModel(BaseModel):
    deadline: date
    quantity: float
    min_stock_date: date
    sku: str

    def set_sku(self, sku: str):
        self.sku = sku


def _predict(sku: str, start_date: date, end_date: date) -> pd.DataFrame:
    import random
    today = datetime.today().date()

    num_days: int = (end_date - start_date).days + 1

    data = {
        "date": [today + timedelta(days=i) for i in range(num_days)],
        "qty": [random.randint(0, 5) for _ in range(num_days)],
    }

    df = pd.DataFrame(data)

    return df


def _get_deadline_order_date_and_quantity(
        delivery_time: int, prediction_of_orders: pd.DataFrame, current_in_stock: int, min_in_stock: int
) -> DeadlineAndQuantityModel:
    stock = current_in_stock

    for _, row in prediction_of_orders.iterrows():

        quantity = row["qty"]
        stock -= quantity

        if stock <= min_in_stock:
            min_stock_date = row["date"]
            deadline_to_order = min_stock_date - timedelta(delivery_time)

            return DeadlineAndQuantityModel(
                deadline=deadline_to_order,
                quantity=quantity,
                min_stock_date=min_stock_date,
                sku=""
            )


    return DeadlineAndQuantityModel(
        deadline=datetime.today().date(),
        quantity=0.0,
        min_stock_date=datetime.today().date() + timedelta(days=90),
        sku=""
    )


def _get_deadline_and_quantity(sku: str, prediction_df: pd.DataFrame, duration: int, current_in_stock: int,
                               min_stock: int) -> DeadlineAndQuantityModel:

    order_date_and_quantity: DeadlineAndQuantityModel = _get_deadline_order_date_and_quantity(
        delivery_time=duration,
        prediction_of_orders=prediction_df,
        current_in_stock=current_in_stock,
        min_in_stock=min_stock
    )

    order_date_and_quantity.set_sku(sku)
    logger.debug(f"Got order_date_and_quantity for sku: {sku}: {order_date_and_quantity}")

    return order_date_and_quantity


def _get_stock_development_list(prediction_df: pd.DataFrame, current_stock: int, amount_of_members: int) -> list[StockDevelopmentForecast]:
    stock_development: list[StockDevelopmentForecast] = []

    stock_forecast = current_stock

    for _, row in prediction_df.iterrows():
        predicted_purchased_amount = row["qty"]
        date_for_forecast = row["date"]

        stock_forecast -= predicted_purchased_amount

        stock_development_for_date = StockDevelopmentForecast(
            date=date_for_forecast,
            stock_forecast_for_date=stock_forecast
        )

        stock_development.append(stock_development_for_date)

        if len(stock_development) >= amount_of_members:
            break

    return stock_development

def get_stock_development_forecast(article: Article, current_in_stock: int, min_stock: int, amount_forecast_members: int) -> OrderWithForecast:
    start_time = datetime.today().date()
    end_time = start_time + timedelta(days=90)
    prediction_df = _predict(article.sku, start_time, end_time)

    stock_development = _get_stock_development_list(
        prediction_df, current_in_stock, amount_forecast_members
    )

    deadline_and_quantity = _get_deadline_and_quantity(
        article.sku, prediction_df, article.delivery_time, current_in_stock, min_stock
    )

    return OrderWithForecast(
        order=Order(
            article=article,
            current_stock=current_in_stock,
            recommended_order_date=deadline_and_quantity.deadline,
            critical_min_stock_date=deadline_and_quantity.min_stock_date,
            quantity=deadline_and_quantity.quantity,
        ),
        forecast=stock_development
    )