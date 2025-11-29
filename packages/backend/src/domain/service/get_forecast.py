from datetime import date, timedelta, datetime
import random
import pandas as pd

from domain.model.global_sales_forecast import WeatherSaleAndSalesForecast


def _predict_with_weather_and_sales(start_date: date, end_date: date) -> pd.DataFrame:
    """
    returns a pd.Dataframe that has these cols aggregated on all skus per day:
    date: date | qty (quantity): int | tavg (temperatur): float
    | weather_label: str
    | sale_active: bool
    | sales_percent: float (wenn der nicht null ist, dann soviel prozent auf alles als string convertieren)
    """
    # Alle Tage im Intervall sammeln
    num_days: int = (end_date - start_date).days + 1
    days: list[date] = [start_date + timedelta(days=i) for i in range(num_days)]

    # Mögliche Labels
    weather_labels: list[str] = ["sun", "normal", "rain"]

    # Dummy-Daten generieren (später durch echte Forecasts ersetzbar)
    data = {
        "date": days,
        "qty": [random.randint(0, 20) for _ in days],
        "tavg": [round(random.uniform(-5.0, 30.0), 1) for _ in days],
        "weather_label": [random.choice(weather_labels) for _ in days],
        "sale_active": [random.choice([True, False]) for _ in days],
        "sales_percent": [round(random.uniform(0.0, 0.5), 2) for _ in days],
    }

    df: pd.DataFrame = pd.DataFrame(data)

    # Sicherstellen, dass "date" vom Typ datetime.date ist
    df["date"] = df["date"].dt.date if hasattr(df["date"], "dt") else df["date"]

    return df

def get_weather_sale_and_sales_forecast(start_date: date, end_date: date) -> list[WeatherSaleAndSalesForecast]:
    prediction_df = _predict_with_weather_and_sales(start_date, end_date)

    forecast: list[WeatherSaleAndSalesForecast] = []

    for _, row in prediction_df.iterrows():
        is_sale = bool(row["sale_active"])
        sale_type: str | None = None
        if is_sale:
            sale_percent = row["sales_percent"]
            sale_type = f"{int(sale_percent * 100)}% auf alles"

        forecast.append(
            WeatherSaleAndSalesForecast(
                date=row["date"],
                amount=row["qty"],
                weather_condition=row["weather_label"],
                temperature=int(row["tavg"]),
                is_sale=row["sale_active"],
                sale_type=sale_type
            )
        )

    return forecast
