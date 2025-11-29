import logging

import pandas as pd
from datetime import datetime, timedelta, date
from pydantic import BaseModel

from domain.model.order import StockDevelopmentForecast

logger = logging.getLogger(__name__)


class DeadlineAndQuantityModel(BaseModel):
    deadline: date
    quantity: int
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
        "quantity": [random.randint(0, 5) for _ in range(num_days)],
    }

    df = pd.DataFrame(data)

    return df


def _get_deadline_order_date_and_quantity(
        delivery_time: int, prediction_of_orders: pd.DataFrame, current_in_stock: int, min_in_stock: int
) -> DeadlineAndQuantityModel:
    stock = current_in_stock
    quantity = 0
    for _, row in prediction_of_orders.iterrows():
        quantity += row["quantity"]
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
        quantity=0,
        min_stock_date=datetime.today().date() + timedelta(days=90),
        sku=""
    )


def get_deadline_and_quantity(sku: str, duration: int, current_in_stock: int,
                              min_stock: int) -> DeadlineAndQuantityModel:
    now = datetime.today()

    end_date = now + timedelta(90)

    prediction_of_orders = _predict(
        sku=sku,
        start_date=now,
        end_date=end_date
    )

    order_date_and_quantity: DeadlineAndQuantityModel = _get_deadline_order_date_and_quantity(
        delivery_time=duration,
        prediction_of_orders=prediction_of_orders,
        current_in_stock=current_in_stock,
        min_in_stock=min_stock
    )

    order_date_and_quantity.set_sku(sku)
    logger.debug(f"Got order_date_and_quantity for sku: {sku}: {order_date_and_quantity}")

    return order_date_and_quantity


def get_forecast_for_article_stock_development(sku: str, current_stock: int) -> list[StockDevelopmentForecast]:
    start_time = datetime.today().date()
    end_time = start_time + timedelta(days=30)
    prediction_df = _predict(sku, start_time, end_time)

    stock_development: list[StockDevelopmentForecast] = []

    stock_forecast = current_stock

    for _, row in prediction_df.iterrows():
        predicted_purchased_amount = row["quantity"]
        date_for_forecast = row["date"]

        stock_forecast -= predicted_purchased_amount

        stock_development_for_date = StockDevelopmentForecast(
            date=date_for_forecast,
            stock_forecast_for_date=stock_forecast
        )

        stock_development.append(stock_development_for_date)

    return stock_development
