import logging

import pandas as pd
from datetime import datetime, timedelta, date
from typing import Any

from domain.model.order import Order
from domain.model.stock import Stock

logger = logging.getLogger(__name__)

def _predict(sku: str, start_date: date, end_date: date) -> pd.DataFrame:
    import random
    today = datetime.today()
    data = {
        "date": [today + timedelta(days=i) for i in range(10)],
        "quantity": [random.randint(1, 100) for _ in range(10)],
    }

    return pd.DataFrame(data)

def _get_deadline_order_date_and_quantity(delivery_time: int, prediction_of_orders: pd.DataFrame, current_in_stock: int, min_in_stock: int) -> dict[str, Any] | None:
    stock = current_in_stock
    quantity = 0
    for _, row in prediction_of_orders.iterrows():
        quantity += row["quantity"]
        stock -= quantity

        if stock <= min_in_stock:
            min_stock_date = row["date"]
            deadline_to_order = min_stock_date - timedelta(delivery_time)

            return {
                "deadline": deadline_to_order,
                "quantity": quantity
            }

    return None

def get_deadline_and_quantity_for_all_products(all_products: pd.DataFrame, stock: Stock) -> list[Order]:
    orders: list[Order] = []

    for _, row in all_products.iterrows():
        deadline_and_quantity = _get_deadline_and_quantity(row, stock)

        if deadline_and_quantity is None:
            continue

        order = Order(
            article_id=row["SKU"],
            quantity=deadline_and_quantity.get("quantity"),
            deadline=deadline_and_quantity.get("deadline")
        )
        orders.append(order)

        logger.debug(f"appended order: {order}")

    return orders


def _get_deadline_and_quantity(product_df: pd.Series, stock: Stock) -> dict[str, Any] | None:
    now = datetime.today()

    end_date = now + timedelta(90)

    sku = str(product_df["SKU"])

    prediction_of_orders = _predict(
        sku=sku,
        start_date=now,
        end_date=end_date
    )

    order_date_and_quantity = _get_deadline_order_date_and_quantity(
        delivery_time=product_df["duration"],
        prediction_of_orders=prediction_of_orders,
        current_in_stock=stock.get_current_stock_for_article(sku),
        min_in_stock=stock.get_min_stock_for_article(sku)
    )


    logger.debug(f"Got order_date_and_quantity for sku: {sku}: {order_date_and_quantity}")

    return order_date_and_quantity