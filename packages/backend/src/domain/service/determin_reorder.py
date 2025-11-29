import logging

import pandas as pd
from datetime import datetime, timedelta, date
from pydantic import BaseModel

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
    data = {
        "date": [today + timedelta(days=i) for i in range(10)],
        "quantity": [random.randint(1, 100) for _ in range(10)],
    }

    df = pd.DataFrame(data)

    return df

def _get_deadline_order_date_and_quantity(
        delivery_time: int, prediction_of_orders: pd.DataFrame, current_in_stock: int, min_in_stock: int
) -> DeadlineAndQuantityModel | None:

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

    return None


def get_deadline_and_quantity(sku: str, duration: int, current_in_stock: int, min_stock: int) -> DeadlineAndQuantityModel | None:
    now = datetime.today()

    end_date = now + timedelta(90)

    prediction_of_orders = _predict(
        sku=sku,
        start_date=now,
        end_date=end_date
    )

    order_date_and_quantity: DeadlineAndQuantityModel | None = _get_deadline_order_date_and_quantity(
        delivery_time=duration,
        prediction_of_orders=prediction_of_orders,
        current_in_stock=current_in_stock,
        min_in_stock=min_stock
    )

    if order_date_and_quantity is not None:
        order_date_and_quantity.set_sku(sku)
        logger.debug(f"Got order_date_and_quantity for sku: {sku}: {order_date_and_quantity}")

    return order_date_and_quantity